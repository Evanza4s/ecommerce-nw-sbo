package schemas

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
)

type CartResponse struct {
	ID         string             `json:"id"`
	UserID     string             `json:"user_id"`
	TotalItems int                `json:"total_items"`
	TotalPrice float64            `json:"total_price"`
	Items      []CartItemResponse `json:"items"`
}

type CartItemResponse struct {
	ID               string  `json:"id"`
	ProductVariantID string  `json:"product_variant_id"`
	Quantity         int     `json:"quantity"`
	ProductName      string  `json:"product_name"`
	Color            string  `json:"color"`
	Size             string  `json:"size"`
	VariantImage     string  `json:"variant_image"`
	Price            float64 `json:"price"`
	DiscountPrice    float64 `json:"discount_price"`
	Subtotal         float64 `json:"subtotal"`
	Weight           float64 `json:"weight"`
}

func ToCartResponse(cart *model.MstCart) CartResponse {
	var items []CartItemResponse
	totalItems := 0
	totalPrice := 0.0

	for _, item := range cart.Items {
		variant := item.ProductVariantRef
		product := variant.ProductRef

		price := product.Price
		if product.DiscountPrice > 0 {
			price = product.DiscountPrice
		}
		
		// Adjust with variant price if needed, usually variant.PriceAdjustment
		price += variant.PriceAdjustment

		subtotal := price * float64(item.Quantity)

		totalItems += item.Quantity
		totalPrice += subtotal

		image := variant.VariantImage
		if image == "" {
			image = product.ThumbnailURL
		}

		items = append(items, CartItemResponse{
			ID:               item.ID.String(),
			ProductVariantID: item.ProductVariantID.String(),
			Quantity:         item.Quantity,
			ProductName:      product.ProductName,
			Color:            variant.Color,
			Size:             variant.Size,
			VariantImage:     image,
			Price:            product.Price + variant.PriceAdjustment,
			DiscountPrice:    product.DiscountPrice,
			Subtotal:         subtotal,
			Weight:           variant.Weight,
		})
	}

	return CartResponse{
		ID:         cart.ID.String(),
		UserID:     cart.UserID.String(),
		TotalItems: totalItems,
		TotalPrice: totalPrice,
		Items:      items,
	}
}
