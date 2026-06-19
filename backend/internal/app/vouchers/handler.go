package vouchers

import (
	"net/http"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/vouchers/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/res"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

type Handler struct {
	service Service
}

func NewVoucherHandler() *Handler {
	return &Handler{
		service: NewServiceImpl(),
	}
}

// GetAll retrieves all vouchers with pagination
// @Summary GET Vouchers Pagination
// @Description Get all vouchers with pagination
// @Tags Vouchers
// @Accept json
// @Produce json
// @Security Bearer
// @Param code query string false "Filter by code"
// @Param status query string false "Filter by status"
// @Param page query int true "Page number" default(1)
// @Param page_size query int true "Page size" default(10)
// @Success 200 {object} res.ResponsePageConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /vouchers/get-all [get]
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

	return c.JSON(h.service.GetAll(req))
}

// GetAllWithoutPagination retrieves all vouchers
// @Summary GET Vouchers
// @Description Get all vouchers
// @Tags Vouchers
// @Accept json
// @Produce json
// @Security Bearer
// @Param code query string false "Filter by code"
// @Param status query string false "Filter by status"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /vouchers [get]
func (h Handler) GetAllWithoutPagination(c echo.Context) error {
	req := new(schemas.GetAllPagination)
	if err := c.Bind(req); err != nil {
		return res.RespError(c, &res.ErrBadRequest)
	}

	return c.JSON(h.service.GetAllNoPagination(req))
}

// GetByID retrieves a voucher by ID
// @Summary GET Voucher by ID
// @Description Get voucher by ID
// @Tags Vouchers
// @Accept json
// @Produce json
// @Security Bearer
// @Param id path string true "Voucher ID"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /vouchers/{id} [get]
func (h Handler) GetByID(c echo.Context) error {
	id := c.Param("id")
	if id == "" {
		return res.RespError(c, &res.ErrBadRequest)
	}

	return c.JSON(h.service.GetByID(id))
}

// Create creates a new voucher
// @Summary POST Voucher
// @Description Create a new voucher
// @Tags Vouchers
// @Accept json
// @Produce json
// @Security Bearer
// @Param body body schemas.CreateVoucher true "Voucher Data"
// @Success 201 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /vouchers [post]
func (h Handler) Create(c echo.Context) error {
	req := new(schemas.CreateVoucher)
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
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, errList, res.MsgAddFailed, nil))
	}

	return c.JSON(h.service.Create(req))
}

// Update updates an existing voucher
// @Summary PUT Voucher
// @Description Update voucher by ID
// @Tags Vouchers
// @Accept json
// @Produce json
// @Security Bearer
// @Param id path string true "Voucher ID"
// @Param body body schemas.UpdateVoucher true "Voucher Data"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /vouchers/{id} [put]
func (h Handler) Update(c echo.Context) error {
	id := c.Param("id")
	if id == "" {
		return res.RespError(c, &res.ErrBadRequest)
	}

	req := new(schemas.UpdateVoucher)
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
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, errList, res.MsgUpdateFailed, nil))
	}

	return c.JSON(h.service.Update(id, req))
}

// Delete deletes a voucher
// @Summary DELETE Voucher
// @Description Delete voucher by ID
// @Tags Vouchers
// @Accept json
// @Produce json
// @Security Bearer
// @Param id path string true "Voucher ID"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /vouchers/{id} [delete]
func (h Handler) Delete(c echo.Context) error {
	id := c.Param("id")
	if id == "" {
		return res.RespError(c, &res.ErrBadRequest)
	}

	return c.JSON(h.service.Delete(id))
}

// ValidateVoucher validates a promo code
// @Summary POST Validate Voucher
// @Description Validate voucher and calculate discount
// @Tags Vouchers
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param request body schemas.ValidateVoucherRequest true "Validate Voucher Request"
// @Success 200 {object} res.ResponseConstant{data=schemas.ValidateVoucherResponse}
// @Failure 400 {object} res.ErrorConstant
// @Router /vouchers/validate [post]
func (h *Handler) ValidateVoucher(c echo.Context) error {
	req := new(schemas.ValidateVoucherRequest)
	if err := c.Bind(req); err != nil {
		return res.RespError(c, &res.ErrBadRequest)
	}

	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		var errList []string
		errors := util.TranslateError(err, util.Translator("en", validate))
		for _, msgErr := range errors {
			errList = append(errList, msgErr.Error())
		}
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, errList, "Validasi gagal", nil))
	}

	return c.JSON(h.service.Validate(req))
}
