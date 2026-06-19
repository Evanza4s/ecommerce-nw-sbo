package repository_impl

import (
	"errors"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/db"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type OrderRepositoryImpl struct {
	db *gorm.DB
}

func NewOrderRepositoryImpl() *OrderRepositoryImpl {
	return &OrderRepositoryImpl{db: db.GetManager()}
}

func (r OrderRepositoryImpl) CreateOrder(order *model.MstOrders) (*model.MstOrders, error) {
	// GORM will automatically create associated Items, Payment, and Shipping
	// within a transaction if they are not empty.
	if err := r.db.Create(order).Error; err != nil {
		return nil, err
	}
	return order, nil
}

func (r OrderRepositoryImpl) FindOrderByID(id uuid.UUID) (*model.MstOrders, error) {
	var order model.MstOrders
	if err := r.db.
		Preload("Items").
		Preload("Items.ProductVariantRef").
		Preload("Items.ProductVariantRef.ProductRef").
		Preload("Payment").
		Preload("Shipping").
		Preload("AddressRef").
		Where("id = ?", id).First(&order).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, gorm.ErrRecordNotFound
		}
		return nil, err
	}
	return &order, nil
}

func (r OrderRepositoryImpl) FindOrdersByUserID(userID uuid.UUID) ([]model.MstOrders, error) {
	var orders []model.MstOrders
	if err := r.db.
		Preload("Items").
		Preload("Items.ProductVariantRef").
		Preload("Items.ProductVariantRef.ProductRef").
		Preload("Payment").
		Preload("Shipping").
		Where("user_id = ?", userID).
		Order("created_at desc").
		Find(&orders).Error; err != nil {
		return nil, err
	}
	return orders, nil
}

func (r OrderRepositoryImpl) FindAllOrders(limit, offset int, search string, status string) ([]model.MstOrders, int64, error) {
	var orders []model.MstOrders
	var total int64

	query := r.db.Model(&model.MstOrders{})

	if search != "" {
		query = query.Joins("LEFT JOIN mst_users ON mst_orders.user_id = mst_users.id").
			Where("mst_orders.order_number ILIKE ? OR mst_users.first_name ILIKE ? OR mst_users.last_name ILIKE ?", "%"+search+"%", "%"+search+"%", "%"+search+"%")
	}

	if status != "" && status != "all" {
		query = query.Where("mst_orders.order_status = ?", status)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := query.
		Preload("Items").
		Preload("UserRef").
		Preload("Payment").
		Preload("Shipping").
		Order("mst_orders.created_at desc").
		Limit(limit).
		Offset(offset).
		Find(&orders).Error; err != nil {
		return nil, 0, err
	}

	return orders, total, nil
}

func (r OrderRepositoryImpl) UpdateOrderStatus(id uuid.UUID, status string) error {
	return r.db.Model(&model.MstOrders{}).Where("id = ?", id).Update("order_status", status).Error
}

func (r OrderRepositoryImpl) FindPaymentByOrderID(orderID uuid.UUID) (*model.MstPayment, error) {
	var payment model.MstPayment
	if err := r.db.Where("order_id = ?", orderID).First(&payment).Error; err != nil {
		return nil, err
	}
	return &payment, nil
}

func (r OrderRepositoryImpl) UpdatePaymentStatus(orderID uuid.UUID, status string) error {
	return r.db.Model(&model.MstPayment{}).Where("order_id = ?", orderID).Update("payment_status", status).Error
}

func (r OrderRepositoryImpl) FindShippingByOrderID(orderID uuid.UUID) (*model.MstShipping, error) {
	var shipping model.MstShipping
	if err := r.db.Where("order_id = ?", orderID).First(&shipping).Error; err != nil {
		return nil, err
	}
	return &shipping, nil
}

func (r OrderRepositoryImpl) UpdateShippingStatus(orderID uuid.UUID, status string, trackingNumber string) error {
	updates := map[string]interface{}{
		"shipping_status": status,
	}
	if trackingNumber != "" {
		updates["tracking_number"] = trackingNumber
	}
	return r.db.Model(&model.MstShipping{}).Where("order_id = ?", orderID).Updates(updates).Error
}

func (r OrderRepositoryImpl) UpdatePaymentReference(orderID uuid.UUID, reference string) error {
	return r.db.Model(&model.MstPayment{}).Where("order_id = ?", orderID).Update("payment_reference", reference).Error
}
