package orders

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/orders/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
)

type Service interface {
	Checkout(payload *model.JwtPayload, userID string, req *schemas.CheckoutRequest) (int, interface{})
	GetAllOrders(page, limit int, search string, status string) (int, interface{})
	GetOrderByID(id string) (int, interface{})
	GetSnapToken(orderID string, userID string) (int, interface{})
	UpdateOrderStatus(id string, req *schemas.UpdateOrderStatusRequest) (int, interface{})
	GetMyOrders(userID string) (int, interface{})
}
