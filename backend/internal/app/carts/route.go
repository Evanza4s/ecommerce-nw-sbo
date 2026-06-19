package carts

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/db"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/middleware"
	"github.com/labstack/echo/v4"
)

func (h Handler) Route(g *echo.Group) {
	// All cart routes require authentication
	g.Use(middleware.JWTMiddleware(db.GetManager()))

	g.GET("", h.GetCart)
	g.DELETE("", h.ClearCart)
	
	g.POST("/items", h.AddToCart)
	g.PUT("/items/:id", h.UpdateCartItem)
	g.DELETE("/items/:id", h.RemoveCartItem)
}
