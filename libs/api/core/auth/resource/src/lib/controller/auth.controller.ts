/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiProduces,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import {
  AbstractAppController,
  ResponseDataWrapperDto
} from '@project/api-core-api';
import { SkipAccessTokenGuard } from '@project/api-core-auth-decorator';
import {
  RefreshTokenGuard,
  ResetPasswordGuard
} from '@project/api-core-auth-guard';
import {
  AuthTokensResultDto,
  ChangePasswordInDto,
  ChangePasswordResultDto,
  ProfileResultDto,
  RefreshTokenInDto,
  ResetPasswordConfirmInDto,
  ResetPasswordConfirmResultDto,
  ResetPasswordRequestInDto,
  ResetPasswordRequestResultDto,
  ResetPasswordVerifyInDto,
  ResetPasswordVerifyResultDto,
  SignInDto
} from '@project/api-core-auth-model';
import { AuthService } from '@project/api-core-auth-service';

@ApiTags('auth')
@Controller({
  path: 'auth'
  /*version: '1'*/
})
export class AuthController extends AbstractAppController {
  protected getClassName(): string {
    return AuthController.name;
  }

  constructor(protected readonly authService: AuthService) {
    super();
  }

  @ApiProduces('application/json')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User login',
    type: AuthTokensResultDto
    // isArray: true,
  })
  @SkipAccessTokenGuard()
  @Post('login')
  async signIn(
    @Body() signInDto: SignInDto
  ): Promise<ResponseDataWrapperDto<AuthTokensResultDto>> {
    this.logger.debug('signIn', signInDto);
    return new ResponseDataWrapperDto<AuthTokensResultDto>(
      await this.authService.signIn(
        signInDto.username as string,
        signInDto.password as string
      )
    );
  }

  @ApiProduces('application/json')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User profile information',
    type: ProfileResultDto
    // isArray: true,
  })
  @ApiBearerAuth()
  @Get('profile')
  async getProfileInfo(
    @Request() req: any
  ): Promise<ResponseDataWrapperDto<ProfileResultDto>> {
    this.logger.debug('getProfile');

    return new ResponseDataWrapperDto<ProfileResultDto>({
      id: req.user.sub,
      username: req.user.username,
      properties: req.user.properties,
      permissions: req.user.permissions
    });
  }

  @ApiProduces('application/json')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User logout',
    type: Boolean
    // isArray: true,
  })
  @ApiBearerAuth()
  @Get('logout')
  async logout(@Request() req: any): Promise<ResponseDataWrapperDto<boolean>> {
    this.logger.debug('logout', req.user.sub);
    this.authService.logout(req.user.sub);
    return new ResponseDataWrapperDto<boolean>(true);
  }

  @ApiProduces('application/json')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Change current user password',
    type: ChangePasswordResultDto
    // isArray: true,
  })
  @ApiBearerAuth()
  @Post('change-password')
  async changePassword(
    @Request() req: any,
    @Body() changePasswordInDto: ChangePasswordInDto
  ): Promise<ResponseDataWrapperDto<ChangePasswordResultDto>> {
    this.logger.debug('changePassword', changePasswordInDto);

    return new ResponseDataWrapperDto<ChangePasswordResultDto>(
      await this.authService.changePassword(
        req.user.sub,
        changePasswordInDto.currentPassword as string,
        changePasswordInDto.newPassword as string
      )
    );
  }

  @ApiProduces('application/json')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Refresh user tokens',
    type: AuthTokensResultDto
    // isArray: true,
  })
  @SkipAccessTokenGuard()
  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth()
  @Post('refresh-token')
  async refreshToken(
    @Request() req: any,
    @Body() refreshTokenInDto: RefreshTokenInDto
  ): Promise<ResponseDataWrapperDto<AuthTokensResultDto>> {
    this.logger.debug('refreshTokenInDto', refreshTokenInDto);
    return new ResponseDataWrapperDto<AuthTokensResultDto>(
      await this.authService.refreshToken(
        req.user.sub,
        refreshTokenInDto.refreshToken as string
      )
    );
  }

  @ApiProduces('application/json')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Request to reset password',
    type: ResetPasswordRequestResultDto
    // isArray: true,
  })
  @SkipAccessTokenGuard()
  @Post('reset-password/request')
  async resetPasswordRequest(
    @Request() req: any,
    @Body() resetPasswordRequestInDto: ResetPasswordRequestInDto
  ): Promise<ResponseDataWrapperDto<ResetPasswordRequestResultDto>> {
    this.logger.debug('resetPasswordRequestInDto', resetPasswordRequestInDto);

    return new ResponseDataWrapperDto<ResetPasswordRequestResultDto>(
      await this.authService.resetPasswordRequest(
        resetPasswordRequestInDto.usernameOrEmail as string
      )
    );
  }

  @ApiProduces('application/json')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Verify to reset password',
    type: ResetPasswordVerifyResultDto
    // isArray: true,
  })
  @SkipAccessTokenGuard()
  @Post('reset-password/verify')
  async resetPasswordVerify(
    @Request() req: any,
    @Body() resetPasswordVerifyInDto: ResetPasswordVerifyInDto
  ): Promise<ResponseDataWrapperDto<ResetPasswordVerifyResultDto>> {
    this.logger.debug('resetPasswordVerifyInDto', resetPasswordVerifyInDto);

    return new ResponseDataWrapperDto<ResetPasswordVerifyResultDto>(
      await this.authService.resetPasswordVerify(
        resetPasswordVerifyInDto.usernameOrEmail as string,
        resetPasswordVerifyInDto.verificationCode as string
      )
    );
  }

  @ApiProduces('application/json')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reset password',
    type: ResetPasswordConfirmResultDto
    // isArray: true,
  })
  @SkipAccessTokenGuard()
  @UseGuards(ResetPasswordGuard)
  @ApiBearerAuth()
  @Post('reset-password/confirm')
  async resetPasswordConfirm(
    @Request() req: any,
    @Body() resetPasswordConfirmInDto: ResetPasswordConfirmInDto
  ): Promise<ResponseDataWrapperDto<ResetPasswordConfirmResultDto>> {
    this.logger.debug('resetPasswordConfirm', resetPasswordConfirmInDto);

    this.logger.debug('req.user', req.user);

    if (resetPasswordConfirmInDto.usernameOrEmail !== req.user.username) {
      this.logger.error('User not allowed to change password');
      throw new BadRequestException('User not allowed to change password');
    }

    return new ResponseDataWrapperDto<ResetPasswordConfirmResultDto>(
      await this.authService.resetPasswordConfirm(
        resetPasswordConfirmInDto.usernameOrEmail as string,
        resetPasswordConfirmInDto.newPassword as string
      )
    );
  }
}
