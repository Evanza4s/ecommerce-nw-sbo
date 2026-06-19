package products

import (
	"errors"
	"mime/multipart"
	"net/http"
	"strings"
	"time"
	"unicode"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/products/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/repository"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/repository/repository_impl"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/cloud"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/res"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// ============================================================
// SERVICE IMPLEMENTATION
// ============================================================

type ServiceImpl struct {
	productRepo repository.ProductRepository
}

func NewServiceImpl() *ServiceImpl {
	return &ServiceImpl{
		productRepo: repository_impl.NewProductRepositoryImpl(),
	}
}

// ============================================================
// HELPERS
// ============================================================

// generateSlugFromName converts product name to a URL-friendly slug
func generateSlugFromName(name string) string {
	lower := strings.ToLower(name)
	var b strings.Builder
	prevDash := false
	for _, r := range lower {
		if unicode.IsLetter(r) || unicode.IsDigit(r) {
			b.WriteRune(r)
			prevDash = false
		} else if !prevDash {
			b.WriteRune('-')
			prevDash = true
		}
	}
	return strings.Trim(b.String(), "-")
}

// toProductResponse maps model to lightweight response
func toProductResponse(p model.MstProduct) schemas.ProductResponse {
	resp := schemas.ProductResponse{
		ID:            p.ID,
		CategoryID:    p.CategoryID,
		ProductName:   p.ProductName,
		ProductSlug:   p.ProductSlug,
		Brand:         p.Brand,
		Gender:        p.Gender,
		Price:         p.Price,
		DiscountPrice: p.DiscountPrice,
		Stock:         p.Stock,
		ThumbnailURL:  p.ThumbnailURL,
		AverageRating: p.AverageRating,
		TotalReviews:  p.TotalReviews,
		SoldCount:     p.SoldCount,
		Status:        p.Status,
		IsActive:      p.IsActive,
		CreatedAt:     p.CreatedAt,
	}

	if p.CategoryRef != nil && p.CategoryRef.ID != uuid.Nil {
		resp.Category = &schemas.CategoryInProductResponse{
			ID:           p.CategoryRef.ID,
			CategoryName: p.CategoryRef.Name,
			CategorySlug: p.CategoryRef.Slug,
		}
	}
	return resp
}

// toProductDetailResponse maps model to detailed response
func toProductDetailResponse(p model.MstProduct) schemas.ProductDetailResponse {
	resp := schemas.ProductDetailResponse{
		ID:             p.ID,
		CategoryID:     p.CategoryID,
		ProductName:    p.ProductName,
		ProductSlug:    p.ProductSlug,
		Description:    p.Description,
		Brand:          p.Brand,
		Gender:         p.Gender,
		Material:       p.Material,
		Price:          p.Price,
		DiscountPrice:  p.DiscountPrice,
		Stock:          p.Stock,
		Weight:         p.Weight,
		ThumbnailURL:   p.ThumbnailURL,
		AverageRating:  p.AverageRating,
		TotalReviews:   p.TotalReviews,
		SoldCount:      p.SoldCount,
		ViewCount:      p.ViewCount,
		SeoTitle:       p.SeoTitle,
		SeoDescription: p.SeoDescription,
		Status:         p.Status,
		IsActive:       p.IsActive,
		PublishedAt:    p.PublishedAt,
		CreatedAt:      p.CreatedAt,
		UpdatedAt:      p.UpdatedAt,
	}

	if p.CategoryRef != nil && p.CategoryRef.ID != uuid.Nil {
		resp.Category = &schemas.CategoryInProductResponse{
			ID:           p.CategoryRef.ID,
			CategoryName: p.CategoryRef.Name,
			CategorySlug: p.CategoryRef.Slug,
		}
	}

	// Map images
	resp.Images = make([]schemas.ProductImageResponse, 0, len(p.Images))
	for _, img := range p.Images {
		resp.Images = append(resp.Images, schemas.ProductImageResponse{
			ID:          img.ID,
			ProductID:   img.ProductID,
			ImageURL:    img.ImageURL,
			IsThumbnail: img.IsThumbnail,
			SortOrder:   img.SortOrder,
		})
	}

	// Map variants
	resp.Variants = make([]schemas.ProductVariantResponse, 0, len(p.Variants))
	for _, v := range p.Variants {
		resp.Variants = append(resp.Variants, schemas.ProductVariantResponse{
			ID:              v.ID,
			ProductID:       v.ProductID,
			Color:           v.Color,
			Size:            v.Size,
			SKU:             v.SKU,
			Barcode:         v.Barcode,
			Stock:           v.Stock,
			Weight:          v.Weight,
			PriceAdjustment: v.PriceAdjustment,
			VariantImage:    v.VariantImage,
			IsActive:        v.IsActive,
			CreatedAt:       v.CreatedAt,
			UpdatedAt:       v.UpdatedAt,
		})
	}

	// Map specifications
	resp.Specifications = make([]schemas.ProductSpecificationResponse, 0, len(p.Specifications))
	for _, s := range p.Specifications {
		resp.Specifications = append(resp.Specifications, schemas.ProductSpecificationResponse{
			ID:        s.ID,
			ProductID: s.ProductID,
			SpecName:  s.SpecName,
			SpecValue: s.SpecValue,
		})
	}

	return resp
}

// ============================================================
// PUBLIC ENDPOINTS
// ============================================================

// GetProducts retrieves paginated product list with filters
func (s ServiceImpl) GetProducts(req *schemas.GetProductsPagination) (int, interface{}) {
	filters := map[string]interface{}{
		"search":      req.Search,
		"category_id": req.CategoryID,
		"brand":       req.Brand,
		"gender":      req.Gender,
		"status":      req.Status,
		"is_active":   req.IsActive,
		"min_price":   req.MinPrice,
		"max_price":   req.MaxPrice,
	}

	products, pageInfo, err := s.productRepo.FindAll(filters, req.Page, req.PageSize)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgGetFailed, nil)
	}

	var responses []schemas.ProductResponse
	for _, p := range products {
		responses = append(responses, toProductResponse(p))
	}

	return res.BuildCustomResponsePagination(res.StatusSuccess, http.StatusOK, nil, res.MsgGetSuccess, responses, pageInfo)
}

