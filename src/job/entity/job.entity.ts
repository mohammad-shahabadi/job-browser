import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';

@Entity()
export class JobEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @AutoMap()
  jobId: string;

  @Column()
  @AutoMap()
  @Index()
  title: string;

  @Column()
  @AutoMap()
  location: string;

  @Column({ nullable: true })
  @AutoMap()
  remote?: boolean;

  @Column({ nullable: true })
  @AutoMap()
  salaryMin?: number;

  @Column({ nullable: true })
  @AutoMap()
  salaryMax?: number;

  @Column({ nullable: true })
  @AutoMap()
  currency?: string;

  @Column()
  @AutoMap()
  companyName: string;

  @Column('text', { array: true, nullable: true })
  @AutoMap()
  skills?: string[];

  @Column({ nullable: true })
  @AutoMap()
  experience?: number;

  @Column()
  @AutoMap()
  postedDate: Date;

  @Column({ nullable: false })
  @AutoMap()
  source: string;

  @Column({ type: 'jsonb', nullable: true })
  @AutoMap()
  metadata?: Record<string, any>;

  @CreateDateColumn()
  fetchedAt: Date;
}
