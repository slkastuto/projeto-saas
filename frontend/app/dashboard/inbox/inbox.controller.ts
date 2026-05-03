import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  Post,
  Body,
} from '@nestjs/common';
import { InboxService } from './inbox.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('inbox')
@UseGuards(JwtAuthGuard)
export class InboxController {
  constructor(private readonly inboxService: InboxService) {
    console.log('🚀 InboxController carregado');
  }

  /* =========================
     LISTAR CONVERSAS
  ========================== */

  @Get()
  async list(@Req() req) {
    const companyId = req.user.companyId;
    return this.inboxService.listConversations(companyId);
  }

  /* =========================
     BUSCAR MENSAGENS
  ========================== */

  @Get(':conversationId/messages')
  async getMessages(
    @Param('conversationId') conversationId: string,
  ) {
    return this.inboxService.getMessages(conversationId);
  }

  /* =========================
     ENVIAR MENSAGEM
  ========================== */

  @Post('messages')
  async sendMessage(
    @Body() body: { conversationId: string; content: string },
    @Req() req,
  ) {
    const companyId = req.user.companyId;

    return this.inboxService.sendMessage(
      body.conversationId,
      body.content,
      companyId,
    );
  }
}
