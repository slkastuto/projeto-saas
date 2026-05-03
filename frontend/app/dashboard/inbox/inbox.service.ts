import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TenantService } from '../tenant/tenant.service';
import { InboxGateway } from './inbox.gateway';

@Injectable()
export class InboxService {
  constructor(
    private prisma: PrismaService,
    private tenant: TenantService,
    private inboxGateway: InboxGateway,
  ) {}

  /* =========================
     LISTAR CONVERSAS
  ========================== */

async listConversations(companyId: string) {
  console.log('🔥 NOVA VERSÃO LIST CONVERSATIONS');

  const conversations = await this.prisma.conversation.findMany(
    this.tenant.withCompany(
      {
        orderBy: { updatedAt: 'desc' },
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          tags: true, // 👈 ESSENCIAL
        },
      },
      companyId,
    ),
  );

  return conversations.map((c) => ({
    id: c.id,
    name: c.name,
    contact: c.contact,
    avatarUrl: c.avatarUrl,
    status: c.status,
    lastMessage: c.messages[0]?.body || null,
    lastMessageAt: c.messages[0]?.createdAt || null,
    unreadCount: 0, // mantém padrão atual
    tags: c.tags, // 👈 AGORA SIM
  }));
}

  /* =========================
     BUSCAR MENSAGENS
  ========================== */

  async getMessages(conversationId: string) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }

  /* =========================
     ENVIAR MENSAGEM
  ========================== */

  async sendMessage(
    conversationId: string,
    content: string,
    companyId: string,
  ) {
    // Verifica se conversa pertence à empresa
    const conversation = await this.prisma.conversation.findFirst(
      this.tenant.withCompany(
        {
          where: { id: conversationId },
        },
        companyId,
      ),
    );

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    /* ============================================
       1️⃣ ENVIA PARA WHATSAPP (porta 4000)
    ============================================ */

    try {
      await fetch('http://localhost:4000/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          number: conversation.contact, // Ex: 554791298307
          message: content,
        }),
      });
    } catch (error) {
      console.error('Erro ao enviar para WhatsApp:', error);
    }

    /* ============================================
       2️⃣ SALVA NO BANCO
    ============================================ */

    const message = await this.prisma.message.create({
      data: {
        body: content,
        conversationId,
        fromMe: true, // ✅ correto conforme seu schema
      },
    });

    /* ============================================
       3️⃣ ATUALIZA CONVERSA
    ============================================ */

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        updatedAt: new Date(),
      },
    });

    /* ============================================
       4️⃣ EMITE SOCKET
    ============================================ */

    this.inboxGateway.emitNewMessage(companyId, {
      ...message,
      conversationId,
    });

    return message;
  }
}