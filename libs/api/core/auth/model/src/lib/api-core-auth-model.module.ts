import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToken } from './entities/user-token.entity';

@Module({
  imports: [
    //-------------------------------------
    TypeOrmModule.forFeature([UserToken])
    //-------------------------------------
  ],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule]
})
export class ApiCoreAuthModelModule {}
