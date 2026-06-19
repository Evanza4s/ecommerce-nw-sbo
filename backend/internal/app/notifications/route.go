package notifications

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/db"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/middleware"
	"github.com/labstack/echo/v4"
)

func (h Handler) Route(g *echo.Group) {
	jwtMid := middleware.JWTMiddleware(db.GetManager())

	g.GET("", h.GetMyNotifications, jwtMid)
	g.GET("/unread-count", h.GetUnreadCount, jwtMid)
	g.PUT("/:id/read", h.MarkAsRead, jwtMid)
	g.PUT("/read-all", h.MarkAllAsRead, jwtMid)
}
