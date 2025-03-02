import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { JobApiAdapter } from '../interface/job-api.interface';
import { JobDto } from '../dto/job.dto';

@Injectable()
export class JobApi1Adapter implements JobApiAdapter {
  private API_URL = 'https://assignment.devotel.io/api/provider1/jobs';

  async fetchJobs(): Promise<JobDto[]> {
    try {
      const response = await axios.get(this.API_URL);
      const jobs = response.data.jobs;

      return jobs.map((job) => ({
        jobId: job.jobId,
        title: job.title,
        location: job.details.location,
        salaryMin: parseInt(
          job.details.salaryRange.split('-')[0].replace(/\D/g, ''),
        ),
        salaryMax: parseInt(
          job.details.salaryRange.split('-')[1].replace(/\D/g, ''),
        ),
        currency: 'USD',
        companyName: job.company.name,
        skills: job.skills,
        experience: 0,
        postedDate: new Date(job.postedDate),
        source: 'api-1',
        metadata: {},
      }));
    } catch (error) {
      console.error('Error fetching jobs from API 1:', error.message);
      return [];
    }
  }
}
