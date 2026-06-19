package orders

import (
	"net/http"
	"strconv"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/orders/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/res"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

type Handler struct {
	service Service
}

func NewOrderHandler() *Handler {
	return &Handler{
		service: NewServiceImpl(),
	}
}

// Checkout creates an order from cart and returns payment URL
// @Summary POST Checkout
// @Description Checkout cart items
// @Tags Orders
// @Accept json
// @Produce json
// @Param request body schemas.CheckoutRequest true "Checkout Data"
// @Security BearerAuth
// @Success 201 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /orders/checkout [post]
func (h *Handler) Checkout(c echo.Context) error {
	userInfo := util.UserIDFromToken(c)
	if userInfo == nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusUnauthorized, []string{"unauthorized"}, "Failed checkout", nil))
	}

	req := new(schemas.CheckoutRequest)
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

	return c.JSON(h.service.Checkout(userInfo, userInfo.UserID.String(), req))
}

// GetAllOrders retrieves a list of orders (paginated, with search and status filter)
// @Summary GET All Orders
// @Description Get all orders
// @Tags Orders
// @Security BearerAuth
// @Param page query int false "Page"
// @Param limit query int false "Limit"
// @Param search query string false "Search"
// @Param status query string false "Order Status"
// @Produce json
// @Success 200 {object} res.PaginationConstant
// @Router /orders [get]
func (h *Handler) GetAllOrders(c echo.Context) error {
	pageStr := c.QueryParam("page")
	limitStr := c.QueryParam("limit")
	search := c.QueryParam("search")
	status := c.QueryParam("status")

	page := 1
	if pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
			page = p
		}
	}

	limit := 10
	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			limit = l
		}
	}

	return c.JSON(h.service.GetAllOrders(page, limit, search, status))
}

// GetOrderByID retrieves an order by its ID
// @Summary GET Order By ID
// @Description Get order by ID
// @Tags Orders
// @Security BearerAuth
// @Param id path string true "Order ID"
// @Produce json
// @Success 200 {object} res.SuccessConstant
// @Router /orders/{id} [get]
func (h *Handler) GetOrderByID(c echo.Context) error {
	id := c.Param("id")
	// For regular GetOrderByID we might not need user ID check for admin endpoints, 
	// but the interface was changed to accept userID too. I'll just pass "" for now 
	// if it's admin or get it from token if it's user.
	// Actually, I changed the interface for GetOrderByID back to `GetOrderByID(id string)` earlier! So I just use:
	return c.JSON(h.service.GetOrderByID(id))
}

// GetSnapToken retrieves the Snap Token for a pending order
// @Summary GET Snap Token
// @Description Get snap token for a pending order
// @Tags Orders
// @Security BearerAuth
// @Param id path string true "Order ID"
// @Produce json
// @Success 200 {object} res.SuccessConstant
// @Router /orders/{id}/pay [get]
func (h *Handler) GetSnapToken(c echo.Context) error {
	id := c.Param("id")
	userInfo := util.UserIDFromToken(c)
	if userInfo == nil {
		return res.RespError(c, &res.ErrUnauthorized)
	}
	return c.JSON(h.service.GetSnapToken(id, userInfo.UserID.String()))
}

// UpdateOrderStatus updates the status of an order
// @Summary PUT Update Order Status
// @Description Update order status
// @Tags Orders
// @Accept json
// @Produce json
// @Param id path string true "Order ID"
// @Param request body schemas.UpdateOrderStatusRequest true "Update Status Data"
// @Security BearerAuth
// @Success 200 {object} res.SuccessConstant
// @Router /orders/{id}/status [put]
func (h *Handler) UpdateOrderStatus(c echo.Context) error {
	id := c.Param("id")
	req := new(schemas.UpdateOrderStatusRequest)
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

	return c.JSON(h.service.UpdateOrderStatus(id, req))
}

// GetMyOrders retrieves orders for the currently authenticated user
// @Summary GET My Orders
// @Description Get current user's orders
// @Tags Orders
// @Security BearerAuth
// @Produce json
// @Success 200 {object} res.SuccessConstant
// @Router /orders/my-orders [get]
func (h *Handler) GetMyOrders(c echo.Context) error {
	userInfo := util.UserIDFromToken(c)
	if userInfo == nil {
		return res.RespError(c, &res.ErrUnauthorized)
	}

	return c.JSON(h.service.GetMyOrders(userInfo.UserID.String()))
}

// GetRevenueStats retrieves revenue statistics for the admin dashboard
// @Summary GET Revenue Stats
// @Description Get revenue statistics
// @Tags Orders
// @Security BearerAuth
// @Produce json
// @Success 200 {object} res.SuccessConstant
// @Router /orders/revenue/stats [get]
func (h *Handler) GetRevenueStats(c echo.Context) error {
	userInfo := util.UserIDFromToken(c)
	if userInfo == nil {
		return res.RespError(c, &res.ErrUnauthorized)
	}

	return c.JSON(h.service.GetRevenueStats())
}

