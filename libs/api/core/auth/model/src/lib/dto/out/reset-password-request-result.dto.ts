import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordRequestResultDto {
  @ApiProperty()
  tokenSend?: boolean;
}
