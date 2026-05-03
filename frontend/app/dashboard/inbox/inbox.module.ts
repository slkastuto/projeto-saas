import { Module } from '@nestjs/common';
import { InboxController } from './inbox.controller';
import { InboxService } from './inbox.service';
import { PrismaService } from '../prisma/prisma.service';
import { TenantService } from '../tenant/tenant.service';

@Module({
  controllers: [InboxController],
  providers: [InboxService, PrismaService, TenantService],
})
export class InboxModule {}
