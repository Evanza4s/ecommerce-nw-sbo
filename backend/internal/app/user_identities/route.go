package user_identities

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/db"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/middleware"
	"github.com/labstack/echo/v4"
)

// Route registers user identity routes
func (h Handler) Route(g *echo.Group) {
	jwtMid := middleware.JWTMiddleware(db.GetManager())
	g.GET("/:id/identity", h.GetIdentity, jwtMid)
	g.PUT("/:id/identity", h.UpdateIdentity, jwtMid)
	g.POST("/:id/avatar", h.UploadAvatar, jwtMid)
	g.DELETE("/:id/avatar", h.DeleteAvatar, jwtMid)
}
