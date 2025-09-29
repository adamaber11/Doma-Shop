

import type { Product, Category, Review, Order, Customer } from './types';

export const allCategories: Category[] = [
  { id: 'electronics', name: 'الإلكترونيات', imageUrl: 'https://picsum.photos/seed/electronics-cat/100/100' },
  { id: 'fashion', name: 'الموضة', imageUrl: 'https://picsum.photos/seed/fashion-cat/100/100' },
  { id: 'beauty-personal-care', name: 'الجمال والعناية الشخصية', imageUrl: 'https://picsum.photos/seed/beauty-cat/100/100' },
  { id: 'home-furniture', name: 'المنزل والأثاث', imageUrl: 'https://picsum.photos/seed/home-kitchen-cat/100/100' },
  { id: 'home-appliances', name: 'الأجهزة المنزلية', imageUrl: 'https://picsum.photos/seed/product-12/100/100' },
  { id: 'sports-outdoors', name: 'الرياضة والهواء الطلق', imageUrl: 'https://picsum.photos/seed/sports-cat/100/100' },
  { id: 'toys-kids', name: 'الألعاب والأطفال', imageUrl: 'https://picsum.photos/seed/toys-cat/100/100' },
  { id: 'books-stationery', name: 'الكتب والأدوات المكتبية', imageUrl: 'https://picsum.photos/seed/books-cat/100/100' },
  { id: 'grocery-food', name: 'البقالة والأطعمة', imageUrl: 'https://picsum.photos/seed/grocery-cat/100/100' },
  { id: 'handmade', name: 'الأعمال اليدوية', imageUrl: 'https://picsum.photos/seed/product-21/100/100' },
  { id: 'used', name: 'المستعمل', imageUrl: 'https://picsum.photos/seed/product-22/100/100' },
  { id: 'cars-parts', name: 'السيارات وقطع الغيار', imageUrl: 'https://picsum.photos/seed/vehicles-cat/100/100' },
  { id: 'pet-supplies', name: 'مستلزمات الحيوانات الأليفة', imageUrl: 'https://picsum.photos/seed/product-16/100/100' },
  { id: 'health-wellness', name: 'الصحة والعافية', imageUrl: 'https://picsum.photos/seed/health-cat/100/100' },
  { id: 'office-supplies', name: 'مستلزمات مكتبية', imageUrl: 'https://picsum.photos/seed/office-cat/100/100' },
  { id: 'music-instruments', name: 'الموسيقى والآلات', imageUrl: 'https://picsum.photos/seed/music-cat/100/100' },
  { id: 'art-crafts', name: 'الفنون والحرف', imageUrl: 'https://picsum.photos/seed/art-cat/100/100' },
  { id: 'industrial-scientific', name: 'صناعي وعلمي', imageUrl: 'https://picsum.photos/seed/industrial-cat/100/100' }
];

const sampleReviews: Review[] = [
    { id: 'rev-1', author: 'أحمد محمود', rating: 5, comment: 'منتج رائع وجودة ممتازة!', createdAt: new Date('2023-10-15T10:00:00Z') },
    { id: 'rev-2', author: 'فاطمة علي', rating: 4, comment: 'جيد جدًا، لكن التوصيل تأخر قليلاً.', createdAt: new Date('2023-10-16T14:30:00Z') },
];

