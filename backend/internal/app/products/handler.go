package products

import (
	"net/http"
	"strconv"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/products/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/res"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

type Handler struct {
	service Service
}

func NewProductHandler() *Handler {
	return &Handler{
		service: NewServiceImpl(),
	}
}

var validate = validator.New()

// ============================================================
// PUBLIC ENDPOINTS
// ============================================================

// GetProducts godoc
// @Summary GET Products (paginated)
// @Description Get paginated list of products with optional filters
// @Tags Products
// @Accept json
// @Produce json
// @Param page query int true "Page number" default(1)
// @Param page_size query int true "Page size" default(12)
// @Param search query string false "Search by name or brand"
// @Param category_id query string false "Filter by category UUID"
// @Param brand query string false "Filter by brand"
// @Param gender query string false "Filter by gender (male|female|unisex)"
// @Param status query string false "Filter by status (active|draft|archived)"
// @Param min_price query number false "Minimum price"
// @Param max_price query number false "Maximum price"
// @Success 200 {object} res.ResponsePageConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /products [get]
func (h Handler) GetProducts(c echo.Context) error {
	req := new(schemas.GetProductsPagination)
	if err := c.Bind(req); err != nil {
		return res.RespError(c, &res.ErrBadRequest)
	}

	if errValid := validate.Struct(req); errValid != nil {
		var errList []string
		errors := util.TranslateError(errValid, util.Translator("en", validate))
		for _, msgErr := range errors {
			errList = append(errList, msgErr.Error())
		}
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, errList, res.MsgGetFailed, nil))
	}

	return c.JSON(h.service.GetProducts(req))
}

// GetProductBySlug godoc
// @Summary GET Product by Slug
// @Description Get product detail by slug (public)
// @Tags Products
// @Accept json
// @Produce json
// @Param slug path string true "Product Slug"
// @Success 200 {object} res.ErrorConstant
// @Failure 404 {object} res.ErrorConstant
// @Router /products/{slug} [get]
func (h Handler) GetProductBySlug(c echo.Context) error {
	slug := c.Param("slug")
	if slug == "" {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"slug is required"}, res.MsgGetFailed, nil))
	}
	return c.JSON(h.service.GetProductBySlug(slug))
}

// ============================================================
// ADMIN ENDPOINTS
// ============================================================

// GetProductByID godoc
// @Summary GET Product by ID (Admin)
// @Description Get product detail by ID
// @Tags Products
// @Accept json
// @Produce json
// @Param id path string true "Product ID (UUID)"
// @Security BearerAuth
// @Success 200 {object} res.ErrorConstant
// @Failure 404 {object} res.ErrorConstant
// @Router /products/admin/{id} [get]
func (h Handler) GetProductByID(c echo.Context) error {
	id := c.Param("id")
	if err := validate.Var(id, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid product id format"}, res.MsgGetFailed, nil))
	}
	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.GetProductByID(jwtPayload, id))
}

// CreateProduct godoc
// @Summary POST Create Product (Admin)
// @Description Create a new product with optional variants and specifications
// @Tags Products
// @Accept json
// @Produce json
// @Param request body schemas.CreateProduct true "Product data"
// @Security BearerAuth
// @Success 201 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /products/admin [post]
func (h *Handler) CreateProduct(c echo.Context) error {
	req := new(schemas.CreateProduct)
	if err := c.Bind(req); err != nil {
		return res.RespError(c, &res.ErrBadRequest)
	}

	if errValid := validate.Struct(req); errValid != nil {
		var errList []string
		errors := util.TranslateError(errValid, util.Translator("en", validate))
		for _, msgErr := range errors {
			errList = append(errList, msgErr.Error())
		}
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, errList, res.MsgAddFailed, nil))
	}

	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.CreateProduct(jwtPayload, req))
}

// UpdateProduct godoc
// @Summary PUT Update Product (Admin)
// @Description Update an existing product
// @Tags Products
// @Accept json
// @Produce json
// @Param id path string true "Product ID (UUID)"
// @Param request body schemas.UpdateProduct true "Product data"
// @Security BearerAuth
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /products/admin/{id} [put]
func (h *Handler) UpdateProduct(c echo.Context) error {
	id := c.Param("id")
	if err := validate.Var(id, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid product id format"}, res.MsgUpdateFailed, nil))
	}

	req := new(schemas.UpdateProduct)
	if err := c.Bind(req); err != nil {
		return res.RespError(c, &res.ErrBadRequest)
	}

	if errValid := validate.Struct(req); errValid != nil {
		var errList []string
		errors := util.TranslateError(errValid, util.Translator("en", validate))
		for _, msgErr := range errors {
			errList = append(errList, msgErr.Error())
		}
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, errList, res.MsgUpdateFailed, nil))
	}

	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.UpdateProduct(jwtPayload, id, req))
}

