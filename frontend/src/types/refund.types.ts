export type RefundStatus = 
  | 'pending'
  | 'processing'
  | 'approved'
  | 'rejected'
  | 'completed';

export type RefundReason = 
  | 'defective'
  | 'wrong_item'
  | 'not_as_described'
  | 'damaged'
  | 'changed_mind'
  | 'other';

export interface RefundItem {
  orderItemId: string;
  product: {
    name: string;
    image: string;
  };
  quantity: number;
  reason: RefundReason;
  description: string;
}

export interface RefundRequest {
  id: string;
  orderId: string;
  userId: string;
  items: RefundItem[];
  status: RefundStatus;
  totalRefund: number;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  evidenceImages?: string[];
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}
