import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './services/prisma.service';
import { WebhookService } from './services/webhook.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [PrismaService, WebhookService],
  exports: [PrismaService, WebhookService],
})
export class CommonModule {}