// DeleteProduct godoc
// @Summary DELETE Product (Admin)
// @Description Soft delete a product
// @Tags Products
// @Accept json
// @Produce json
// @Param id path string true "Product ID (UUID)"
// @Security BearerAuth
// @Success 200 {object} res.ErrorConstant
// @Failure 404 {object} res.ErrorConstant
// @Router /products/admin/{id} [delete]
func (h *Handler) DeleteProduct(c echo.Context) error {
	id := c.Param("id")
	if err := validate.Var(id, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid product id format"}, res.MsgDeleteFailed, nil))
	}
	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.DeleteProduct(jwtPayload, id))
}

// ============================================================
// IMAGE ENDPOINTS
// ============================================================

// UploadProductImage godoc
// @Summary POST Upload Product Image (Admin)
// @Description Upload product image to Cloudinary and save URL to DB
// @Tags Products
// @Accept multipart/form-data
// @Produce json
// @Param id path string true "Product ID (UUID)"
// @Param image formData file true "Image file (jpg, png, webp, gif, bmp)"
// @Param is_thumbnail formData bool false "Set as thumbnail (default: false)"
// @Param sort_order formData int false "Sort order (default: 0)"
// @Security BearerAuth
// @Success 201 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /products/admin/{id}/images [post]
func (h *Handler) UploadProductImage(c echo.Context) error {
	id := c.Param("id")
	if err := validate.Var(id, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid product id format"}, res.MsgAddFailed, nil))
	}

	file, err := c.FormFile("image")
	if err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"image file is required"}, res.MsgAddFailed, nil))
	}

	// Parse optional fields
	isThumbnail := false
	if val := c.FormValue("is_thumbnail"); val == "true" || val == "1" {
		isThumbnail = true
	}

	sortOrder := 0
	if val := c.FormValue("sort_order"); val != "" {
		if n, err := strconv.Atoi(val); err == nil {
			sortOrder = n
		}
	}

	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.UploadProductImage(jwtPayload, id, file, isThumbnail, sortOrder))
}

// GetProductImages godoc
// @Summary GET Product Images (Admin)
// @Description Get all images for a product
// @Tags Products
// @Accept json
// @Produce json
// @Param id path string true "Product ID (UUID)"
// @Security BearerAuth
// @Success 200 {object} res.ErrorConstant
// @Router /products/admin/{id}/images [get]
func (h Handler) GetProductImages(c echo.Context) error {
	id := c.Param("id")
	if err := validate.Var(id, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid product id format"}, res.MsgGetFailed, nil))
	}
	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.GetProductImages(jwtPayload, id))
}

// SetThumbnailImage godoc
// @Summary PUT Set Thumbnail Image (Admin)
// @Description Set a specific image as the product thumbnail
// @Tags Products
// @Accept json
// @Produce json
// @Param id path string true "Product ID (UUID)"
// @Param image_id path string true "Image ID (UUID)"
// @Security BearerAuth
// @Success 200 {object} res.ErrorConstant
// @Router /products/admin/{id}/images/{image_id}/thumbnail [put]
func (h *Handler) SetThumbnailImage(c echo.Context) error {
	id := c.Param("id")
	imageID := c.Param("image_id")

	if err := validate.Var(id, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid product id format"}, res.MsgUpdateFailed, nil))
	}
	if err := validate.Var(imageID, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid image id format"}, res.MsgUpdateFailed, nil))
	}

	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.SetThumbnailImage(jwtPayload, id, imageID))
}

// DeleteProductImage godoc
// @Summary DELETE Product Image (Admin)
// @Description Delete a product image from DB and Cloudinary
// @Tags Products
// @Accept json
// @Produce json
// @Param id path string true "Product ID (UUID)"
// @Param image_id path string true "Image ID (UUID)"
// @Security BearerAuth
// @Success 200 {object} res.ErrorConstant
// @Failure 404 {object} res.ErrorConstant
// @Router /products/admin/{id}/images/{image_id} [delete]
func (h *Handler) DeleteProductImage(c echo.Context) error {
	id := c.Param("id")
	imageID := c.Param("image_id")

	if err := validate.Var(id, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid product id format"}, res.MsgDeleteFailed, nil))
	}
	if err := validate.Var(imageID, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid image id format"}, res.MsgDeleteFailed, nil))
	}

	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.DeleteProductImage(jwtPayload, id, imageID))
}

// ============================================================
// VARIANT ENDPOINTS
// ============================================================

