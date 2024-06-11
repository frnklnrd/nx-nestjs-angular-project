import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractAppService } from '@project/api-core-api';
import {
  AuthTokensResultDto,
  ChangePasswordResultDto,
  ResetPasswordConfirmResultDto,
  ResetPasswordRequestResultDto,
  UserToken
} from '@project/api-core-auth-model';
import { CryptoUtilService } from '@project/api-core-util-crypto';
import { UserOutDto } from '@project/api-module-users-model';
import { UsersService } from '@project/api-module-users-service';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService extends AbstractAppService {
  protected getClassName(): string {
    return AuthService.name;
  }

  constructor(
    protected readonly usersService: UsersService,
    protected readonly cryptoUtilService: CryptoUtilService,
    @InjectRepository(UserToken)
    protected readonly userTokensRepository: Repository<UserToken>,
    protected readonly configService: ConfigService
  ) {
    super();
  }

  async signIn(username: string, pass: string): Promise<AuthTokensResultDto> {
    this.logger.debug('signIn - init');

    const user = await this.usersService.findByUsername(username);

    if (!user) {
      this.logger.error('User not found');
      throw new BadRequestException('User not found');
    }

    if (!user.isActive || user.isBlocked) {
      this.logger.error('User inactive or blocked');
      throw new UnauthorizedException('User inactive or blocked');
    }

    const userTokensInfo = await this.userTokensRepository.findOneBy({
      id: user.id
    });

    const passwordMatches = await this.cryptoUtilService.comparePassword(
      pass,
      user.password as string
    );

    if (!passwordMatches) {
      this.logger.error('Incorrect password');

      const accessFailedAttemptsCount = userTokensInfo?.accessFailedAttempts
        ? userTokensInfo?.accessFailedAttempts + 1
        : 1;

      await this.userTokensRepository.save({
        id: user.id,
        //-------------------------------------
        accessFailedAttempts: accessFailedAttemptsCount,
        accessLastAttemptAt: new Date()
        //-------------------------------------
      });

      if (
        accessFailedAttemptsCount >
        (this.configService.get<number>(
          'security.max_allowed_attempts.sign_in'
        ) as number)
      ) {
        await this.usersService.updateBlocked(user.id as string, true);
        throw new UnauthorizedException('User blocked');
      }

      throw new UnauthorizedException('Incorrect password');
    }

    await this.userTokensRepository.save({
      id: user.id,
      //-------------------------------------
      accessFailedAttempts: 0,
      accessLastAttemptAt: new Date(),
      accessLastAccessAt: new Date(),
      //-------------------------------------
      changePasswordFailedAttempts: 0,
      //-------------------------------------
      resetPasswordAttempts: 0
      //-------------------------------------
    });

    const payload = {
      sub: user.id as string,
      username: user.username as string,
      properties: plainToClass(UserOutDto, user),
      permissions: user.getPermissions()
    };

    const tokens = await this.generateAccessAndRefreshTokens(payload);

    await this.updateAccessAndRefreshToken(
      user.id as string,
      tokens.accessToken,
      tokens.refreshToken,
      true
    );

    const result: AuthTokensResultDto = {
      accessToken: {
        tokenValue: tokens.accessToken,
        expiresIn: this.cryptoUtilService.getAccessTokenExpiresIn()
      },
      refreshToken: {
        tokenValue: tokens.refreshToken,
        expiresIn: this.cryptoUtilService.getRefreshTokenExpiresIn()
      }
    };

    this.logger.debug('signIn - end');

    return result;
  }

  async refreshToken(
    userId: string,
    refreshToken: string
  ): Promise<AuthTokensResultDto> {
    this.logger.debug('refreshToken - init');

    const user = await this.usersService.findById(userId);

    if (!user) {
      this.logger.error('User not found');
      throw new BadRequestException('User not found');
    }

    if (!user.isActive || user.isBlocked) {
      this.logger.error('User inactive or blocked');
      throw new UnauthorizedException('User inactive or blocked');
    }

    const userTokens = await this.findUserTokensById(userId);

    if (!userTokens?.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = await this.cryptoUtilService.compareTokenData(
      refreshToken as string,
      userTokens?.refreshToken as string
    );

    if (!refreshTokenMatches)
      throw new ForbiddenException('Invalid Refresh Token');

    const payload = {
      sub: user.id as string,
      username: user.username as string,
      properties: plainToClass(UserOutDto, user),
      permissions: user.getPermissions()
    };

    const tokens = await this.generateAccessAndRefreshTokens(payload);

    await this.updateAccessAndRefreshToken(
      user.id as string,
      tokens.accessToken,
      tokens.refreshToken,
      true
    );

    const result = {
      accessToken: {
        tokenValue: tokens.accessToken,
        expiresIn: this.cryptoUtilService.getAccessTokenExpiresIn()
      },
      refreshToken: {
        tokenValue: tokens.refreshToken,
        expiresIn: this.cryptoUtilService.getRefreshTokenExpiresIn()
      }
    };

    this.logger.debug('refreshToken - end');

    return result;
  }

  async logout(userId: string) {
    await this.updateAccessAndRefreshToken(userId, null, null, false);
    return true;
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<ChangePasswordResultDto> {
    this.logger.debug('changePassword - init');

    const user = await this.usersService.findById(userId);

    if (!user) {
      this.logger.error('User not found');
      throw new BadRequestException('User not found');
    }

    if (!user.isActive || user.isBlocked) {
      this.logger.error('User inactive or blocked');
      throw new UnauthorizedException('User inactive or blocked');
    }

    if (user.isAdmin) {
      this.logger.error('User Admin not allowed to change password');
      throw new BadRequestException(
        'User Admin not allowed to change password'
      );
    }

    const userTokensInfo = await this.userTokensRepository.findOneBy({
      id: user.id
    });

    const passwordMatches = await this.cryptoUtilService.comparePassword(
      currentPassword,
      user.password as string
    );

    if (!passwordMatches) {
      this.logger.error('Passwords not matches');

      const changePasswordFailedAttemptsCount =
        userTokensInfo?.changePasswordFailedAttempts
          ? userTokensInfo?.changePasswordFailedAttempts + 1
          : 1;

      await this.userTokensRepository.save({
        id: user.id,
        //-------------------------------------
        changePasswordFailedAttempts: changePasswordFailedAttemptsCount,
        changePasswordLastAttemptAt: new Date()
        //-------------------------------------
      });

      if (
        changePasswordFailedAttemptsCount >
        (this.configService.get<number>(
          'security.max_allowed_attempts.change_password'
        ) as number)
      ) {
        await this.usersService.updateBlocked(user.id as string, true);
        throw new UnauthorizedException('User blocked');
      }

      throw new UnauthorizedException('Incorrect password');
    }

    await this.userTokensRepository.save({
      id: user.id,
      //-------------------------------------
      accessFailedAttempts: 0,
      //-------------------------------------
      changePasswordFailedAttempts: 0,
      changePasswordLastAttemptAt: new Date(),
      changePasswordLastChangeAt: new Date(),
      //-------------------------------------
      resetPasswordAttempts: 0
      //-------------------------------------
    });

    await this.usersService.updatePassword(userId, newPassword);

    this.logger.debug('changePassword - end');

    return {
      passwordChanged: true
    };
  }

  async resetPasswordRequest(
    usernameOrEmail: string
  ): Promise<ResetPasswordRequestResultDto> {
    this.logger.debug('resetPasswordRequest - init');

    let user = null;

    if (usernameOrEmail) {
      user = await this.usersService.findByUsername(usernameOrEmail);
    }

    if (!user && usernameOrEmail) {
      user = await this.usersService.findByEmail(usernameOrEmail);
    }

    if (!user) {
      this.logger.error('User not found');
      throw new BadRequestException('User not found');
    }

    if (!user.isActive || user.isBlocked) {
      this.logger.error('User inactive or blocked');
      throw new UnauthorizedException('User inactive or blocked');
    }

    const userTokensInfo = await this.userTokensRepository.findOneBy({
      id: user.id
    });

    const resetPasswordAttemptsCount = userTokensInfo?.resetPasswordAttempts
      ? userTokensInfo?.resetPasswordAttempts + 1
      : 1;

    await this.userTokensRepository.save({
      id: user.id,
      //-------------------------------------
      resetPasswordAttempts: resetPasswordAttemptsCount,
      resetPasswordLastAttemptAt: new Date()
      //-------------------------------------
    });

    if (
      resetPasswordAttemptsCount >
      (this.configService.get<number>(
        'security.max_allowed_attempts.reset_password'
      ) as number)
    ) {
      await this.usersService.updateBlocked(user.id as string, true);
      throw new UnauthorizedException('User blocked');
    }

    const payload = {
      sub: null,
      username: usernameOrEmail as string
    };

    const tokens = await this.generateResetPasswordToken(payload);

    await this.updateResetPasswordToken(
      user.id as string,
      tokens.resetPasswordToken,
      true
    );

    // TODO send a notification by email

    this.logger.debug('tokens', { tokens });

    this.logger.debug('resetPasswordRequest - end');

    return {
      tokenSend: true
    };
  }

  async resetPasswordConfirm(
    usernameOrEmail: string,
    newPassword: string
  ): Promise<ResetPasswordConfirmResultDto> {
    this.logger.debug('resetPasswordConfirm - init');

    let user = null;

    if (usernameOrEmail) {
      user = await this.usersService.findByUsername(usernameOrEmail);
    }

    if (!user && usernameOrEmail) {
      user = await this.usersService.findByEmail(usernameOrEmail);
    }

    if (!user || !user.isActive) {
      this.logger.error('User not found');
      throw new BadRequestException('User not found');
    }

    if (user.isBlocked) {
      this.logger.error('User blocked');
      throw new UnauthorizedException('User blocked');
    }

    /*
    if (user.isAdmin) {
      this.logger.error('User Admin not allowed to change password');
      throw new BadRequestException(
        'User Admin not allowed to change password'
      );
    }
    */

    const userTokensInfo = await this.userTokensRepository.findOneBy({
      id: user.id
    });

    await this.userTokensRepository.save({
      id: user.id,
      //-------------------------------------
      accessFailedAttempts: 0,
      //-------------------------------------
      changePasswordFailedAttempts: 0,
      //-------------------------------------
      resetPasswordAttempts: 0,
      resetPasswordLastResetAt: new Date()
      //-------------------------------------
    });

    await this.updateResetPasswordToken(user.id as string, null, false);

    await this.usersService.updatePassword(user.id as string, newPassword);

    this.logger.debug('resetPasswordConfirm - end');

    return {
      passwordChanged: true
    };
  }
  // ---------------------------------------------------------

  private async generateAccessAndRefreshTokens(payload: {
    sub: string;
    username: string;
    properties: UserOutDto;
    permissions: string[];
  }) {
    const accessToken =
      await this.cryptoUtilService.signAsyncWithAccessTokenConfig(payload);

    const refreshToken =
      await this.cryptoUtilService.signAsyncWithRefreshTokenConfig(payload);

    return {
      accessToken,
      refreshToken
    };
  }

  private async generateResetPasswordToken(payload: {
    sub: string | null;
    username: string;
  }) {
    const resetPasswordToken =
      await this.cryptoUtilService.signAsyncWithResetPasswordConfig(payload);

    return {
      resetPasswordToken
    };
  }

  // ---------------------------------------------------------

  async findUserTokensById(id: string): Promise<UserToken | null> {
    const tokens = await this.userTokensRepository.findOneBy({ id });
    return tokens
      ? tokens
      : {
          id: undefined,
          accessToken: undefined,
          refreshToken: undefined
        };
  }

  // ---------------------------------------------------------

  private async updateAccessAndRefreshToken(
    id: string,
    accessToken: string | null,
    refreshToken: string | null,
    hashTokens: boolean
  ): Promise<UserToken> {
    return this.userTokensRepository.save({
      id,
      accessToken: (hashTokens && accessToken
        ? await this.cryptoUtilService.hashTokenData(accessToken as string)
        : null) as string,
      accessTokenUpdatedAt: new Date(),
      refreshToken: (hashTokens && refreshToken
        ? await this.cryptoUtilService.hashTokenData(refreshToken as string)
        : null) as string,
      refreshTokenUpdatedAt: new Date()
    });
  }

  // ---------------------------------------------------------

  private async updateResetPasswordToken(
    id: string,
    resetPasswordToken: string | null,
    hashToken: boolean
  ): Promise<UserToken> {
    return this.userTokensRepository.save({
      id,
      resetPasswordToken: (hashToken && resetPasswordToken
        ? await this.cryptoUtilService.hashTokenData(
            resetPasswordToken as string
          )
        : null) as string,
      resetPasswordTokenUpdatedAt: new Date()
    });
  }

  // ---------------------------------------------------------
}
