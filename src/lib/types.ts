
export type Category = {
  id: string;
  name: string;
  imageId: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrls: string[];
  stock: number;
  isFeatured?: boolean;
  isBestOffer?: boolean;
  colors?: string[];
  sizes?: string[];
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
