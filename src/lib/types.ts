
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
  imageIds: string[];
  stock: number;
};

export type CartItem = {
  id: string;
  product: Product;
  quantity: number;
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
