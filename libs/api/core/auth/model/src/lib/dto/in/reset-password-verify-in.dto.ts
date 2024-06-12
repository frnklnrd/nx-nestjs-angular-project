import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordVerifyInDto {
  @ApiProperty()
  usernameOrEmail?: string;

  @ApiProperty()
  verificationCode?: string;
}
