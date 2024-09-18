import { Module } from '@nestjs/common';
import { ChatArchiveService } from './chat-archive.service';
import { ChatGateway } from 'src/chat/chat.gateway';

@Module({
    providers: [ChatArchiveService, ChatGateway]
})
export class ChatArchiveModule {}
