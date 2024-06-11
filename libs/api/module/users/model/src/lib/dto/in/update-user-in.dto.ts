import { OmitType } from '@nestjs/swagger';
import { DefaultUserDto } from '../default-user.dto';

export class UpdateUserInDto extends OmitType(DefaultUserDto, [] as const) {}
