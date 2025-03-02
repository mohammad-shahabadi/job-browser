import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { JobApi2Adapter } from './job-api2.adapter';
import { JobDto } from '../dto/job.dto';

jest.mock('axios');
describe('JobApi2Adapter', () => {
  let jobApi2Adapter: JobApi2Adapter;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [JobApi2Adapter],
    }).compile();

    jobApi2Adapter = moduleRef.get(JobApi2Adapter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and transform job data correctly', async () => {
    const mockApiResponse = {
      data: {
        data: {
          jobsList: {
            'job-504': {
              position: 'Software Engineer',
              location: {
                city: 'Seattle',
                state: 'WA',
                remote: false,
              },
              compensation: {
                min: 78000,
                max: 84000,
                currency: 'USD',
              },
              employer: {
                companyName: 'BackEnd Solutions',
                website: 'https://backend-solutions.com',
              },
              requirements: {
                experience: 5,
                technologies: ['JavaScript', 'Node.js', 'React'],
              },
              datePosted: '2025-03-01',
            },
          },
        },
      },
    };

    (axios.get as jest.Mock).mockResolvedValue(mockApiResponse);

    const jobs: JobDto[] = await jobApi2Adapter.fetchJobs();

    expect(jobs).toHaveLength(1);
    expect(jobs[0].jobId).toBe('job-504');
    expect(jobs[0].title).toBe('Software Engineer');
    expect(jobs[0].location).toBe('Seattle, WA');
    expect(jobs[0].remote).toBe(false);
    expect(jobs[0].salaryMin).toBe(78000);
    expect(jobs[0].salaryMax).toBe(84000);
    expect(jobs[0].currency).toBe('USD');
    expect(jobs[0].companyName).toBe('BackEnd Solutions');
    expect(jobs[0].skills).toEqual(['JavaScript', 'Node.js', 'React']);
    expect(jobs[0].experience).toBe(5);
    expect(jobs[0].postedDate).toEqual(new Date('2025-03-01'));
    expect(jobs[0].source).toBe('api-2');
    expect(jobs[0].metadata).toEqual({
      website: 'https://backend-solutions.com',
    });
  });

  it('should handle API failure and return an empty array', async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error('API Error'));

    const jobs: JobDto[] = await jobApi2Adapter.fetchJobs();

    expect(jobs).toEqual([]);
  });
});
