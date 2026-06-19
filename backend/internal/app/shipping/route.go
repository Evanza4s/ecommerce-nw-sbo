package shipping

import (
	"github.com/labstack/echo/v4"
)

func (h Handler) Route(g *echo.Group) {
	g.POST("/rates", h.GetRates)
	g.GET("/get-all", h.GetAllPagination)
}