// GetProductBySlug retrieves a product by slug (public)
func (s ServiceImpl) GetProductBySlug(slug string) (int, interface{}) {
	product, err := s.productRepo.FindBySlug(slug)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusFailed, http.StatusNotFound, []string{"product not found"}, res.MsgGetFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgGetFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgGetSuccess, toProductDetailResponse(*product))
}

// ============================================================
// ADMIN CRUD
// ============================================================

// GetProductByID retrieves a product by ID
func (s ServiceImpl) GetProductByID(payload *model.JwtPayload, id string) (int, interface{}) {
	parsedID, err := uuid.Parse(id)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid product id"}, res.MsgGetFailed, nil)
	}

	product, err := s.productRepo.FindByID(parsedID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusFailed, http.StatusNotFound, []string{"product not found"}, res.MsgGetFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgGetFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgGetSuccess, toProductDetailResponse(*product))
}

// CreateProduct creates a new product with optional variants and specifications
func (s ServiceImpl) CreateProduct(payload *model.JwtPayload, req *schemas.CreateProduct) (int, interface{}) {
	parsedCategoryID, err := uuid.Parse(req.CategoryID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid category id"}, res.MsgAddFailed, nil)
	}

	// Generate slug
	slug := req.ProductSlug
	if slug == "" {
		slug = generateSlugFromName(req.ProductName)
	}

	// Ensure slug uniqueness
	repoImpl := s.productRepo.(*repository_impl.ProductRepositoryImpl)
	slug = repository_impl.GenerateUniqueSlug(slug, repoImpl, nil)

	// Determine status
	status := req.Status
	if status == "" {
		status = "draft"
	}

	now := time.Now()
	product := model.MstProduct{
		CategoryID:     parsedCategoryID,
		ProductName:    req.ProductName,
		ProductSlug:    slug,
		Description:    req.Description,
		Brand:          req.Brand,
		Gender:         req.Gender,
		Material:       req.Material,
		Price:          req.Price,
		DiscountPrice:  req.DiscountPrice,
		Stock:          req.Stock,
		Weight:         req.Weight,
		SeoTitle:       req.SeoTitle,
		SeoDescription: req.SeoDescription,
		Status:         status,
		IsActive:       req.IsActive,
	}

	if payload != nil {
		product.CreatedBy = payload.UserID
	}

	if status == "active" {
		product.PublishedAt = &now
	}

	savedProduct, err := s.productRepo.Save(product)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgAddFailed, nil)
	}

	// Save variants
	for _, v := range req.Variants {
		variant := model.MstProductVariant{
			ProductID:       savedProduct.ID,
			Color:           v.Color,
			Size:            v.Size,
			SKU:             v.SKU,
			Barcode:         v.Barcode,
			Stock:           v.Stock,
			Weight:          v.Weight,
			PriceAdjustment: v.PriceAdjustment,
			IsActive:        v.IsActive,
		}
		if payload != nil {
			variant.CreatedBy = payload.UserID
		}
		s.productRepo.SaveVariant(variant)
	}

	// Save specifications
	for _, sp := range req.Specifications {
		spec := model.MstProductSpecification{
			ProductID: savedProduct.ID,
			SpecName:  sp.SpecName,
			SpecValue: sp.SpecValue,
		}
		s.productRepo.SaveSpecification(spec)
	}

	// Reload with relations
	full, _ := s.productRepo.FindByID(savedProduct.ID)
	if full != nil {
		return res.BuildCustomResponse(res.StatusSuccess, http.StatusCreated, nil, res.MsgCreated, toProductDetailResponse(*full))
	}
	return res.BuildCustomResponse(res.StatusSuccess, http.StatusCreated, nil, res.MsgCreated, savedProduct)
}

