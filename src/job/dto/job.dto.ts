import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

export class JobDto {
  @ApiProperty({ example: 'job-504' })
  @AutoMap()
  jobId: string;

  @ApiProperty({ example: 'Software Engineer' })
  @AutoMap()
  title: string;

  @ApiProperty({ example: 'Seattle, CA' })
  @AutoMap()
  location: string;

  @ApiProperty({ example: true })
  @AutoMap()
  remote?: boolean;

  @ApiProperty({ example: 78000 })
  @AutoMap()
  salaryMin?: number;

  @ApiProperty({ example: 84000 })
  @AutoMap()
  salaryMax?: number;

  @ApiProperty({ example: 'USD' })
  @AutoMap()
  currency?: string;

  @ApiProperty({ example: 'BackEnd Solutions' })
  @AutoMap()
  companyName: string;

  @ApiProperty({ example: ['JavaScript', 'Node.js', 'React'] })
  @AutoMap()
  skills?: string[];

  @ApiProperty({ example: 5 })
  @AutoMap()
  experience?: number;

  @ApiProperty({ example: '2025-03-01T00:00:00.000Z' })
  @AutoMap()
  postedDate: Date;

  @ApiProperty({ example: 'api-1' })
  @AutoMap()
  source: string;

  @ApiProperty({ example: { recruiter: 'John Doe', dataSource: 'API 1' } })
  @AutoMap()
  metadata?: Record<string, any>;
}
