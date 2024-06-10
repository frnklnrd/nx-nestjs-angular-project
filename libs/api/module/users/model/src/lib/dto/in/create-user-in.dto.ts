import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';
import { DefaultUserDto } from '../default-user.dto';

const passwordRegEx =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,20}$/;

export class CreateUserInDto extends PartialType(DefaultUserDto) {
  @IsNotEmpty()
  @Matches(passwordRegEx, {
    message: `Password must contain Minimum 8 and maximum 20 characters,
    at least one uppercase letter,
    one lowercase letter,
    one number and
    one special character`,
  })
  @ApiProperty()
  password?: string;
}
