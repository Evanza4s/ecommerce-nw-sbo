package payments

import (
	"net/http"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/payments/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/res"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

type Handler struct {
	service Service
}

func NewPaymentHandler() *Handler {
	return &Handler{
		service: NewServiceImpl(),
	}
}

// MidtransWebhook handles notifications from Midtrans
// @Summary POST Midtrans Webhook
// @Description Receive payment notifications
// @Tags Payments
// @Accept json
// @Produce json
// @Router /payments/webhook [post]
func (h *Handler) MidtransWebhook(c echo.Context) error {
	req := new(schemas.MidtransNotificationRequest)
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "bad request"})
	}

	// Always return 200 OK to midtrans
	go func() {
		_ = h.service.HandleMidtransWebhook(req)
	}()

	return c.JSON(http.StatusOK, map[string]string{"message": "ok"})
}

// @Summary GET Payment All
// @Description Get all payment with pagination
// @Tags Payments
// @Accept json
// @Produce json
// @Param payment_reference query string false "payment_reference"
// @Param payment_status query string false "payment_status"
// @Param order_id query string false "order_id"
// @Param page query int true "page" default(1)
// @Param page_size query int true "page size" default(10)
// @Success 200 {object} res.ResponsePageConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /payments/get-all [get]
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
