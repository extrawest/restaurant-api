import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { ORDERS_QUEUE } from './constants';

@Injectable()
export class ProducerService {
  private channelWrapper: ChannelWrapper;
  constructor() {
    const rabbitUser = process.env.RABBITMQ_DEFAULT_USER;
    const rabbitPassword = process.env.RABBITMQ_DEFAULT_PASS;
    const rabbitHost = process.env.RABBITMQ_HOST;
    const connection = amqp.connect([`amqp://${rabbitUser}:${rabbitPassword}@${rabbitHost}`])
    this.channelWrapper = connection.createChannel({
      setup: (channel: Channel) => {
        return channel.assertQueue(ORDERS_QUEUE, { durable: true })
      }
    })
  }

  // TODO: any
  async addToOrdersQueue(order: any) {
    try {
      await this.channelWrapper.sendToQueue(
        ORDERS_QUEUE,
        Buffer.from(JSON.stringify(order)),
        {
          persistent: true
        }
      )
    } catch (error) {
      throw new HttpException(
        'Error adding order to queue',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}