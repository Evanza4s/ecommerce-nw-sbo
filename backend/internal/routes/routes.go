package routes

import (
	"fmt"
	"net/http"
	"os"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/addresses"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/auth"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/carts"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/categories"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/faq"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/notifications"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/orders"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/payments"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/products"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/refunds"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/roles"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/shipping"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/user_identities"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/users"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/vouchers"
	"github.com/labstack/echo/v4"
	echoSwagger "github.com/swaggo/echo-swagger"
)

func Init(g *echo.Group) {
	var (
		APP     = os.Getenv("APP")
		VERSION = os.Getenv("VERSION")
	)

	// Index
	g.GET("/", func(c echo.Context) error {
		message := fmt.Sprintf("Welcome to %s version %s", APP, VERSION)
		return c.String(http.StatusOK, message)
	})

	// API Routes
	auth.NewAuthHandler().Route(g.Group("/auth"))
	categories.NewCategoryHandler().Route(g.Group("/categories"))
	roles.NewRoleshandler().Route(g.Group("/roles"))
	faq.NewFaqHandler().Route(g.Group("/faq"))
	users.NewUserHandler().Route(g.Group("/users"))
	user_identities.NewUserIdentityHandler().Route(g.Group("/user-identities"))
	addresses.NewAddressHandler().Route(g.Group("/addresses"))
	products.NewProductHandler().Route(g.Group("/products"))
	carts.NewCartHandler().Route(g.Group("/carts"))
	orders.NewOrderHandler().Route(g.Group("/orders"))
	shipping.NewShippingHandler().Route(g.Group("/shipping"))
	payments.NewPaymentHandler().Route(g.Group("/payments"))
	refunds.NewRefundHandler().Route(g.Group("/refunds"))
	notifications.NewNotificationHandler().Route(g.Group("/notifications"))
	vouchers.NewVoucherHandler().Route(g.Group("/vouchers"))

	// Swagger
	g.GET("/swagger/*", echoSwagger.WrapHandler)
}
