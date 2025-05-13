import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UserMiddleware } from './user.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, UserMiddleware],
  exports: [UsersService, UserMiddleware],
  controllers: [UsersController],
})
export class UsersModule {}
