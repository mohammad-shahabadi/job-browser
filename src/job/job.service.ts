import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { JobRepository } from './repository/job.repository';
import { JobFilterDto } from './dto/job-filter.dto';
import { Mapper } from '@automapper/core';
import { JobDto } from './dto/job.dto';
import { JobEntity } from './entity/job.entity';
import { InjectMapper } from '@automapper/nestjs';
import { JobApi1Adapter } from './adapter/job-api1.adapter';
import { JobApi2Adapter } from './adapter/job-api2.adapter';
import { JobApiAdapter } from './interface/job-api.interface';
import { SelectQueryBuilder } from 'typeorm';
import { ResponseListDto } from '../common/dto/response-list.dto';
import * as process from 'process';

@Injectable()
export class JobService {
  constructor(
    private readonly jobRepository: JobRepository,
    @InjectMapper()
    private readonly mapper: Mapper,
    private readonly api1Adapter: JobApi1Adapter,
    private readonly api2Adapter: JobApi2Adapter,
  ) {}

  @Cron(process.env.CRON_SCHEDULE || CronExpression.EVERY_MINUTE)
  async fetchJobsPeriodically() {
    const adapters: JobApiAdapter[] = [this.api1Adapter, this.api2Adapter];

    for (const adapter of adapters) {
      const jobs: JobDto[] = await adapter.fetchJobs();

      for (const job of jobs) {
        const exists = await this.jobRepository.findOne({
          where: { jobId: job.jobId },
        });

        if (!exists) {
          const jobEntity = this.mapper.map(job, JobDto, JobEntity);
          await this.jobRepository.save(jobEntity);
        }
      }
    }
  }

  async getJobs(
    filter: JobFilterDto,
    page = 1,
    pageSize = 10,
  ): Promise<ResponseListDto<JobDto>> {
    let query: SelectQueryBuilder<JobEntity> =
      this.jobRepository.createQueryBuilder('job');

    if (filter.title) {
      query = query.andWhere('LOWER(job.title) LIKE LOWER(:title)', {
        title: `%${filter.title}%`,
      });
    }
    if (filter.location) {
      query = query.andWhere('LOWER(job.location) LIKE LOWER(:location)', {
        location: `%${filter.location}%`,
      });
    }
    if (filter.companyName) {
      query = query.andWhere(
        'LOWER(job.companyName) LIKE LOWER(:companyName)',
        {
          companyName: `%${filter.companyName}%`,
        },
      );
    }
    if (filter.salaryMin) {
      query = query.andWhere('job.salaryMin >= :salaryMin', {
        salaryMin: filter.salaryMin,
      });
    }
    if (filter.salaryMax) {
      query = query.andWhere('job.salaryMax <= :salaryMax', {
        salaryMax: filter.salaryMax,
      });
    }
    if (filter.experience) {
      query = query.andWhere('job.experience >= :experience', {
        experience: filter.experience,
      });
    }
    if (filter.remote !== undefined) {
      query = query.andWhere('job.remote = :remote', { remote: filter.remote });
    }
    if (filter.source) {
      query = query.andWhere('job.source = :source', { source: filter.source });
    }

    query = query.skip((page - 1) * pageSize).take(pageSize);

    const jobs = await query.getManyAndCount();

    return {
      page,
      pageSize,
      total: jobs[1],
      data: this.mapper.mapArray(jobs[0], JobEntity, JobDto),
    };
  }
}
