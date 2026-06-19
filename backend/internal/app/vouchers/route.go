package vouchers

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/db"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/middleware"
	"github.com/labstack/echo/v4"
)

func (h Handler) Route(g *echo.Group) {
	admin := g.Group("")
	admin.Use(middleware.JWTMiddleware(db.GetManager()))
	admin.Use(middleware.AdminOnly(db.GetManager()))

	admin.GET("", h.GetAllWithoutPagination)
	admin.GET("/get-all", h.GetAll)
	admin.GET("/:id", h.GetByID)
	admin.POST("", h.Create)
	admin.PUT("/:id", h.Update)
	admin.DELETE("/:id", h.Delete)
	
	public := g.Group("")
	public.Use(middleware.JWTMiddleware(db.GetManager()))
	public.POST("/validate", h.ValidateVoucher)
}
