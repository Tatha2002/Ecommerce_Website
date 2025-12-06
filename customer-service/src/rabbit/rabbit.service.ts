import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitService implements OnModuleInit {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor(
    @Inject('RABBIT_SERVICE') private readonly client: ClientProxy,
  ) {}

  async onModuleInit() {
    this.connection = await amqp.connect(
      `amqp://${process.env.RMQ_USER || 'admin'}:${
        process.env.RMQ_PASS || 'admin'
      }@${process.env.RMQ_HOST || 'localhost'}:${
        process.env.RMQ_PORT || '5672'
      }`,
    );
    this.channel = await this.connection.createChannel();
  }

  emit(pattern: string, data: any) {
    return this.client.emit(pattern, data);
  }

  send<T = any>(pattern: string, data: any) {
    return this.client.send<T>(pattern, data);
  }

  /** ------- NEW: Subscribe / Listen to Queue Messages -------- */
  async subscribe(pattern: string, handler: (msg: any) => void) {
    await this.channel.assertQueue(pattern, { durable: true });

    this.channel.consume(pattern, (message) => {
      if (!message) return;
      const content = JSON.parse(message.content.toString());
      handler(content);
      this.channel.ack(message);
    });

    console.log(`📡 Listening to RabbitMQ queue: ${pattern}`);
  }
}
