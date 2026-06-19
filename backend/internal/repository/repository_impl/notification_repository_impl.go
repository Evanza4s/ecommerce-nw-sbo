package repository_impl

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/db"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type NotificationRepositoryImpl struct {
	db *gorm.DB
}

func NewNotificationRepositoryImpl() *NotificationRepositoryImpl {
	return &NotificationRepositoryImpl{db: db.GetManager()}
}

func (r *NotificationRepositoryImpl) Save(data model.TrxNotification) (*model.TrxNotification, error) {
	if err := r.db.Create(&data).Error; err != nil {
		return nil, err
	}
	return &data, nil
}

func (r *NotificationRepositoryImpl) FindByUserID(userID uuid.UUID) ([]model.TrxNotification, error) {
	var notifications []model.TrxNotification
	err := r.db.Where("user_id = ?", userID).Order("created_at desc").Find(&notifications).Error
	return notifications, err
}

func (r *NotificationRepositoryImpl) GetUnreadCount(userID uuid.UUID) (int64, error) {
	var count int64
	err := r.db.Model(&model.TrxNotification{}).Where("user_id = ? AND is_read = ?", userID, false).Count(&count).Error
	return count, err
}

func (r *NotificationRepositoryImpl) MarkAsRead(id uuid.UUID) error {
	return r.db.Model(&model.TrxNotification{}).Where("id = ?", id).Update("is_read", true).Error
}

func (r *NotificationRepositoryImpl) MarkAllAsRead(userID uuid.UUID) error {
	return r.db.Model(&model.TrxNotification{}).Where("user_id = ? AND is_read = ?", userID, false).Update("is_read", true).Error
}
