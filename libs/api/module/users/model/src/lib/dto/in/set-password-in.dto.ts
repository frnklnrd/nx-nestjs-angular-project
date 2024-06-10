import { ApiProperty } from '@nestjs/swagger';

export class SetPasswordInDto {
  @ApiProperty()
  newPassword?: string;
}
