import { MessagingProvider } from '../messaging.interface';
import { WhatsappService } from '../../whatsapp/whatsapp.service';

export class WhatsAppWebProvider implements MessagingProvider {
  constructor(private readonly whatsappService: WhatsappService) {}

  async sendMessage(
    companyId: string,
    number: string,
    message: string,
  ): Promise<void> {
    await this.whatsappService.sendMessage(companyId, number, message);
  }
}
