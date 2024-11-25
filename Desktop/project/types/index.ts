export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export type CustomerStatus = "new" | "regular" | "vip";

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  orderCount: number;
  totalSpent: string;
  status: CustomerStatus;
  lastOrder: string;
  trend: "up" | "down";
  preferences: string[];
}

export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: string;
}

export interface Order {
  id: string;
  date: string;
  customer: {
    name: string;
    email: string;
  };
  items: OrderItem[];
  total: string;
  status: OrderStatus;
  shippingAddress: string;
}

export interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  description: string;
}