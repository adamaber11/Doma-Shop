import type { Product, Category } from './types';

export const allCategories: Category[] = [
  { id: 'electronics', name: 'Electronics', imageId: 'electronics-cat' },
  { id: 'fashion', name: 'Fashion', imageId: 'fashion-cat' },
  { id: 'beauty', name: 'Beauty & Personal Care', imageId: 'beauty-cat' },
  { id: 'home-kitchen', name: 'Home & Kitchen', imageId: 'home-kitchen-cat' },
  { id: 'grocery', name: 'Grocery', imageId: 'grocery-cat' },
  { id: 'health-sports', name: 'Health & Sports', imageId: 'sports-cat' },
  { id: 'toys-hobbies', name: 'Toys & Hobbies', imageId: 'toys-cat' },
  { id: 'books-stationery', name: 'Books & Stationery', imageId: 'books-cat' },
  { id: 'vehicles-accessories', name: 'Vehicles & Accessories', imageId: 'vehicles-cat' },
];

export const allProducts: Product[] = [
  // Electronics
  { id: 'prod-1', name: 'Pro Laptop 15"', description: 'The latest high-performance laptop for professionals and creatives. Features a stunning 15" display and all-day battery life.', price: 1999.99, categoryId: 'electronics', imageIds: ['product-1'], stock: 15 },
  { id: 'prod-2', name: 'SmartPhone X', description: 'Experience the future with the SmartPhone X, featuring a revolutionary camera system and the most powerful chip ever in a smartphone.', price: 999.00, categoryId: 'electronics', imageIds: ['product-2'], stock: 30 },
  { id: 'prod-3', name: 'Noise-Cancelling Headphones', description: 'Immerse yourself in music with industry-leading noise cancellation and high-fidelity audio.', price: 349.99, categoryId: 'electronics', imageIds: ['product-3'], stock: 50 },

  // Fashion
  { id: 'prod-4', name: 'Classic Denim Jacket', description: 'A timeless denim jacket made from premium materials. Perfect for any casual occasion.', price: 89.99, categoryId: 'fashion', imageIds: ['product-4'], stock: 100 },
  { id: 'prod-5', name: 'Flowy Summer Dress', description: 'Stay cool and stylish with this lightweight and elegant summer dress. Available in multiple colors.', price: 59.50, categoryId: 'fashion', imageIds: ['product-5'], stock: 80 },
  { id: 'prod-6', name: 'Urban Leather Sneakers', description: 'Comfortable and stylish leather sneakers for everyday wear. A versatile addition to your wardrobe.', price: 120.00, categoryId: 'fashion', imageIds: ['product-6'], stock: 120 },

  // Beauty & Personal Care
  { id: 'prod-7', name: 'Vitamin C Face Serum', description: 'Brighten and rejuvenate your skin with this potent organic vitamin C serum.', price: 25.00, categoryId: 'beauty', imageIds: ['product-7'], stock: 200 },
  { id: 'prod-8', name: 'Hydrating Daily Moisturizer', description: 'A lightweight, natural-ingredient moisturizer for all skin types. Provides 24-hour hydration.', price: 35.00, categoryId: 'beauty', imageIds: ['product-8'], stock: 150 },
  { id: 'prod-9', name: 'Sonic Electric Toothbrush', description: 'Achieve a superior clean with our professional-grade sonic electric toothbrush. Includes two brush heads.', price: 79.99, categoryId: 'beauty', imageIds: ['product-9'], stock: 60 },

  // Home & Kitchen
  { id: 'prod-10', name: 'Pro Espresso Machine', description: 'Become your own barista with this professional-quality home espresso machine. Makes perfect lattes and cappuccinos.', price: 499.99, categoryId: 'home-kitchen', imageIds: ['product-10'], stock: 25 },
  { id: 'prod-11', name: '10-Piece Cookware Set', description: 'Upgrade your kitchen with this durable, non-stick cookware set. Includes all the essential pots and pans.', price: 149.99, categoryId: 'home-kitchen', imageIds: ['product-11'], stock: 40 },
  { id: 'prod-12', name: 'Robo-Vaccum Pro', description: 'Keep your floors spotless with this smart robotic vacuum cleaner. Wi-Fi connected and self-charging.', price: 299.00, categoryId: 'home-kitchen', imageIds: ['product-12'], stock: 35 },

  // Grocery
  { id: 'prod-13', name: 'Organic Gala Apples', description: 'A bag of crisp, sweet, and juicy organic Gala apples. Perfect for snacking or baking. (2 lbs)', price: 5.99, categoryId: 'grocery', imageIds: ['product-13'], stock: 300 },
  { id: 'prod-14', name: 'Artisan Sourdough Loaf', description: 'Freshly baked artisan sourdough bread with a crispy crust and soft, chewy interior.', price: 7.50, categoryId: 'grocery', imageIds: ['product-14'], stock: 100 },
  { id: 'prod-15', name: 'Extra Virgin Olive Oil', description: 'Premium, cold-pressed extra virgin olive oil from Italy. Ideal for dressings and cooking. (500ml)', price: 15.99, categoryId: 'grocery', imageIds: ['product-15'], stock: 180 },

  // Health & Sports
  { id: 'prod-16', name: 'Adjustable Dumbbell Set', description: 'A space-saving adjustable dumbbell set, perfect for a home gym. Ranges from 5 to 52.5 lbs.', price: 399.00, categoryId: 'health-sports', imageIds: ['product-16'], stock: 30 },
  { id: 'prod-17', name: 'Eco-Friendly Yoga Mat', description: 'A high-quality, non-slip, and eco-friendly yoga mat for your daily practice.', price: 45.00, categoryId: 'health-sports', imageIds: ['product-17'], stock: 90 },
  { id: 'prod-18', name: 'Daily Multivitamin', description: 'A complete daily multivitamin to support overall health and wellness. (90 tablets)', price: 19.99, categoryId: 'health-sports', imageIds: ['product-18'], stock: 250 },

  // Toys & Hobbies
  { id: 'prod-19', name: 'Classic Wooden Train Set', description: 'A beautifully crafted wooden train set that encourages imaginative play. (52 pieces)', price: 65.00, categoryId: 'toys-hobbies', imageIds: ['product-19'], stock: 70 },
  { id: 'prod-20', name: 'Creator Expert Car Model', description: 'A challenging and rewarding building experience. This creator set is a detailed replica of a classic car.', price: 149.99, categoryId: 'toys-hobbies', imageIds: ['product-20'], stock: 40 },
  { id: 'prod-21', name: 'Cuddly Teddy Bear', description: 'An ultra-soft and cuddly 18-inch teddy bear, the perfect companion for all ages.', price: 24.99, categoryId: 'toys-hobbies', imageIds: ['product-21'], stock: 150 },

  // Books & Stationery
  { id: 'prod-22', name: 'The Midnight Library', description: 'A bestselling novel by Matt Haig. A beautiful story about choices, regrets, and what makes a life truly fulfilled.', price: 16.99, categoryId: 'books-stationery', imageIds: ['product-22'], stock: 120 },
  { id: 'prod-23', name: 'Gel Pen Set - 48 Colors', description: 'Unleash your creativity with this set of 48 vibrant, smooth-writing gel pens.', price: 19.99, categoryId: 'books-stationery', imageIds: ['product-23'], stock: 200 },
  { id: 'prod-24', name: '2024 Leather Planner', description: 'Stay organized with this elegant leather-bound planner. Features daily, weekly, and monthly views.', price: 29.99, categoryId: 'books-stationery', imageIds: ['product-24'], stock: 90 },

  // Vehicles & Accessories
  { id: 'prod-25', name: 'Ultimate Car Care Kit', description: 'Everything you need to keep your car looking brand new. Includes wax, soap, tire shine, and microfiber towels.', price: 55.00, categoryId: 'vehicles-accessories', imageIds: ['product-25'], stock: 60 },
  { id: 'prod-26', name: 'Stealth Motorcycle Helmet', description: 'A DOT-approved full-face motorcycle helmet with a sleek matte black finish and advanced ventilation.', price: 180.00, categoryId: 'vehicles-accessories', imageIds: ['product-26'], stock: 45 },
  { id: 'prod-27', name: 'Digital GPS Navigator', description: 'Never get lost again with this 7-inch touchscreen GPS navigator with lifetime map updates.', price: 129.99, categoryId: 'vehicles-accessories', imageIds: ['product-27'], stock: 55 },
];
