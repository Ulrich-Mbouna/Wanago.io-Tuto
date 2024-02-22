import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthenticationModule } from './authentication/authentication.module';
import * as Joi from '@hapi/joi';
import ExceptionLoggerFilter from './utils/exceptionLogger.filter';
import { APP_FILTER } from '@nestjs/core';
import { AddressModule } from './address/address.module';
import { CategoryModule } from './category/category.module';
import { SearchModule } from './search/search.module';
import { SubscribersModule } from './subscribers/subscribers.module';
import { CommentModule } from './comment/comment.module';
import { ProductModule } from './product/product.module';
import { ProductCategoryModule } from './product-category/product-category.module';
import { EmailModule } from './email/email.module';

import { ScheduleModule } from '@nestjs/schedule';
import { EmailSchedulingService } from './email/email-scheduling/email-scheduling.service';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import * as process from 'process';
import {
  ApolloDriver,
  ApolloDriverAsyncConfig,
  ApolloDriverConfig,
} from '@nestjs/apollo';

@Module({
  imports: [
    PostsModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        AWS_REGION: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),
        AWS_PRIVATE_BUCKET_NAME: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        EMAIL_SERVICE: Joi.string().required(),
        EMAIL_USER: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
        GRAPHQL_PLAYGROUND: Joi.number(),
        PORT: Joi.number(),
      }),
    }),
    DatabaseModule,
    UserModule,
    AuthenticationModule,
    AddressModule,
    CategoryModule,
    SearchModule,
    SubscribersModule,
    CommentModule,
    ProductModule,
    ProductCategoryModule,
    EmailModule,
    ScheduleModule.forRoot(),
    ChatModule,
    MessageModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        playground: Boolean(configService.get('GRAPHQL_PLAYGROUND')),
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        include: [PostsModule],
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ExceptionLoggerFilter,
    },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
