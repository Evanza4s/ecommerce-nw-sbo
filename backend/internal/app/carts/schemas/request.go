package schemas

type AddToCartRequest struct {
	ProductVariantID string `json:"product_variant_id" validate:"required"`
	Quantity         int    `json:"quantity" validate:"required,min=1"`
}

type UpdateCartItemRequest struct {
	Quantity int `json:"quantity" validate:"required,min=1"`
}
