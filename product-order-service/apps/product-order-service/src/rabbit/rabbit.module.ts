import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitService } from './rabbit.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBIT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            // build URL from env vars, with sensible defaults
            `amqp://${process.env.RMQ_USER || 'admin'}:${process.env.RMQ_PASS || 'admin'}@${process.env.RMQ_HOST || 'localhost'}:${process.env.RMQ_PORT || '5672'}`
          ],
          queue: process.env.RMQ_QUEUE || 'main_queue',
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  providers: [RabbitService],
  exports: [RabbitService],
})
export class RabbitModule {}
