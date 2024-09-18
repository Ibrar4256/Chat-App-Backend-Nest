import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway(3002, { cors: '*' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private messages: { user: string; message: string }[] = [];
  private users: Map<string, string> = new Map();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const username = this.users.get(client.id) || 'Unknown User';
    this.server.emit('user-left', {
      message: `${username} left the chat.`,
    });
    this.users.delete(client.id);
  }

  @SubscribeMessage('setUsername')
  handleSetUsername(client: Socket, username: string) {
    this.users.set(client.id, username);
    this.server.emit('user-joined', {
      message: `${username} joined the chat.`,
    });
  }

  @SubscribeMessage('sendMessage')
  handleMessage(client: Socket, payload: { message: string }): void {
    const username = this.users.get(client.id) || 'Anonymous';
    const newMessage = { user: username, message: payload.message };
    this.messages.push(newMessage);
    this.server.emit('receiveMessage', newMessage);
  }

  getMessages() {
    return this.messages;
  }

  clearMessages() {
    this.messages = [];
  }
}
