import { Injectable } from '@nestjs/common';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { MessagingProvider } from './messaging.interface';
import { WhatsAppWebProvider } from './providers/whatsapp-web.provider';

@Injectable()
export class MessagingService {
  private provider: MessagingProvider;

  constructor(private readonly whatsappService: WhatsappService) {
    this.provider = new WhatsAppWebProvider(this.whatsappService);
  }

  async sendMessage(
    companyId: string,
    number: string,
    message: string,
  ) {
    return this.provider.sendMessage(companyId, number, message);
  }
}
