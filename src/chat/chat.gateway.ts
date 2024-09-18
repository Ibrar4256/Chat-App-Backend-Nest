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
  @WebSocketServer() //performs io.emit() functionality
  server: Server;

  private messages: { user: string; message: string }[] = [];
  private users: Map<string, string> = new Map(); // Map to store client.id to username

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

  // Handle setting a username when a user joins
  @SubscribeMessage('setUsername')
  handleSetUsername(client: Socket, username: string) {
    this.users.set(client.id, username);
    this.server.emit('user-joined', {
      message: `${username} joined the chat.`,
    });
  }

  // Handle sending a message
  @SubscribeMessage('sendMessage')
  handleMessage(
    client: Socket,
    payload: { message: string },
  ): void {
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



//socket.on()

//io.emit()  broadcast/send message to all connected clients

//socket.emit() send message to 1 single client

//client.broadcast.emit()  broadcasts the message to eveyone except the user itself
// }
