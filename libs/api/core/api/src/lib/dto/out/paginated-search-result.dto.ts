import { ApiProperty } from '@nestjs/swagger';

export class PaginatedSearchResultDto<T> {
  @ApiProperty()
  items?: T[];

  @ApiProperty()
  total?: number;

  @ApiProperty()
  page?: number;

  @ApiProperty()
  limit?: number;
}
