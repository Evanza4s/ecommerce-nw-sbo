package schemas

import "github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"

// ============================================================
// REQUEST SCHEMAS FOR ROLES
// ============================================================

// GetAllPagination request for paginated roles list
type GetAllPagination struct {
	RoleName     string `json:"role_name" query:"role_name"`
	IsAdmin      *bool  `json:"is_admin" query:"is_admin"`
	IsSuperadmin *bool  `json:"is_superadmin" query:"is_superadmin"`
	Page         int    `json:"page" query:"page" validate:"required,min=1"`
	PageSize     int    `json:"page_size" query:"page_size" validate:"required,min=1,max=100"`
}

// GetAll request for non-paginated roles list
type GetAll struct {
	RoleName     string `json:"role_name" query:"role_name"`
	IsAdmin      *bool  `json:"is_admin" query:"is_admin"`
	IsSuperadmin *bool  `json:"is_superadmin" query:"is_superadmin"`
}

// RequestRoles for create/update role
type RequestRoles struct {
	RoleName     string `json:"role_name" validate:"required"`
	IsAdmin      bool   `json:"is_admin"`
	IsSuperadmin bool   `json:"is_superadmin"`
}

// MaptoRequestRoles maps request to model
func MaptoRequestRoles(in *RequestRoles) model.MstRoles {
	return model.MstRoles{
		RoleName:     in.RoleName,
		IsAdmin:      in.IsAdmin,
		IsSuperadmin: in.IsSuperadmin,
	}
}
