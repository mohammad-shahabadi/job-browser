import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { JobMapperProfile } from './mapper/job.mapper';
import { JobRepository } from './repository/job.repository';
import { JobApi1Adapter } from './adapter/job-api1.adapter';
import { JobApi2Adapter } from './adapter/job-api2.adapter';

@Module({
  controllers: [JobController],
  providers: [
    JobService,
    JobMapperProfile,
    JobRepository,
    JobApi1Adapter,
    JobApi2Adapter,
  ],
})
export class JobModule {}
