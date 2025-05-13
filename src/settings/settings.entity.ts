import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/users.entity';

@Entity()
export class Settings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'timestamp',
    default: () => 'NOW()',
  })
  created_at: number;

  @ManyToOne(() => User, (user) => user.settings, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;
}