export const allProducts: Product[] = [
  // Electronics
  { id: 'prod-1', name: 'لابتوب برو 15 بوصة', description: 'أحدث لابتوب عالي الأداء للمحترفين والمبدعين. يتميز بشاشة مذهلة مقاس 15 بوصة وبطارية تدوم طوال اليوم.', price: 1999.99, categoryId: 'electronics', stock: 15, variants: [{color: '#333333', imageUrls: ['https://picsum.photos/seed/prod1/600/600']}], reviews: sampleReviews },
  { id: 'prod-2', name: 'هاتف ذكي X', description: 'جرب المستقبل مع هاتف X الذكي، الذي يتميز بنظام كاميرا ثوري وأقوى شريحة في هاتف ذكي على الإطلاق.', price: 999.00, categoryId: 'electronics', stock: 30, variants: [{color: '#FFFFFF', imageUrls: ['https://picsum.photos/seed/prod2/600/600']}] },
  { id: 'prod-3', name: 'سماعات إلغاء الضوضاء', description: 'انغمس في الموسيقى مع سماعات رائدة في إلغاء الضوضاء وصوت عالي الدقة.', price: 349.99, salePrice: 299.99, categoryId: 'electronics', stock: 50, variants: [{color: '#000000', imageUrls: ['https://picsum.photos/seed/prod3/600/600']}], isBestOffer: true },

  // Fashion
  { id: 'prod-4', name: 'جاكيت جينز كلاسيك', description: 'جاكيت جينز خالد مصنوع من مواد فاخرة. مثالي لأي مناسبة غير رسمية.', price: 89.99, categoryId: 'fashion', stock: 100, variants: [{color: '#3A8DDE', imageUrls: ['https://picsum.photos/seed/prod4/600/600']}], sizes: ['S', 'M', 'L', 'XL'] },
  { id: 'prod-5', name: 'فستان صيفي فضفاض', description: 'ابقي أنيقة ومرتاحة مع هذا الفستان الصيفي الخفيف والأنيق. متوفر بألوان متعددة.', price: 59.50, categoryId: 'fashion', stock: 80, variants: [{color: '#FFC0CB', imageUrls: ['https://picsum.photos/seed/prod5/600/600']}], isFeatured: true },
  { id: 'prod-6', name: 'حذاء رياضي جلدي حضري', description: 'حذاء رياضي جلدي مريح وأنيق للارتداء اليومي. إضافة متعددة الاستخدامات لخزانة ملابسك.', price: 120.00, categoryId: 'fashion', stock: 120, variants: [{color: '#FFFFFF', imageUrls: ['https://picsum.photos/seed/prod6/600/600']}, {color: '#000000', imageUrls: ['https://picsum.photos/seed/prod6-black/600/600']}], isBestOffer: true },

  // Beauty & Personal Care
  { id: 'prod-7', name: 'سيروم فيتامين سي للوجه', description: 'أضيئي وجددي بشرتك مع هذا السيروم العضوي القوي بفيتامين سي.', price: 25.00, categoryId: 'beauty-personal-care', stock: 200, variants: [{color: '#FFD700', imageUrls: ['https://picsum.photos/seed/prod7/600/600']}] },
  { id: 'prod-8', name: 'مرطب يومي مرطب', description: 'مرطب خفيف الوزن بمكونات طبيعية لجميع أنواع البشرة. يوفر ترطيبًا لمدة 24 ساعة.', price: 35.00, categoryId: 'beauty-personal-care', stock: 150, variants: [{color: '#F0F8FF', imageUrls: ['https://picsum.photos/seed/prod8/600/600']}], isFeatured: true },
  { id: 'prod-9', name: 'فرشاة أسنان كهربائية سونيك', description: 'احصل على نظافة فائقة مع فرشاة الأسنان الكهربائية الصوتية ذات الجودة الاحترافية. تتضمن رأسين للفرشاة.', price: 79.99, categoryId: 'beauty-personal-care', stock: 60, variants: [{color: '#ADD8E6', imageUrls: ['https://picsum.photos/seed/prod9/600/600']}] },

  // Home & Kitchen
  { id: 'prod-10', name: 'آلة إسبرسو برو', description: 'كن باريستا بنفسك مع آلة الإسبريسو المنزلية ذات الجودة الاحترافية. تصنع أفضل أنواع اللاتيه والكابتشينو.', price: 499.99, categoryId: 'home-furniture', stock: 25, variants: [{color: '#C0C0C0', imageUrls: ['https://picsum.photos/seed/prod10/600/600']}], isFeatured: true },
  { id: 'prod-11', name: 'طقم أواني طهي 10 قطع', description: 'قم بترقية مطبخك مع طقم أواني الطهي المتين وغير اللاصق. يتضمن جميع الأواني والمقالي الأساسية.', price: 149.99, categoryId: 'home-furniture', stock: 40, variants: [{color: '#4682B4', imageUrls: ['https://picsum.photos/seed/prod11/600/600']}] },
  { id: 'prod-12', name: 'مكنسة روبو-فاكيوم برو', description: 'حافظ على نظافة أرضياتك مع هذه المكنسة الكهربائية الروبوتية الذكية. متصلة بشبكة Wi-Fi وتشحن ذاتيًا.', price: 299.00, salePrice: 249.00, categoryId: 'home-appliances', stock: 35, variants: [{color: '#000000', imageUrls: ['https://picsum.photos/seed/prod12/600/600']}], isBestOffer: true },
];

export const allOrders: Order[] = [
    { id: 'order-101', customerName: 'علي حسن', customerEmail: 'ali@example.com', total: 149.99, status: 'delivered', createdAt: new Date('2023-11-10T09:30:00Z'), items: [{productName: 'طقم أواني طهي 10 قطع', quantity: 1, price: 149.99}] },
    { id: 'order-102', customerName: 'منى صالح', customerEmail: 'mona@example.com', total: 65.00, status: 'shipped', createdAt: new Date('2023-11-12T14:00:00Z'), items: [{productName: 'طقم قطار خشبي كلاسيكي', quantity: 1, price: 65.00}] },
    { id: 'order-103', name: 'خالد عبد الله', email: 'khaled@example.com', total: 349.99, status: 'pending', createdAt: new Date('2023-11-14T11:20:00Z'), items: [{productName: 'سماعات إلغاء الضوضاء', quantity: 1, price: 349.99}] },
    { id: 'order-104', name: 'نورة إبراهيم', email: 'noura@example.com', total: 89.99, status: 'cancelled', createdAt: new Date('2023-11-13T18:00:00Z'), items: [{productName: 'جاكيت جينز كلاسيك', quantity: 1, price: 89.99}] },
];

export const allCustomers: Customer[] = [
    { id: 'cust-1', name: 'علي حسن', email: 'ali@example.com', photoURL: 'https://i.pravatar.cc/150?u=ali@example.com', joinedAt: new Date('2023-01-15T10:00:00Z')},
    { id: 'cust-2', name: 'منى صالح', email: 'mona@example.com', photoURL: 'https://i.pravatar.cc/150?u=mona@example.com', joinedAt: new Date('2023-02-20T11:30:00Z')},
    { id: 'cust-3', name: 'خالد عبد الله', email: 'khaled@example.com', photoURL: 'https://i.pravatar.cc/150?u=khaled@example.com', joinedAt: new Date('2023-03-05T16:45:00Z')},
    { id: 'cust-4', name: 'نورة إبراهيم', email: 'noura@example.com', photoURL: 'https://i.pravatar.cc/150?u=noura@example.com', joinedAt: new Date('2023-04-10T09:00:00Z')},
];
