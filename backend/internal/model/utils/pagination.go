package utils

import (
	"gorm.io/gorm"
)

// ============================================================
// PAGINATION TYPES
// ============================================================

// SortVal represents sort value type
type SortVal string

// PaginationDTO represents pagination request parameters
type PaginationDTO struct {
	Page     int `json:"page" query:"page" validate:"required,min=1"`
	PageSize int `json:"page_size" query:"page_size" validate:"required,min=1,max=100"`
}

// PaginationInfoDTO represents pagination metadata in response
type PaginationInfoDTO struct {
	Page       int   `json:"page"`
	PageSize   int   `json:"page_size"`
	Count      int64 `json:"total"`
	TotalPages int   `json:"total_pages"`
}

// UserInfo represents basic user information
type UserInfo struct {
	Id    uint
	Email string
}

// ============================================================
// PAGINATION CONSTANTS
// ============================================================

const (
	DefaultPage     = 1
	DefaultPageSize = 10
	MaxPageSize     = 100
)

// ============================================================
// PAGINATION FUNCTIONS
// ============================================================

// Paginate creates a pagination scope for GORM queries
func Paginate(data map[string]interface{}) (func(db *gorm.DB) *gorm.DB, *PaginationInfoDTO) {
	var PageDto PaginationInfoDTO

	return func(db *gorm.DB) *gorm.DB {
		page, ok := data["page"].(float64)
		if !ok || page < 1 {
			page = DefaultPage
		}

		pageSize, ok := data["page_size"].(float64)
		if !ok || pageSize < 1 {
			pageSize = DefaultPageSize
		}

		// Limit max page size
		if pageSize > MaxPageSize {
			pageSize = MaxPageSize
		}

		offset := int((page - 1) * pageSize)

		PageDto = PaginationInfoDTO{
			Page:     int(page),
			PageSize: int(pageSize),
		}

		return db.Offset(offset).Limit(PageDto.PageSize)
	}, &PageDto
}

// PaginateWithTotal creates a pagination scope with total count calculation
func PaginateWithTotal(page, pageSize int) (func(db *gorm.DB) *gorm.DB, *PaginationInfoDTO) {
	if page < 1 {
		page = DefaultPage
	}
	if pageSize < 1 || pageSize > MaxPageSize {
		pageSize = DefaultPageSize
	}

	info := &PaginationInfoDTO{
		Page:     page,
		PageSize: pageSize,
	}

	offset := (page - 1) * pageSize

	return func(db *gorm.DB) *gorm.DB {
		return db.Offset(offset).Limit(pageSize)
	}, info
}

// CalculateTotalPages calculates total pages based on count and page size
func CalculateTotalPages(count int64, pageSize int) int {
	if pageSize <= 0 {
		return 0
	}
	pages := int(count) / pageSize
	if int(count)%pageSize > 0 {
		pages++
	}
	return pages
}
