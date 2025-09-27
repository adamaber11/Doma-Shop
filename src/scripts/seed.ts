import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { allProducts, allCategories } from '../lib/data';

async function seedDatabase() {
  try {
    // Check for existing service account credentials
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      console.error('GOOGLE_APPLICATION_CREDENTIALS environment variable not set.');
      console.log('Please download your service account key from Firebase Console > Project Settings > Service accounts and set the path in your environment.');
      process.exit(1);
    }
    
    // Initialize Firebase Admin SDK
    initializeApp();

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
