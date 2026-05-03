import {
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WhatsappService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {
  constructor(
    private readonly whatsappService: WhatsappService,
  ) {}

  /**
   * 🔐 Conexão iniciada pelo painel (rota protegida)
   * POST /whatsapp/connect
   */
  @UseGuards(JwtAuthGuard)
  @Post('connect')
  async connect(@Req() req: Request & { user?: any }) {
    if (!req.user?.companyId) {
      throw new Error('CompanyId não encontrado no token');
    }

    const companyId = req.user.companyId;

    await this.whatsappService.initializeForCompany(companyId);

    return {
      success: true,
      message: 'WhatsApp inicializado com sucesso',
    };
  }
}
