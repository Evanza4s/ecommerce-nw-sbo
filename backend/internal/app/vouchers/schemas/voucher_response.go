package schemas

import (
	"time"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
)

type VoucherResponse struct {
	ID              string     `json:"id"`
	Code            string     `json:"code"`
	DiscountType    string     `json:"discount_type"`
	DiscountValue   float64    `json:"discount_value"`
	MinimumPurchase float64    `json:"minimum_purchase"`
	MaxUsage        int        `json:"max_usage"`
	UsedCount       int        `json:"used_count"`
	StartDate       *time.Time `json:"start_date"`
	EndDate         *time.Time `json:"end_date"`
	IsActive        bool       `json:"is_active"`
	Status          string     `json:"status"` // Calculated field for frontend
}

func ToVoucherResponse(v model.MstVoucher) VoucherResponse {
	status := "draft"
	now := time.Now()

	if !v.IsActive {
		status = "inactive"
	} else if v.EndDate != nil && v.EndDate.Before(now) {
		status = "expired"
	} else if v.StartDate != nil && v.StartDate.After(now) {
		status = "scheduled"
	} else {
		status = "active"
	}

	return VoucherResponse{
		ID:              v.ID.String(),
		Code:            v.Code,
		DiscountType:    v.DiscountType,
		DiscountValue:   v.DiscountValue,
		MinimumPurchase: v.MinimumPurchase,
		MaxUsage:        v.MaxUsage,
		UsedCount:       v.UsedCount,
		StartDate:       v.StartDate,
		EndDate:         v.EndDate,
		IsActive:        v.IsActive,
		Status:          status,
	}
}

func ToVoucherResponses(vouchers []model.MstVoucher) []VoucherResponse {
	var responses []VoucherResponse
	for _, v := range vouchers {
		responses = append(responses, ToVoucherResponse(v))
	}
	return responses
}

type ValidateVoucherResponse struct {
	IsValid        bool    `json:"is_valid"`
	DiscountAmount float64 `json:"discount_amount"`
	VoucherCode    string  `json:"voucher_code"`
	Message        string  `json:"message"`
}
