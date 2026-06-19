package products

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/db"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/middleware"
	"github.com/labstack/echo/v4"
)

// Route registers all product routes
//
// Public (no auth):
//   GET  /products              — list products (paginated + filter)
//   GET  /products/:slug        — product detail by slug
//
// Admin (JWT required):
//   GET    /products/admin/:id                              — detail by ID
//   POST   /products/admin                                  — create product
//   PUT    /products/admin/:id                              — update product
//   DELETE /products/admin/:id                              — delete product
//   POST   /products/admin/:id/images                       — upload image
//   GET    /products/admin/:id/images                       — list images
//   PUT    /products/admin/:id/images/:image_id/thumbnail   — set thumbnail
//   DELETE /products/admin/:id/images/:image_id             — delete image
//   POST   /products/admin/:id/variants                     — add variant
//   PUT    /products/admin/:id/variants/:variant_id         — update variant
//   DELETE /products/admin/:id/variants/:variant_id         — delete variant
//   POST   /products/admin/:id/specifications               — add specification
//   DELETE /products/admin/:id/specifications/:spec_id      — delete specification
func (h Handler) Route(g *echo.Group) {
	// ============================================================
	// PUBLIC ROUTES
	// ============================================================
	g.GET("", h.GetProducts)
	g.GET("/:slug", h.GetProductBySlug)

	// ============================================================
	// ADMIN PROTECTED ROUTES
	// ============================================================
	admin := g.Group("/admin")
	admin.Use(middleware.JWTMiddleware(db.GetManager()))

	// Product CRUD
	admin.GET("/:id", h.GetProductByID)
	admin.POST("", h.CreateProduct)
	admin.PUT("/:id", h.UpdateProduct)
	admin.DELETE("/:id", h.DeleteProduct)

	// Images
	admin.POST("/:id/images", h.UploadProductImage)
	admin.GET("/:id/images", h.GetProductImages)
	admin.PUT("/:id/images/:image_id/thumbnail", h.SetThumbnailImage)
	admin.DELETE("/:id/images/:image_id", h.DeleteProductImage)

	// Variants
	admin.POST("/:id/variants", h.CreateProductVariant)
	admin.PUT("/:id/variants/:variant_id", h.UpdateProductVariant)
	admin.DELETE("/:id/variants/:variant_id", h.DeleteProductVariant)

	// Specifications
	admin.POST("/:id/specifications", h.CreateProductSpecification)
	admin.DELETE("/:id/specifications/:spec_id", h.DeleteProductSpecification)
}
