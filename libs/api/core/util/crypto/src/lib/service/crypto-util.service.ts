import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AbstractAppService } from '@project/api-core-api';
import * as argon2 from 'argon2';
import * as bcrypt from 'bcrypt';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class CryptoUtilService extends AbstractAppService {
  protected getClassName(): string {
    return CryptoUtilService.name;
  }

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {
    super();
  }

  // ---------------------------------------------------------

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hashedData = Buffer.from(
      await bcrypt.hash(password + this.getEncryptPasswordSecret(), salt)
    ).toString('base64');
    return hashedData;
  }

  // ---------------------------------------------------------

  async comparePassword(
    password: string,
    storedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(
      password + this.getEncryptPasswordSecret(),
      Buffer.from(storedPassword, 'base64').toString()
    );
  }

  // ---------------------------------------------------------

  private getEncryptPasswordSecret(): string {
    return this.configService.get<string>('encrypt.secret') as string;
  }

  // ---------------------------------------------------------

  async hashTokenData(data: string): Promise<string> {
    const hashedData = Buffer.from(await argon2.hash(data)).toString('base64');
    return hashedData;
  }

  // ---------------------------------------------------------

  async compareTokenData(data: string, storedHash: string): Promise<boolean> {
    return argon2.verify(Buffer.from(storedHash, 'base64').toString(), data);
  }

  // ---------------------------------------------------------

  getAccessTokenStrategyConfig() {
    return {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: this.getAccessTokenSecret(),
      passReqToCallback: true,
      ignoreExpiration: false,
    };
  }

  getRefreshTokenStrategyConfig() {
    return {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: this.getRefreshTokenSecret(),
      passReqToCallback: true,
      ignoreExpiration: false,
    };
  }

  getResetPasswordTokenStrategyConfig() {
    return {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: this.getResetPasswordSecret(),
      passReqToCallback: true,
      ignoreExpiration: false,
    };
  }

  // ---------------------------------------------------------

  async signAsyncWithAccessTokenConfig(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.getAccessTokenSecret(),
      expiresIn: this.getAccessTokenExpiresIn(),
      // privateKey?: jwt.Secret;
    });
  }

  async signAsyncWithRefreshTokenConfig(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.getRefreshTokenSecret(),
      expiresIn: this.getRefreshTokenExpiresIn(),
      // privateKey?: jwt.Secret;
    });
  }

  async signAsyncWithResetPasswordConfig(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.getResetPasswordSecret(),
      expiresIn: this.getResetPasswordExpiresIn(),
      // privateKey?: jwt.Secret;
    });
  }

  // ---------------------------------------------------------

  async verifyAsyncWithAccessTokenConfig(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token as string, {
      secret: this.getAccessTokenSecret(),
      // publicKey?: string | Buffer;
    });
  }

  async verifyAsyncWithRefreshTokenConfig(refreshToken: string): Promise<any> {
    return this.jwtService.verifyAsync(refreshToken as string, {
      secret: this.getRefreshTokenSecret(),
      // publicKey?: string | Buffer;
    });
  }

  async verifyAsyncWithResetPasswordConfig(
    resetPasswordToken: string
  ): Promise<any> {
    return this.jwtService.verifyAsync(resetPasswordToken as string, {
      secret: this.getResetPasswordSecret(),
      // publicKey?: string | Buffer;
    });
  }

  // ---------------------------------------------------------

  private getAccessTokenSecret(): string {
    return this.configService.get<string>('jwt.access_token.secret') as string;
  }

  private getRefreshTokenSecret(): string {
    return this.configService.get<string>('jwt.refresh_token.secret') as string;
  }

  private getResetPasswordSecret(): string {
    return this.configService.get<string>(
      'jwt.reset_password.secret'
    ) as string;
  }

  // ---------------------------------------------------------

  getAccessTokenExpiresIn(): number {
    return (
      Number.parseInt(
        (
          this.configService.get<string>(
            'jwt.access_token.expires_in'
          ) as string
        ).replace('s', '')
      ) * 1000
    );
  }

  getRefreshTokenExpiresIn(): number {
    return (
      Number.parseInt(
        (
          this.configService.get<string>(
            'jwt.refresh_token.expires_in'
          ) as string
        ).replace('s', '')
      ) * 1000
    );
  }

  getResetPasswordExpiresIn(): number {
    return (
      Number.parseInt(
        (
          this.configService.get<string>(
            'jwt.reset_password.expires_in'
          ) as string
        ).replace('s', '')
      ) * 1000
    );
  }

  // ---------------------------------------------------------
}
