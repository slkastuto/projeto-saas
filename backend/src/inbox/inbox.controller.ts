import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InboxService } from './inbox.service';

@Controller('inbox')
@UseGuards(JwtAuthGuard)
export class InboxController {
  constructor(private inboxService: InboxService) {}

  // ==============================
  // LISTAR CONVERSAS
  // ==============================
  @Get()
  findAll(@Req() req) {
    return this.inboxService.listConversations(req.user.companyId);
  }

  // ==============================
  // BUSCAR MENSAGENS
  // ==============================

@Get('messages/:conversationId')
getMessages(
  @Param('conversationId') conversationId: string,
  @Req() req,
) {
  return this.inboxService.getMessages(
    conversationId,
    req.user.companyId,
  );
}

  // ==============================
  // ENVIAR MENSAGEM
  // ==============================
  @Post('messages')
  sendMessage(
    @Body() body: { conversationId: string; content: string },
    @Req() req,
  ) {
    return this.inboxService.sendMessage(
      body.conversationId,
      body.content,
      req.user.companyId,
    );
  }

  // ==============================
  // MARCAR COMO LIDA
  // ==============================
  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @Req() req) {
    return this.inboxService.markAsRead(id, req.user.companyId);
  }

  // ==============================
  // EDITAR NOME DO CONTATO
  // ==============================
  @Patch(':id/name')
  updateName(
    @Param('id') id: string,
    @Body() body: { name: string },
    @Req() req,
  ) {
    return this.inboxService.updateConversationName(
      id,
      body.name,
      req.user.companyId,
    );
  }

  // ==============================
  // SALVAR / DESSALVAR CONTATO
  // ==============================
  @Patch(':id/save')
  toggleSave(@Param('id') id: string, @Req() req) {
    return this.inboxService.toggleSaveConversation(
      id,
      req.user.companyId,
    );
  }

  // ==============================
  // EXCLUIR CONVERSA
  // ==============================
  @Delete(':id')
  delete(@Param('id') id: string, @Req() req) {
    return this.inboxService.deleteConversation(
      id,
      req.user.companyId,
    );
  }
  // ==============================
// ATUALIZAR TAGS DA CONVERSA
// ==============================
@Patch(':id/tags')
updateTags(
  @Param('id') id: string,
  @Body() body: any,
  @Req() req,
) {
  console.log('BODY RECEBIDO:', body);

  if (!body) {
    return { error: 'Body não está chegando' };
  }

  return this.inboxService.updateConversationTags(
    id,
    body.tagIds,
    req.user.companyId,
  );
}
}