// CreateProductVariant godoc
// @Summary POST Create Variant (Admin)
// @Tags Products
// @Accept json
// @Produce json
// @Param id path string true "Product ID (UUID)"
// @Param request body schemas.CreateProductVariant true "Variant data"
// @Security BearerAuth
// @Success 201 {object} res.ErrorConstant
// @Router /products/admin/{id}/variants [post]
func (h *Handler) CreateProductVariant(c echo.Context) error {
	id := c.Param("id")
	if err := validate.Var(id, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid product id format"}, res.MsgAddFailed, nil))
	}

	req := new(schemas.CreateProductVariant)
	if err := c.Bind(req); err != nil {
		return res.RespError(c, &res.ErrBadRequest)
	}

	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.CreateProductVariant(jwtPayload, id, req))
}

// UpdateProductVariant godoc
// @Summary PUT Update Variant (Admin)
// @Tags Products
// @Accept json
// @Produce json
// @Param id path string true "Product ID (UUID)"
// @Param variant_id path string true "Variant ID (UUID)"
// @Param request body schemas.UpdateProductVariant true "Variant data"
// @Security BearerAuth
// @Success 200 {object} res.ErrorConstant
// @Router /products/admin/{id}/variants/{variant_id} [put]
func (h *Handler) UpdateProductVariant(c echo.Context) error {
	id := c.Param("id")
	variantID := c.Param("variant_id")

	if err := validate.Var(id, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid product id format"}, res.MsgUpdateFailed, nil))
	}
	if err := validate.Var(variantID, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid variant id format"}, res.MsgUpdateFailed, nil))
	}

	req := new(schemas.UpdateProductVariant)
	if err := c.Bind(req); err != nil {
		return res.RespError(c, &res.ErrBadRequest)
	}

	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.UpdateProductVariant(jwtPayload, id, variantID, req))
}

// DeleteProductVariant godoc
// @Summary DELETE Variant (Admin)
// @Tags Products
// @Accept json
// @Produce json
// @Param id path string true "Product ID (UUID)"
// @Param variant_id path string true "Variant ID (UUID)"
// @Security BearerAuth
// @Success 200 {object} res.ErrorConstant
// @Router /products/admin/{id}/variants/{variant_id} [delete]
func (h *Handler) DeleteProductVariant(c echo.Context) error {
	id := c.Param("id")
	variantID := c.Param("variant_id")

	if err := validate.Var(id, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid product id format"}, res.MsgDeleteFailed, nil))
	}
	if err := validate.Var(variantID, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid variant id format"}, res.MsgDeleteFailed, nil))
	}

	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.DeleteProductVariant(jwtPayload, id, variantID))
}

// ============================================================
// SPECIFICATION ENDPOINTS
// ============================================================

// CreateProductSpecification godoc
// @Summary POST Create Specification (Admin)
// @Tags Products
// @Accept json
// @Produce json
// @Param id path string true "Product ID (UUID)"
// @Param request body schemas.CreateProductSpecification true "Spec data"
// @Security BearerAuth
// @Success 201 {object} res.ErrorConstant
// @Router /products/admin/{id}/specifications [post]
func (h *Handler) CreateProductSpecification(c echo.Context) error {
	id := c.Param("id")
	if err := validate.Var(id, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid product id format"}, res.MsgAddFailed, nil))
	}

	req := new(schemas.CreateProductSpecification)
	if err := c.Bind(req); err != nil {
		return res.RespError(c, &res.ErrBadRequest)
	}

	if errValid := validate.Struct(req); errValid != nil {
		var errList []string
		errors := util.TranslateError(errValid, util.Translator("en", validate))
		for _, msgErr := range errors {
			errList = append(errList, msgErr.Error())
		}
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, errList, res.MsgAddFailed, nil))
	}

	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.CreateProductSpecification(jwtPayload, id, req))
}

// DeleteProductSpecification godoc
// @Summary DELETE Specification (Admin)
// @Tags Products
// @Accept json
// @Produce json
// @Param id path string true "Product ID (UUID)"
// @Param spec_id path string true "Specification ID (UUID)"
// @Security BearerAuth
// @Success 200 {object} res.ErrorConstant
// @Router /products/admin/{id}/specifications/{spec_id} [delete]
func (h *Handler) DeleteProductSpecification(c echo.Context) error {
	id := c.Param("id")
	specID := c.Param("spec_id")

	if err := validate.Var(id, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid product id format"}, res.MsgDeleteFailed, nil))
	}
	if err := validate.Var(specID, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid spec id format"}, res.MsgDeleteFailed, nil))
	}

	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.DeleteProductSpecification(jwtPayload, id, specID))
}
