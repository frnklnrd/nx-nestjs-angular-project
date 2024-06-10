/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiProperty } from '@nestjs/swagger';

export class PaginationInDto {
  @ApiProperty()
  page?: number;

  @ApiProperty()
  perPage?: number;
}

export class SortInDto {
  @ApiProperty()
  field?: string;

  @ApiProperty()
  order?: 'ASC' | 'DESC';
}

export class SearchPaginatedInDto {
  @ApiProperty()
  pagination?: PaginationInDto;

  @ApiProperty()
  sort?: SortInDto;

  @ApiProperty()
  filter?: any;

  @ApiProperty()
  meta?: any;
}
