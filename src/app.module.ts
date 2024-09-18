import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ChatArchiveModule } from './chat-archive/chat-archive.module';

@Module({
  imports: [ChatArchiveModule, ScheduleModule.forRoot()],
})
export class AppModule {}
