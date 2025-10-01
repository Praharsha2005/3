export interface User {
  id: string;
  name: string;
  email: string;
  userType: 'student' | 'business';
  createdAt: Date;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  sellerId: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  userId: string;
}

export interface Collaboration {
  id: string;
  projectId: string;
  businessUserId: string;
  studentUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  message: string;
  createdAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
}