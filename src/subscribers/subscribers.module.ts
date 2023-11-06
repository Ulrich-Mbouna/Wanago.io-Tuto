import { Module } from '@nestjs/common';
import { SubscribersController } from './subscribers.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';
import * as process from 'process';

@Module({
  imports: [ConfigModule],
  controllers: [SubscribersController],
  providers: [
    // {
    //   provide: 'SUBSCRIBERS_SERVICE',
    //   useFactory: (configService: ConfigService) => {
    //     const user = configService.get('RABBITMQ_USER');
    //     const password = configService.get('RABBITMQ_PASSWORD');
    //     const host = configService.get('RABBITMQ_HOST');
    //     const queueName = configService.get('RABBITMQ_QUEUE_NAME');
    //
    //     return ClientProxyFactory.create({
    //       transport: Transport.RMQ,
    //       options: {
    //         urls: [`amqp://${user}:${password}@${host}`],
    //         queue: queueName,
    //         queueOptions: {
    //           durable: true,
    //         },
    //       },
    //     });
    //   },
    //   inject: [ConfigService],
    // },
    {
      provide: 'SUBSCRIBERS_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: 'subscribers',
            protoPath: join(process.cwd(), 'src/subscribers/subscribers.proto'),
            url: configService.get('GRPC_CONNECTION_URL'),
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class SubscribersModule {}
