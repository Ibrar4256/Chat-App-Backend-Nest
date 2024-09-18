import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ChatGateway } from '../chat/chat.gateway';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ChatArchiveService {
  constructor(private readonly chatGateway: ChatGateway) {}

  @Cron('0 */2 * * *') 
  handleCron() {
    const messages = this.chatGateway.getMessages();
    if (messages.length) {
      const archivePath = path.join(__dirname, '../archives');
      
      console.log('Archive path:', archivePath);
      
      try {
        if (!fs.existsSync(archivePath)) {
          fs.mkdirSync(archivePath);
        }
        const filePath = path.join(archivePath, `chat-archive-${Date.now()}.txt`);
        const data = messages
          .map((msg) => `${msg.user}: ${msg.message}`)
          .join('\n');
        fs.writeFileSync(filePath, data);
        console.log('Messages archived:', filePath);
      } catch (error) {
        console.error('Error archiving messages:', error);
      }
    }
  }
}
