export interface FAQ {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FAQRequest {
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
}

export interface FAQListResponse {
  data: FAQ[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
