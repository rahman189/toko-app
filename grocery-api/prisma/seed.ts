import 'dotenv/config';
import bcrypt from 'bcrypt';

import { PrismaClient, UserRole } from '../src/generated/prisma/client.js';

import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const categories = [
  'Minuman',
  'Makanan',
  'Sembako',
  'Snack',
  'Kebutuhan Rumah',
  'Kebersihan',
  'Perawatan Diri',
  'Bayi',
  'Elektronik',
  'Alat Tulis',
];

const productNames = [
  'Aqua',
  'Le Minerale',
  'Indomie Goreng',
  'Indomie Soto',
  'Indomie Kari Ayam',
  'Teh Botol Sosro',
  'Ultra Milk',
  'Bimoli',
  'Sania',
  'Royco',
  'Dancow',
  'Good Day',
  'Kapal Api',
  'Energen',
  'Chitato',
  'Taro',
  'Qtela',
  'Oreo',
  'Roma Malkist',
  'SilverQueen',
  'Pocky',
  'Pilus Garuda',
  'Kacang Garuda',
  'Lays',
  'Tango',
  'Sunlight',
  'Mama Lemon',
  'Rinso',
  'Molto',
  'Downy',
  'So Klin',
  'Daia',
  'Lifebuoy',
  'Pepsodent',
  'Sunsilk',
  'Pantene',
  'Clear',
  'Dove',
  'Lux',
  'Nuvo',
  'Pampers',
  'Sweety',
  'MamyPoko',
  'Cussons Baby',
  'Zwitsal',
  'Minyak Kayu Putih',
  'Tolak Angin',
  'Antangin',
  'Paracetamol',
  'Hansaplast',
  'Baterai ABC',
  'Baterai Panasonic',
  'Lampu Philips',
  'Kabel USB',
  'Charger USB',
  'Pulpen Pilot',
  'Pulpen Standard',
  'Pensil 2B',
  'Penghapus Faber Castell',
  'Buku Tulis Sinar Dunia',
  'Buku Tulis Kiky',
  'Spidol Snowman',
  'Penggaris Butterfly',
  'Lem Fox',
  'Lakban',
  'Korek Api',
  'Tissue Paseo',
  'Tissue Nice',
  'Tissue Tessa',
  'Kapas Selection',
  'Cotton Buds',
  'Sabun Cuci Piring',
  'Sabun Batang',
  'Pasta Gigi',
  'Sikat Gigi',
  'Shampoo',
  'Conditioner',
  'Body Lotion',
  'Deodorant',
  'Parfum',
  'Air Mineral',
  'Jus Buah',
  'Susu UHT',
  'Kopi Sachet',
  'Teh Celup',
  'Gula Pasir',
  'Garam',
  'Tepung Terigu',
  'Beras',
  'Kecap Manis',
  'Saus Sambal',
  'Saus Tomat',
  'Margarin',
  'Telur Ayam',
  'Mie Telur',
  'Biskuit',
  'Wafer',
  'Permen',
  'Cokelat',
  'Kerupuk',
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function main(): Promise<void> {
  console.log('🌱 Starting database seed...');

  /*
   * --------------------------------------------------
   * Users
   * --------------------------------------------------
   */

  const passwordHash = await bcrypt.hash('Password123!', 10);

  const admin = await prisma.user.upsert({
    where: {
      email: 'admin@grocery.local',
    },
    update: {
      name: 'Grocery Admin',
      role: UserRole.ADMIN,
      isActive: true,
      password: passwordHash,
    },
    create: {
      name: 'Grocery Admin',
      email: 'admin@grocery.local',
      password: passwordHash,
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  const staff = await prisma.user.upsert({
    where: {
      email: 'staff@grocery.local',
    },
    update: {
      name: 'Grocery Staff',
      role: UserRole.STAFF,
      isActive: true,
      password: passwordHash,
    },
    create: {
      name: 'Grocery Staff',
      email: 'staff@grocery.local',
      password: passwordHash,
      role: UserRole.STAFF,
      isActive: true,
    },
  });

  console.log(`✅ Admin created: ${admin.email}`);
  console.log(`✅ Staff created: ${staff.email}`);

  /*
   * --------------------------------------------------
   * Categories
   * --------------------------------------------------
   */

  const categoryRecords = [];

  for (const name of categories) {
    const category = await prisma.category.upsert({
      where: {
        slug: slugify(name),
      },
      update: {
        name,
        isActive: true,
      },
      create: {
        name,
        slug: slugify(name),
        isActive: true,
      },
    });

    categoryRecords.push(category);
  }

  console.log(`✅ Categories seeded: ${categoryRecords.length}`);

  /*
   * --------------------------------------------------
   * Products
   * --------------------------------------------------
   */

  for (let index = 0; index < 100; index++) {
    const baseName = productNames[index % productNames.length];

    const productNumber = index + 1;

    const productName =
      productNumber <= productNames.length
        ? baseName
        : `${baseName} ${Math.ceil(productNumber / productNames.length)}`;

    const category = categoryRecords[index % categoryRecords.length];

    const product = await prisma.product.create({
      data: {
        name: productName,
        description: `Sample description for ${productName}`,
        categoryId: category.id,
        isActive: true,

        variants: {
          create: [
            {
              sku: `SKU-${String(productNumber).padStart(4, '0')}-01`,
              barcode: `899000000${String(productNumber).padStart(4, '0')}`,
              variantName: 'Default',
              price: 5000 + index * 500,
              costPrice: 4000 + index * 400,
              stock: 10 + (index % 50),
              attributes: {
                unit: 'pcs',
              },
              isActive: true,
            },
          ],
        },
      },
    });

    console.log(`✅ Product ${productNumber}/100: ${product.name}`);
  }

  console.log('🎉 Database seed completed!');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
