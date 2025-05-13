import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name, { timestamp: true });

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async getUser(telegramId: string) {
    try {
      return this.usersRepository.findOne({ where: { telegramId } });
    } catch (e) {
      this.logger.error(e.message, e.stack);
      return null;
    }
  }

  async checkCreateUser(
    telegramId: string,
    tgUsername: string,
    firstName: string,
    lastName: string,
  ) {
    try {
      const user = await this.getUser(telegramId);

      if (user) {
        return user;
      }

      return this.createUser(telegramId, tgUsername, firstName, lastName);
    } catch (e) {
      console.error(e.message);
    }
  }

  async createUser(
    telegramId: string,
    tgUsername: string,
    firstName: string,
    lastName: string,
  ) {
    try {
      const result = this.usersRepository.create({
        telegramId,
        tgUsername,
        firstName,
        lastName,
      });
      return this.usersRepository.save(result);
    } catch (e) {
      this.logger.error(e.message, e.stack);
    }
  }
}
