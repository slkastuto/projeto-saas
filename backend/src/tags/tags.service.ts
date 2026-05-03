import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, name: string, color?: string) {
    return this.prisma.tag.create({
      data: {
        name,
        color,
        companyId,
      },
    });
  }

  async findAll(companyId: string) {
    return this.prisma.tag.findMany({
      where: { companyId },
      include: {
        _count: {
          select: { conversations: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
  
async remove(companyId: string, tagId: string) {
  const tag = await this.prisma.tag.findFirst({
    where: {
      id: tagId,
      companyId,
    },
  });

  if (!tag) {
    throw new Error('Tag não encontrada');
  }

  // Remove todas as relações many-to-many
  await this.prisma.tag.update({
    where: { id: tagId },
    data: {
      conversations: {
        set: [],
      },
    },
  });

  // Agora pode deletar
  return this.prisma.tag.delete({
    where: { id: tagId },
  });
}
}