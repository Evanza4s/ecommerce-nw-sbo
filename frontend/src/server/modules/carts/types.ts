export interface CartItem {
  id: string;
  product_variant_id: string;
  quantity: number;
  product_name: string;
  color: string;
  size: string;
  variant_image: string;
  price: number;
  discount_price: number;
  subtotal: number;
  weight: number;
}

export interface Cart {
  id: string;
  user_id: string;
  total_items: number;
  total_price: number;
  items: CartItem[];
}