// UpdateProduct updates an existing product
func (s ServiceImpl) UpdateProduct(payload *model.JwtPayload, id string, req *schemas.UpdateProduct) (int, interface{}) {
	parsedID, err := uuid.Parse(id)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid product id"}, res.MsgUpdateFailed, nil)
	}

	existing, err := s.productRepo.FindByID(parsedID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusFailed, http.StatusNotFound, []string{"product not found"}, res.MsgUpdateFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgUpdateFailed, nil)
	}

	// Apply updates
	if req.ProductName != "" {
		existing.ProductName = req.ProductName
	}
	if req.ProductSlug != "" {
		// Check slug uniqueness
		repoImpl := s.productRepo.(*repository_impl.ProductRepositoryImpl)
		slug := repository_impl.GenerateUniqueSlug(req.ProductSlug, repoImpl, &parsedID)
		existing.ProductSlug = slug
	}
	if req.CategoryID != "" {
		parsedCatID, err := uuid.Parse(req.CategoryID)
		if err == nil {
			existing.CategoryID = parsedCatID
		}
	}
	if req.Description != "" {
		existing.Description = req.Description
	}
	if req.Brand != "" {
		existing.Brand = req.Brand
	}
	if req.Gender != "" {
		existing.Gender = req.Gender
	}
	if req.Material != "" {
		existing.Material = req.Material
	}
	if req.Price > 0 {
		existing.Price = req.Price
	}
	if req.DiscountPrice >= 0 {
		existing.DiscountPrice = req.DiscountPrice
	}
	if req.Stock != nil {
		existing.Stock = *req.Stock
	}
	if req.Weight > 0 {
		existing.Weight = req.Weight
	}
	if req.SeoTitle != "" {
		existing.SeoTitle = req.SeoTitle
	}
	if req.SeoDescription != "" {
		existing.SeoDescription = req.SeoDescription
	}
	if req.Status != "" {
		existing.Status = req.Status
		if req.Status == "active" && existing.PublishedAt == nil {
			now := time.Now()
			existing.PublishedAt = &now
		}
	}
	if req.IsActive != nil {
		existing.IsActive = *req.IsActive
	}

	if payload != nil {
		existing.UpdatedBy = &payload.UserID
	}

	result, err := s.productRepo.Update(*existing)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgUpdateFailed, nil)
	}

	// Synchronize variants
	if len(req.Variants) > 0 {
		existingVariants, _ := s.productRepo.FindVariantsByProductID(result.ID)
		
		for _, incoming := range req.Variants {
			var matched *model.MstProductVariant
			for i, ev := range existingVariants {
				if ev.Color == incoming.Color && ev.Size == incoming.Size {
					matched = &existingVariants[i]
					break
				}
			}

			if matched != nil {
				matched.SKU = incoming.SKU
				matched.Stock = incoming.Stock
				matched.Weight = incoming.Weight
				matched.PriceAdjustment = incoming.PriceAdjustment
				matched.IsActive = incoming.IsActive
				if payload != nil {
					matched.UpdatedBy = &payload.UserID
				}
				s.productRepo.UpdateVariant(*matched)
			} else {
				newVariant := model.MstProductVariant{
					ProductID:       result.ID,
					Color:           incoming.Color,
					Size:            incoming.Size,
					SKU:             incoming.SKU,
					Barcode:         incoming.Barcode,
					Stock:           incoming.Stock,
					Weight:          incoming.Weight,
					PriceAdjustment: incoming.PriceAdjustment,
					IsActive:        incoming.IsActive,
				}
				if payload != nil {
					newVariant.CreatedBy = payload.UserID
				}
				s.productRepo.SaveVariant(newVariant)
			}
		}

		// Disable variants that are not in the incoming request
		for _, ev := range existingVariants {
			found := false
			for _, incoming := range req.Variants {
				if ev.Color == incoming.Color && ev.Size == incoming.Size {
					found = true
					break
				}
			}
			if !found && ev.IsActive {
				ev.IsActive = false
				if payload != nil {
					ev.UpdatedBy = &payload.UserID
				}
				s.productRepo.UpdateVariant(ev)
			}
		}
	}

	// Synchronize specifications
	if req.Specifications != nil {
		// Delete existing specifications
		s.productRepo.DeleteAllSpecificationsByProductID(result.ID)
		
		// Insert new specifications
		for _, sp := range req.Specifications {
			spec := model.MstProductSpecification{
				ProductID: result.ID,
				SpecName:  sp.SpecName,
				SpecValue: sp.SpecValue,
			}
			s.productRepo.SaveSpecification(spec)
		}
	}

	full, _ := s.productRepo.FindByID(result.ID)
	if full != nil {
		return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgUpdateSuccess, toProductDetailResponse(*full))
	}
	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgUpdateSuccess, result)
}

