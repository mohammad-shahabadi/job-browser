import { ApiProperty } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { RequestListDto } from '../../common/dto/request-list.dto';
import { Type } from 'class-transformer';

export class JobFilterDto extends RequestListDto {
  @ApiProperty({ required: false, example: 'Software Engineer' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false, example: 'Seattle, CA' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ required: false, example: 'BackEnd Solutions' })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({ required: false, example: 78000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  salaryMin?: number;

  @ApiProperty({ required: false, example: 120000 })
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  salaryMax?: number;

  @ApiProperty({ required: false, example: 3 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  experience?: number;

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsBooleanString()
  remote?: string;

  @ApiProperty({ required: false, example: 'api-1' })
  @IsOptional()
  @IsString()
  source?: string;
}
