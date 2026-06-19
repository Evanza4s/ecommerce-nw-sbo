package schemas

import (
	"time"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/google/uuid"
)

type NotificationResponse struct {
	ID        uuid.UUID `json:"id"`
	Title     string    `json:"title"`
	Message   string    `json:"message"`
	Type      string    `json:"type"`
	IsRead    bool      `json:"is_read"`
	CreatedAt time.Time `json:"created_at"`
}

type NotificationUnreadCount struct {
	UnreadCount int64 `json:"unread_count"`
}

func MapToNotificationResponse(in model.TrxNotification) NotificationResponse {
	return NotificationResponse{
		ID:        in.ID,
		Title:     in.Title,
		Message:   in.Message,
		Type:      in.Type,
		IsRead:    in.IsRead,
		CreatedAt: in.CreatedAt,
	}
}

func MapToNotificationResponses(in []model.TrxNotification) []NotificationResponse {
	out := make([]NotificationResponse, len(in))
	for i, v := range in {
		out[i] = MapToNotificationResponse(v)
	}
	return out
}
