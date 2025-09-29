

export type SubCategory = {
  id: string;
  name: string;
};

export type Category = {
  id: string;
  name: string;
  imageUrl: string;
  parentId?: string; // ID of the parent category
  subcategories?: SubCategory[];
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
  salePrice?: number | null;
  stock: number;
  variants: ProductVariant[];
  sizes?: string[];
  isFeatured?: boolean;
  isBestOffer?: boolean;
  isBestSeller?: boolean;
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
  selectedColor?: string;
  selectedSize?: string;
};

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: {
    governorate: string;
    address: string;
    city: string;
    zip: string;
    country: string;
  };
  items: {
    productName: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  shippingCost: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'cod';
  createdAt: Date;
};

export type Customer = {
    id: string;
    name: string;
    email: string;
    photoURL: string;
    joinedAt: Date;
}

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
  description?: string;
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

export type SocialMediaSettings = {
    facebookUrl: string;
    instagramUrl: string;
    tiktokUrl: string;
};

export type ShippingRate = {
    id: string;
    governorate: string;
    cost: number;
};
