import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordConfirmResultDto {
  @ApiProperty()
  passwordChanged?: boolean;
}
