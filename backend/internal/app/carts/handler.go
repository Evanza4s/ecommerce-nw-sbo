package carts

import (
	"net/http"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/carts/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/res"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

type Handler struct {
	service Service
}

func NewCartHandler() *Handler {
	return &Handler{
		service: NewServiceImpl(),
	}
}

// GetCart retrieves user cart
// @Summary GET User Cart
// @Description Get current logged-in user cart
// @Tags Carts
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} res.ErrorConstant
// @Failure 401 {object} res.ErrorConstant
// @Router /carts [get]
func (h Handler) GetCart(c echo.Context) error {
	userInfo := util.UserIDFromToken(c)
	if userInfo == nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusUnauthorized, []string{"unauthorized"}, res.MsgGetFailed, nil))
	}

	return c.JSON(h.service.GetCart(userInfo, userInfo.UserID.String()))
}

// AddToCart adds an item to cart
// @Summary POST Add To Cart
// @Description Add product variant to cart
// @Tags Carts
// @Accept json
// @Produce json
// @Param request body schemas.AddToCartRequest true "Add To Cart Data"
// @Security BearerAuth
// @Success 201 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /carts/items [post]
func (h *Handler) AddToCart(c echo.Context) error {
	userInfo := util.UserIDFromToken(c)
	if userInfo == nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusUnauthorized, []string{"unauthorized"}, res.MsgAddFailed, nil))
	}

	req := new(schemas.AddToCartRequest)
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
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, errList, res.MsgAddFailed, nil))
	}

	return c.JSON(h.service.AddToCart(userInfo, userInfo.UserID.String(), req))
}

// UpdateCartItem updates cart item quantity
// @Summary PUT Update Cart Item
// @Description Update quantity of cart item
// @Tags Carts
// @Accept json
// @Produce json
// @Param id path string true "Cart Item ID"
// @Param request body schemas.UpdateCartItemRequest true "Update Cart Item Data"
// @Security BearerAuth
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /carts/items/{id} [put]
func (h *Handler) UpdateCartItem(c echo.Context) error {
	userInfo := util.UserIDFromToken(c)
	if userInfo == nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusUnauthorized, []string{"unauthorized"}, res.MsgUpdateFailed, nil))
	}

	itemID := c.Param("id")
	validate := validator.New()
	if err := validate.Var(itemID, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid item id format"}, res.MsgUpdateFailed, nil))
	}

	req := new(schemas.UpdateCartItemRequest)
	if err := c.Bind(&req); err != nil {
		return res.RespError(c, &res.ErrBadRequest)
	}

	if errValid := validate.Struct(req); errValid != nil {
		var errList []string
		errors := util.TranslateError(errValid, util.Translator("en", validate))
		for _, msgErr := range errors {
			errList = append(errList, msgErr.Error())
		}
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, errList, res.MsgUpdateFailed, nil))
	}

	return c.JSON(h.service.UpdateCartItem(userInfo, userInfo.UserID.String(), itemID, req))
}

// RemoveCartItem removes an item from cart
// @Summary DELETE Cart Item
// @Description Remove item from cart
// @Tags Carts
// @Accept json
// @Produce json
// @Param id path string true "Cart Item ID"
// @Security BearerAuth
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /carts/items/{id} [delete]
func (h *Handler) RemoveCartItem(c echo.Context) error {
	userInfo := util.UserIDFromToken(c)
	if userInfo == nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusUnauthorized, []string{"unauthorized"}, res.MsgDeleteFailed, nil))
	}

	itemID := c.Param("id")
	validate := validator.New()
	if err := validate.Var(itemID, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid item id format"}, res.MsgDeleteFailed, nil))
	}

	return c.JSON(h.service.RemoveItem(userInfo, userInfo.UserID.String(), itemID))
}

// ClearCart removes all items from cart
// @Summary DELETE Clear Cart
// @Description Remove all items from cart
// @Tags Carts
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /carts [delete]
func (h *Handler) ClearCart(c echo.Context) error {
	userInfo := util.UserIDFromToken(c)
	if userInfo == nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusUnauthorized, []string{"unauthorized"}, res.MsgDeleteFailed, nil))
	}

	return c.JSON(h.service.ClearCart(userInfo, userInfo.UserID.String()))
}