// DeleteProduct soft deletes a product
func (s ServiceImpl) DeleteProduct(payload *model.JwtPayload, id string) (int, interface{}) {
	parsedID, err := uuid.Parse(id)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid product id"}, res.MsgDeleteFailed, nil)
	}

	product, err := s.productRepo.FindByID(parsedID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusFailed, http.StatusNotFound, []string{"product not found"}, res.MsgDeleteFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgDeleteFailed, nil)
	}

	if payload != nil {
		product.DeletedBy = &payload.UserID
	}

	if err := s.productRepo.Delete(product); err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgDeleteFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgDeleteSuccess, nil)
}

// ============================================================
// IMAGE MANAGEMENT
// ============================================================

// UploadProductImage uploads image to Cloudinary and saves URL to DB
func (s ServiceImpl) UploadProductImage(payload *model.JwtPayload, productID string, file *multipart.FileHeader, isThumbnail bool, sortOrder int) (int, interface{}) {
	parsedID, err := uuid.Parse(productID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid product id"}, res.MsgAddFailed, nil)
	}

	// Verify product exists
	_, err = s.productRepo.FindByID(parsedID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusFailed, http.StatusNotFound, []string{"product not found"}, res.MsgAddFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgAddFailed, nil)
	}

	// Validate image file
	if err := cloud.ValidateImageFile(file); err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgAddFailed, nil)
	}

	// Upload to Cloudinary — folder: home/products/<product_id>
	folder := cloud.FolderProducts + "/" + productID
	imageURL, err := cloud.UploadImage(file, folder)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{"failed to upload image: " + err.Error()}, res.MsgAddFailed, nil)
	}

	// Check if this is the first image for the product
	existingImages, _ := s.productRepo.FindImagesByProductID(parsedID)
	if len(existingImages) == 0 {
		isThumbnail = true
	}

	// If set as thumbnail manually or automatically, unset all previous thumbnails
	if isThumbnail && len(existingImages) > 0 {
		s.productRepo.UnsetAllThumbnails(parsedID)
	}

	// Save image record to DB
	imageRecord := model.MstProductImage{
		ProductID:   parsedID,
		ImageURL:    imageURL,
		IsThumbnail: isThumbnail,
		SortOrder:   sortOrder,
	}

	if payload != nil {
		imageRecord.CreatedBy = payload.UserID
	}

	saved, err := s.productRepo.SaveImage(imageRecord)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgAddFailed, nil)
	}

	// If thumbnail, update product.thumbnail_url
	if isThumbnail {
		s.productRepo.SetThumbnail(parsedID, saved.ID)
	}

	response := schemas.ProductImageUploadResponse{
		ID:          saved.ID,
		ProductID:   saved.ProductID,
		ImageURL:    saved.ImageURL,
		IsThumbnail: saved.IsThumbnail,
		SortOrder:   saved.SortOrder,
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusCreated, nil, res.MsgCreated, response)
}

