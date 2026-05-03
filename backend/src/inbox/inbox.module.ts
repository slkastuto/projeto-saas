import { Module, forwardRef } from '@nestjs/common';
import { InboxService } from './inbox.service';
import { InboxController } from './inbox.controller';
import { InboxGateway } from './inbox.gateway';
import { PrismaModule } from '../prisma/prisma.module';
import { TenantModule } from '../tenant/tenant.module';
import { MessagingModule } from '../messaging/messaging.module';
import { WhatsappModule } from '../whatsapp/whatsapp.module';

@Module({
  imports: [
    PrismaModule,
    TenantModule,
    MessagingModule,
    forwardRef(() => WhatsappModule), // 👈 IMPORTANTE
  ],
  controllers: [InboxController],
  providers: [InboxService, InboxGateway],
  exports: [InboxService, InboxGateway], // 👈 EXPORTAR GATEWAY
})
export class InboxModule {}
