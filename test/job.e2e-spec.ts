import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { JobModule } from '../src/job/job.module';
import { JobService } from '../src/job/job.service';
import { ResponseListDto } from '../src/common/dto/response-list.dto';
import { JobDto } from '../src/job/dto/job.dto';
import { JobMapperProfile } from '../src/job/mapper/job.mapper';
import { JobRepository } from '../src/job/repository/job.repository';

describe('JobController (E2E)', () => {
  let app: INestApplication;
  const jobService = {
    getJobs: jest.fn().mockResolvedValue({
      page: 1,
      pageSize: 10,
      total: 1,
      data: [
        {
          jobId: 'job-123',
          title: 'Software Engineer',
          location: 'New York, NY',
          salaryMin: 80000,
          salaryMax: 120000,
          currency: 'USD',
          companyName: 'TechCorp',
          skills: ['JavaScript', 'Node.js'],
          experience: 3,
          postedDate: new Date(),
          source: 'api-1',
          metadata: {},
        },
      ],
    } as ResponseListDto<JobDto>),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [JobModule],
    })
      .overrideProvider(JobService) // ✅ Mock JobService
      .useValue(jobService)
      .overrideProvider(JobMapperProfile)
      .useValue(JobMapperProfile)
      .overrideProvider(JobRepository)
      .useValue(JobRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /job should return job listings', async () => {
    const response = await request(app.getHttpServer()).get('/job');

    expect(response.status).toBe(200);
    expect(response.body.page).toBe(1);
    expect(response.body.pageSize).toBe(10);
    expect(response.body.total).toBe(1);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].jobId).toBe('job-123');
    expect(response.body.data[0].title).toBe('Software Engineer');
  });

  it('GET /job with filters should call JobService with correct params', async () => {
    const req = {
      title: 'Software Engineer',
      location: 'New York, NY',
      page: '1',
      pageSize: '5',
      companyName: 'Google',
    };
    const response = await request(app.getHttpServer()).get('/job').query(req);

    expect(response.status).toBe(200);
    expect(jobService.getJobs).toHaveBeenCalledWith(req, '1', '5');
  });
});
