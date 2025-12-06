import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { Customer } from './entities/customer.entity';
import { OrderHistory } from './entities/order-history.entity';
import { RabbitModule } from '../rabbit/rabbit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, OrderHistory]),  // ⬅ Added OrderHistory entity
    RabbitModule,
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
