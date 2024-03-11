import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisPubsubService extends RedisPubSub implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {
    super({
      connection: {
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
      },
    });
  }

  async onModuleInit() {
    console.log('Hello world');
  }
}
