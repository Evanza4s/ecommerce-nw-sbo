package categories

import (
	"fmt"
	"net/http"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/categories/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/res"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

type Handler struct {
	service Service
}

func NewCategoryHandler() *Handler {
	return &Handler{
		service: NewServiceImpl(),
	}
}

// @Summary GET Category All
// @Description Get all categories with pagination
// @Tags Category
// @Accept json
// @Produce json
// @Param name query string false "name Category"
// @Param slug query string false "slug Category"
// @Param icon query string false "icon Category"
// @Param is_active query bool false "is_active Category"
// @Param page query int true "page" default(1)
// @Param page_size query int true "page size" default(10)
// @Success 200 {object} res.ResponsePageConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /categories/get-all [get]
func (h Handler) GetAllPagination(c echo.Context) (err error) {
	req := new(schemas.GetAllPagination)
	if err := c.Bind(req); err != nil {
		return res.RespError(c, &res.ErrBadRequest)
	}

	validate := validator.New()
	if errValid := validate.Struct(req); errValid != nil {
		var errList []string
		errors := util.TranslateError(errValid, util.Translator("en", validate))
		for _, msgErr := range errors {
			errList = append(errList, msgErr.Error())
		}
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, errList, res.MsgGetFailed, nil))
	}

	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.GetAllPagination(jwtPayload, req))
}

// @Summary GET Category
// @Description Get all categories without pagination
// @Tags Category
// @Accept json
// @Produce json
// @Param name query string false "name Category"
// @Param slug query string false "slug Category"
// @Param icon query string false "icon Category"
// @Param is_active query bool false "is_active Category"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /categories [get]
func (h Handler) GetAll(c echo.Context) (err error) {
	req := new(schemas.GetAll)
	if err := c.Bind(req); err != nil {
		return res.RespError(c, &res.ErrBadRequest)
	}

	validate := validator.New()
	if errValid := validate.Struct(req); errValid != nil {
		var errList []string
		errors := util.TranslateError(errValid, util.Translator("en", validate))
		for _, msgErr := range errors {
			errList = append(errList, msgErr.Error())
		}
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, errList, res.MsgGetFailed, nil))
	}

	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.GetAll(jwtPayload, req))
}

// @Summary GET Category by ID
// @Description Get category by ID
// @Tags Category
// @Accept json
// @Produce json
// @Param id path string true "Id Category"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /categories/{id} [get]
func (h Handler) GetById(c echo.Context) (err error) {
	id := c.Param("id")
	validate := validator.New()
	if err := validate.Var(id, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgDeleteFailed, nil))
	}
	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.GetById(jwtPayload, id))
}

// @Summary POST Category
// @Description Create a new category
// @Tags Category
// @Accept json
// @Produce json
// @Param request body schemas.RequestCategory true "request body Create Category"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /categories [post]
func (h *Handler) Create(c echo.Context) (err error) {
	req := new(schemas.RequestCategory)
	if err := c.Bind(&req); err != nil {
		return res.RespError(c, &res.ErrBadRequest)
	}

	fmt.Println(req)

	validate := validator.New()
	if errValid := validate.Struct(req); errValid != nil {
		var errList []string
		errors := util.TranslateError(errValid, util.Translator("en", validate))
		for _, msgErr := range errors {
			errList = append(errList, msgErr.Error())
		}
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, errList, res.MsgGetFailed, nil))
	}
	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.Create(jwtPayload, req))
}

// @Summary PUT Category
// @Description Update category by ID
// @Tags Category
// @Accept json
// @Produce json
// @Param id path string true "Id Category"
// @Param request body schemas.RequestCategory true "request body Update Category"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /categories/{id} [put]
func (h *Handler) Update(c echo.Context) (err error) {
	id := c.Param("id")
	req := new(schemas.RequestCategory)
	if err := c.Bind(&req); err != nil {
		return res.RespError(c, &res.ErrorConstant{})
	}

	validate := validator.New()
	if errValid := validate.Struct(req); errValid != nil {
		var errList []string
		errors := util.TranslateError(errValid, util.Translator("en", validate))
		for _, msgErr := range errors {
			errList = append(errList, msgErr.Error())
		}
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, errList, res.MsgGetFailed, nil))
	}

	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.Update(jwtPayload, id, req))
}

// @Summary DELETE Category
// @Description Delete category by ID
// @Tags Category
// @Accept json
// @Produce json
// @Param id path string true "Id Category"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /categories/{id} [delete]
func (h *Handler) Delete(c echo.Context) (err error) {
	id := c.Param("id")
	validate := validator.New()
	if err := validate.Var(id, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgDeleteFailed, nil))
	}
	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.Delete(jwtPayload, id))
}
