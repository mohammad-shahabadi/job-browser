import { Test, TestingModule } from '@nestjs/testing';
import { AutomapperModule } from '@automapper/nestjs';

import { classes } from '@automapper/classes';
import { JobMapperProfile } from '../mapper/job.mapper';
import { JobDto } from '../dto/job.dto';
import { JobEntity } from '../entity/job.entity';

describe('JobMapper Profile', () => {
  let jobMapperProfile: JobMapperProfile;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AutomapperModule.forRoot({ strategyInitializer: classes() })],
      providers: [JobMapperProfile],
    }).compile();

    jobMapperProfile = moduleRef.get(JobMapperProfile);
  });

  it('should correctly map JobDto to JobEntity using the profile', () => {
    const jobDto: JobDto = {
      jobId: 'job-123',
      title: 'Software Engineer',
      location: 'Seattle, WA',
      salaryMin: 75000,
      salaryMax: 120000,
      currency: 'USD',
      companyName: 'TechCorp',
      skills: ['JavaScript', 'Node.js'],
      experience: 3,
      postedDate: new Date(),
      source: 'api-1',
      metadata: { recruiter: 'John Doe' },
    };

    const jobEntity: JobEntity = jobMapperProfile['mapper'].map(
      jobDto,
      JobDto,
      JobEntity,
    );

    expect(jobEntity.jobId).toEqual(jobDto.jobId);
    expect(jobEntity.title).toEqual(jobDto.title);
    expect(jobEntity.location).toEqual(jobDto.location);
    expect(jobEntity.skills).toEqual(jobDto.skills);
    expect(jobEntity.postedDate).toEqual(jobDto.postedDate);
    expect(jobEntity.salaryMin).toEqual(jobDto.salaryMin);
    expect(jobEntity.salaryMax).toEqual(jobDto.salaryMax);
    expect(jobEntity.currency).toEqual(jobDto.currency);
    expect(jobEntity.metadata).toEqual(jobDto.metadata);
  });
});
