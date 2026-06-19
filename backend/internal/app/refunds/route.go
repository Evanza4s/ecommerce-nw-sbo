package refunds

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/db"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/middleware"
	"github.com/labstack/echo/v4"
)

func (h Handler) Route(g *echo.Group) {
	jwtMid := middleware.JWTMiddleware(db.GetManager())
	adminMid := middleware.AdminOnly(db.GetManager())
	g.POST("", h.Create, jwtMid)
	g.GET("", h.GetAll, jwtMid)
	g.GET("/:id", h.GetByID, jwtMid)
	g.PUT("/:id/status", h.UpdateStatus, jwtMid, adminMid)
}
