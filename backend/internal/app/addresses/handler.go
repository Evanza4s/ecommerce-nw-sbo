package addresses

import (
	"net/http"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/addresses/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/res"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

type Handler struct {
	service Service
}

func NewAddressHandler() *Handler {
	return &Handler{
		service: NewServiceImpl(),
	}
}

// GetAddresses retrieves all addresses for a user
// @Summary GET User Addresses
// @Description Get all addresses for a specific user
// @Tags Addresses
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /addresses/{id}/addresses [get]
func (h Handler) GetAddresses(c echo.Context) error {
	id := c.Param("id")
	validate := validator.New()
	if err := validate.Var(id, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id format"}, res.MsgGetFailed, nil))
	}
	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.GetAddresses(jwtPayload, id))
}

// GetAddressByID retrieves a specific address
// @Summary GET User Address by ID
// @Description Get a specific address by ID for a user
// @Tags Addresses
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Param address_id path string true "Address ID"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /addresses/{id}/addresses/{address_id} [get]
func (h Handler) GetAddressByID(c echo.Context) error {
	userID := c.Param("id")
	addressID := c.Param("address_id")

	validate := validator.New()
	if err := validate.Var(userID, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id format"}, res.MsgGetFailed, nil))
	}
	if err := validate.Var(addressID, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid address id format"}, res.MsgGetFailed, nil))
	}

	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.GetAddressByID(jwtPayload, userID, addressID))
}

// CreateAddress creates a new address
// @Summary POST User Address
// @Description Create a new address for a user
// @Tags Addresses
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Param request body schemas.CreateAddress true "Address data"
// @Success 201 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /addresses/{id}/addresses [post]
func (h *Handler) CreateAddress(c echo.Context) error {
	id := c.Param("id")
	req := new(schemas.CreateAddress)
	if err := c.Bind(&req); err != nil {
		return res.RespError(c, &res.ErrBadRequest)
	}

	validate := validator.New()
	if err := validate.Var(id, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id format"}, res.MsgAddFailed, nil))
	}

	if errValid := validate.Struct(req); errValid != nil {
		var errList []string
		errors := util.TranslateError(errValid, util.Translator("en", validate))
		for _, msgErr := range errors {
			errList = append(errList, msgErr.Error())
		}
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, errList, res.MsgAddFailed, nil))
	}

	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.CreateAddress(jwtPayload, id, req))
}

// UpdateAddress updates an address
// @Summary PUT User Address
// @Description Update an existing address for a user
// @Tags Addresses
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Param address_id path string true "Address ID"
// @Param request body schemas.UpdateAddress true "Address data"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /addresses/{id}/addresses/{address_id} [put]
func (h *Handler) UpdateAddress(c echo.Context) error {
	userID := c.Param("id")
	addressID := c.Param("address_id")
	req := new(schemas.UpdateAddress)
	if err := c.Bind(&req); err != nil {
		return res.RespError(c, &res.ErrBadRequest)
	}

	validate := validator.New()
	if err := validate.Var(userID, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id format"}, res.MsgUpdateFailed, nil))
	}
	if err := validate.Var(addressID, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid address id format"}, res.MsgUpdateFailed, nil))
	}

	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.UpdateAddress(jwtPayload, userID, addressID, req))
}

// DeleteAddress soft deletes an address
// @Summary DELETE User Address
// @Description Delete an address for a user
// @Tags Addresses
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Param address_id path string true "Address ID"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /addresses/{id}/addresses/{address_id} [delete]
func (h *Handler) DeleteAddress(c echo.Context) error {
	userID := c.Param("id")
	addressID := c.Param("address_id")

	validate := validator.New()
	if err := validate.Var(userID, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id format"}, res.MsgDeleteFailed, nil))
	}
	if err := validate.Var(addressID, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid address id format"}, res.MsgDeleteFailed, nil))
	}

	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.DeleteAddress(jwtPayload, userID, addressID))
}

// SetDefaultAddress sets an address as default
// @Summary PUT Set Default Address
// @Description Set an address as the default address for a user
// @Tags Addresses
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Param address_id path string true "Address ID"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /addresses/{id}/addresses/{address_id}/default [put]
func (h *Handler) SetDefaultAddress(c echo.Context) error {
	userID := c.Param("id")
	addressID := c.Param("address_id")

	validate := validator.New()
	if err := validate.Var(userID, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id format"}, res.MsgUpdateFailed, nil))
	}
	if err := validate.Var(addressID, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid address id format"}, res.MsgUpdateFailed, nil))
	}

	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.SetDefaultAddress(jwtPayload, userID, addressID))
}
