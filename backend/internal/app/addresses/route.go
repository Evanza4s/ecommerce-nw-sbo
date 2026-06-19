package addresses

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/db"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/middleware"
	"github.com/labstack/echo/v4"
)

func (h Handler) Route(g *echo.Group) {
	jwtMid := middleware.JWTMiddleware(db.GetManager())
	g.GET("/:id/addresses", h.GetAddresses, jwtMid)
	g.GET("/:id/addresses/:address_id", h.GetAddressByID, jwtMid)
	g.POST("/:id/addresses", h.CreateAddress, jwtMid)
	g.PUT("/:id/addresses/:address_id", h.UpdateAddress, jwtMid)
	g.DELETE("/:id/addresses/:address_id", h.DeleteAddress, jwtMid)
	g.PUT("/:id/addresses/:address_id/default", h.SetDefaultAddress, jwtMid)
}
