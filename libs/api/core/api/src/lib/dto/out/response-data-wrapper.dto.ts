import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseDataWrapperDto<T> {
  @ApiProperty()
  data?: T;

  @ApiProperty()
  status?: HttpStatus;

  constructor(data: T, status: HttpStatus = HttpStatus.OK) {
    this.data = data;
    this.status = status;
  }
}
