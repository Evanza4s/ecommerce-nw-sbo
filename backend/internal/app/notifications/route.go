package notifications

import (
	"github.com/labstack/echo/v4"
)

func (h Handler) Route(g *echo.Group) {

	g.GET("", h.GetMyNotifications)
	g.GET("/unread-count", h.GetUnreadCount)
	g.PUT("/:id/read", h.MarkAsRead)
	g.PUT("/read-all", h.MarkAllAsRead)
}
