import type { Product, Category } from './types';

export const allCategories: Category[] = [
  { id: 'electronics', name: 'الإلكترونيات', imageId: 'electronics-cat' },
  { id: 'fashion', name: 'الموضة', imageId: 'fashion-cat' },
  { id: 'beauty-personal-care', name: 'الجمال والعناية الشخصية', imageId: 'beauty-cat' },
  { id: 'home-furniture', name: 'المنزل والأثاث', imageId: 'home-kitchen-cat' },
  { id: 'home-appliances', name: 'الأجهزة المنزلية', imageId: 'product-12' },
  { id: 'sports-outdoors', name: 'الرياضة والهواء الطلق', imageId: 'sports-cat' },
  { id: 'toys-kids', name: 'الألعاب والأطفال', imageId: 'toys-cat' },
  { id: 'books-stationery', name: 'الكتب والأدوات المكتبية', imageId: 'books-cat' },
  { id: 'grocery-food', name: 'البقالة والأطعمة', imageId: 'grocery-cat' },
  { id: 'handmade', name: 'الأعمال اليدوية', imageId: 'product-21' },
  { id: 'used', name: 'المستعمل', imageId: 'product-22' },
  { id: 'cars-parts', name: 'السيارات وقطع الغيار', imageId: 'vehicles-cat' },
  { id: 'pet-supplies', name: 'مستلزمات الحيوانات الأليفة', imageId: 'product-16' }
];

