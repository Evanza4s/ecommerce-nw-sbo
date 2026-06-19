package carts

import (
	"errors"
	"net/http"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/carts/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/repository"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/repository/repository_impl"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/res"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ServiceImpl struct {
	cartRepo    repository.CartRepository
	productRepo repository.ProductRepository
}

func NewServiceImpl() *ServiceImpl {
	return &ServiceImpl{
		cartRepo:    repository_impl.NewCartRepositoryImpl(),
		productRepo: repository_impl.NewProductRepositoryImpl(),
	}
}

func (s ServiceImpl) getOrCreateCart(userID uuid.UUID) (*model.MstCart, error) {
	cart, err := s.cartRepo.FindCartByUserID(userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			newCart := &model.MstCart{
				UserID: userID,
			}
			return s.cartRepo.CreateCart(newCart)
		}
		return nil, err
	}
	return cart, nil
}

func (s ServiceImpl) GetCart(payload *model.JwtPayload, userID string) (int, interface{}) {
	parsedUserID, err := uuid.Parse(userID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id"}, res.MsgGetFailed, nil)
	}

	cart, err := s.getOrCreateCart(parsedUserID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgGetFailed, nil)
	}

	// Fetch again to get preloaded items if we just created it
	if len(cart.Items) == 0 {
		cart, _ = s.cartRepo.FindCartByUserID(parsedUserID)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgGetSuccess, schemas.ToCartResponse(cart))
}

func (s ServiceImpl) AddToCart(payload *model.JwtPayload, userID string, req *schemas.AddToCartRequest) (int, interface{}) {
	parsedUserID, err := uuid.Parse(userID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id"}, res.MsgAddFailed, nil)
	}

	variantID, err := uuid.Parse(req.ProductVariantID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid product variant id"}, res.MsgAddFailed, nil)
	}

	// 1. Validasi Variant dan Stock
	variant, err := s.productRepo.FindVariantByID(variantID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusNotFound, []string{"product variant not found"}, res.MsgAddFailed, nil)
	}

	if variant.Stock < req.Quantity {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"insufficient stock"}, res.MsgAddFailed, nil)
	}

	// 2. Dapatkan atau buat Cart
	cart, err := s.getOrCreateCart(parsedUserID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgAddFailed, nil)
	}

	// 3. Cek apakah item sudah ada di keranjang
	cartItem, err := s.cartRepo.FindCartItemByVariantID(cart.ID, variantID)
	if err == nil && cartItem != nil {
		// Update kuantitas jika sudah ada
		newQuantity := cartItem.Quantity + req.Quantity
		if variant.Stock < newQuantity {
			return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"insufficient stock for combined quantity"}, res.MsgAddFailed, nil)
		}
		
		cartItem.Quantity = newQuantity
		updatedItem, err := s.cartRepo.UpdateCartItem(cartItem)
		if err != nil {
			return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgAddFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, "Item quantity updated", updatedItem)
	}

	// 4. Jika belum ada, buat item baru
	newItem := &model.MstCartItem{
		CartID:           cart.ID,
		ProductVariantID: variantID,
		Quantity:         req.Quantity,
	}

	if payload != nil {
		newItem.CreatedBy = payload.UserID
	}

	savedItem, err := s.cartRepo.SaveCartItem(newItem)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgAddFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusCreated, nil, "Item added to cart", savedItem)
}

func (s ServiceImpl) UpdateCartItem(payload *model.JwtPayload, userID string, itemID string, req *schemas.UpdateCartItemRequest) (int, interface{}) {
	parsedItemID, err := uuid.Parse(itemID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid item id"}, res.MsgUpdateFailed, nil)
	}

	cartItem, err := s.cartRepo.FindCartItemByID(parsedItemID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusNotFound, []string{"cart item not found"}, res.MsgUpdateFailed, nil)
	}

	// Validate stock
	variant, err := s.productRepo.FindVariantByID(cartItem.ProductVariantID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{"product variant error"}, res.MsgUpdateFailed, nil)
	}

	if variant.Stock < req.Quantity {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"insufficient stock"}, res.MsgUpdateFailed, nil)
	}

	cartItem.Quantity = req.Quantity
	if payload != nil {
		cartItem.UpdatedBy = &payload.UserID
	}
	updatedItem, err := s.cartRepo.UpdateCartItem(cartItem)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgUpdateFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, "Cart item updated", updatedItem)
}

func (s ServiceImpl) RemoveItem(payload *model.JwtPayload, userID string, itemID string) (int, interface{}) {
	parsedItemID, err := uuid.Parse(itemID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid item id"}, res.MsgDeleteFailed, nil)
	}

	err = s.cartRepo.DeleteCartItem(parsedItemID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgDeleteFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, "Item removed from cart", nil)
}

func (s ServiceImpl) ClearCart(payload *model.JwtPayload, userID string) (int, interface{}) {
	parsedUserID, err := uuid.Parse(userID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id"}, res.MsgDeleteFailed, nil)
	}

	cart, err := s.cartRepo.FindCartByUserID(parsedUserID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusNotFound, []string{"cart not found"}, res.MsgDeleteFailed, nil)
	}

	err = s.cartRepo.ClearCart(cart.ID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgDeleteFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, "Cart cleared", nil)
}
