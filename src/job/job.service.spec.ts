import { Test, TestingModule } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { JobService } from './job.service';
import { JobEntity } from './entity/job.entity';
import { JobApi1Adapter } from './adapter/job-api1.adapter';
import { JobApi2Adapter } from './adapter/job-api2.adapter';
import { JobDto } from './dto/job.dto';
import { JobMapperProfile } from './mapper/job.mapper';
import { ResponseListDto } from '../common/dto/response-list.dto';
import { JobFilterDto } from './dto/job-filter.dto';
import { JobRepository } from './repository/job.repository';

jest.mock('./adapter/job-api1.adapter');
jest.mock('./adapter/job-api2.adapter');

describe('JobService', () => {
  let jobService: JobService;
  let jobRepository: JobRepository;
  let api1Adapter: JobApi1Adapter;
  let api2Adapter: JobApi2Adapter;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AutomapperModule.forRoot({ strategyInitializer: classes() })],
      providers: [
        JobService,
        {
          provide: JobRepository,
          useValue: {
            createQueryBuilder: jest.fn(() => ({
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
            })),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        { provide: JobApi1Adapter, useClass: JobApi1Adapter },
        { provide: JobApi2Adapter, useClass: JobApi2Adapter },
        JobMapperProfile,
      ],
    }).compile();

    jobService = moduleRef.get(JobService);
    jobRepository = moduleRef.get(JobRepository);
    api1Adapter = moduleRef.get(JobApi1Adapter);
    api2Adapter = moduleRef.get(JobApi2Adapter);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Reset mock state after each test
  });

  describe('fetchJobsPeriodically', () => {
    it('should fetch jobs from adapters and save new jobs', async () => {
      const mockJobs: JobDto[] = [
        {
          jobId: 'job-001',
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
      ];

      jest.spyOn(api1Adapter, 'fetchJobs').mockResolvedValue(mockJobs as any);
      jest.spyOn(api2Adapter, 'fetchJobs').mockResolvedValue([]);
      jest.spyOn(jobRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(jobRepository, 'save').mockResolvedValue(mockJobs[0] as any);

      await jobService.fetchJobsPeriodically();

      expect(api1Adapter.fetchJobs).toHaveBeenCalled();
      expect(api2Adapter.fetchJobs).toHaveBeenCalled();
      expect(jobRepository.findOne).toHaveBeenCalledWith({
        where: { jobId: 'job-001' },
      });
      expect(jobRepository.save).toHaveBeenCalled();
    });

    it('should not save existing jobs', async () => {
      const mockJobs: JobDto[] = [
        {
          jobId: 'job-002',
          title: 'Backend Developer',
          location: 'San Francisco, CA',
          salaryMin: 90000,
          salaryMax: 130000,
          currency: 'USD',
          companyName: 'Innovatech',
          skills: ['Java', 'Spring Boot'],
          experience: 4,
          postedDate: new Date(),
          source: 'api-1',
          metadata: {},
        },
      ];

      jest.spyOn(api1Adapter, 'fetchJobs').mockResolvedValue(mockJobs);
      jest.spyOn(api2Adapter, 'fetchJobs').mockResolvedValue([]);
      jest
        .spyOn(jobRepository, 'findOne')
        .mockResolvedValue(mockJobs[0] as unknown as JobEntity);

      await jobService.fetchJobsPeriodically();

      expect(jobRepository.findOne).toHaveBeenCalledWith({
        where: { jobId: 'job-002' },
      });
      expect(jobRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('getJobs', () => {
    let queryBuilder: SelectQueryBuilder<JobEntity>;
    let mockJobEntities: JobEntity[];

    beforeEach(() => {
      mockJobEntities = [
        {
          jobId: 'job-123',
          title: 'Full Stack Developer',
          location: 'Remote',
          salaryMin: 85000,
          salaryMax: 110000,
          currency: 'USD',
          companyName: 'RemoteTech',
          skills: ['React', 'Node.js'],
          experience: 2,
          postedDate: new Date(),
          source: 'api-1',
          metadata: {},
        } as JobEntity,
      ];

      queryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockJobEntities, 1]),
      } as unknown as SelectQueryBuilder<JobEntity>;

      jest
        .spyOn(jobRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilder);
    });

    it('should return paginated job results', async () => {
      const filterDto: JobFilterDto = {
        title: 'Developer',
        location: 'Remote',
        page: '1',
        pageSize: '10',
      };

      const result: ResponseListDto<JobDto> = await jobService.getJobs(
        filterDto,
        1,
        10,
      );

      expect(jobRepository.createQueryBuilder).toHaveBeenCalledWith('job');
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'LOWER(job.title) LIKE LOWER(:title)',
        { title: '%Developer%' },
      );
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'LOWER(job.location) LIKE LOWER(:location)',
        { location: '%Remote%' },
      );
      expect(queryBuilder.skip).toHaveBeenCalledWith(0);
      expect(queryBuilder.take).toHaveBeenCalledWith(10);
      expect(queryBuilder.getManyAndCount).toHaveBeenCalled();
      expect(result.total).toBe(1);
      expect(result.data).toHaveLength(1);
    });

    it('should return empty results when no jobs match the filters', async () => {
      jest.spyOn(queryBuilder, 'getManyAndCount').mockResolvedValue([[], 0]);

      const filterDto: JobFilterDto = {
        title: 'Nonexistent Job',
        page: '1',
        pageSize: '10',
      };

      const result: ResponseListDto<JobDto> = await jobService.getJobs(
        filterDto,
        1,
        10,
      );

      expect(result.total).toBe(0);
      expect(result.data).toHaveLength(0);
    });
  });
});
