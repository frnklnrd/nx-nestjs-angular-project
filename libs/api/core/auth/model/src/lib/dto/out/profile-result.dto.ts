import { ApiProperty } from '@nestjs/swagger';

export class ProfileResultDto {
  @ApiProperty()
  id?: string;

  @ApiProperty()
  username?: string;

  @ApiProperty()
  properties?: { [id: string]: null | undefined | number | string };

  @ApiProperty()
  permissions?: string[];
}
