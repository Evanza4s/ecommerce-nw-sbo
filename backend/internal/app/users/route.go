package users

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/db"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/middleware"
	"github.com/labstack/echo/v4"
)

// Route registers user routes
func (h Handler) Route(g *echo.Group) {
	// Admin User Management (Superadmin Only)
	admin := g.Group("")
	admin.Use(middleware.JWTMiddleware(db.GetManager()))
	admin.Use(middleware.SuperadminOnly(db.GetManager()))

	// User CRUD
	admin.GET("", h.GetAllWithoutPagination)
	admin.GET("/get-all", h.GetAll)
	admin.GET("/:id", h.GetByID)
	admin.POST("", h.Create)
	admin.PUT("/:id", h.Update)
	admin.DELETE("/:id", h.Delete)

	// User Status and Role
	admin.PUT("/:id/status", h.UpdateStatus)
	admin.PUT("/:id/role/:role_id", h.UpdateRole)

	// Password Management
	admin.PUT("/:id/change-password", h.ChangePassword)

	// Profile Management (Self)
	profile := g.Group("/profile")
	profile.Use(middleware.JWTMiddleware(db.GetManager()))
	profile.GET("", h.GetProfile)
	profile.PUT("", h.UpdateProfile)

	// Change Password (Self)
	g.PUT("/change-password", h.ChangePasswordProfile, middleware.JWTMiddleware(db.GetManager()))
}
