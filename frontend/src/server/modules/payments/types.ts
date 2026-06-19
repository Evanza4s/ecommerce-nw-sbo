export interface Payment {
  id: string;
  order_id: string;
  payment_provider_id?: string | null;
  payment_method_id?: string | null;
  payment_reference: string;
  amount: number;
  payment_status: string;
  paid_at?: string | null;
  created_at: string;
  updated_at: string;
  OrderRef?: any;
  ProviderRef?: any;
  MethodRef?: any;
}
