package schemas

// UpdateIdentity request for updating user identity
type UpdateIdentity struct {
	FirstName   string `json:"first_name"`
	LastName    string `json:"last_name"`
	PhoneNumber string `json:"phone_number"`
	Gender      string `json:"gender"`
	BirthPlace  string `json:"birth_place"`
	BirthDate   string `json:"birth_date"`
	AvatarURL   string `json:"avatar_url"`
}
