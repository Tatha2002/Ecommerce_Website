import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { RabbitModule } from '../rabbit/rabbit.module'; // ensure path correct

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), RabbitModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
