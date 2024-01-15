import { Module } from '@nestjs/common';
import { ConsumerService } from './queues.consumer';
import { ProducerService } from './queues.producer';

@Module({
  providers: [ProducerService, ConsumerService],
  exports: [ProducerService]
})
export class QueuesModule {}
