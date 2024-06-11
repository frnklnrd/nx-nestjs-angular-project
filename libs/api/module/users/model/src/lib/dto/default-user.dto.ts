import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  MinLength
} from 'class-validator';

export class DefaultUserDto {
  @IsNotEmpty()
  @MinLength(3, { message: 'Username must have at least 3 characters.' })
  @IsAlphanumeric(undefined, {
    message: 'Username does not allow other than alpha numeric chars.'
  })
  @ApiProperty()
  username?: string;

  @IsNotEmpty()
  @IsEmail(undefined, { message: 'Please provide valid Email.' })
  @ApiProperty()
  email?: string;

  @ApiProperty()
  isAdmin?: boolean;

  @ApiProperty()
  isActive?: boolean;
}
