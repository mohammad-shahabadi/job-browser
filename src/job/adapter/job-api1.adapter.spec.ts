import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { JobApi1Adapter } from './job-api1.adapter';
import { JobDto } from '../dto/job.dto';

jest.mock('axios');

describe('JobApi1Adapter', () => {
  let jobApi1Adapter: JobApi1Adapter;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [JobApi1Adapter],
    }).compile();

    jobApi1Adapter = moduleRef.get(JobApi1Adapter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and transform job data correctly', async () => {
    const mockApiResponse = {
      data: {
        jobs: [
          {
            jobId: 'P1-42',
            title: 'Backend Engineer',
            details: {
              location: 'New York, NY',
              salaryRange: '$84k - $100k',
            },
            company: {
              name: 'Creative Design Ltd',
            },
            skills: ['JavaScript', 'Node.js', 'React'],
            postedDate: '2025-02-27T04:49:14.655Z',
          },
        ],
      },
    };

    (axios.get as jest.Mock).mockResolvedValue(mockApiResponse);

    const jobs: JobDto[] = await jobApi1Adapter.fetchJobs();

    expect(jobs).toHaveLength(1);
    expect(jobs[0].jobId).toBe('P1-42');
    expect(jobs[0].title).toBe('Backend Engineer');
    expect(jobs[0].location).toBe('New York, NY');
    expect(jobs[0].salaryMin).toBe(84);
    expect(jobs[0].salaryMax).toBe(100);
    expect(jobs[0].currency).toBe('USD');
    expect(jobs[0].companyName).toBe('Creative Design Ltd');
    expect(jobs[0].skills).toEqual(['JavaScript', 'Node.js', 'React']);
    expect(jobs[0].postedDate).toEqual(new Date('2025-02-27T04:49:14.655Z'));
    expect(jobs[0].source).toBe('api-1');
    expect(jobs[0].metadata).toEqual({});
  });

  it('should handle API failure and return an empty array', async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error('API Error'));

    const jobs: JobDto[] = await jobApi1Adapter.fetchJobs();

    expect(jobs).toEqual([]);
  });
});
