import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { JobDto } from '../dto/job.dto';
import { JobApiAdapter } from '../interface/job-api.interface';

@Injectable()
export class JobApi2Adapter implements JobApiAdapter {
  private API_URL = 'https://assignment.devotel.io/api/provider2/jobs';

  async fetchJobs(): Promise<JobDto[]> {
    try {
      const response = await axios.get(this.API_URL);
      const jobsList = response.data.data.jobsList;

      return Object.keys(jobsList).map((jobKey) => {
        const jobData = jobsList[jobKey];

        return {
          jobId: jobKey,
          title: jobData.position,
          location: `${jobData.location.city}, ${jobData.location.state}`,
          remote: jobData.location.remote,
          salaryMin: jobData.compensation.min,
          salaryMax: jobData.compensation.max,
          currency: jobData.compensation.currency,
          companyName: jobData.employer.companyName,
          skills: jobData.requirements.technologies,
          experience: jobData.requirements.experience,
          postedDate: new Date(jobData.datePosted),
          source: 'api-2',
          metadata: {
            website: jobData.employer.website,
          },
        };
      });
    } catch (error) {
      console.error('Error fetching jobs from API 2:', error.message);
      return [];
    }
  }
}
