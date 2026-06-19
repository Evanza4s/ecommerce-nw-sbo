package model

import (
	"time"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
)

type TrxDailySales struct {
	utils.DefaultModel
	SalesDate     time.Time `json:"sales_date" gorm:"type:date;not null"`
	TotalOrder    int       `json:"total_order" gorm:"default:0"`
	TotalCustomer int       `json:"total_customer" gorm:"default:0"`
	TotalRevenue  float64   `json:"total_revenue" gorm:"type:numeric(18,2);default:0"`
	TotalRefund   float64   `json:"total_refund" gorm:"type:numeric(18,2);default:0"`
}

func (TrxDailySales) TableName() string {
	return "public.trx_daily_sales"
}
