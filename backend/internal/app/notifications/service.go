package notifications

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/notifications/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/google/uuid"
)

type Service interface {
	CreateNotification(userID uuid.UUID, title, message, notifType string) error
	GetMyNotifications(jwtPayload *model.JwtPayload) ([]schemas.NotificationResponse, error)
	GetUnreadCount(jwtPayload *model.JwtPayload) (schemas.NotificationUnreadCount, error)
	MarkAsRead(jwtPayload *model.JwtPayload, id uuid.UUID) error
	MarkAllAsRead(jwtPayload *model.JwtPayload) error
}
