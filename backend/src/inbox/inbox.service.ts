import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TenantService } from '../tenant/tenant.service';
import { MessagingService } from '../messaging/messaging.service';
import { MessageStatus, ConversationStatus } from '@prisma/client';

@Injectable()
export class InboxService {

  constructor(
    private prisma: PrismaService,
    private tenant: TenantService,
    private messagingService: MessagingService,
  ) {}


  /* =========================
     LISTAR CONVERSAS
  ========================== */

async listConversations(companyId: string) {
  const conversations = await this.prisma.conversation.findMany(
    this.tenant.withCompany(
      {
        orderBy: { updatedAt: 'desc' as const },
        include: {
          tags: true,
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' as const },
          },
          _count: {
            select: {
              messages: {
                where: {
                  fromMe: false,
                  status: { not: MessageStatus.READ },
                },
              },
            },
          },
        },
      },
      companyId,
    ),
  ) as any; // 👈 ESSA LINHA RESOLVE TUDO

  return conversations.map((c: any) => ({
    id: c.id,
    name: c.name,
    contact: c.contact,
    avatarUrl: c.avatarUrl,
    isSaved: c.isSaved,
    status: c.status,
    lastMessage: c.messages[0]?.body ?? null,
    lastMessageAt: c.messages[0]?.createdAt ?? null,
    unreadCount: c._count.messages,
    tags: c.tags,
  }));
}

  /* =========================
     BUSCAR MENSAGENS
  ========================== */

  async getMessages(conversationId: string, companyId: string) {
    const conversation = await this.prisma.conversation.findFirst(
      this.tenant.withCompany(
        { where: { id: conversationId } },
        companyId,
      ),
    );

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }

  /* =========================
     MARCAR COMO LIDA
  ========================== */

  async markAsRead(conversationId: string, companyId: string) {
    const conversation = await this.prisma.conversation.findFirst(
      this.tenant.withCompany(
        { where: { id: conversationId } },
        companyId,
      ),
    );

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    await this.prisma.message.updateMany({
      where: {
        conversationId,
        fromMe: false,
        status: { not: MessageStatus.READ },
      },
      data: {
        status: MessageStatus.READ,
        readAt: new Date(),
      },
    });

    return { success: true };
  }

  /* =========================
     EDITAR NOME
  ========================== */

  async updateConversationName(
    conversationId: string,
    name: string,
    companyId: string,
  ) {
    const conversation = await this.prisma.conversation.findFirst(
      this.tenant.withCompany(
        { where: { id: conversationId } },
        companyId,
      ),
    );

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: { name },
    });
  }

  /* =========================
     SALVAR / DESSALVAR CONTATO
  ========================== */

  async toggleSaveConversation(
    conversationId: string,
    companyId: string,
  ) {
    const conversation = await this.prisma.conversation.findFirst(
      this.tenant.withCompany(
        { where: { id: conversationId } },
        companyId,
      ),
    );

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        isSaved: !conversation.isSaved,
      },
    });
  }

  /* =========================
     ATUALIZAR STATUS
  ========================== */

  async updateStatus(
    conversationId: string,
    status: ConversationStatus,
    companyId: string,
  ) {
    const conversation = await this.prisma.conversation.findFirst(
      this.tenant.withCompany(
        { where: { id: conversationId } },
        companyId,
      ),
    );

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: { status },
    });
  }

  /* =========================
     EXCLUIR CONVERSA
  ========================== */

  async deleteConversation(
    conversationId: string,
    companyId: string,
  ) {
    const conversation = await this.prisma.conversation.findFirst(
      this.tenant.withCompany(
        { where: { id: conversationId } },
        companyId,
      ),
    );

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    await this.prisma.message.deleteMany({
      where: { conversationId },
    });

    await this.prisma.conversation.delete({
      where: { id: conversationId },
    });

    return { success: true };
  }

  /* =========================
     ENVIAR MENSAGEM
  ========================== */
async sendMessage(
  conversationId: string,
  content: string,
  companyId: string,
) {
  const conversation = await this.prisma.conversation.findFirst(
    this.tenant.withCompany(
      { where: { id: conversationId } },
      companyId,
    ),
  );

  if (!conversation) {
    throw new NotFoundException('Conversation not found');
  }

  // 🔥 1️⃣ Envia para WhatsApp
  await this.messagingService.sendMessage(
    companyId,
    conversation.contact,
    content,
  );

  // 🔥 2️⃣ SALVA A MENSAGEM NO BANCO (AQUI ESTAVA O BUG)
  await this.prisma.message.create({
    data: {
      conversationId,
      body: content,
      fromMe: true,
      status: MessageStatus.SENT,
    },
  });

  // 🔥 3️⃣ Atualiza conversa (updatedAt + status automático)
  await this.prisma.conversation.update({
    where: { id: conversationId },
    data: {
      updatedAt: new Date(),
      status:
        conversation.status === ConversationStatus.OPEN
          ? ConversationStatus.IN_PROGRESS
          : conversation.status,
    },
  });

  return { success: true };
}

async updateConversationTags(
  conversationId: string,
  tagIds: string[],
  companyId: string,
) {

  console.log('🔎 TOKEN COMPANY:', companyId);
  console.log('🔎 CONVERSATION ID:', conversationId);

  const rawConversation = await this.prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  console.log('🔎 RAW CONVERSATION:', rawConversation);

  // 1️⃣ Verifica se a conversa pertence à empresa
  const conversation = await this.prisma.conversation.findFirst(
    this.tenant.withCompany(
      { where: { id: conversationId } },
      companyId,
    ),
  );

  if (!conversation) {
    throw new NotFoundException('Conversation not found');
  }

  // 2️⃣ Verifica se todas as tags pertencem à empresa
  const tags = await this.prisma.tag.findMany({
    where: {
      id: { in: tagIds },
      companyId,
    },
  });

  if (tags.length !== tagIds.length) {
    throw new NotFoundException('One or more tags are invalid');
  }

  // 3️⃣ Atualiza completamente as tags
  return this.prisma.conversation.update({
    where: { id: conversationId },
    data: {
      tags: {
        set: tagIds.map((id) => ({ id })),
      },
    },
    include: {
      tags: true,
    },
  });
}
}