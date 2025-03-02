import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobModule } from './job/job.module';
import { DbModule } from './db/db.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { optionsApp } from './db/data-source';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_FILTER } from '@nestjs/core';
import { ServerExceptionFilter } from './common/filter/server-exception.filter';

@Module({
  imports: [
    TypeOrmModule.forRoot(optionsApp),
    AutomapperModule.forRoot({ strategyInitializer: classes() }),
    ScheduleModule.forRoot(),
    JobModule,
    DbModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ServerExceptionFilter,
    },
  ],
})
export class AppModule {}
