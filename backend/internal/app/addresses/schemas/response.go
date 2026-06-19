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
	Province     string     `json:"province"`
	City         string     `json:"city"`
	District     string     `json:"district"`
	Village      string     `json:"village,omitempty"`
	PostalCode   string     `json:"postal_code"`
	FullAddress  string     `json:"full_address"`
	AddressLabel string     `json:"address_label,omitempty"`
	IsDefault    bool       `json:"is_default"`
	Latitude     float64    `json:"latitude,omitempty"`
	Longitude    float64    `json:"longitude,omitempty"`
}
