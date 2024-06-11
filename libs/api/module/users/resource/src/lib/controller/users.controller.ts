import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  Response
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiProduces,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import {
  AbstractAppController,
  PaginatedSearchResultDto
} from '@project/api-core-api';
import {
  CreateUserInDto,
  SearchUsersInDto,
  SetPasswordInDto,
  UpdateUserInDto,
  UserOutDto
} from '@project/api-module-users-model';
import { UsersService } from '@project/api-module-users-service';
import { plainToClass } from 'class-transformer';
import { Response as Res } from 'express';

@ApiBearerAuth()
@ApiTags('users')
@Controller({
  path: 'users',
  version: '1'
})
export class UsersController extends AbstractAppController {
  protected getClassName(): string {
    return UsersController.name;
  }

  constructor(protected readonly usersService: UsersService) {
    super();
  }

  // @CheckPermission(['ADMIN'])
  @ApiProduces('application/json')
  @ApiResponse({
    status: 200,
    description: 'List of users matching the search criteria',
    type: UserOutDto
    // isArray: true,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error'
  })
  @Post()
  async create(@Body() createUserDto: CreateUserInDto): Promise<UserOutDto> {
    // Check if user exists
    const userExists = await this.usersService.findByUsername(
      createUserDto.username as string
    );

    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    // Create user
    const user = await this.usersService.create(createUserDto);

    // Return created user
    return plainToClass(UserOutDto, user);
  }

  @ApiProduces('application/json')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of users matching the search criteria',
    type: PaginatedSearchResultDto<UserOutDto>
    // isArray: true,
  })
  @Post('search/paginated')
  async searchPaginated(
    @Body() body: SearchUsersInDto,
    @Response() response: Res
  ): Promise<Res> {
    this.logger.debug('searchPaginated - init');

    this.logger.debug('body', body);

    const data = await this.usersService.searchPaginated(body);

    this.logger.debug('data', data);

    const result: PaginatedSearchResultDto<UserOutDto> = {
      items: data.items.map((item) => plainToClass(UserOutDto, item)),
      total: data.total,
      page: data.page,
      limit: data.limit
    };

    this.logger.debug('searchPaginated - end');

    return response
      .set({
        'Access-Control-Expose-Headers': 'Content-Items-Total',
        'Content-Items-Total': '' + result.total
      })
      .json(result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserInDto
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id/set-password')
  setPassword(
    @Request() req: any,
    @Param('id') id: string,
    @Body() setPasswordInDto: SetPasswordInDto
  ) {
    this.logger.debug('setPassword', setPasswordInDto);

    if (id === req.user.sub) {
      this.logger.error('User not allowed to set own password');
      throw new BadRequestException('User not allowed to set own password');
    }

    // set user password
    const user = this.usersService.setPassword(
      id,
      setPasswordInDto.newPassword as string
    );

    // Return created user
    return plainToClass(UserOutDto, user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
