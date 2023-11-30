import { Injectable } from '@nestjs/common';
import { AuthenticationService } from '../authentication/authentication.service';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';
import { User } from '../user/entities/user.entity';
import { MessageService } from '../message/message.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly messageService: MessageService,
  ) {}

  async getUserFromCookie(socket: Socket) {
    const cookie = socket.handshake.headers.cookie;

    const { Authentication: authenticationToken } = parse(cookie);

    const user =
      await this.authenticationService.getUserFromAuthenticationToken(
        authenticationToken,
      );

    if (!user) {
      throw new WsException('Invalid credentials');
    }

    return user;
  }

  async saveMessage(content: string, author: User) {
    return this.messageService.createMessage(content, author);
  }

  async getAllMessages() {
    return this.messageService.getAllMessages();
  }
}
