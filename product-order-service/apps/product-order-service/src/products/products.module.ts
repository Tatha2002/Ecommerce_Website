import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { RabbitModule } from '../rabbit/rabbit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    RabbitModule, // provide RabbitService so ProductsService can inject it
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
