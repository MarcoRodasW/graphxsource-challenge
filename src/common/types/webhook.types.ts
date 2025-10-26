export interface WebhookEvent<T> {
  entityType: string;
  entityId: string;
  eventType: string;
  data: T;
  timestamp: Date;
}

export type WebhookEventPayload<T> = T;
