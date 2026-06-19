package repository

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/orders/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/google/uuid"
)

type OrderRepository interface {
	CreateOrder(order *model.MstOrders) (*model.MstOrders, error)
	FindOrderByID(id uuid.UUID) (*model.MstOrders, error)
	FindOrdersByUserID(userID uuid.UUID) ([]model.MstOrders, error)
	FindAllOrders(limit, offset int, search string, status string) ([]model.MstOrders, int64, error)
	UpdateOrderStatus(id uuid.UUID, status string) error
	GetRevenueStats() (*schemas.RevenueStatsResponse, error)
	
	// Payment
	FindPaymentByOrderID(orderID uuid.UUID) (*model.MstPayment, error)
	UpdatePaymentStatus(orderID uuid.UUID, status string) error
	UpdatePaymentReference(orderID uuid.UUID, reference string) error

	// Shipping
	FindShippingByOrderID(orderID uuid.UUID) (*model.MstShipping, error)
	UpdateShippingStatus(orderID uuid.UUID, status string, trackingNumber string) error
}
