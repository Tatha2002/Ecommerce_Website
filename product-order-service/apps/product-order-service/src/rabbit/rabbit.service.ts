/* rabbit/rabbit.service.ts */
import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class RabbitService {
  public client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'orders_queue',     // name must match in all services
        queueOptions: { durable: true },
      },
    });
  }

  async emit(pattern: string, data: any) {
    return this.client.emit(pattern, data).toPromise();
  }
}
