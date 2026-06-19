package schemas

// CreateAddress request for creating address
type CreateAddress struct {
	ReceiverName string  `json:"receiver_name" validate:"required"`
	PhoneNumber  string  `json:"phone_number" validate:"required"`
	ProvinceID   string  `json:"province_id" validate:"required"`
	Province     string  `json:"province" validate:"required"`
	CityID       string  `json:"city_id" validate:"required"`
	City         string  `json:"city" validate:"required"`
	DistrictID   string  `json:"district_id" validate:"required"`
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
	ProvinceID   string  `json:"province_id"`
	Province     string  `json:"province"`
	CityID       string  `json:"city_id"`
	City         string  `json:"city"`
	DistrictID   string  `json:"district_id"`
	District     string  `json:"district"`
	Village      string  `json:"village"`
	PostalCode   string  `json:"postal_code"`
	FullAddress  string  `json:"full_address"`
	AddressLabel string  `json:"address_label"`
	IsDefault    *bool   `json:"is_default"`
	Latitude     float64 `json:"latitude"`
	Longitude    float64 `json:"longitude"`
}
