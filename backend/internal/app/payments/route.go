package payments

import (
	"github.com/labstack/echo/v4"
)

func (h Handler) Route(g *echo.Group) {
	g.POST("/webhook", h.MidtransWebhook)
	g.GET("/get-all", h.GetAllPagination)
}
