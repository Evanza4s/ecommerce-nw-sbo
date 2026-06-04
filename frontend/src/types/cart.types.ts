export interface CartItem {
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

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  promoCode?: string;
  total: number;
}

export interface PromoCode {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  expiresAt: string;
}
