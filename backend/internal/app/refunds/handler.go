package refunds

import (
	"net/http"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/refunds/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/res"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

type Handler struct {
	service Service
}

func NewRefundHandler() *Handler {
	return &Handler{
		service: NewServiceImpl(),
	}
}

func (h Handler) Create(c echo.Context) error {
	req := new(schemas.CreateRefundRequest)
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
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, errList, "Failed to create refund request", nil))
	}

	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.Create(jwtPayload, req))
}

func (h Handler) GetAll(c echo.Context) error {
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
	return c.JSON(h.service.GetAll(jwtPayload, req))
}

func (h Handler) GetByID(c echo.Context) error {
	id := c.Param("id")
	validate := validator.New()
	if err := validate.Var(id, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid refund id format"}, "Failed to get refund", nil))
	}
	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.GetByID(jwtPayload, id))
}

func (h Handler) UpdateStatus(c echo.Context) error {
	id := c.Param("id")
	validate := validator.New()
	if err := validate.Var(id, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid refund id format"}, "Failed to update refund status", nil))
	}

	req := new(schemas.UpdateRefundStatusRequest)
	if err := c.Bind(req); err != nil {
		return res.RespError(c, &res.ErrBadRequest)
	}

	if errValid := validate.Struct(req); errValid != nil {
		var errList []string
		errors := util.TranslateError(errValid, util.Translator("en", validate))
		for _, msgErr := range errors {
			errList = append(errList, msgErr.Error())
		}
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, errList, "Failed to update refund status", nil))
	}

	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.UpdateStatus(jwtPayload, id, req))
}
