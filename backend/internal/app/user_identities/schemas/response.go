package schemas

import (
	"time"

	"github.com/google/uuid"
)

// IdentityResponse represents user identity data
type IdentityResponse struct {
	ID          uuid.UUID  `json:"id"`
	UserID      uuid.UUID  `json:"user_id"`
	FirstName   string     `json:"first_name,omitempty"`
	LastName    string     `json:"last_name,omitempty"`
	PhoneNumber string     `json:"phone_number,omitempty"`
	Gender      string     `json:"gender,omitempty"`
	BirthPlace  string     `json:"birth_place,omitempty"`
	BirthDate   *time.Time `json:"birth_date,omitempty"`
	AvatarURL   string     `json:"avatar_url,omitempty"`
}
