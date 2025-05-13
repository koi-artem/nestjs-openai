import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Settings } from '../settings/settings.entity';
import { Feedback } from '../feedback/feedback.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  @Index({ unique: true })
  telegramId: string;

  @Column()
  @Index({ unique: true })
  tgUsername: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Settings, (settings) => settings.user)
  settings: Settings[];

  @OneToMany(() => Feedback, (feedback) => feedback.user)
  feedback: Feedback[];
}
