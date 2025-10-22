import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

interface OrdersByDate {
  [dateKey: string]: Array<{
    id: string;
    createdAt: Date;
    orderId: string | null;
  }>;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}${month}${day}`;
}

function groupOrdersByDate(
  orders: Array<{ id: string; createdAt: Date; orderId: string | null }>,
): OrdersByDate {
  const grouped: OrdersByDate = {};

  for (const order of orders) {
    const dateKey = formatDate(order.createdAt);
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(order);
  }

  return grouped;
}

async function main() {
  console.log('Starting order ID backfill process...\n');

  const errors: Array<{ orderId: string; orderUuid: string; error: string }> =
    [];
  let totalProcessed = 0;
  let totalErrors = 0;
  let totalSkipped = 0;

  try {
    // Fetch all orders, ordered by creation date
    console.log('Fetching orders...');
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
        createdAt: true,
        orderId: true,
      },
    });

    console.log(`Found ${orders.length} total orders\n`);

    // Filter orders that need backfilling (idempotency check)
    const ordersToProcess = orders.filter((order) => order.orderId === null);
    totalSkipped = orders.length - ordersToProcess.length;

    if (totalSkipped > 0) {
      console.log(
        `Skipping ${totalSkipped} order(s) that already have orderId\n`,
      );
    }

    if (ordersToProcess.length === 0) {
      console.log('No orders to backfill. Exiting.');
      return;
    }

    console.log(
      `Processing ${ordersToProcess.length} order(s) without orderId\n`,
    );

    // Group orders by date
    const ordersByDate = groupOrdersByDate(ordersToProcess);
    console.log(
      `Orders grouped into ${Object.keys(ordersByDate).length} date(s)\n`,
    );

    // Assign sequential IDs per date
    const dateKeys = Object.keys(ordersByDate).sort();

    for (const dateKey of dateKeys) {
      const dateOrders = ordersByDate[dateKey];
      console.log(
        `Processing ${dateOrders.length} order(s) for date ${dateKey}...`,
      );

      let sequenceNumber = 1;
      let dateProcessed = 0;
      let dateErrors = 0;

      for (const order of dateOrders) {
        const orderId = `ORD-${dateKey}-${sequenceNumber.toString().padStart(4, '0')}`;

        try {
          await prisma.order.update({
            where: { id: order.id },
            data: { orderId },
          });

          totalProcessed++;
          dateProcessed++;
          sequenceNumber++;

          // Log progress every 10 orders
          if (totalProcessed % 10 === 0) {
            console.log(`  Progress: ${totalProcessed} orders processed...`);
          }
        } catch (error) {
          totalErrors++;
          dateErrors++;
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          errors.push({
            orderId,
            orderUuid: order.id,
            error: errorMessage,
          });
          console.error(
            `  ✗ Error updating order ${order.id} with orderId ${orderId}: ${errorMessage}`,
          );
          // Continue processing remaining orders
          sequenceNumber++;
        }
      }

      console.log(
        `  ✓ Completed ${dateProcessed} order(s) for ${dateKey}${dateErrors > 0 ? ` (${dateErrors} errors)` : ''}`,
      );
    }

    // Generate summary report
    console.log('\n' + '='.repeat(60));
    console.log('BACKFILL SUMMARY REPORT');
    console.log('='.repeat(60));
    console.log(`Total orders found: ${orders.length}`);
    console.log(`Orders skipped (already have orderId): ${totalSkipped}`);
    console.log(`Orders processed successfully: ${totalProcessed}`);
    console.log(`Orders with errors: ${totalErrors}`);
    console.log(
      `Success rate: ${totalProcessed + totalErrors > 0 ? ((totalProcessed / (totalProcessed + totalErrors)) * 100).toFixed(2) : 0}%`,
    );

    if (errors.length > 0) {
      console.log('\nErrors encountered:');
      errors.forEach((err, index) => {
        console.log(
          `  ${index + 1}. Order UUID: ${err.orderUuid}, OrderID: ${err.orderId}`,
        );
        console.log(`     Error: ${err.error}`);
      });
    }

    console.log('='.repeat(60));
    console.log('\nBackfill process completed!');

    if (totalErrors > 0) {
      console.warn(
        `\n⚠ Warning: ${totalErrors} order(s) failed to update. Please review the errors above.`,
      );
    }
  } catch (error) {
    console.error('Fatal error during backfill:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the script
main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
