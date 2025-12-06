import { DataSource } from 'typeorm';
import { Customer } from './customers/entities/customer.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.PG_HOST || 'localhost',
  port: +(process.env.PG_PORT || 5434),
  username: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'postgres',
  database: process.env.PG_DB || 'customer_db',
  entities: [Customer],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
});
