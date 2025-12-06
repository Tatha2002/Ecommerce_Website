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

  /** ------------------ CREATE CUSTOMER -------------------- */
  async createCustomer(dto: any) {
    // Sometimes DTO arrives as an array → correct it
    const data: Customer = Array.isArray(dto) ? dto[0] : dto;

    const customer = this.customerRepo.create(data);
    const saved = await this.customerRepo.save(customer);

    // Emit only CUSTOMER events from this MS
    this.rabbitService.emit('customer.created', {
      id: saved.id,
      name: saved.name,
      email: saved.email,
      address: saved.address,
    });

    return saved;
  }

  /** ------------------ FIND ALL -------------------- */
  async findAll() {
    return this.customerRepo.find();
  }

  /** ------------------ FIND ONE -------------------- */
  async findOne(id: string) {
    return this.customerRepo.findOne({ where: { id } });
  }

  /** ------------------ UPDATE -------------------- */
  async update(id: string, updateDto: any) {
    await this.customerRepo.update(id, updateDto);
    return this.findOne(id);
  }

  /** ------------------ DELETE -------------------- */
  async remove(id: string) {
    await this.customerRepo.delete(id);
    return { message: 'Customer deleted', id };
  }

  /** ------------------ CUSTOMER ORDER HISTORY -------------------- */
  async getOrderHistory(customerId: string) {
    return this.orderHistoryRepo.find({
      where: { customerId },
      order: { orderDate: 'DESC' },
    });
  }
}
