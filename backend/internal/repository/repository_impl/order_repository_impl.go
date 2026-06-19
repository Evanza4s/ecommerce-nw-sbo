package repository_impl

import (
	"errors"
	"fmt"
	"time"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/db"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/orders/schemas"
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
	tx := r.db.Begin()
	if err := tx.Model(&model.MstPayment{}).Where("order_id = ?", orderID).Update("payment_status", status).Error; err != nil {
		tx.Rollback()
		return err
	}
	if err := tx.Model(&model.MstOrders{}).Where("id = ?", orderID).Update("payment_status", status).Error; err != nil {
		tx.Rollback()
		return err
	}
	return tx.Commit().Error
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

func (r OrderRepositoryImpl) GetRevenueStats() (*schemas.RevenueStatsResponse, error) {
	now := time.Now()
	startDate := now.AddDate(0, 0, -6)
	startDate = time.Date(startDate.Year(), startDate.Month(), startDate.Day(), 0, 0, 0, 0, startDate.Location())

	// 1. Get 7 days daily revenue
	var dailyStats []struct {
		Date  string
		Total float64
	}

	err := r.db.Model(&model.MstOrders{}).
		Select("TO_CHAR(created_at, 'YYYY-MM-DD') as date, SUM(grand_total) as total").
		Where("payment_status = ? AND order_status != ? AND created_at >= ?", "paid", "canceled", startDate).
		Group("TO_CHAR(created_at, 'YYYY-MM-DD')").
		Scan(&dailyStats).Error

	if err != nil {
		return nil, err
	}

	// Map to daily revenue format
	dailyMap := make(map[string]float64)
	for _, stat := range dailyStats {
		dailyMap[stat.Date] = stat.Total
	}

	var revenueData []schemas.DailyRevenue
	var totalRevenue7Days float64
	for i := 0; i < 7; i++ {
		date := startDate.AddDate(0, 0, i)
		dateStr := date.Format("2006-01-02")
		label := date.Format("Mon")
		val := dailyMap[dateStr]
		// Recharts prefers small numbers or raw numbers. We will pass raw value, but label might need it
		revenueData = append(revenueData, schemas.DailyRevenue{
			Label: label,
			Value: val, 
		})
		totalRevenue7Days += val
	}

	// Average order value over 7 days
	var orderCount int64
	r.db.Model(&model.MstOrders{}).
		Where("payment_status = ? AND order_status != ? AND created_at >= ?", "paid", "canceled", startDate).
		Count(&orderCount)

	avgOrderValue := 0.0
	if orderCount > 0 {
		avgOrderValue = totalRevenue7Days / float64(orderCount)
	}

	// Top 3 Products in the last 7 days
	var topProductsData []struct {
		ProductName string
		Total       float64
	}

	err = r.db.Table("mst_orders").
		Select("mst_product.product_name, SUM(mst_order_items.subtotal) as total").
		Joins("JOIN mst_order_items ON mst_order_items.order_id = mst_orders.id").
		Joins("JOIN mst_product_variant ON mst_product_variant.id = mst_order_items.product_variant_id").
		Joins("JOIN mst_product ON mst_product.id = mst_product_variant.product_id").
		Where("mst_orders.payment_status = ? AND mst_orders.order_status != ? AND mst_orders.created_at >= ?", "paid", "canceled", startDate).
		Group("mst_product.product_name").
		Order("total DESC").
		Limit(3).
		Scan(&topProductsData).Error

	if err != nil {
		return nil, err
	}

	var topProducts []schemas.TopProduct
	for _, p := range topProductsData {
		topProducts = append(topProducts, schemas.TopProduct{
			Name:    p.ProductName,
			Revenue: fmt.Sprintf("Rp. %s", utilFormatNumber(p.Total)),
		})
	}

	// Growth (Compare with previous 7 days)
	prevStartDate := startDate.AddDate(0, 0, -7)
	var prevTotalRevenue float64
	r.db.Model(&model.MstOrders{}).
		Select("COALESCE(SUM(grand_total), 0)").
		Where("payment_status = ? AND order_status != ? AND created_at >= ? AND created_at < ?", "paid", "canceled", prevStartDate, startDate).
		Scan(&prevTotalRevenue)

	growthStr := "+0.0%"
	if prevTotalRevenue > 0 {
		growth := ((totalRevenue7Days - prevTotalRevenue) / prevTotalRevenue) * 100
		if growth >= 0 {
			growthStr = fmt.Sprintf("+%.1f%%", growth)
		} else {
			growthStr = fmt.Sprintf("%.1f%%", growth)
		}
	} else if totalRevenue7Days > 0 {
		growthStr = "+100%"
	}

	return &schemas.RevenueStatsResponse{
		RevenueData:       revenueData,
		TopProducts:       topProducts,
		TotalRevenue:      fmt.Sprintf("Rp. %s", utilFormatNumber(totalRevenue7Days)),
		AverageOrderValue: fmt.Sprintf("Rp. %s", utilFormatNumber(avgOrderValue)),
		Growth:            growthStr,
	}, nil
}

func utilFormatNumber(num float64) string {
	// Simple formatting, ideally use message printer but this works for basic Rp formatting
	if num == 0 {
		return "0"
	}
	if num >= 1000000 {
		return fmt.Sprintf("%.1f Juta", num/1000000)
	}
	return fmt.Sprintf("%.0f", num)
}