// GetProductImages retrieves all images for a product
func (s ServiceImpl) GetProductImages(payload *model.JwtPayload, productID string) (int, interface{}) {
	parsedID, err := uuid.Parse(productID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid product id"}, res.MsgGetFailed, nil)
	}

	images, err := s.productRepo.FindImagesByProductID(parsedID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgGetFailed, nil)
	}

	var responses []schemas.ProductImageResponse
	for _, img := range images {
		responses = append(responses, schemas.ProductImageResponse{
			ID:          img.ID,
			ProductID:   img.ProductID,
			ImageURL:    img.ImageURL,
			IsThumbnail: img.IsThumbnail,
			SortOrder:   img.SortOrder,
		})
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgGetSuccess, responses)
}

// SetThumbnailImage sets a specific image as thumbnail
func (s ServiceImpl) SetThumbnailImage(payload *model.JwtPayload, productID string, imageID string) (int, interface{}) {
	parsedProductID, err := uuid.Parse(productID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid product id"}, res.MsgUpdateFailed, nil)
	}
	parsedImageID, err := uuid.Parse(imageID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid image id"}, res.MsgUpdateFailed, nil)
	}

	if err := s.productRepo.SetThumbnail(parsedProductID, parsedImageID); err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgUpdateFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgUpdateSuccess, nil)
}

