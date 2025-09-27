

export type Category = {
  id: string;
  name: string;
  imageId: string;
};

export type Review = {
  id: string;
  rating: number;
  comment: string;
  author: string;
  createdAt: Date;
};

export type ProductVariant = {
  color: string;
  imageUrls: string[];
};

export type Product = {
  id:string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  categoryId: string;
  stock: number;
  variants: ProductVariant[];
  sizes?: string[];
  isFeatured?: boolean;
  isBestOffer?: boolean;
  brand?: string;
  type?: string;
  material?: string;
  madeIn?: string;
  reviews?: Review[];
};

export type CartItem = {
  id: string;
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize?: string;
};

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  customerInfo: {
    name: string;
    email: string;
    address: string;
  };
  createdAt: Date;
  status: 'pending' | 'shipped' | 'delivered';
};

export type HomepageSettings = {
    heroTitle: string;
    heroSubtitle: string;
    heroImageUrl: string;
};

export type AboutPageSettings = {
    aboutTitle: string;
    aboutSubtitle: string;
    aboutHeroUrl: string;
    storyTitle: string;
    storyContent: string;
    missionTitle: string;
    missionContent: string;
    teamTitle: string;
    teamContent: string;
    journeyTitle: string;
    journeyContent: string;
};

export type Ad = {
  id: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
};

export type ContactInfoSettings = {
    email: string;
    phone: string;
    address: string;
};

