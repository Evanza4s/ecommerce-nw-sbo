export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded';

export interface OrderItem {
  id: string;
  productId: string;
  product: {
    name: string;
    price: number;
    image: string;
  };
  size: string;
  color: string;
  quantity: number;
  subtotal: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  shippingMethod: string;
  shippingCost: number;
  subtotal: number;
  discount: number;
  promoCode?: string;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrackingEvent {
  status: string;
  description: string;
  location: string;
  timestamp: string;
  completed: boolean;
}

export interface OrderSummaryProps {
  showAction?: boolean;
  showHelp?: boolean;
}

export interface OrderStatusProps {
  status: OrderStatus | string;
  className?: string;
}