export const allProducts: Product[] = [
  // Electronics
  { id: 'prod-1', name: 'لابتوب برو 15 بوصة', description: 'أحدث لابتوب عالي الأداء للمحترفين والمبدعين. يتميز بشاشة مذهلة مقاس 15 بوصة وبطارية تدوم طوال اليوم.', price: 1999.99, categoryId: 'electronics', imageIds: ['product-1'], stock: 15 },
  { id: 'prod-2', name: 'هاتف ذكي X', description: 'جرب المستقبل مع هاتف X الذكي، الذي يتميز بنظام كاميرا ثوري وأقوى شريحة في هاتف ذكي على الإطلاق.', price: 999.00, categoryId: 'electronics', imageIds: ['product-2'], stock: 30 },
  { id: 'prod-3', name: 'سماعات إلغاء الضوضاء', description: 'انغمس في الموسيقى مع سماعات رائدة في إلغاء الضوضاء وصوت عالي الدقة.', price: 349.99, categoryId: 'electronics', imageIds: ['product-3'], stock: 50 },

  // Fashion
  { id: 'prod-4', name: 'جاكيت جينز كلاسيك', description: 'جاكيت جينز خالد مصنوع من مواد فاخرة. مثالي لأي مناسبة غير رسمية.', price: 89.99, categoryId: 'fashion', imageIds: ['product-4'], stock: 100 },
  { id: 'prod-5', name: 'فستان صيفي فضفاض', description: 'ابقي أنيقة ومرتاحة مع هذا الفستان الصيفي الخفيف والأنيق. متوفر بألوان متعددة.', price: 59.50, categoryId: 'fashion', imageIds: ['product-5'], stock: 80 },
  { id: 'prod-6', name: 'حذاء رياضي جلدي حضري', description: 'حذاء رياضي جلدي مريح وأنيق للارتداء اليومي. إضافة متعددة الاستخدامات لخزانة ملابسك.', price: 120.00, categoryId: 'fashion', imageIds: ['product-6'], stock: 120 },

  // Beauty & Personal Care
  { id: 'prod-7', name: 'سيروم فيتامين سي للوجه', description: 'أضيئي وجددي بشرتك مع هذا السيروم العضوي القوي بفيتامين سي.', price: 25.00, categoryId: 'beauty-personal-care', imageIds: ['product-7'], stock: 200 },
  { id: 'prod-8', name: 'مرطب يومي مرطب', description: 'مرطب خفيف الوزن بمكونات طبيعية لجميع أنواع البشرة. يوفر ترطيبًا لمدة 24 ساعة.', price: 35.00, categoryId: 'beauty-personal-care', imageIds: ['product-8'], stock: 150 },
  { id: 'prod-9', name: 'فرشاة أسنان كهربائية سونيك', description: 'احصل على نظافة فائقة مع فرشاة الأسنان الكهربائية الصوتية ذات الجودة الاحترافية. تتضمن رأسين للفرشاة.', price: 79.99, categoryId: 'beauty-personal-care', imageIds: ['product-9'], stock: 60 },

  // Home & Kitchen
  { id: 'prod-10', name: 'آلة إسبرسو برو', description: 'كن باريستا بنفسك مع آلة الإسبريسو المنزلية ذات الجودة الاحترافية. تصنع أفضل أنواع اللاتيه والكابتشينو.', price: 499.99, categoryId: 'home-furniture', imageIds: ['product-10'], stock: 25 },
  { id: 'prod-11', name: 'طقم أواني طهي 10 قطع', description: 'قم بترقية مطبخك مع طقم أواني الطهي المتين وغير اللاصق. يتضمن جميع الأواني والمقالي الأساسية.', price: 149.99, categoryId: 'home-furniture', imageIds: ['product-11'], stock: 40 },
  { id: 'prod-12', name: 'مكنسة روبو-فاكيوم برو', description: 'حافظ على نظافة أرضياتك مع هذه المكنسة الكهربائية الروبوتية الذكية. متصلة بشبكة Wi-Fi وتشحن ذاتيًا.', price: 299.00, categoryId: 'home-appliances', imageIds: ['product-12'], stock: 35 },

  // Grocery
  { id: 'prod-13', name: 'تفاح جالا عضوي', description: 'كيس من تفاح جالا العضوي الهش والحلو. مثالي للوجبات الخفيفة أو الخبز. (2 رطل)', price: 5.99, categoryId: 'grocery-food', imageIds: ['product-13'], stock: 300 },
  { id: 'prod-14', name: 'رغيف خبز العجين المخمر الحرفي', description: 'خبز العجين المخمر الحرفي المخبوز طازجًا مع قشرة مقرمشة وداخل طري ومطاطي.', price: 7.50, categoryId: 'grocery-food', imageIds: ['product-14'], stock: 100 },
  { id: 'prod-15', name: 'زيت زيتون بكر ممتاز', description: 'زيت زيتون بكر ممتاز معصور على البارد من إيطاليا. مثالي للصلصات والطبخ. (500 مل)', price: 15.99, categoryId: 'grocery-food', imageIds: ['product-15'], stock: 180 },

  // Health & Sports
  { id: 'prod-16', name: 'طقم دمبل قابل للتعديل', description: 'طقم دمبل قابل للتعديل موفر للمساحة، مثالي لصالة الألعاب الرياضية المنزلية. يتراوح من 5 إلى 52.5 رطلاً.', price: 399.00, categoryId: 'sports-outdoors', imageIds: ['product-16'], stock: 30 },
  { id: 'prod-17', name: 'سجادة يوجا صديقة للبيئة', description: 'سجادة يوجا عالية الجودة وغير قابلة للانزلاق وصديقة للبيئة لممارستك اليومية.', price: 45.00, categoryId: 'sports-outdoors', imageIds: ['product-17'], stock: 90 },
  { id: 'prod-18', name: 'فيتامينات متعددة يومية', description: 'فيتامينات متعددة يومية كاملة لدعم الصحة والعافية بشكل عام. (90 قرصًا)', price: 19.99, categoryId: 'sports-outdoors', imageIds: ['product-18'], stock: 250 },

  // Toys & Hobbies
  { id: 'prod-19', name: 'طقم قطار خشبي كلاسيكي', description: 'طقم قطار خشبي مصنوع بشكل جميل يشجع على اللعب التخيلي. (52 قطعة)', price: 65.00, categoryId: 'toys-kids', imageIds: ['product-19'], stock: 70 },
  { id: 'prod-20', name: 'نموذج سيارة خبير مبدع', description: 'تجربة بناء صعبة ومجزية. هذه المجموعة المبدعة هي نسخة طبق الأصل مفصلة لسيارة كلاسيكية.', price: 149.99, categoryId: 'toys-kids', imageIds: ['product-20'], stock: 40 },
  { id: 'prod-21', name: 'دمية دب محبوبة', description: 'دمية دب ناعمة ومحبوبة مقاس 18 بوصة، الرفيق المثالي لجميع الأعمار.', price: 24.99, categoryId: 'toys-kids', imageIds: ['product-21'], stock: 150 },

  // Books & Stationery
  { id: 'prod-22', name: 'مكتبة منتصف الليل', description: 'رواية الأكثر مبيعًا لمات هيغ. قصة جميلة عن الخيارات والندم وما يجعل الحياة مرضية حقًا.', price: 16.99, categoryId: 'books-stationery', imageIds: ['product-22'], stock: 120 },
  { id: 'prod-23', name: 'طقم أقلام جل - 48 لونًا', description: 'أطلق العنان لإبداعك مع هذه المجموعة المكونة من 48 قلم جل نابض بالحياة وسلس الكتابة.', price: 19.99, categoryId: 'books-stationery', imageIds: ['product-23'], stock: 200 },
  { id: 'prod-24', name: 'مخطط جلدي 2024', description: 'ابق منظمًا مع هذا المخطط الأنيق المغلف بالجلد. يتميز بعروض يومية وأسبوعية وشهرية.', price: 29.99, categoryId: 'books-stationery', imageIds: ['product-24'], stock: 90 },

  // Vehicles & Accessories
  { id: 'prod-25', name: 'طقم العناية بالسيارة المثالي', description: 'كل ما تحتاجه للحفاظ على مظهر سيارتك جديدًا تمامًا. يشمل الشمع والصابون وملمع الإطارات ومناشف الألياف الدقيقة.', price: 55.00, categoryId: 'cars-parts', imageIds: ['product-25'], stock: 60 },
  { id: 'prod-26', name: 'خوذة دراجة نارية خفية', description: 'خوذة دراجة نارية كاملة الوجه معتمدة من DOT مع لمسة نهائية سوداء غير لامعة وتهوية متقدمة.', price: 180.00, categoryId: 'cars-parts', imageIds: ['product-26'], stock: 45 },
  { id: 'prod-27', name: 'ملاح GPS رقمي', description: 'لا تضل طريقك مرة أخرى مع ملاح GPS بشاشة تعمل باللمس مقاس 7 بوصات مع تحديثات خرائط مدى الحياة.', price: 129.99, categoryId: 'cars-parts', imageIds: ['product-27'], stock: 55 },
];
