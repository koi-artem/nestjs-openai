import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('/:id')
  @ApiQuery({ name: 'id', description: 'User ID' })
  async findAll(@Param('id') id: string) {
    const user = await this.usersService.getUser(id);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
