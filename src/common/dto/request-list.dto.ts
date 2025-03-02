import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class RequestListDto {
  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumberString()
  page: string;

  @ApiProperty({ example: 10 })
  @IsOptional()
  @IsNumberString()
  pageSize: string;
}
