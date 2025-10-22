import { PrismaClient, ProductType, OrderStatus } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.orderStatusHistory.deleteMany();
  await prisma.order.deleteMany();
  await prisma.tshirtDetails.deleteMany();
  await prisma.mugDetails.deleteMany();
  await prisma.posterDetails.deleteMany();
  await prisma.products.deleteMany();

  // Create T-shirt products
  console.log('👕 Creating T-shirt products...');
  const tshirt1 = await prisma.products.create({
    data: {
      sku: 'TSHIRT-BLK-M',
      name: 'Classic Black T-Shirt',
      price: 19.99,
      description: 'Comfortable cotton t-shirt in classic black',
      productType: ProductType.TSHIRT,
      tshirtDetails: {
        create: {
          size: 'M',
          color: 'Black',
        },
      },
    },
  });

  const tshirt2 = await prisma.products.create({
    data: {
      sku: 'TSHIRT-WHT-L',
      name: 'White Premium T-Shirt',
      price: 22.99,
      description: 'Premium quality white t-shirt',
      productType: ProductType.TSHIRT,
      tshirtDetails: {
        create: {
          size: 'L',
          color: 'White',
        },
      },
    },
  });

  const tshirt3 = await prisma.products.create({
    data: {
      sku: 'TSHIRT-RED-S',
      name: 'Red Graphic T-Shirt',
      price: 24.99,
      description: 'Bold red t-shirt with custom graphics',
      productType: ProductType.TSHIRT,
      tshirtDetails: {
        create: {
          size: 'S',
          color: 'Red',
        },
      },
    },
  });

  // Create Mug products
  console.log('☕ Creating Mug products...');
  const mug1 = await prisma.products.create({
    data: {
      sku: 'MUG-WHT-350',
      name: 'Classic White Mug',
      price: 12.99,
      description: 'Standard ceramic mug in white',
      productType: ProductType.MUG,
      mugDetails: {
        create: {
          capacity: 350,
          color: 'White',
        },
      },
    },
  });

  const mug2 = await prisma.products.create({
    data: {
      sku: 'MUG-BLK-500',
      name: 'Large Black Mug',
      price: 15.99,
      description: 'Extra large black ceramic mug',
      productType: ProductType.MUG,
      mugDetails: {
        create: {
          capacity: 500,
          color: 'Black',
        },
      },
    },
  });

  // Create Poster products
  console.log('🖼️ Creating Poster products...');
  const poster1 = await prisma.products.create({
    data: {
      sku: 'POSTER-A3-GLOSS',
      name: 'A3 Glossy Poster',
      price: 29.99,
      description: 'High-quality A3 poster with glossy finish',
      productType: ProductType.POSTER,
      posterDetails: {
        create: {
          width: 29.7,
          height: 42.0,
          material: 'Glossy Paper',
        },
      },
    },
  });

  const poster2 = await prisma.products.create({
    data: {
      sku: 'POSTER-A2-MATTE',
      name: 'A2 Matte Poster',
      price: 39.99,
      description: 'Large A2 poster with matte finish',
      productType: ProductType.POSTER,
      posterDetails: {
        create: {
          width: 42.0,
          height: 59.4,
          material: 'Matte Paper',
        },
      },
    },
  });

  // Create Orders with different statuses
  console.log('📦 Creating orders...');

  // Order 1: RECEIVED status
  const order1 = await prisma.order.create({
    data: {
      orderId: 'ORD-20241021-0001',
      client: 'John Doe',
      productId: tshirt1.id,
      orderStatus: OrderStatus.RECEIVED,
      comments: 'Please use eco-friendly packaging',
    },
  });

  await prisma.orderStatusHistory.create({
    data: {
      orderId: order1.id,
      fromStatus: null,
      toStatus: OrderStatus.RECEIVED,
    },
  });

  // Order 2: PROCESSING status
  const order2 = await prisma.order.create({
    data: {
      orderId: 'ORD-20241021-0002',
      client: 'Jane Smith',
      productId: mug1.id,
      orderStatus: OrderStatus.PROCESSING,
      comments: 'Rush order if possible',
    },
  });

  await prisma.orderStatusHistory.createMany({
    data: [
      {
        orderId: order2.id,
        fromStatus: null,
        toStatus: OrderStatus.RECEIVED,
      },
      {
        orderId: order2.id,
        fromStatus: OrderStatus.RECEIVED,
        toStatus: OrderStatus.PROCESSING,
      },
    ],
  });

  // Order 3: APPROVED status
  const order3 = await prisma.order.create({
    data: {
      orderId: 'ORD-20241021-0003',
      client: 'Bob Johnson',
      productId: poster1.id,
      orderStatus: OrderStatus.APPROVED,
    },
  });

  await prisma.orderStatusHistory.createMany({
    data: [
      {
        orderId: order3.id,
        fromStatus: null,
        toStatus: OrderStatus.RECEIVED,
      },
      {
        orderId: order3.id,
        fromStatus: OrderStatus.RECEIVED,
        toStatus: OrderStatus.PROCESSING,
      },
      {
        orderId: order3.id,
        fromStatus: OrderStatus.PROCESSING,
        toStatus: OrderStatus.APPROVED,
      },
    ],
  });

  // Order 4: IN_PRODUCTION status
  const order4 = await prisma.order.create({
    data: {
      orderId: 'ORD-20241021-0004',
      client: 'Alice Williams',
      productId: tshirt2.id,
      orderStatus: OrderStatus.IN_PRODUCTION,
      comments: 'Custom design on back',
    },
  });

  await prisma.orderStatusHistory.createMany({
    data: [
      {
        orderId: order4.id,
        fromStatus: null,
        toStatus: OrderStatus.RECEIVED,
      },
      {
        orderId: order4.id,
        fromStatus: OrderStatus.RECEIVED,
        toStatus: OrderStatus.PROCESSING,
      },
      {
        orderId: order4.id,
        fromStatus: OrderStatus.PROCESSING,
        toStatus: OrderStatus.APPROVED,
      },
      {
        orderId: order4.id,
        fromStatus: OrderStatus.APPROVED,
        toStatus: OrderStatus.IN_PRODUCTION,
      },
    ],
  });

  // Order 5: SHIPPED status
  const order5 = await prisma.order.create({
    data: {
      orderId: 'ORD-20241021-0005',
      client: 'Charlie Brown',
      productId: mug2.id,
      orderStatus: OrderStatus.SHIPPED,
      comments: 'Gift wrapping requested',
    },
  });

  await prisma.orderStatusHistory.createMany({
    data: [
      {
        orderId: order5.id,
        fromStatus: null,
        toStatus: OrderStatus.RECEIVED,
      },
      {
        orderId: order5.id,
        fromStatus: OrderStatus.RECEIVED,
        toStatus: OrderStatus.PROCESSING,
      },
      {
        orderId: order5.id,
        fromStatus: OrderStatus.PROCESSING,
        toStatus: OrderStatus.APPROVED,
      },
      {
        orderId: order5.id,
        fromStatus: OrderStatus.APPROVED,
        toStatus: OrderStatus.IN_PRODUCTION,
      },
      {
        orderId: order5.id,
        fromStatus: OrderStatus.IN_PRODUCTION,
        toStatus: OrderStatus.SHIPPED,
      },
    ],
  });

  // Order 6: DELIVERED status
  const order6 = await prisma.order.create({
    data: {
      orderId: 'ORD-20241021-0006',
      client: 'Diana Prince',
      productId: poster2.id,
      orderStatus: OrderStatus.DELIVERED,
    },
  });

  await prisma.orderStatusHistory.createMany({
    data: [
      {
        orderId: order6.id,
        fromStatus: null,
        toStatus: OrderStatus.RECEIVED,
      },
      {
        orderId: order6.id,
        fromStatus: OrderStatus.RECEIVED,
        toStatus: OrderStatus.PROCESSING,
      },
      {
        orderId: order6.id,
        fromStatus: OrderStatus.PROCESSING,
        toStatus: OrderStatus.APPROVED,
      },
      {
        orderId: order6.id,
        fromStatus: OrderStatus.APPROVED,
        toStatus: OrderStatus.IN_PRODUCTION,
      },
      {
        orderId: order6.id,
        fromStatus: OrderStatus.IN_PRODUCTION,
        toStatus: OrderStatus.SHIPPED,
      },
      {
        orderId: order6.id,
        fromStatus: OrderStatus.SHIPPED,
        toStatus: OrderStatus.DELIVERED,
      },
    ],
  });

  // Additional orders for variety
  await prisma.order.create({
    data: {
      orderId: 'ORD-20241021-0007',
      client: 'Eve Martinez',
      productId: tshirt3.id,
      orderStatus: OrderStatus.RECEIVED,
      comments: 'First time customer',
    },
  });

  await prisma.order.create({
    data: {
      orderId: 'ORD-20241021-0008',
      client: 'Frank Castle',
      productId: mug1.id,
      orderStatus: OrderStatus.PROCESSING,
    },
  });

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Products: ${await prisma.products.count()}`);
  console.log(`   - T-shirts: ${await prisma.tshirtDetails.count()}`);
  console.log(`   - Mugs: ${await prisma.mugDetails.count()}`);
  console.log(`   - Posters: ${await prisma.posterDetails.count()}`);
  console.log(`   - Orders: ${await prisma.order.count()}`);
  console.log(
    `   - Status History: ${await prisma.orderStatusHistory.count()}`,
  );
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
