import { Test, TestingModule } from '@nestjs/testing';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { JobRepository } from './repository/job.repository';
import { JobMapperProfile } from './mapper/job.mapper';
import { AutomapperModule, getMapperToken } from '@automapper/nestjs';
import { createMapper } from '@automapper/core';
import { classes } from '@automapper/classes';
import { JobApi1Adapter } from './adapter/job-api1.adapter';
import { JobApi2Adapter } from './adapter/job-api2.adapter';

describe('JobController', () => {
  let controller: JobController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AutomapperModule],
      controllers: [JobController],
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
        {
          provide: getMapperToken(),
          useValue: createMapper({
            strategyInitializer: classes(),
          }),
        },
        JobMapperProfile,
        JobApi1Adapter,
        JobApi2Adapter,
      ],
    }).compile();

    controller = module.get<JobController>(JobController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
