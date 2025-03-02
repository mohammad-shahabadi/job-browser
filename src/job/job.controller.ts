import { Controller, Get, Query } from '@nestjs/common';
import { JobService } from './job.service';
import { ApiResponse } from '@nestjs/swagger';
import { JobDto } from './dto/job.dto';
import { JobFilterDto } from './dto/job-filter.dto';
import { ResponseListDto } from '../common/dto/response-list.dto';

@Controller()
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get('job-offers')
  @ApiResponse({
    status: 200,
    description: 'Returns a list of job offers',
    type: [JobDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad query params',
  })
  async getJobs(
    @Query() filter: JobFilterDto,
  ): Promise<ResponseListDto<JobDto>> {
    console.log(filter);
    return await this.jobService.getJobs(
      filter,
      +filter.page,
      +filter.pageSize,
    );
  }
}
