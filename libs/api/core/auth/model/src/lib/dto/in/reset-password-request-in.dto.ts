import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordRequestInDto {
  @ApiProperty()
  usernameOrEmail?: string;
}
