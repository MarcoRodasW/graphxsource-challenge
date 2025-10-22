import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/services/prisma.service';

export interface IOrderIdGenerator {
  generateOrderId(date?: Date): Promise<string>;
}

@Injectable()
export class OrderIdGeneratorService implements IOrderIdGenerator {
  constructor(private readonly prisma: PrismaService) {}

  async generateOrderId(date: Date = new Date()): Promise<string> {
    const dateStr = this.formatDate(date);
    const prefix = `ORD-${dateStr}`;

    // Query for the highest sequential number for this date
    const lastOrder = await this.prisma.order.findFirst({
      where: {
        orderId: {
          startsWith: prefix,
        },
      },
      orderBy: {
        orderId: 'desc',
      },
      select: {
        orderId: true,
      },
    });

    let sequentialNumber = 1;
    if (lastOrder?.orderId) {
      // Extract sequential number from last order ID
      const orderId = lastOrder.orderId as string;
      const parts = orderId.split('-');
      if (parts.length === 3) {
        const lastSequence = parseInt(parts[2], 10);
        if (!isNaN(lastSequence)) {
          sequentialNumber = lastSequence + 1;
        }
      }
    }

    // Format: ORD-YYYYMMDD-NNNN
    return `${prefix}-${sequentialNumber.toString().padStart(4, '0')}`;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}${month}${day}`;
  }
}
