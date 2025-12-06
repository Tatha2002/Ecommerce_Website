import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class CustomerEventsController {
  private logger = new Logger(CustomerEventsController.name);

  @EventPattern('order.created')
  handleOrderCreated(@Payload() data: any) {
    this.logger.log(`Received event: order.created`);
    this.logger.debug(data);
  }
}
