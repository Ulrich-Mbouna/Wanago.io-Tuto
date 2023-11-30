import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { MessageModule } from '../message/message.module';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  imports: [MessageModule, AuthenticationModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
