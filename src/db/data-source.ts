import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies/snake-naming.strategy';
import { SeederOptions } from 'typeorm-extension';
import * as process from 'process';

config();

// In case of using seeder
export const optionsSeeder: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: String(process.env.DB_USER),
  password: String(process.env.DB_PASS),
  database: String(process.env.DB_NAME),
  entities: ['dist/**/*.entity.js'],
  synchronize: process.env.TYPEORM_SYNC == 'true',
  namingStrategy: new SnakeNamingStrategy(),
  seeds: ['dist/db/seeds/**/*.js'],
};

export const optionsApp: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: String(process.env.DB_USER),
  password: String(process.env.DB_PASS),
  database: String(process.env.DB_NAME),
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: process.env.TYPEORM_SYNC == 'true',
  namingStrategy: new SnakeNamingStrategy(),
};

export const dataSource = new DataSource(optionsSeeder);
