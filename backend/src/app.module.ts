import { TagsModule } from './tags/tags.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TenantModule } from './tenant/tenant.module';
import { InboxModule } from './inbox/inbox.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { MessagingModule } from './messaging/messaging.module';

@Module({
  imports: [
    TagsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    TenantModule,
    AuthModule,
    InboxModule,
    WhatsappModule,
    MessagingModule,
  ],
})
export class AppModule {}
