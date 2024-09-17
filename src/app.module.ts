import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ChatGateway } from './chat/chat.gateway';
import { ChatModule } from './chat/chat.module';
import { ChatArchiveService } from './chat-archive/chat-archive.service';

@Module({
  imports: [ChatModule, ScheduleModule.forRoot()],
  providers: [ChatGateway, ChatArchiveService],
})
export class AppModule {}
