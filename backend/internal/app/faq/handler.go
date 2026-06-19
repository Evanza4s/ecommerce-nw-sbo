package faq

import (
	"fmt"
	"net/http"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/faq/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/res"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

type Handler struct {
	service Service
}

func NewFaqHandler() *Handler {
	return &Handler{
		service: NewServiceImpl(),
	}
}

// @Summary GET FAQ All
// @Description Get all faq with pagination
// @Tags FAQ
// @Accept json
// @Produce json
// @Param question query string false "question FAQ"
// @Param answer query string false "answer FAQ"
// @Param sort_order query string false "sort_order FAQ"
// @Param is_active query bool false "is_active FAQ"
// @Param page query int true "page" default(1)
// @Param page_size query int true "page size" default(10)
// @Success 200 {object} res.ResponsePageConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /faq/get-all [get]
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

// @Summary GET FAQ
// @Description Get all faq without pagination
// @Tags FAQ
// @Accept json
// @Produce json
// @Param question query string false "question FAQ"
// @Param answer query string false "answer FAQ"
// @Param sort_order query string false "sort_order FAQ"
// @Param is_active query bool false "is_active FAQ"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /faq [get]
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

// @Summary GET FAQ by ID
// @Description Get FAQ by ID
// @Tags FAQ
// @Accept json
// @Produce json
// @Param id path string true "id FAQ"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /faq/{id} [get]
func (h Handler) GetById(c echo.Context) (err error) {
	id := c.Param("id")
	validate := validator.New()
	if err := validate.Var(id, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid id format"}, res.MsgGetFailed, nil))
	}
	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.GetById(jwtPayload, id))
}

// @Summary POST FAQ
// @Description Create a new FAQ
// @Tags FAQ
// @Accept json
// @Produce json
// @Param request body schemas.FAQRequest true "request body Create FAQ"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /faq [post]
func (h *Handler) Create(c echo.Context) (err error) {
	req := new(schemas.FAQRequest)
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

// @Summary PUT FAQ
// @Description Update FAQ by ID
// @Tags FAQ
// @Accept json
// @Produce json
// @Param id path string true "Id FAQ"
// @Param request body schemas.FAQRequest true "request body Update FAQ"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /faq/{id} [put]
func (h *Handler) Update(c echo.Context) (err error) {
	id := c.Param("id")
	req := new(schemas.FAQRequest)
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

// @Summary DELETE FAQ
// @Description Delete FAQ by ID
// @Tags FAQ
// @Accept json
// @Produce json
// @Param id path string true "Id FAQ"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /faq/{id} [delete]
func (h *Handler) Delete(c echo.Context) (err error) {
	id := c.Param("id")
	validate := validator.New()
	if err := validate.Var(id, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgDeleteFailed, nil))
	}
	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.Delete(jwtPayload, id))
}
