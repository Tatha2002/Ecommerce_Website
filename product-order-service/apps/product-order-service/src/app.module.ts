import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { RabbitModule } from './rabbit/rabbit.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',

      // ✅ MUST BE localhost (Windows → Docker)
      host: process.env.PG_HOST || 'localhost',

      port: +(process.env.PG_PORT || 5432),
      username: process.env.PG_USER || 'postgres',
      password: process.env.PG_PASSWORD || 'password123',   // as in docker-compose
      database: process.env.PG_DB || 'ecommerce',           // as in docker-compose

      autoLoadEntities: true,
      synchronize: true,
    }),

    ProductsModule,
    OrdersModule,
    RabbitModule,
  ],
})
export class AppModule {}
