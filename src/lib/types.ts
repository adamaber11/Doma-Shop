
export type Category = {
  id: string;
  name: string;
  imageId: string;
};

export type ProductVariant = {
  color: string;
  imageUrls: string[];
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stock: number;
  variants: ProductVariant[];
  sizes?: string[];
  isFeatured?: boolean;
  isBestOffer?: boolean;
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
