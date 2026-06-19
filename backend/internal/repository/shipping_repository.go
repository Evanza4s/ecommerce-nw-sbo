package repository

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
)

type ShippingRepository interface {
	GetAllPagination(limit, offset int, search string, status string) ([]model.MstShipping, int64, error)
}
