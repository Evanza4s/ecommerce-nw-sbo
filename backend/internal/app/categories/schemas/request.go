package schemas

import "github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"

// ============================================================
// REQUEST SCHEMAS FOR CATEGORY
// ============================================================

// GetAllPagination request for paginated category list
type GetAllPagination struct {
	Name     string `json:"name" query:"name"`
	Slug     string `json:"slug" query:"slug"`
	Icon     string `json:"icon" query:"icon"`
	IsActive *bool  `json:"is_active" query:"is_active"`
	Page     int    `json:"page" query:"page" validate:"required,min=1"`
	PageSize int    `json:"page_size" query:"page_size" validate:"required,min=1,max=100"`
}

// GetAll request for non-paginated category list
type GetAll struct {
	Name     string `json:"name" query:"name"`
	Slug     string `json:"slug" query:"slug"`
	Icon     string `json:"icon" query:"icon"`
	IsActive *bool  `json:"is_active" query:"is_active"`
}

// RequestCategory for create/update category
type RequestCategory struct {
	Name     string `json:"name" validate:"required"`
	Slug     string `json:"slug" validate:"required"`
	Icon     string `json:"icon"`
	IsActive bool   `json:"is_active"`
}

// MaptoRequestCategory maps request to model
func MaptoRequestCategory(in *RequestCategory) model.MstCategory {
	return model.MstCategory{
		Name:     in.Name,
		Slug:     in.Slug,
		Icon:     in.Icon,
		IsActive: in.IsActive,
	}
}
