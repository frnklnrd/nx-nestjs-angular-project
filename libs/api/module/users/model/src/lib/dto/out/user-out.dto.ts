import { OmitType } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { DefaultUserDto } from '../default-user.dto';

export class UserOutDto extends OmitType(DefaultUserDto, [] as const) {
  @Expose()
  id?: string;

  @Exclude()
  password?: string;

  // Other fields...

  constructor(partial: Partial<UserOutDto>) {
    super();
    Object.assign(this, partial);
  }
}
