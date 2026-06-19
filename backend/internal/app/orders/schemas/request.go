package schemas

type CheckoutRequest struct {
	AddressID       string `json:"address_id" validate:"required,uuid"`
	Courier         string `json:"courier" validate:"required"` // e.g., jne, pos, tiki
	ShippingService string `json:"shipping_service" validate:"required"` // e.g., REG, OKE
	VoucherCode     string `json:"voucher_code" validate:"omitempty"`
}

type UpdateOrderStatusRequest struct {
	OrderStatus    string `json:"order_status" validate:"omitempty"`
	PaymentStatus  string `json:"payment_status" validate:"omitempty"`
	ShippingStatus string `json:"shipping_status" validate:"omitempty"`
	TrackingNumber string `json:"tracking_number" validate:"omitempty"`
}
