package shipping

import (
	"github.com/labstack/echo/v4"
)

func (h Handler) Route(g *echo.Group) {
	g.POST("/rates", h.GetRates)
	g.GET("/get-all", h.GetAllPagination)
	g.GET("/provinces", h.GetProvinces)
	g.GET("/cities", h.GetCities)
	g.GET("/districts/:city_id", h.GetDistricts)
}
