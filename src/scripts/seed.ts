import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { allProducts, allCategories, allOrders, allCustomers } from '../lib/data';

async function seedDatabase() {
  try {
    initializeApp({
      credential: applicationDefault(),
      projectId: 'studio-5671039815', 
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
      const dataToSet: any = { ...productData };
      if (productData.reviews) {
          dataToSet.reviews = productData.reviews.map(review => ({
              ...review,
              createdAt: Timestamp.fromDate(review.createdAt)
          }))
      }
      await productCollection.doc(id).set(dataToSet);
      console.log(`- Seeded product: ${product.name}`);
    }
    console.log('✅ Products seeded successfully.');

     // Seed Orders
    console.log('\nSeeding orders...');
    const orderCollection = db.collection('orders');
    for (const order of allOrders) {
      const { id, customerName, customerEmail, ...orderData } = order;
      const dataToSet = {
        ...orderData,
        customerName: customerName || order.name, // Backward compatibility
        customerEmail: customerEmail || order.email, // Backward compatibility
        createdAt: Timestamp.fromDate(orderData.createdAt),
      };
      await orderCollection.doc(id).set(dataToSet);
      console.log(`- Seeded order: ${order.id}`);
    }
    console.log('✅ Orders seeded successfully.');

    // Seed Customers
    console.log('\nSeeding customers...');
    const customerCollection = db.collection('customers');
    for (const customer of allCustomers) {
      const { id, ...customerData } = customer;
       const dataToSet = {
        ...customerData,
        joinedAt: Timestamp.fromDate(customerData.joinedAt),
      };
      await customerCollection.doc(id).set(dataToSet);
      console.log(`- Seeded customer: ${customer.name}`);
    }
    console.log('✅ Customers seeded successfully.');

    console.log('\nDatabase seeding completed!');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
