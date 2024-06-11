import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordInDto {
  @ApiProperty()
  currentPassword?: string;

  @ApiProperty()
  newPassword?: string;
}
