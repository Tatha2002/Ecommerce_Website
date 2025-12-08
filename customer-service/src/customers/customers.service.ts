import { Injectable } from '@nestjs/common';
import { RabbitService } from '../rabbit/rabbit.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { OrderHistory } from './entities/order-history.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,

    @InjectRepository(OrderHistory)
    private orderHistoryRepo: Repository<OrderHistory>,

    private rabbitService: RabbitService,
  ) {}

  async createCustomer(dto: any) {
    const data: Customer = Array.isArray(dto) ? dto[0] : dto;

    const customer = this.customerRepo.create(data);
    const saved = await this.customerRepo.save(customer);

    this.rabbitService.emit('customer.created', {
      id: saved.id,
      name: saved.name,
      email: saved.email,
      address: saved.address,
    });

    return saved;
  }

  async findAll() {
    return this.customerRepo.find();
  }

  async findOne(id: string) {
    return this.customerRepo.findOne({ where: { id } });
  }

  async update(id: string, updateDto: any) {
    await this.customerRepo.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.customerRepo.delete(id);
    return { message: 'Customer deleted', id };
  }

  async getOrderHistory(customerId: string) {
    return this.orderHistoryRepo.find({
      where: { customerId },
      order: { orderDate: 'DESC' },
    });
  }
}
