

import type { Product, Category, Review, Order, Customer } from './types';

export const allCategories: Category[] = [
  { 
    id: 'electronics', 
    name: 'الإلكترونيات', 
    imageUrl: 'https://picsum.photos/seed/electronics-cat/100/100',
    subcategories: [
      { id: 'mobiles', name: 'هواتف محمولة' },
      { id: 'laptops', name: 'لابتوبات' },
      { id: 'audio', name: 'أجهزة صوتية' },
      { id: 'tvs', name: 'تلفزيونات' },
    ]
  },
  { 
    id: 'fashion', 
    name: 'الموضة', 
    imageUrl: 'https://picsum.photos/seed/fashion-cat/100/100',
    subcategories: [
      { id: 'mens-fashion', name: 'أزياء رجالية' },
      { id: 'womens-fashion', name: 'أزياء نسائية' },
      { id: 'kids-fashion', name: 'أزياء أطفال' },
    ]
  },
  { 
    id: 'beauty-personal-care', 
    name: 'الجمال والعناية الشخصية', 
    imageUrl: 'https://picsum.photos/seed/beauty-cat/100/100',
    subcategories: [
        { id: 'skincare', name: 'عناية بالبشرة' },
        { id: 'makeup', name: 'مكياج' },
        { id: 'haircare', name: 'عناية بالشعر' },
        { id: 'fragrances', name: 'عطور' },
    ]
  },
  { 
    id: 'home-furniture', 
    name: 'المنزل والأثاث', 
    imageUrl: 'https://picsum.photos/seed/home-kitchen-cat/100/100',
    subcategories: [
        { id: 'furniture', name: 'أثاث' },
        { id: 'bedding', name: 'مفروشات' },
        { id: 'decor', name: 'ديكور' },
    ]
  },
  { id: 'home-appliances', name: 'الأجهزة المنزلية', imageUrl: 'https://picsum.photos/seed/product-12/100/100', subcategories: [] },
  { id: 'sports-outdoors', name: 'الرياضة والهواء الطلق', imageUrl: 'https://picsum.photos/seed/sports-cat/100/100', subcategories: [] },
  { id: 'toys-kids', name: 'الألعاب والأطفال', imageUrl: 'https://picsum.photos/seed/toys-cat/100/100', subcategories: [] },
  { id: 'books-stationery', name: 'الكتب والأدوات المكتبية', imageUrl: 'https://picsum.photos/seed/books-cat/100/100', subcategories: [] },
  { id: 'grocery-food', name: 'البقالة والأطعمة', imageUrl: 'https://picsum.photos/seed/grocery-cat/100/100', subcategories: [] },
  { id: 'handmade', name: 'الأعمال اليدوية', imageUrl: 'https://picsum.photos/seed/product-21/100/100', subcategories: [] },
  { id: 'used', name: 'المستعمل', imageUrl: 'https://picsum.photos/seed/product-22/100/100', subcategories: [] },
  { id: 'cars-parts', name: 'السيارات وقطع الغيار', imageUrl: 'https://picsum.photos/seed/vehicles-cat/100/100', subcategories: [] },
  { id: 'pet-supplies', name: 'مستلزمات الحيوانات الأليفة', imageUrl: 'https://picsum.photos/seed/product-16/100/100', subcategories: [] },
  { id: 'health-wellness', name: 'الصحة والعافية', imageUrl: 'https://picsum.photos/seed/health-cat/100/100', subcategories: [] },
  { id: 'office-supplies', name: 'مستلزمات مكتبية', imageUrl: 'https://picsum.photos/seed/office-cat/100/100', subcategories: [] },
  { id: 'music-instruments', name: 'الموسيقى والآلات', imageUrl: 'https://picsum.photos/seed/music-cat/100/100', subcategories: [] },
  { id: 'art-crafts', name: 'الفنون والحرف', imageUrl: 'https://picsum.photos/seed/art-cat/100/100', subcategories: [] },
  { id: 'industrial-scientific', name: 'صناعي وعلمي', imageUrl: 'https://picsum.photos/seed/industrial-cat/100/100', subcategories: [] }
];

const sampleReviews: Review[] = [
    { id: 'rev-1', author: 'أحمد محمود', rating: 5, comment: 'منتج رائع وجودة ممتازة!', createdAt: new Date('2023-10-15T10:00:00Z') },
    { id: 'rev-2', author: 'فاطمة علي', rating: 4, comment: 'جيد جدًا، لكن التوصيل تأخر قليلاً.', createdAt: new Date('2023-10-16T14:30:00Z') },
];

