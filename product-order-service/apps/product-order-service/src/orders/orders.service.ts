import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { RabbitService } from '../rabbit/rabbit.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,

    private readonly rabbitService: RabbitService,
  ) {}

  // FIND ALL
  async findAll() {
    // include items (eager: true already set on entity, but keep relations for clarity)
    return this.orderRepo.find({ relations: ['items'], order: { createdAt: 'DESC' } });
  }

  // FIND ONE (by UUID string)
  async findOne(id: string) {
    if (!id) throw new NotFoundException('Order id missing');
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  // CREATE
  async createOrder(dto: any) {
    try {
      // sanitize input
      const itemsInput: any[] = Array.isArray(dto.items) ? dto.items : [];

      // compute total if not provided (sum price * qty)
      const computedTotal = itemsInput.reduce(
        (s, it) => s + (Number(it.price ?? 0) * Number(it.quantity ?? 0)),
        0,
      );
      const total = dto.total !== undefined ? Number(dto.total) : computedTotal;

      // create and save order (UUID string)
      const order = this.orderRepo.create({
        customerId: dto.customerId,
        total,
      });

      const savedOrder = await this.orderRepo.save(order);

      // prepare and save items with orderId = savedOrder.id
      const items = itemsInput.map((item) =>
        this.orderItemRepo.create({
          orderId: savedOrder.id,
          productId: item.productId,
          quantity: Number(item.quantity ?? 0),
          price: item.price !== undefined ? Number(item.price) : 0,
        }),
      );

      const savedItems = await this.orderItemRepo.save(items);

      // Emit RabbitMQ event so other microservices (Customer MS) can react
      try {
        await this.rabbitService.emit('order.created', {
          orderId: savedOrder.id,
          customerId: savedOrder.customerId,
          total: savedOrder.total,
          items: savedItems,
          createdAt: savedOrder.createdAt,
        });
      } catch (e) {
        // don't fail order creation if MQ publish fails — log and continue
        console.error('Failed to emit order.created event', e);
      }

      return { ...savedOrder, items: savedItems };
    } catch (err) {
      console.error('createOrder error', err);
      throw new InternalServerErrorException('Failed to create order');
    }
  }

  // UPDATE
  async update(id: string, dto: any) {
    // ensure exists
    const existing = await this.findOne(id);

    // Delete old items belonging to this order
    await this.orderItemRepo.delete({ orderId: id });

    // Insert new items
    const itemsInput: any[] = Array.isArray(dto.items) ? dto.items : [];

    const items = itemsInput.map((item) =>
      this.orderItemRepo.create({
        orderId: id,
        productId: item.productId,
        quantity: Number(item.quantity ?? 0),
        price: item.price !== undefined ? Number(item.price) : 0,
      }),
    );

    await this.orderItemRepo.save(items);

    // compute total if provided or from items
    const computedTotal = items.reduce((s, it) => s + (Number(it.price ?? 0) * Number(it.quantity ?? 0)), 0);
    const totalToSet = dto.total !== undefined ? Number(dto.total) : computedTotal;

    // update order
    await this.orderRepo.update(id, {
      customerId: dto.customerId ?? existing.customerId,
      total: totalToSet,
    });

    // emit update event (optional) — you can define another pattern if needed
    try {
      await this.rabbitService.emit('order.updated', {
        orderId: id,
        customerId: dto.customerId ?? existing.customerId,
        total: totalToSet,
        items,
      });
    } catch (e) {
      console.error('Failed to emit order.updated', e);
    }

    return { message: 'Order updated successfully' };
  }

  // DELETE
  async remove(id: string) {
    // verify existence
    await this.findOne(id);

    // Delete items first (explicit)
    await this.orderItemRepo.delete({ orderId: id });

    // Delete order record
    await this.orderRepo.delete(id);

    // emit delete event if you want subscribers to react
    try {
      await this.rabbitService.emit('order.deleted', { orderId: id });
    } catch (e) {
      console.error('Failed to emit order.deleted', e);
    }

    return { message: 'Order deleted successfully' };
  }
}
