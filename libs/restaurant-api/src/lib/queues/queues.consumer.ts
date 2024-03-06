import {
	Injectable,
	OnModuleInit,
	Logger
} from "@nestjs/common";
import amqp, { ChannelWrapper } from "amqp-connection-manager";
import { ConfirmChannel } from "amqplib";
import { CREATE_ORDERS_QUEUE } from "./constants";
import { OrderService } from "../order/order.service";

@Injectable()
export class ConsumerService implements OnModuleInit {
	private channelWrapper: ChannelWrapper;
	private readonly logger = new Logger(ConsumerService.name);
	constructor(private ordersService: OrderService) {
		const rabbitUser = process.env["RABBITMQ_DEFAULT_USER"];
		const rabbitPassword = process.env["RABBITMQ_DEFAULT_PASS"];
		const rabbitHost = process.env["RABBITMQ_HOST"];
		const connection = amqp.connect([`amqp://${rabbitUser}:${rabbitPassword}@${rabbitHost}`]);
		this.channelWrapper = connection.createChannel();
	}

	public async onModuleInit() {
		try {
			await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
				await channel.assertQueue(CREATE_ORDERS_QUEUE, {
					durable: true
				});
				await channel.consume(CREATE_ORDERS_QUEUE, async (message) => {
					if (message) {
						const content = JSON.parse(message.content.toString());
						this.logger.log("Received message:", content);
						await this.ordersService.create(content);
						channel.ack(message);
					}
				});
			});
		} catch (err) {
			this.logger.error("Error starting the consumer:", err);
		}
	}
}