// DeleteProductImage deletes an image from DB (Cloudinary cleanup is async)
func (s ServiceImpl) DeleteProductImage(payload *model.JwtPayload, productID string, imageID string) (int, interface{}) {
	parsedProductID, err := uuid.Parse(productID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid product id"}, res.MsgDeleteFailed, nil)
	}
	parsedImageID, err := uuid.Parse(imageID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid image id"}, res.MsgDeleteFailed, nil)
	}

	image, err := s.productRepo.FindImageByID(parsedImageID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusFailed, http.StatusNotFound, []string{"image not found"}, res.MsgDeleteFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgDeleteFailed, nil)
	}

	// Ensure image belongs to this product
	if image.ProductID != parsedProductID {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusForbidden, []string{"image does not belong to this product"}, res.MsgDeleteFailed, nil)
	}

	// Delete from Cloudinary
	publicID := cloud.ExtractPublicIDFromURL(image.ImageURL)
	if publicID != "" {
		cloud.DeleteImage(publicID)
	}

	if err := s.productRepo.DeleteImage(image); err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgDeleteFailed, nil)
	}

	// If this was a thumbnail, update product
	if image.IsThumbnail {
		remaining, _ := s.productRepo.FindImagesByProductID(parsedProductID)
		if len(remaining) > 0 {
			s.productRepo.SetThumbnail(parsedProductID, remaining[0].ID)
		}
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgDeleteSuccess, nil)
}

// ============================================================
// VARIANT MANAGEMENT
// ============================================================

// CreateProductVariant creates a new variant for a product
func (s ServiceImpl) CreateProductVariant(payload *model.JwtPayload, productID string, req *schemas.CreateProductVariant) (int, interface{}) {
	parsedID, err := uuid.Parse(productID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid product id"}, res.MsgAddFailed, nil)
	}

	_, err = s.productRepo.FindByID(parsedID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusFailed, http.StatusNotFound, []string{"product not found"}, res.MsgAddFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgAddFailed, nil)
	}

	variant := model.MstProductVariant{
		ProductID:       parsedID,
		Color:           req.Color,
		Size:            req.Size,
		SKU:             req.SKU,
		Barcode:         req.Barcode,
		Stock:           req.Stock,
		Weight:          req.Weight,
		PriceAdjustment: req.PriceAdjustment,
		IsActive:        req.IsActive,
	}

	if payload != nil {
		variant.CreatedBy = payload.UserID
	}

	saved, err := s.productRepo.SaveVariant(variant)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgAddFailed, nil)
	}

	response := schemas.ProductVariantResponse{
		ID:              saved.ID,
		ProductID:       saved.ProductID,
		Color:           saved.Color,
		Size:            saved.Size,
		SKU:             saved.SKU,
		Barcode:         saved.Barcode,
		Stock:           saved.Stock,
		Weight:          saved.Weight,
		PriceAdjustment: saved.PriceAdjustment,
		IsActive:        saved.IsActive,
		CreatedAt:       saved.CreatedAt,
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusCreated, nil, res.MsgCreated, response)
}

// UpdateProductVariant updates a variant
func (s ServiceImpl) UpdateProductVariant(payload *model.JwtPayload, productID string, variantID string, req *schemas.UpdateProductVariant) (int, interface{}) {
	parsedProductID, err := uuid.Parse(productID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid product id"}, res.MsgUpdateFailed, nil)
	}
	parsedVariantID, err := uuid.Parse(variantID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid variant id"}, res.MsgUpdateFailed, nil)
	}

	variant, err := s.productRepo.FindVariantByID(parsedVariantID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusFailed, http.StatusNotFound, []string{"variant not found"}, res.MsgUpdateFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgUpdateFailed, nil)
	}

	if variant.ProductID != parsedProductID {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusForbidden, []string{"variant does not belong to this product"}, res.MsgUpdateFailed, nil)
	}

	if req.Color != "" {
		variant.Color = req.Color
	}
	if req.Size != "" {
		variant.Size = req.Size
	}
	if req.SKU != "" {
		variant.SKU = req.SKU
	}
	if req.Barcode != "" {
		variant.Barcode = req.Barcode
	}
	if req.Stock != nil {
		variant.Stock = *req.Stock
	}
	if req.Weight > 0 {
		variant.Weight = req.Weight
	}
	if req.PriceAdjustment != 0 {
		variant.PriceAdjustment = req.PriceAdjustment
	}
	if req.IsActive != nil {
		variant.IsActive = *req.IsActive
	}

	if payload != nil {
		variant.UpdatedBy = &payload.UserID
	}

	result, err := s.productRepo.UpdateVariant(*variant)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgUpdateFailed, nil)
	}

	response := schemas.ProductVariantResponse{
		ID:              result.ID,
		ProductID:       result.ProductID,
		Color:           result.Color,
		Size:            result.Size,
		SKU:             result.SKU,
		Barcode:         result.Barcode,
		Stock:           result.Stock,
		Weight:          result.Weight,
		PriceAdjustment: result.PriceAdjustment,
		IsActive:        result.IsActive,
		CreatedAt:       result.CreatedAt,
		UpdatedAt:       result.UpdatedAt,
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgUpdateSuccess, response)
}

