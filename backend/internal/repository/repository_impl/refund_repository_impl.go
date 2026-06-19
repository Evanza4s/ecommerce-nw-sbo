package repository_impl

import (
	"errors"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/db"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type RefundRepositoryImpl struct {
	db *gorm.DB
}

func NewRefundRepositoryImpl() *RefundRepositoryImpl {
	return &RefundRepositoryImpl{db: db.GetManager()}
}

func (r RefundRepositoryImpl) CreateRefund(refund *model.TrxRefund) (*model.TrxRefund, error) {
	if err := r.db.Create(refund).Error; err != nil {
		return nil, err
	}
	return refund, nil
}

func (r RefundRepositoryImpl) FindRefundByID(id uuid.UUID) (*model.TrxRefund, error) {
	var refund model.TrxRefund
	if err := r.db.Preload("Evidences").Preload("UserRef").Where("id = ?", id).First(&refund).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, gorm.ErrRecordNotFound
		}
		return nil, err
	}
	return &refund, nil
}

func (r RefundRepositoryImpl) FindRefundsByUserID(userID uuid.UUID) ([]model.TrxRefund, error) {
	var refunds []model.TrxRefund
	if err := r.db.Preload("Evidences").Preload("UserRef").Where("user_id = ?", userID).Order("created_at desc").Find(&refunds).Error; err != nil {
		return nil, err
	}
	return refunds, nil
}

func (r RefundRepositoryImpl) FindAllRefunds(limit, offset int, search string, status string) ([]model.TrxRefund, int64, error) {
	var refunds []model.TrxRefund
	var total int64
	query := r.db.Model(&model.TrxRefund{}).
		Joins("LEFT JOIN mst_users ON trx_refund.user_id = mst_users.id")
	
	if search != "" {
		query = query.Where("trx_refund.refund_number ILIKE ? OR trx_refund.order_id::text ILIKE ? OR mst_users.fullname ILIKE ? OR mst_users.username ILIKE ?", 
			"%"+search+"%", "%"+search+"%", "%"+search+"%", "%"+search+"%")
	}

	if status != "" && status != "all" {
		query = query.Where("trx_refund.refund_status = ?", status)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := query.Preload("Evidences").Preload("UserRef").Order("trx_refund.created_at desc").Limit(limit).Offset(offset).Find(&refunds).Error; err != nil {
		return nil, 0, err
	}
	return refunds, total, nil
}

func (r RefundRepositoryImpl) UpdateRefundStatus(id uuid.UUID, status string) error {
	return r.db.Model(&model.TrxRefund{}).Where("id = ?", id).Update("refund_status", status).Error
}
