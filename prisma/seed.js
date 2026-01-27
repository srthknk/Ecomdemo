const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with demo data...');

  // Clear existing data (optional - comment out if you want to keep existing data)
  await prisma.orderItem.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.product.deleteMany();
  await prisma.store.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.user.deleteMany();

  // Create demo users
  const user1 = await prisma.user.create({
    data: {
      id: 'user_demo_buyer_001',
      name: 'John Doe',
      email: 'buyer@example.com',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      id: 'user_demo_seller_001',
      name: 'Sarah Store',
      email: 'seller@example.com',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      id: 'user_demo_seller_002',
      name: 'Mike Electronics',
      email: 'mike@example.com',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    },
  });

  console.log('✅ Created 3 demo users');

  // Create demo stores
  const store1 = await prisma.store.create({
    data: {
      userId: user2.id,
      name: 'Fashion Hub',
      username: 'fashion_hub',
      description: 'Premium fashion and clothing store',
      address: '123 Fashion Street, NY, USA',
      email: 'fashionhub@store.com',
      contact: '+1-234-567-8900',
      logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=fashionhub',
      isActive: true,
      status: 'approved',
    },
  });

  const store2 = await prisma.store.create({
    data: {
      userId: user3.id,
      name: 'Tech World',
      username: 'tech_world',
      description: 'Latest electronics and gadgets',
      address: '456 Tech Avenue, CA, USA',
      email: 'techworld@store.com',
      contact: '+1-234-567-8901',
      logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=techworld',
      isActive: true,
      status: 'approved',
    },
  });

  console.log('✅ Created 2 demo stores');

  // Create demo products for store1
  const product1 = await prisma.product.create({
    data: {
      name: 'Premium Cotton T-Shirt',
      description: 'High quality 100% cotton t-shirt, perfect for everyday wear',
      mrp: 1999,
      price: 999,
      category: 'Clothing',
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
      inStock: true,
      storeId: store1.id,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Blue Denim Jeans',
      description: 'Classic blue denim jeans with perfect fit',
      mrp: 3999,
      price: 2499,
      category: 'Clothing',
      images: ['https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500'],
      inStock: true,
      storeId: store1.id,
    },
  });

  const product3 = await prisma.product.create({
    data: {
      name: 'Wireless Bluetooth Headphones',
      description: '30-hour battery life, noise cancellation, premium sound quality',
      mrp: 9999,
      price: 5999,
      category: 'Electronics',
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
      inStock: true,
      storeId: store2.id,
    },
  });

  const product4 = await prisma.product.create({
    data: {
      name: 'USB-C Fast Charger',
      description: '65W fast charging for all devices',
      mrp: 2999,
      price: 1499,
      category: 'Electronics',
      images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500'],
      inStock: true,
      storeId: store2.id,
    },
  });

  console.log('✅ Created 4 demo products');

  // Create demo address for buyer
  const address1 = await prisma.address.create({
    data: {
      userId: user1.id,
      name: 'John Doe',
      email: 'buyer@example.com',
      street: '789 Main Street, Apt 101',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA',
      phone: '+1-555-123-4567',
    },
  });

  console.log('✅ Created demo address');

  // Create demo order
  const order1 = await prisma.order.create({
    data: {
      total: 7498,
      status: 'DELIVERED',
      userId: user1.id,
      storeId: store1.id,
      addressId: address1.id,
      isPaid: true,
      paymentMethod: 'STRIPE',
      isCouponUsed: false,
      coupon: {},
      orderItems: {
        create: [
          {
            productId: product1.id,
            quantity: 2,
            price: 999,
          },
          {
            productId: product2.id,
            quantity: 1,
            price: 2499,
          },
        ],
      },
    },
  });

  console.log('✅ Created demo order with items');

  // Create demo ratings
  const rating1 = await prisma.rating.create({
    data: {
      rating: 5,
      review: 'Amazing quality! Highly recommend this product.',
      userId: user1.id,
      productId: product1.id,
      orderId: order1.id,
    },
  });

  const rating2 = await prisma.rating.create({
    data: {
      rating: 4,
      review: 'Great fit and comfortable to wear.',
      userId: user1.id,
      productId: product2.id,
      orderId: order1.id,
    },
  });

  console.log('✅ Created demo ratings');

  // Create demo coupons
  const coupon1 = await prisma.coupon.create({
    data: {
      code: 'WELCOME10',
      description: '10% off for new users',
      discount: 10,
      forNewUser: true,
      forMember: false,
      isPublic: true,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  });

  const coupon2 = await prisma.coupon.create({
    data: {
      code: 'MEMBER20',
      description: '20% off for members',
      discount: 20,
      forNewUser: false,
      forMember: true,
      isPublic: true,
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    },
  });

  console.log('✅ Created demo coupons');

  console.log('\n✨ Database seeded successfully!\n');
  console.log('📊 Demo Data Summary:');
  console.log(`   • Users: 3`);
  console.log(`   • Stores: 2`);
  console.log(`   • Products: 4`);
  console.log(`   • Orders: 1`);
  console.log(`   • Ratings: 2`);
  console.log(`   • Coupons: 2`);
  console.log('\n🔐 Demo Credentials:');
  console.log(`   • Buyer Email: ${user1.email}`);
  console.log(`   • Seller 1 Email: ${user2.email}`);
  console.log(`   • Seller 2 Email: ${user3.email}`);
  console.log('\n💡 Use Clerk to login with these emails (no password needed)\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
