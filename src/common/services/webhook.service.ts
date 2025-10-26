import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { WebhookEvent } from '../types/webhook.types';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async sendWebhook<T>(event: WebhookEvent<T>): Promise<void> {
    const webhookUrl = this.configService.get<string>('WEBHOOK_URL');

    if (!webhookUrl) {
      this.logger.debug('WEBHOOK_URL not configured, skipping webhook');
      return;
    }

    try {
      await firstValueFrom(
        this.httpService.post(webhookUrl, {
          entityType: event.entityType,
          entityId: event.entityId,
          eventType: event.eventType,
          data: event.data,
          timestamp: event.timestamp,
        }),
      );

      this.logger.log(
        `Webhook sent successfully for ${event.entityType} ${event.entityId}`,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error(
        `Failed to send webhook for ${event.entityType} ${event.entityId}: ${errorMessage}`,
        errorStack,
      );
    }
  }
}
