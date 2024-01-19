import { Module } from "@nestjs/common";
import { ConsumerService } from "./queues.consumer";
import { ProducerService } from "./queues.producer";
import { OrderModule } from "../order/order.module";

@Module({
	imports: [OrderModule],
	providers: [ProducerService, ConsumerService],
	exports: [ProducerService]
})
export class QueuesModule {}