export const allProducts: Product[] = [
  // Electronics
  { id: 'prod-1', name: 'لابتوب برو 15 بوصة', description: 'أحدث لابتوب عالي الأداء للمحترفين والمبدعين. يتميز بشاشة مذهلة مقاس 15 بوصة وبطارية تدوم طوال اليوم.', price: 1999.99, categoryId: 'electronics', subcategoryId: 'laptops', stock: 15, variants: [{color: '#333333', imageUrls: ['https://picsum.photos/seed/prod1/600/600']}], reviews: sampleReviews },
  { id: 'prod-2', name: 'هاتف ذكي X', description: 'جرب المستقبل مع هاتف X الذكي، الذي يتميز بنظام كاميرا ثوري وأقوى شريحة في هاتف ذكي على الإطلاق.', price: 999.00, categoryId: 'electronics', subcategoryId: 'mobiles', stock: 30, variants: [{color: '#FFFFFF', imageUrls: ['https://picsum.photos/seed/prod2/600/600']}] },
  { id: 'prod-3', name: 'سماعات إلغاء الضوضاء', description: 'انغمس في الموسيقى مع سماعات رائدة في إلغاء الضوضاء وصوت عالي الدقة.', price: 349.99, salePrice: 299.99, categoryId: 'electronics', subcategoryId: 'audio', stock: 50, variants: [{color: '#000000', imageUrls: ['https://picsum.photos/seed/prod3/600/600']}], isBestOffer: true },

  // Fashion
  { id: 'prod-4', name: 'جاكيت جينز كلاسيك', description: 'جاكيت جينز خالد مصنوع من مواد فاخرة. مثالي لأي مناسبة غير رسمية.', price: 89.99, categoryId: 'fashion', subcategoryId: 'mens-fashion', stock: 100, variants: [{color: '#3A8DDE', imageUrls: ['https://picsum.photos/seed/prod4/600/600']}], sizes: ['S', 'M', 'L', 'XL'] },
  { id: 'prod-5', name: 'فستان صيفي فضفاض', description: 'ابقي أنيقة ومرتاحة مع هذا الفستان الصيفي الخفيف والأنيق. متوفر بألوان متعددة.', price: 59.50, categoryId: 'fashion', subcategoryId: 'womens-fashion', stock: 80, variants: [{color: '#FFC0CB', imageUrls: ['https://picsum.photos/seed/prod5/600/600']}], isFeatured: true },
  { id: 'prod-6', name: 'حذاء رياضي جلدي حضري', description: 'حذاء رياضي جلدي مريح وأنيق للارتداء اليومي. إضافة متعددة الاستخدامات لخزانة ملابسك.', price: 120.00, categoryId: 'fashion', subcategoryId: 'mens-fashion', stock: 120, variants: [{color: '#FFFFFF', imageUrls: ['https://picsum.photos/seed/prod6/600/600']}, {color: '#000000', imageUrls: ['https://picsum.photos/seed/prod6-black/600/600']}], isBestOffer: true },

  // Beauty & Personal Care
  { id: 'prod-7', name: 'سيروم فيتامين سي للوجه', description: 'أضيئي وجددي بشرتك مع هذا السيروم العضوي القوي بفيتامين سي.', price: 25.00, categoryId: 'beauty-personal-care', subcategoryId: 'skincare', stock: 200, variants: [{color: '#FFD700', imageUrls: ['https://picsum.photos/seed/prod7/600/600']}] },
  { id: 'prod-8', name: 'مرطب يومي مرطب', description: 'مرطب خفيف الوزن بمكونات طبيعية لجميع أنواع البشرة. يوفر ترطيبًا لمدة 24 ساعة.', price: 35.00, categoryId: 'beauty-personal-care', subcategoryId: 'skincare', stock: 150, variants: [{color: '#F0F8FF', imageUrls: ['https://picsum.photos/seed/prod8/600/600']}], isFeatured: true },
  { id: 'prod-9', name: 'فرشاة أسنان كهربائية سونيك', description: 'احصل على نظافة فائقة مع فرشاة الأسنان الكهربائية الصوتية ذات الجودة الاحترافية. تتضمن رأسين للفرشاة.', price: 79.99, categoryId: 'beauty-personal-care', stock: 60, variants: [{color: '#ADD8E6', imageUrls: ['https://picsum.photos/seed/prod9/600/600']}] },

  // Home & Kitchen
  { id: 'prod-10', name: 'آلة إسبرسو برو', description: 'كن باريستا بنفسك مع آلة الإسبريسو المنزلية ذات الجودة الاحترافية. تصنع أفضل أنواع اللاتيه والكابتشينو.', price: 499.99, categoryId: 'home-furniture', subcategoryId: 'furniture', stock: 25, variants: [{color: '#C0C0C0', imageUrls: ['https://picsum.photos/seed/prod10/600/600']}], isFeatured: true },
  { id: 'prod-11', name: 'طقم أواني طهي 10 قطع', description: 'قم بترقية مطبخك مع طقم أواني الطهي المتين وغير اللاصق. يتضمن جميع الأواني والمقالي الأساسية.', price: 149.99, categoryId: 'home-furniture', stock: 40, variants: [{color: '#4682B4', imageUrls: ['https://picsum.photos/seed/prod11/600/600']}] },
  { id: 'prod-12', name: 'مكنسة روبو-فاكيوم برو', description: 'حافظ على نظافة أرضياتك مع هذه المكنسة الكهربائية الروبوتية الذكية. متصلة بشبكة Wi-Fi وتشحن ذاتيًا.', price: 299.00, salePrice: 249.00, categoryId: 'home-appliances', stock: 35, variants: [{color: '#000000', imageUrls: ['https://picsum.photos/seed/prod12/600/600']}], isBestOffer: true },
];

export const allOrders: Order[] = [];

export const allCustomers: Customer[] = [];
