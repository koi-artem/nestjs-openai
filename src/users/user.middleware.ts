import { NextFunction } from 'express';
import { UsersService } from './users.service';
import { Injectable } from '@nestjs/common';
import { Context } from '../interfaces/context.interface';

@Injectable()
export class UserMiddleware {
  constructor(private readonly usersService: UsersService) {}

  use = async (ctx: Context, next: NextFunction) => {
    let user = await this.usersService.getUser(ctx.from.id.toString());

    if (!user) {
      await this.usersService.createUser(
        ctx.from.id.toString(),
        ctx.from.username,
        ctx.from.first_name,
        ctx.from.last_name,
      );
    }

    next();
  };
}
