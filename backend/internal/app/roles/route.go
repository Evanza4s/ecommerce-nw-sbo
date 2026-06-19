package roles

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/db"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/middleware"
	"github.com/labstack/echo/v4"
)

func (h Handler) Route(g *echo.Group) {
	jwtMid := middleware.JWTMiddleware(db.GetManager())
	superadminMid := middleware.SuperadminOnly(db.GetManager())

	g.Use(jwtMid)

	g.GET("", h.GetAll)
	g.GET("/get-all", h.GetAllPagination)
	g.GET("/:id", h.GetByID)
	
	// Create, Update, Delete are protected by SuperadminOnly
	g.POST("", h.Create, superadminMid)
	g.PUT("/:id", h.Update, superadminMid)
	g.DELETE("/:id", h.Delete, superadminMid)
}
