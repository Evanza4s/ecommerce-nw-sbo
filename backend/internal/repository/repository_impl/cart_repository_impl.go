package repository_impl

import (
	"errors"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/db"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type CartRepositoryImpl struct {
	db *gorm.DB
}

func NewCartRepositoryImpl() *CartRepositoryImpl {
	return &CartRepositoryImpl{db: db.GetManager()}
}

func (r CartRepositoryImpl) FindCartByUserID(userID uuid.UUID) (*model.MstCart, error) {
	var cart model.MstCart
	if err := r.db.Preload("Items").
		Preload("Items.ProductVariantRef").
		Preload("Items.ProductVariantRef.ProductRef").
		Where("user_id = ?", userID).First(&cart).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, gorm.ErrRecordNotFound
		}
		return nil, err
	}
	return &cart, nil
}

func (r CartRepositoryImpl) CreateCart(cart *model.MstCart) (*model.MstCart, error) {
	if err := r.db.Create(cart).Error; err != nil {
		return nil, err
	}
	return cart, nil
}

func (r CartRepositoryImpl) ClearCart(cartID uuid.UUID) error {
	return r.db.Where("cart_id = ?", cartID).Delete(&model.MstCartItem{}).Error
}

func (r CartRepositoryImpl) FindCartItemByVariantID(cartID uuid.UUID, variantID uuid.UUID) (*model.MstCartItem, error) {
	var item model.MstCartItem
	if err := r.db.Where("cart_id = ? AND product_variant_id = ?", cartID, variantID).First(&item).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, gorm.ErrRecordNotFound
		}
		return nil, err
	}
	return &item, nil
}

func (r CartRepositoryImpl) FindCartItemByID(itemID uuid.UUID) (*model.MstCartItem, error) {
	var item model.MstCartItem
	if err := r.db.Where("id = ?", itemID).First(&item).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, gorm.ErrRecordNotFound
		}
		return nil, err
	}
	return &item, nil
}

func (r CartRepositoryImpl) SaveCartItem(item *model.MstCartItem) (*model.MstCartItem, error) {
	if err := r.db.Create(item).Error; err != nil {
		return nil, err
	}
	return item, nil
}

func (r CartRepositoryImpl) UpdateCartItem(item *model.MstCartItem) (*model.MstCartItem, error) {
	var result model.MstCartItem
	if err := r.db.Model(&result).Clauses(clause.Returning{}).Where("id = ?", item.ID).Updates(map[string]interface{}{
		"quantity": item.Quantity,
	}).Error; err != nil {
		return nil, err
	}
	return &result, nil
}

func (r CartRepositoryImpl) DeleteCartItem(itemID uuid.UUID) error {
	return r.db.Where("id = ?", itemID).Delete(&model.MstCartItem{}).Error
}
