import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InboxGateway } from '../inbox/inbox.gateway'; // 👈 IMPORTAR

@Injectable()
export class WhatsappService {
  constructor(
    private prisma: PrismaService,
    private inboxGateway: InboxGateway, // 👈 INJETAR AQUI
  ) {}

  async handleIncomingMessage(data: {
    contact: string;
    name?: string;
    body: string;
    companyId: string;
  }) {
    const { contact, name, body, companyId } = data;

    if (!contact || !companyId || !body) {
      console.error('❌ Payload inválido:', data);
      throw new BadRequestException('Payload inválido do WhatsApp');
    }

    // 1️⃣ Criar ou atualizar conversa
    const conversation = await this.prisma.conversation.upsert({
      where: {
        companyId_contact: {
          companyId,
          contact,
        },
      },
      update: {
        updatedAt: new Date(),
      },
      create: {
        companyId,
        contact,
        name,
      },
    });

    // 2️⃣ Criar mensagem
    const message = await this.prisma.message.create({
      data: {
        conversationId: conversation.id,
        body,
        fromMe: false,
      },
    });

    // 3️⃣ Emitir evento via Socket 🔥
    this.inboxGateway.emitNewMessage(companyId, {
      id: message.id,
      body: message.body,
      createdAt: message.createdAt,
      fromMe: message.fromMe,
      conversationId: conversation.id,
      contact,
      name,
    });

    return { success: true };
  }
}
