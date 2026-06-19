package schemas

type CheckoutResponse struct {
	OrderID     string `json:"order_id"`
	OrderNumber string `json:"order_number"`
	RedirectURL string `json:"redirect_url"` // Midtrans Snap URL
	SnapToken   string `json:"snap_token"`   // Midtrans Snap Token
}
