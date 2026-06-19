package schemas

import (
	"time"

	address_schemas "github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/addresses/schemas"
	identity_schemas "github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/user_identities/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/google/uuid"
)

type UserResponse struct {
	ID          uuid.UUID  `json:"id"`
	Email       string     `json:"email"`
	Username    string     `json:"username"`
	Fullname    string     `json:"fullname"`
	RoleID      uuid.UUID  `json:"role_id"`
	RoleName    string     `json:"role_name,omitempty"`
	IsActive    bool       `json:"is_active"`
	IsVerified  bool       `json:"is_verified"`
	LastLoginAt *time.Time `json:"last_login_at,omitempty"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   *time.Time `json:"updated_at,omitempty"`
}

type UserDetailResponse struct {
	ID              uuid.UUID                          `json:"id"`
	Email           string                             `json:"email"`
	Username        string                             `json:"username"`
	Fullname        string                             `json:"fullname"`
	RoleID          uuid.UUID                          `json:"role_id"`
	Role            *RoleResponse                      `json:"role,omitempty"`
	IsActive        bool                               `json:"is_active"`
	IsVerified      bool                               `json:"is_verified"`
	LastLoginAt     *time.Time                         `json:"last_login_at,omitempty"`
	EmailVerifiedAt *time.Time                         `json:"email_verified_at,omitempty"`
	Identity        *identity_schemas.IdentityResponse `json:"identity,omitempty"`
	Addresses       []address_schemas.AddressResponse  `json:"addresses,omitempty"`
	CreatedAt       time.Time                          `json:"created_at"`
	UpdatedAt       *time.Time                         `json:"updated_at,omitempty"`
}

type RoleResponse struct {
	ID           uuid.UUID `json:"id"`
	RoleName     string    `json:"role_name"`
	IsAdmin      bool      `json:"is_admin"`
	IsSuperadmin bool      `json:"is_superadmin"`
}

type ProfileResponse struct {
	ID         uuid.UUID                          `json:"id"`
	Email      string                             `json:"email"`
	Username   string                             `json:"username"`
	Fullname   string                             `json:"fullname"`
	Role       *RoleResponse                      `json:"role,omitempty"`
	IsActive   bool                               `json:"is_active"`
	IsVerified bool                               `json:"is_verified"`
	Identity   *identity_schemas.IdentityResponse `json:"identity,omitempty"`
	Addresses  []address_schemas.AddressResponse  `json:"addresses,omitempty"`
	CreatedAt  time.Time                          `json:"created_at"`
}

func ToUserResponse(user model.MstUsers) UserResponse {
	response := UserResponse{
		ID:          user.ID,
		Email:       user.Email,
		Username:    user.Username,
		Fullname:    user.Fullname,
		RoleID:      user.RoleID,
		IsActive:    user.IsActive,
		IsVerified:  user.IsVerified,
		LastLoginAt: user.LastLoginAt,
		CreatedAt:   user.CreatedAt,
		UpdatedAt:   user.UpdatedAt,
	}

	if user.RoleRef != nil && user.RoleRef.ID != uuid.Nil {
		response.RoleName = user.RoleRef.RoleName
	}

	return response
}

func ToUserDetailResponse(user model.MstUsers) UserDetailResponse {
	response := UserDetailResponse{
		ID:              user.ID,
		Email:           user.Email,
		Username:        user.Username,
		Fullname:        user.Fullname,
		RoleID:          user.RoleID,
		IsActive:        user.IsActive,
		IsVerified:      user.IsVerified,
		LastLoginAt:     user.LastLoginAt,
		EmailVerifiedAt: user.EmailVerifiedAt,
		CreatedAt:       user.CreatedAt,
		UpdatedAt:       user.UpdatedAt,
	}

	if user.RoleRef != nil && user.RoleRef.ID != uuid.Nil {
		response.Role = &RoleResponse{
			ID:           user.RoleRef.ID,
			RoleName:     user.RoleRef.RoleName,
			IsAdmin:      user.RoleRef.IsAdmin,
			IsSuperadmin: user.RoleRef.IsSuperadmin,
		}
	}

	if user.Identity != nil && user.Identity.ID != uuid.Nil {
		response.Identity = &identity_schemas.IdentityResponse{
			ID:          user.Identity.ID,
			UserID:      user.Identity.UserID,
			FirstName:   user.Identity.FirstName,
			LastName:    user.Identity.LastName,
			PhoneNumber: user.Identity.PhoneNumber,
			Gender:      user.Identity.Gender,
			BirthPlace:  user.Identity.BirthPlace,
			BirthDate:   user.Identity.BirthDate,
			AvatarURL:   user.Identity.AvatarURL,
		}
	}

	if len(user.Addresses) > 0 {
		response.Addresses = make([]address_schemas.AddressResponse, 0, len(user.Addresses))
		for _, addr := range user.Addresses {
			response.Addresses = append(response.Addresses, address_schemas.AddressResponse{
				ID:           addr.ID,
				UserID:       addr.UserID,
				ReceiverName: addr.ReceiverName,
				PhoneNumber:  addr.PhoneNumber,
				Province:     addr.Province,
				City:         addr.City,
				District:     addr.District,
				Village:      addr.Village,
				PostalCode:   addr.PostalCode,
				FullAddress:  addr.FullAddress,
				AddressLabel: addr.AddressLabel,
				IsDefault:    addr.IsDefault,
				Latitude:     addr.Latitude,
				Longitude:    addr.Longitude,
			})
		}
	}

	return response
}

func ToProfileResponse(user model.MstUsers) ProfileResponse {
	response := ProfileResponse{
		ID:         user.ID,
		Email:      user.Email,
		Username:   user.Username,
		Fullname:   user.Fullname,
		IsActive:   user.IsActive,
		IsVerified: user.IsVerified,
		CreatedAt:  user.CreatedAt,
	}

	if user.RoleRef != nil && user.RoleRef.ID != uuid.Nil {
		response.Role = &RoleResponse{
			ID:           user.RoleRef.ID,
			RoleName:     user.RoleRef.RoleName,
			IsAdmin:      user.RoleRef.IsAdmin,
			IsSuperadmin: user.RoleRef.IsSuperadmin,
		}
	}

	if user.Identity != nil && user.Identity.ID != uuid.Nil {
		response.Identity = &identity_schemas.IdentityResponse{
			ID:          user.Identity.ID,
			UserID:      user.Identity.UserID,
			FirstName:   user.Identity.FirstName,
			LastName:    user.Identity.LastName,
			PhoneNumber: user.Identity.PhoneNumber,
			Gender:      user.Identity.Gender,
			BirthPlace:  user.Identity.BirthPlace,
			BirthDate:   user.Identity.BirthDate,
			AvatarURL:   user.Identity.AvatarURL,
		}
	}

	if len(user.Addresses) > 0 {
		response.Addresses = make([]address_schemas.AddressResponse, 0, len(user.Addresses))
		for _, addr := range user.Addresses {
			response.Addresses = append(response.Addresses, address_schemas.AddressResponse{
				ID:           addr.ID,
				UserID:       addr.UserID,
				ReceiverName: addr.ReceiverName,
				PhoneNumber:  addr.PhoneNumber,
				Province:     addr.Province,
				City:         addr.City,
				District:     addr.District,
				Village:      addr.Village,
				PostalCode:   addr.PostalCode,
				FullAddress:  addr.FullAddress,
				AddressLabel: addr.AddressLabel,
				IsDefault:    addr.IsDefault,
				Latitude:     addr.Latitude,
				Longitude:    addr.Longitude,
			})
		}
	}

	return response
}
