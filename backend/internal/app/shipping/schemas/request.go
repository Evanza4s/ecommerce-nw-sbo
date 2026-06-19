package schemas

type ShippingRatesRequest struct {
	Origin      string `json:"origin" validate:"required"` // City ID from rajaongkir
	Destination string `json:"destination" validate:"required"` // City ID from rajaongkir
	Weight      int    `json:"weight" validate:"required,min=1"` // in grams
	Courier     string `json:"courier" validate:"required"` // jne, pos, tiki
}

type GetAllPagination struct {
	Page           int    `query:"page" validate:"required"`
	PageSize       int    `query:"page_size" validate:"required"`
	TrackingNumber string `query:"tracking_number"`
	ShippingStatus string `query:"shipping_status"`
	OrderID        string `query:"order_id"`
}
