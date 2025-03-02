import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { optionsSeeder } from './data-source';

@Module({
  imports: [TypeOrmModule.forRoot(optionsSeeder)],
})
export class DbModule {}
