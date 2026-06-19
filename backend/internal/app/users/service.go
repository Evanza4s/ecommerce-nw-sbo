package users

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/users/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
)

// ============================================================
// USER SERVICE INTERFACE
// ============================================================

type Service interface {
	// User CRUD
	GetAll(payload *model.JwtPayload, req *schemas.GetAllPagination) (int, interface{})
	GetAllWithoutPagination(payload *model.JwtPayload, req *schemas.GetAll) (int, interface{})
	GetByID(payload *model.JwtPayload, id string) (int, interface{})
	GetProfile(payload *model.JwtPayload, userID string) (int, interface{})
	Create(payload *model.JwtPayload, req *schemas.CreateUser) (int, interface{})
	Update(payload *model.JwtPayload, id string, req *schemas.UpdateUser) (int, interface{})
	UpdateProfile(payload *model.JwtPayload, userID string, req *schemas.UpdateProfile) (int, interface{})
	UpdateStatus(payload *model.JwtPayload, id string, req *schemas.UpdateStatus) (int, interface{})
	Delete(payload *model.JwtPayload, id string) (int, interface{})

	// Password Management
	ChangePassword(payload *model.JwtPayload, userID string, req *schemas.ChangePassword) (int, interface{})

	// Role Management (for admin)
	UpdateUserRole(payload *model.JwtPayload, userID string, roleID string) (int, interface{})

	// Internal use (for auth)
	FindByEmail(email string) (*model.MstUsers, error)
	FindByUsername(username string) (*model.MstUsers, error)
}
