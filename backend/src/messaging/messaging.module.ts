import { Module } from '@nestjs/common';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { MessagingService } from './messaging.service';

@Module({
  imports: [WhatsappModule],
  providers: [MessagingService],
  exports: [MessagingService],
})
export class MessagingModule {}