// DeleteProductVariant deletes a variant
func (s ServiceImpl) DeleteProductVariant(payload *model.JwtPayload, productID string, variantID string) (int, interface{}) {
	parsedProductID, err := uuid.Parse(productID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid product id"}, res.MsgDeleteFailed, nil)
	}
	parsedVariantID, err := uuid.Parse(variantID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid variant id"}, res.MsgDeleteFailed, nil)
	}

	variant, err := s.productRepo.FindVariantByID(parsedVariantID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusFailed, http.StatusNotFound, []string{"variant not found"}, res.MsgDeleteFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgDeleteFailed, nil)
	}

	if variant.ProductID != parsedProductID {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusForbidden, []string{"variant does not belong to this product"}, res.MsgDeleteFailed, nil)
	}

	if payload != nil {
		variant.DeletedBy = &payload.UserID
	}

	if err := s.productRepo.DeleteVariant(variant); err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgDeleteFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgDeleteSuccess, nil)
}

// ============================================================
// SPECIFICATION MANAGEMENT
// ============================================================

// CreateProductSpecification adds a specification to a product
func (s ServiceImpl) CreateProductSpecification(payload *model.JwtPayload, productID string, req *schemas.CreateProductSpecification) (int, interface{}) {
	parsedID, err := uuid.Parse(productID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid product id"}, res.MsgAddFailed, nil)
	}

	_, err = s.productRepo.FindByID(parsedID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusFailed, http.StatusNotFound, []string{"product not found"}, res.MsgAddFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgAddFailed, nil)
	}

	spec := model.MstProductSpecification{
		ProductID: parsedID,
		SpecName:  req.SpecName,
		SpecValue: req.SpecValue,
	}

	if payload != nil {
		spec.CreatedBy = payload.UserID
	}

	saved, err := s.productRepo.SaveSpecification(spec)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgAddFailed, nil)
	}

	response := schemas.ProductSpecificationResponse{
		ID:        saved.ID,
		ProductID: saved.ProductID,
		SpecName:  saved.SpecName,
		SpecValue: saved.SpecValue,
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusCreated, nil, res.MsgCreated, response)
}

// DeleteProductSpecification deletes a specification
func (s ServiceImpl) DeleteProductSpecification(payload *model.JwtPayload, productID string, specID string) (int, interface{}) {
	parsedProductID, err := uuid.Parse(productID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid product id"}, res.MsgDeleteFailed, nil)
	}
	parsedSpecID, err := uuid.Parse(specID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid spec id"}, res.MsgDeleteFailed, nil)
	}

	specs, err := s.productRepo.FindSpecificationsByProductID(parsedProductID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgDeleteFailed, nil)
	}

	var targetSpec *model.MstProductSpecification
	for i := range specs {
		if specs[i].ID == parsedSpecID {
			targetSpec = &specs[i]
			break
		}
	}

	if targetSpec == nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusNotFound, []string{"specification not found"}, res.MsgDeleteFailed, nil)
	}

	if err := s.productRepo.DeleteSpecification(targetSpec); err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgDeleteFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgDeleteSuccess, nil)
}
