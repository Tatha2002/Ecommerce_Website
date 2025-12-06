import { DataSource } from 'typeorm';
import { Product } from './products/entities/product.entity';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.PG_HOST || 'localhost',
  port: +(process.env.PG_PORT || 5433),
  username: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'postgres',
  database: process.env.PG_DB || 'product_db',
  entities: [Product, Order, OrderItem],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
});
