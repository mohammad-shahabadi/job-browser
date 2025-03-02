import { DataSource, Repository } from 'typeorm';
import { JobEntity } from '../entity/job.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JobRepository extends Repository<JobEntity> {
  constructor(private dataSource: DataSource) {
    super(JobEntity, dataSource.createEntityManager());
  }
}
