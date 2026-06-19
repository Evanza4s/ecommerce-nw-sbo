export interface Voucher {
  id: string;
  code: string;
  discount_type: "Percentage" | "Nominal";
  discount_value: number;
  minimum_purchase: number;
  max_usage: number;
  used_count: number;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  status: "active" | "scheduled" | "expired" | "draft" | "inactive";
}

export interface CreateVoucherRequest {
  code: string;
  discount_type: "Percentage" | "Nominal";
  discount_value: number;
  minimum_purchase: number;
  max_usage: number;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
}

export interface UpdateVoucherRequest {
  discount_type?: "Percentage" | "Nominal";
  discount_value?: number;
  minimum_purchase?: number;
  max_usage?: number;
  start_date?: string | null;
  end_date?: string | null;
  is_active?: boolean;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  totalElements: number;
  totalPages: number;
}

export interface ValidateVoucherRequest {
  code: string;
  cart_subtotal: number;
}

export interface ValidateVoucherResponse {
  is_valid: boolean;
  discount_amount: number;
  voucher_code: string;
  message: string;
}
