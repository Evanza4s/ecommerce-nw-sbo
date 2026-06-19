package orders

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/db"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/middleware"
	"github.com/labstack/echo/v4"
)

func (h Handler) Route(g *echo.Group) {
	g.Use(middleware.JWTMiddleware(db.GetManager()))
	g.POST("/checkout", h.Checkout)
	g.GET("", h.GetAllOrders)
	g.GET("/my-orders", h.GetMyOrders)
	g.GET("/:id", h.GetOrderByID)
	g.GET("/:id/pay", h.GetSnapToken)
	g.GET("/revenue/stats", h.GetRevenueStats)
	g.PUT("/:id/status", h.UpdateOrderStatus)
}
