// src/inbox/inbox.gateway.ts

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: false,
  },
})

export class InboxGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('🟢 Cliente conectado:', client.id);
    console.log('Total conectados:', this.server.engine.clientsCount);
  }

  handleDisconnect(client: Socket) {
    console.log('🔴 Cliente desconectado:', client.id);
    console.log('Total conectados:', this.server.engine.clientsCount);
  }

  @SubscribeMessage('join_company')
  handleJoinCompany(
    @MessageBody() companyId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(companyId);
    console.log('🏢 Cliente entrou na sala:', companyId);
  }

  emitNewMessage(companyId: string, message: any) {
    console.log('📡 Emitindo new_message para empresa:', companyId);
    this.server.to(companyId).emit('new_message', message);
  }
}
