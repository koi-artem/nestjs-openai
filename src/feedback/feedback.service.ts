import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './feedback.entity';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly userService: UsersService,
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
  ) {}

  async createFeedback(telegramId: string, content: string) {
    const user = await this.userService.getUser(telegramId);

    const feedback = this.feedbackRepository.create({
      content,
      user,
    });

    return this.feedbackRepository.save(feedback);
  }
}
