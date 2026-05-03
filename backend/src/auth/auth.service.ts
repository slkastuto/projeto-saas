import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // ======================
  // REGISTER
  // ======================
  async register(dto: RegisterDto) {
    try {
      const { name, email, password } = dto;

      const userExists = await this.prisma.user.findUnique({
        where: { email },
      });

      if (userExists) {
        throw new BadRequestException('E-mail já cadastrado');
      }

      const company = await this.prisma.company.create({
        data: {
          name: 'Minha Empresa',
          slug: `empresa-${Date.now()}`,
        },
      });

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'ADMIN',
          companyId: company.id,
        },
      });

      return {
        message: 'Conta criada com sucesso',
        userId: user.id,
      };
    } catch (error) {
      console.error('REGISTER ERROR 👉', error);
      throw error;
    }
  }

  // ======================
  // LOGIN + JWT
  // ======================
  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Credenciais inválidas');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new BadRequestException('Credenciais inválidas');
    }

    const payload = {
      sub: user.id,
      companyId: user.companyId,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
    };
  }
}
