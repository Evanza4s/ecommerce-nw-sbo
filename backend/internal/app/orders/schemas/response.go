package schemas

type CheckoutResponse struct {
	OrderID     string `json:"order_id"`
	OrderNumber string `json:"order_number"`
	RedirectURL string `json:"redirect_url"` // Midtrans Snap URL
	SnapToken   string `json:"snap_token"`   // Midtrans Snap Token
}

type DailyRevenue struct {
	Label string  `json:"label"` // e.g. "Mon"
	Value float64 `json:"value"` // Revenue value (in millions for chart, or raw value)
}

type TopProduct struct {
	Name    string `json:"name"`
	Revenue string `json:"revenue"` // Formatted string, e.g. "Rp. 9.2 Juta"
}

type RevenueStatsResponse struct {
	RevenueData       []DailyRevenue `json:"revenue_data"`
	TopProducts       []TopProduct   `json:"top_products"`
	TotalRevenue      string         `json:"total_revenue"` // e.g. "Rp. 25.000.000"
	AverageOrderValue string         `json:"average_order_value"` // e.g. "Rp. 102.000"
	Growth            string         `json:"growth"` // e.g. "+18.4%"
}

