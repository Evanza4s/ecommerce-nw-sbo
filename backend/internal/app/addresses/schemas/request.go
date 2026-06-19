package schemas

// CreateAddress request for creating address
type CreateAddress struct {
	ReceiverName string  `json:"receiver_name" validate:"required"`
	PhoneNumber  string  `json:"phone_number" validate:"required"`
	Province     string  `json:"province" validate:"required"`
	City         string  `json:"city" validate:"required"`
	District     string  `json:"district" validate:"required"`
	Village      string  `json:"village"`
	PostalCode   string  `json:"postal_code" validate:"required"`
	FullAddress  string  `json:"full_address" validate:"required"`
	AddressLabel string  `json:"address_label"`
	IsDefault    bool    `json:"is_default"`
	Latitude     float64 `json:"latitude"`
	Longitude    float64 `json:"longitude"`
}

// UpdateAddress request for updating address
type UpdateAddress struct {
	ReceiverName string  `json:"receiver_name"`
	PhoneNumber  string  `json:"phone_number"`
	Province     string  `json:"province"`
	City         string  `json:"city"`
	District     string  `json:"district"`
	Village      string  `json:"village"`
	PostalCode   string  `json:"postal_code"`
	FullAddress  string  `json:"full_address"`
	AddressLabel string  `json:"address_label"`
	IsDefault    *bool   `json:"is_default"`
	Latitude     float64 `json:"latitude"`
	Longitude    float64 `json:"longitude"`
}
