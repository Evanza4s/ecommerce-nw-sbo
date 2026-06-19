package schemas

import "time"

type CreateVoucher struct {
	Code            string     `json:"code" validate:"required,min=3,max=50"`
	DiscountType    string     `json:"discount_type" validate:"required,oneof=Percentage Nominal"`
	DiscountValue   float64    `json:"discount_value" validate:"required,gt=0"`
	MinimumPurchase float64    `json:"minimum_purchase" validate:"gte=0"`
	MaxUsage        int        `json:"max_usage" validate:"required,min=1"`
	StartDate       *time.Time `json:"start_date"`
	EndDate         *time.Time `json:"end_date"`
	IsActive        *bool      `json:"is_active" validate:"required"`
}

type UpdateVoucher struct {
	DiscountType    string     `json:"discount_type" validate:"omitempty,oneof=Percentage Nominal"`
	DiscountValue   float64    `json:"discount_value" validate:"omitempty,gt=0"`
	MinimumPurchase float64    `json:"minimum_purchase" validate:"omitempty,gte=0"`
	MaxUsage        int        `json:"max_usage" validate:"omitempty,min=1"`
	StartDate       *time.Time `json:"start_date"`
	EndDate         *time.Time `json:"end_date"`
	IsActive        *bool      `json:"is_active"`
}

type GetAllPagination struct {
	Code     string `json:"code" query:"code"`
	Status   string `json:"status" query:"status"`
	Page     int    `json:"page" query:"page" validate:"required,min=1"`
	PageSize int    `json:"page_size" query:"page_size" validate:"required,min=1,max=100"`
}

type ValidateVoucherRequest struct {
	Code         string  `json:"code" validate:"required"`
	CartSubtotal float64 `json:"cart_subtotal" validate:"required,gt=0"`
}
