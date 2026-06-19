package categories

import "github.com/labstack/echo/v4"

func (h Handler) Route(g *echo.Group) {
	g.GET("", h.GetAll)
	g.GET("/get-all", h.GetAllPagination)
	g.GET("/:id", h.GetById)
	g.POST("", h.Create)
	g.PUT("/:id", h.Update)
	g.DELETE("/:id", h.Delete)
}
