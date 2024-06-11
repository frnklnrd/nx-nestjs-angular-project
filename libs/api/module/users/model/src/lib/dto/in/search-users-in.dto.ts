import { PartialType } from '@nestjs/swagger';
import { SearchPaginatedInDto } from '@project/api-core-api';

export class SearchUsersInDto extends PartialType(SearchPaginatedInDto) {}
