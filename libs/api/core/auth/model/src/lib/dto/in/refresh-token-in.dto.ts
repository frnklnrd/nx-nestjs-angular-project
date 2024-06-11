import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenInDto {
  @ApiProperty()
  refreshToken?: string;
}
