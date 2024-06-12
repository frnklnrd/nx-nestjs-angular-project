import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordVerifyResultDto {
  @ApiProperty()
  resetPasswordToken?: string;
}
