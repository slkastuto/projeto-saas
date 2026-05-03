import {
  Injectable,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Client, LocalAuth } from 'whatsapp-web.js';
import { InboxGateway } from '../inbox/inbox.gateway';
import { MessageStatus, ConversationStatus } from '@prisma/client';

@Injectable()
export class WhatsappService {
  private clients = new Map<string, Client>();
  private readyMap = new Map<string, boolean>();
  private initializingMap = new Map<string, boolean>();

  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => InboxGateway))
    private inboxGateway: InboxGateway,
  ) {}

  async initializeForCompany(companyId: string) {
    const existingClient = this.clients.get(companyId);

    if (existingClient && this.readyMap.get(companyId)) return;
    if (this.initializingMap.get(companyId)) return;

    this.initializingMap.set(companyId, true);

    const client = new Client({
      authStrategy: new LocalAuth({
        clientId: companyId,
        dataPath: '.wwebjs_auth',
      }),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    });

    this.clients.set(companyId, client);
    this.readyMap.set(companyId, false);

    /* QR */
    client.on('qr', (qr) => {
      this.inboxGateway.server
        .to(companyId)
        .emit('whatsapp_qr', { qr });

      this.inboxGateway.server
        .to(companyId)
        .emit('whatsapp_status', 'waiting_scan');
    });

    /* READY */
    client.on('ready', () => {
      this.readyMap.set(companyId, true);
      this.initializingMap.set(companyId, false);

      this.inboxGateway.server
        .to(companyId)
        .emit('whatsapp_status', 'connected');
    });

    /* DISCONNECT */
    client.on('disconnected', async () => {
      this.readyMap.set(companyId, false);
      this.initializingMap.set(companyId, false);

      try {
        await client.destroy();
      } catch {}

      this.clients.delete(companyId);

      this.inboxGateway.server
        .to(companyId)
        .emit('whatsapp_status', 'disconnected');
    });

    /* =========================
       MENSAGENS
    ========================= */

client.on('message', async (msg) => {
  try {

    // 🔥 ACEITAR SOMENTE CONTATOS DIRETOS
    if (!msg.from.endsWith('@c.us')) {
      return;
    }

    const chat = await msg.getChat();
    const rawId = chat.id._serialized;
    if (!rawId) return;

    const contactNumber = rawId
      .replace('@c.us', '')
      .replace('@g.us', '');

    const isFromMe = msg.fromMe;

    let name: string | null = null;
    let avatarUrl: string | null = null;

    // 🔥 Só atualiza nome/avatar se NÃO for mensagem minha
    if (!isFromMe) {
      try {
        const contact = await msg.getContact();

        name =
          contact?.pushname ||
          contact?.name ||
          contact?.shortName ||
          null;

        try {
          avatarUrl = await contact.getProfilePicUrl();
        } catch {
          avatarUrl = null;
        }
      } catch {}
    }

        let conversation = await this.prisma.conversation.findFirst({
          where: { companyId, contact: contactNumber },
        });

        if (!conversation) {
          conversation = await this.prisma.conversation.create({
            data: {
              companyId,
              contact: contactNumber,
              name,
              avatarUrl,
              status: ConversationStatus.OPEN,
            },
          });
        } else {
          // 🔥 Reabre conversa se cliente respondeu
          if (
            conversation.status === ConversationStatus.RESOLVED &&
            !isFromMe
          ) {
            await this.prisma.conversation.update({
              where: { id: conversation.id },
              data: { status: ConversationStatus.OPEN },
            });

            conversation.status = ConversationStatus.OPEN;
          }

          // 🔥 Atualiza nome/avatar SOMENTE se não for mensagem minha
          if (!isFromMe) {
            if (
              name !== conversation.name ||
              avatarUrl !== conversation.avatarUrl
            ) {
              await this.prisma.conversation.update({
                where: { id: conversation.id },
                data: {
                  name: name ?? conversation.name,
                  avatarUrl: avatarUrl ?? conversation.avatarUrl,
                },
              });

              conversation.name = name ?? conversation.name;
              conversation.avatarUrl =
                avatarUrl ?? conversation.avatarUrl;
            }
          }
        }

        const whatsappId = msg.id._serialized;

        const existing = await this.prisma.message.findUnique({
          where: { whatsappId },
        });

        if (existing) return;

// 🚫 NÃO cria mensagem enviada por mim
if (isFromMe) {
  return;
}

const message = await this.prisma.message.create({
  data: {
    whatsappId,
    conversationId: conversation.id,
    body: msg.body,
    fromMe: false,
    status: MessageStatus.DELIVERED,
  },
});

        this.inboxGateway.emitNewMessage(companyId, {
          id: message.id,
          body: message.body,
          conversationId: conversation.id,
          createdAt: message.createdAt,
          fromMe: isFromMe,
          status: message.status,
          contact: contactNumber,
          name: conversation.name,
          avatarUrl: conversation.avatarUrl,
        });

      } catch (error) {
        console.error('Erro ao processar mensagem:', error);
      }
    });

    await client.initialize();
  }

  /* =========================
   ENVIO DE MENSAGEM
========================= */

async sendMessage(
  companyId: string,
  number: string,
  message: string,
) {
  const client = this.clients.get(companyId);

  if (!client || !this.readyMap.get(companyId)) {
    throw new Error('WhatsApp não inicializado.');
  }

  const formattedNumber = number.includes('@')
    ? number
    : `${number}@c.us`;

  await client.sendMessage(formattedNumber, message);
}
}