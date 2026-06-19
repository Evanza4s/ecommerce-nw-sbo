package schemas

type CreateRefundRequest struct {
	OrderID     string `json:"order_id" validate:"required,uuid"`
	Reason      string `json:"reason" validate:"required"`
	EvidenceURL string `json:"evidence_url"`
}

type RefundResponse struct {
	ID           string  `json:"id"`
	OrderID      string  `json:"order_id"`
	RefundNumber string  `json:"refund_number"`
	RefundStatus string  `json:"refund_status"`
	Reason       string  `json:"reason"`
	RefundAmount float64 `json:"refund_amount"`
	CustomerName string  `json:"customer_name"`
	EvidenceURL  string  `json:"evidence_url"`
	CreatedAt    string  `json:"created_at"`
}

type UpdateRefundStatusRequest struct {
	RefundStatus string `json:"refund_status" validate:"required"`
	AdminNotes   string `json:"admin_notes"`
}

type GetAllPagination struct {
	Page         int    `query:"page" validate:"required"`
	PageSize     int    `query:"page_size" validate:"required"`
	Search       string `query:"search"`
	RefundStatus string `query:"status"`
}
