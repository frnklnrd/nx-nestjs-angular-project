import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenDto {
  @ApiProperty()
  tokenValue?: string;

  @ApiProperty()
  expiresIn?: number;
}

export class RefreshTokenDto {
  @ApiProperty()
  tokenValue?: string;

  @ApiProperty()
  expiresIn?: number;
}

export class AuthTokensResultDto {
  @ApiProperty()
  accessToken?: AccessTokenDto;

  @ApiProperty()
  refreshToken?: RefreshTokenDto;
}
