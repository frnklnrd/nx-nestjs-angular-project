import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordConfirmInDto {
  @ApiProperty()
  usernameOrEmail?: string;

  @ApiProperty()
  newPassword?: string;
}
