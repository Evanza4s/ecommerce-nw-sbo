package schemas

import "github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"

// ============================================================
// REQUEST SCHEMAS FOR FAQ
// ============================================================

// GetAllPagination request for paginated FAQ list
type GetAllPagination struct {
	Question  string `json:"question" query:"question"`
	Answer    string `json:"answer" query:"answer"`
	SortOrder *int   `json:"sort_order" query:"sort_order"`
	IsActive  *bool  `json:"is_active" query:"is_active"`
	Page      int    `json:"page" query:"page" validate:"required,min=1"`
	PageSize  int    `json:"page_size" query:"page_size" validate:"required,min=1,max=100"`
}

// GetAll request for non-paginated FAQ list
type GetAll struct {
	Question  string `json:"question" query:"question"`
	Answer    string `json:"answer" query:"answer"`
	SortOrder *int   `json:"sort_order" query:"sort_order"`
	IsActive  *bool  `json:"is_active" query:"is_active"`
}

// FAQRequest for create/update FAQ
type FAQRequest struct {
	Question  string `json:"question" validate:"required"`
	Answer    string `json:"answer" validate:"required"`
	SortOrder int    `json:"sort_order"`
	IsActive  bool   `json:"is_active"`
}

// MapToFAQRequest maps request to model
func MapToFAQRequest(in *FAQRequest) model.MstFaq {
	return model.MstFaq{
		Question:  in.Question,
		Answer:    in.Answer,
		SortOrder: in.SortOrder,
		IsActive:  in.IsActive,
	}
}
