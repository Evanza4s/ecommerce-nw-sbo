package shipping

import (
	"net/http"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/shipping/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/res"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

type Handler struct {
	service Service
}

func NewShippingHandler() *Handler {
	return &Handler{
		service: NewServiceImpl(),
	}
}

// GetRates calculates shipping rates using RajaOngkir
// @Summary POST Shipping Rates
// @Description Get shipping rates
// @Tags Shipping
// @Accept json
// @Produce json
// @Param request body schemas.ShippingRatesRequest true "Shipping Rates Data"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /shipping/rates [post]
func (h *Handler) GetRates(c echo.Context) error {
	req := new(schemas.ShippingRatesRequest)
	if err := c.Bind(&req); err != nil {
		return res.RespError(c, &res.ErrBadRequest)
	}

	validate := validator.New()
	if errValid := validate.Struct(req); errValid != nil {
		var errList []string
		errors := util.TranslateError(errValid, util.Translator("en", validate))
		for _, msgErr := range errors {
			errList = append(errList, msgErr.Error())
		}
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, errList, "Validation Error", nil))
	}

	return c.JSON(h.service.GetRates(req))
}

// @Summary GET Shipping All
// @Description Get all shipping with pagination
// @Tags Shipping
// @Accept json
// @Produce json
// @Param tracking_number query string false "tracking_number"
// @Param shipping_status query string false "shipping_status"
// @Param order_id query string false "order_id"
// @Param page query int true "page" default(1)
// @Param page_size query int true "page size" default(10)
// @Success 200 {object} res.ResponsePageConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /shipping/get-all [get]
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
