package repository

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/google/uuid"
)

type NotificationRepository interface {
	Save(data model.TrxNotification) (*model.TrxNotification, error)
	FindByUserID(userID uuid.UUID) ([]model.TrxNotification, error)
	GetUnreadCount(userID uuid.UUID) (int64, error)
	MarkAsRead(id uuid.UUID) error
	MarkAllAsRead(userID uuid.UUID) error
}
