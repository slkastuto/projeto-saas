import { Controller, Post, Body } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post('webhook')
  async receiveMessage(
    @Body()
    body: {
      contact: string;
      name?: string;
      body: string;
      companyId: string;
    },
  ) {
    // 🔎 log para garantir que chega certo
    console.log('📥 Webhook recebido:', body);

    return this.whatsappService.handleIncomingMessage(body);
  }
}
