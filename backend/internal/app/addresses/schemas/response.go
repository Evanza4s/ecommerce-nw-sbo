package schemas

import (
	"github.com/google/uuid"
)

// AddressResponse represents address data in response
type AddressResponse struct {
	ID           uuid.UUID  `json:"id"`
	UserID       uuid.UUID  `json:"user_id"`
	ReceiverName string     `json:"receiver_name"`
	PhoneNumber  string     `json:"phone_number"`
	ProvinceID   string     `json:"province_id"`
	Province     string     `json:"province"`
	CityID       string     `json:"city_id"`
	City         string     `json:"city"`
	DistrictID   string     `json:"district_id"`
	District     string     `json:"district"`
	Village      string     `json:"village,omitempty"`
	PostalCode   string     `json:"postal_code"`
	FullAddress  string     `json:"full_address"`
	AddressLabel string     `json:"address_label,omitempty"`
	IsDefault    bool       `json:"is_default"`
	Latitude     float64    `json:"latitude,omitempty"`
	Longitude    float64    `json:"longitude,omitempty"`
}
