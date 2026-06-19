package schemas

type MidtransNotificationRequest struct {
	TransactionTime   string `json:"transaction_time"`
	TransactionStatus string `json:"transaction_status"`
	TransactionID     string `json:"transaction_id"`
	StatusMessage     string `json:"status_message"`
	StatusCode        string `json:"status_code"`
	SignatureKey      string `json:"signature_key"`
	PaymentType       string `json:"payment_type"`
	OrderID           string `json:"order_id"`
	MerchantID        string `json:"merchant_id"`
	GrossAmount       string `json:"gross_amount"`
	FraudStatus       string `json:"fraud_status"`
}

type GetAllPagination struct {
	PaymentReference string `json:"payment_reference" query:"payment_reference" map:"payment_reference,omitempty"`
	PaymentStatus    string `json:"payment_status" query:"payment_status" map:"payment_status,omitempty"`
	OrderID          string `json:"order_id" query:"order_id" map:"order_id,omitempty"`
	Page             int    `json:"page" query:"page" validate:"required"`
	PageSize         int    `json:"page_size" query:"page_size" validate:"required"`
}
