import { Controller, Get, Post, Body, Req, UseGuards, Delete, Param } from '@nestjs/common';
import { TagsService } from './tags.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  async create(@Req() req, @Body() body: any) {
    const companyId = req.user.companyId;

    return this.tagsService.create(
      companyId,
      body.name,
      body.color,
    );
  }

  @Get()
  async findAll(@Req() req) {
    const companyId = req.user.companyId;

    return this.tagsService.findAll(companyId);
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    const companyId = req.user.companyId;

    return this.tagsService.remove(companyId, id);
  }
}