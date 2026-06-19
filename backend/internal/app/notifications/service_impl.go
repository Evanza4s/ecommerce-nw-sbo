package notifications

import (
	"errors"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/notifications/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/repository"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/repository/repository_impl"
	"github.com/google/uuid"
)

type serviceImpl struct {
	repo repository.NotificationRepository
}

func NewService() Service {
	return &serviceImpl{repo: repository_impl.NewNotificationRepositoryImpl()}
}

func (s *serviceImpl) CreateNotification(userID uuid.UUID, title, message, notifType string) error {
	notif := model.TrxNotification{
		UserID:  userID,
		Title:   title,
		Message: message,
		Type:    notifType,
		IsRead:  false,
	}
	_, err := s.repo.Save(notif)
	return err
}

func (s *serviceImpl) GetMyNotifications(jwtPayload *model.JwtPayload) ([]schemas.NotificationResponse, error) {
	if jwtPayload == nil {
		return nil, errors.New("unauthorized")
	}
	notifs, err := s.repo.FindByUserID(jwtPayload.UserID)
	if err != nil {
		return nil, err
	}
	return schemas.MapToNotificationResponses(notifs), nil
}

func (s *serviceImpl) GetUnreadCount(jwtPayload *model.JwtPayload) (schemas.NotificationUnreadCount, error) {
	if jwtPayload == nil {
		return schemas.NotificationUnreadCount{UnreadCount: 0}, errors.New("unauthorized")
	}
	count, err := s.repo.GetUnreadCount(jwtPayload.UserID)
	if err != nil {
		return schemas.NotificationUnreadCount{UnreadCount: 0}, err
	}
	return schemas.NotificationUnreadCount{UnreadCount: count}, nil
}

func (s *serviceImpl) MarkAsRead(jwtPayload *model.JwtPayload, id uuid.UUID) error {
	if jwtPayload == nil {
		return errors.New("unauthorized")
	}
	if id == uuid.Nil {
		return errors.New("invalid notification id")
	}
	return s.repo.MarkAsRead(id)
}

func (s *serviceImpl) MarkAllAsRead(jwtPayload *model.JwtPayload) error {
	if jwtPayload == nil {
		return errors.New("unauthorized")
	}
	return s.repo.MarkAllAsRead(jwtPayload.UserID)
}
