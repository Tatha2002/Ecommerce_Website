import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RabbitService } from '../rabbit/rabbit.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly rabbitService: RabbitService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = this.productRepo.create(createProductDto);
    return this.productRepo.save(product);
  }

  async findAll() {
    return this.productRepo.find();
  }

  async findOne(id: string) {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, updateDto: UpdateProductDto) {
    const product = await this.findOne(id);
    Object.assign(product, updateDto);

    const updated = await this.productRepo.save(product);

    // publish update event
    this.rabbitService.emit('product.updated', {
      id: updated.id,
      price: updated.price,
      stock: updated.stock,
    });

    return updated;
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepo.remove(product);

    // publish delete event
    this.rabbitService.emit('product.deleted', {
      id: product.id,
      name: product.name,
    });

    return { message: 'Product deleted', id };
  }

  // Validation helper used by order checkout flow
  async validateProducts(items: { productId: string; qty: number }[]) {
    const ids = items.map(i => i.productId);
    const products = await this.productRepo.find({ where: { id: In(ids) } });

    if (products.length !== items.length) {
      throw new BadRequestException('Some products not found');
    }

    const errors: { productId: string; message: string }[] = [];

    for (const req of items) {
      const product = products.find(p => p.id === req.productId);
      if (!product) {
        errors.push({ productId: req.productId, message: 'Product not found' });
        continue;
      }
      if (product.stock < req.qty) {
        errors.push({
          productId: product.id,
          message: `Only ${product.stock} items left`,
        });
      }
    }

    if (errors.length > 0) {
      throw new BadRequestException({ message: 'Stock validation failed', errors });
    }

    return {
      success: true,
      message: 'All products are valid for checkout',
    };
  }
}
