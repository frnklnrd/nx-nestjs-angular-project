import { Module } from '@nestjs/common';
import { ApiCoreAuthServiceModule } from '@project/api-core-auth-service';
import { AuthController } from './controller/auth.controller';

@Module({
  imports: [ApiCoreAuthServiceModule],
  controllers: [AuthController],
  providers: [],
  exports: []
})
export class ApiCoreAuthResourceModule {}
