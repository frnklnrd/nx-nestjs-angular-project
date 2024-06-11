import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordResultDto {
  @ApiProperty()
  passwordChanged?: boolean;
}
