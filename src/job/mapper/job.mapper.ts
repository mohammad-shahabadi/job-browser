import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { JobEntity } from '../entity/job.entity';
import { JobDto } from '../dto/job.dto';

@Injectable()
export class JobMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, JobEntity, JobDto);
      createMap(
        mapper,
        JobDto,
        JobEntity,
        forMember(
          (destination) => destination.skills,
          mapFrom((source) => source.skills),
        ),
        forMember(
          (destination) => destination.metadata,
          mapFrom((source) => source.metadata),
        ),
      );
    };
  }
}
