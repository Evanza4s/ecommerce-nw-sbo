package repository

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/google/uuid"
)

type RefundRepository interface {
	CreateRefund(refund *model.TrxRefund) (*model.TrxRefund, error)
	FindRefundByID(id uuid.UUID) (*model.TrxRefund, error)
	FindRefundsByUserID(userID uuid.UUID) ([]model.TrxRefund, error)
	FindAllRefunds(limit, offset int, search string, status string) ([]model.TrxRefund, int64, error)
	UpdateRefundStatus(id uuid.UUID, status string) error
}
