import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { allProducts, allCategories } from '../lib/data';

async function seedDatabase() {
  try {
    // Initialize Firebase Admin SDK باستخدام Project Credentials مباشرة
    initializeApp({
      credential: applicationDefault(),
      projectId: 'studio-5671039815', // غيره للـ Project ID بتاعك
    });

    const db = getFirestore();
    db.settings({ ignoreUndefinedProperties: true });

    console.log('Starting to seed database...');

    // Seed Categories
    console.log('Seeding categories...');
    const categoryCollection = db.collection('categories');
    for (const category of allCategories) {
      const { id, ...categoryData } = category;
      await categoryCollection.doc(id).set(categoryData);
      console.log(`- Seeded category: ${category.name}`);
    }
    console.log('✅ Categories seeded successfully.');

    // Seed Products
    console.log('\nSeeding products...');
    const productCollection = db.collection('products');
    for (const product of allProducts) {
      const { id, ...productData } = product;
      await productCollection.doc(id).set(productData);
      console.log(`- Seeded product: ${product.name}`);
    }
    console.log('✅ Products seeded successfully.');

    console.log('\nDatabase seeding completed!');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
