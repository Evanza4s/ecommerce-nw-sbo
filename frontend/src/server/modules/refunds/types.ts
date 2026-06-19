import { AuthResponse } from '../auth/types';

export interface RefundRequest {
  order_id: string;
  reason: string;
  evidence_url?: string;
}

export interface Refund {
  id: string;
  order_id: string;
  refund_number: string;
  refund_status: string;
  reason: string;
  refund_amount: number;
  customer_name: string;
  evidence_url?: string;
  created_at: string;
}
