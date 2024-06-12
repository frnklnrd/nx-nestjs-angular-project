import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CryptoUtilService } from '@project/api-core-util-crypto';
import {
  CreateUserInDto,
  SearchUsersInDto,
  UpdateUserInDto,
  User
} from '@project/api-module-users-model';

import { plainToClass } from 'class-transformer';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    protected readonly usersRepository: Repository<User>,
    protected readonly dataSource: DataSource,
    protected readonly cryptoUtilService: CryptoUtilService
  ) {}

  /**
   * this is function is used to create User in User Entity.
   * @param createUserDto this will type of createUserDto in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of user
   */
  async create(createUserDto: CreateUserInDto): Promise<User> {
    const user: User = plainToClass(User, createUserDto);

    return this.usersRepository.save({
      ...user,
      isAdmin: false,
      password: await this.cryptoUtilService.encryptPassword(
        createUserDto.password as string
      )
    });
  }

  async setPassword(userId: string, newPassword: string): Promise<any> {
    // Check if user exists
    const user = await this.findById(userId);

    if (!user || !user.isActive) {
      throw new BadRequestException('User not found');
    }

    if (user.isAdmin) {
      throw new BadRequestException(
        'User Admin not allowed to change password'
      );
    }

    const result = await this.updatePassword(userId, newPassword);

    return result;
  }

  async updatePassword(userId: string, newPassword: string): Promise<User> {
    return this.usersRepository.save({
      id: userId,
      password: await this.cryptoUtilService.encryptPassword(
        newPassword as string
      )
    });
  }

  async createMany(users: User[]) {
    await this.dataSource.transaction(async (manager) => {
      await manager.save(users[0]);
      await manager.save(users[1]);
    });
  }

  /**
   * this function is used to get all the user's list
   * @returns promise of array of users
   */
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param id is type of number, which represent the id of user.
   * @returns promise of user
   */
  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  /**
   * this function used to get data of use whose username is passed in parameter
   * @param username is type of number, which represent the username of user.
   * @returns promise of user
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ username });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async searchPaginated(
    params: SearchUsersInDto
  ): Promise<{ items: User[]; total: number; page: number; limit: number }> {
    const { page = 1, perPage = 10 } = params.pagination as {
      page: number;
      perPage: number;
    };

    const [items, total] = await this.usersRepository.findAndCount({
      // where: username ? { username: ILike(`%${username}%`) } : {},
      take: perPage,
      skip: (page - 1) * perPage
    });

    return {
      items,
      total,
      page,
      limit: perPage
    };
  }

  /**
   * this function is used to updated specific user whose id is passed in
   * parameter along with passed updated data
   * @param id is type of string, which represent the id of user.
   * @param updateUserDto this is partial type of createUserDto.
   * @returns promise of udpate user
   */
  async update(id: string, updateUserDto: UpdateUserInDto): Promise<User> {
    const user: User = new User();

    user.email = updateUserDto.email as string;
    user.username = updateUserDto.username as string;
    // user.password = updateUserDto.password as string;

    user.id = id;

    return this.usersRepository.save(user);
  }

  /**
   * this function is used to remove or delete user from database.
   * @param id is the type of number, which represent id of user
   * @returns nuber of rows deleted or affected
   */
  async remove(id: string): Promise<{ affected?: number | null | undefined }> {
    return this.usersRepository.delete(id);
  }

  async updateActive(userId: string, active: boolean): Promise<User> {
    return this.usersRepository.save({
      id: userId,
      isActive: active
    });
    // TODO add active at date
  }

  async updateBlocked(userId: string, blocked: boolean): Promise<User> {
    return this.usersRepository.save({
      id: userId,
      isBlocked: blocked
    });
    // TODO add blocked at date
  }

  // ---------------------------------------------------------
}
