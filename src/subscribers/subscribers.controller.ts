import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Post,
  UseGuards,
  UseInterceptors,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import SubscribersService from './subscribers.service.interface';

@Controller('subscribers')
@UseInterceptors(ClassSerializerInterceptor)
export class SubscribersController implements OnModuleInit {
  private subscribersService: SubscribersService;
  constructor(@Inject('SUBSCRIBERS_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.subscribersService =
      this.client.getService<SubscribersService>('SubscriberService');
  }

  @Get()
  async getSubscribers() {
    return this.subscribersService.getAllSubscribers({});
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createPost(@Body() subscriber: CreateSubscriberDto) {
    console.log({ subscriber });
    return this.subscribersService.addSubscriber(subscriber);
  }
}
