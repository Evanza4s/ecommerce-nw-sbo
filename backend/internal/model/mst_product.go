package model

import (
	"time"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/google/uuid"
)

type MstProduct struct {
	utils.DefaultModel
	CategoryID        uuid.UUID                 `json:"category_id" gorm:"type:uuid;not null"`
	ProductName       string                    `json:"product_name" gorm:"type:varchar(255);not null"`
	ProductSlug       string                    `json:"product_slug" gorm:"type:varchar(255);unique"`
	Description       string                    `json:"description" gorm:"type:text"`
	Brand             string                    `json:"brand" gorm:"type:varchar(100)"`
	Gender            string                    `json:"gender" gorm:"type:varchar(30)"`
	Material          string                    `json:"material" gorm:"type:varchar(150)"`
	Price             float64                   `json:"price" gorm:"type:numeric(18,2);not null"`
	DiscountPrice     float64                   `json:"discount_price" gorm:"type:numeric(18,2)"`
	Stock             int                       `json:"stock" gorm:"default:0"`
	Weight            float64                   `json:"weight" gorm:"type:numeric(10,2)"`
	ThumbnailURL      string                    `json:"thumbnail_url" gorm:"type:text"`
	AverageRating     float64                   `json:"average_rating" gorm:"type:numeric(3,2);default:0"`
	TotalReviews      int                       `json:"total_reviews" gorm:"default:0"`
	SoldCount         int64                     `json:"sold_count" gorm:"default:0"`
	ViewCount         int64                     `json:"view_count" gorm:"default:0"`
	SeoTitle          string                    `json:"seo_title" gorm:"type:varchar(255)"`
	SeoDescription    string                    `json:"seo_description" gorm:"type:text"`
	Status            string                    `json:"status" gorm:"type:varchar(30)"`
	IsActive          bool                      `json:"is_active" gorm:"default:true"`
	PublishedAt       *time.Time                `json:"published_at"`
	CategoryRef       *MstCategory               `gorm:"foreignKey:CategoryID"`
	Variants          []MstProductVariant       `gorm:"foreignKey:ProductID"`
	Images            []MstProductImage         `gorm:"foreignKey:ProductID"`
	Specifications    []MstProductSpecification `gorm:"foreignKey:ProductID"`
	PromotionProducts []MstPromotionProduct     `gorm:"foreignKey:ProductID"`
}

func (MstProduct) TableName() string {
	return "public.mst_product"
}
