package schemas

import (
	"fmt"
	"unicode"

	"github.com/google/uuid"
)

type GetAllPagination struct {
	ID         string `json:"id" query:"id"`
	Email      string `json:"email" query:"email"`
	Username   string `json:"username" query:"username"`
	IsActive   *bool  `json:"is_active" query:"is_active"`
	IsVerified *bool  `json:"is_verified" query:"is_verified"`
	RoleID     string `json:"role_id" query:"role_id"`
	Page       int    `json:"page" query:"page" validate:"required,min=1"`
	PageSize   int    `json:"page_size" query:"page_size" validate:"required,min=1,max=100"`
}

type GetAll struct {
	ID         string `json:"id" query:"id"`
	Email      string `json:"email" query:"email"`
	Username   string `json:"username" query:"username"`
	IsActive   *bool  `json:"is_active" query:"is_active"`
	IsVerified *bool  `json:"is_verified" query:"is_verified"`
	RoleID     string `json:"role_id" query:"role_id"`
}

type CreateUser struct {
	Email    string `json:"email" validate:"required,email"`
	Username string `json:"username" validate:"required,min=3,max=100"`
	Password string `json:"password" validate:"required,min=8,max=72"`
	Fullname string `json:"fullname" validate:"required"`
	RoleID   string `json:"role_id" validate:"required,uuid"`
	IsActive bool   `json:"is_active"`
}

type UpdateUser struct {
	Email      string `json:"email" validate:"omitempty,email"`
	Username   string `json:"username" validate:"omitempty,min=3,max=100"`
	Fullname   string `json:"fullname"`
	RoleID     string `json:"role_id" validate:"omitempty,uuid"`
	IsActive   *bool  `json:"is_active"`
	IsVerified *bool  `json:"is_verified"`
}

type UpdateProfile struct {
	Fullname string `json:"fullname" validate:"omitempty"`
	Username string `json:"username" validate:"omitempty,min=3,max=100"`
}

type ChangePassword struct {
	CurrentPassword string `json:"current_password" validate:"required"`
	NewPassword     string `json:"new_password" validate:"required,min=8,max=72"`
	ConfirmPassword string `json:"confirm_password" validate:"required"`
}

type UpdateStatus struct {
	IsActive *bool `json:"is_active" validate:"required"`
}

type UserRoleRequest struct {
	UserID string `json:"user_id" validate:"required,uuid"`
	RoleID string `json:"role_id" validate:"required,uuid"`
}

func (u *CreateUser) ValidatePassword() []error {
	var errList []error

next:
	for name, classes := range map[string][]*unicode.RangeTable{
		"upper case": {unicode.Upper, unicode.Title},
		"lower case": {unicode.Lower},
		"numeric":    {unicode.Number, unicode.Digit},
		"special":    {unicode.Space, unicode.Symbol, unicode.Punct, unicode.Mark},
	} {
		for _, r := range u.Password {
			if unicode.IsOneOf(classes, r) {
				continue next
			}
		}
		errList = append(errList, fmt.Errorf("password must have at least one %s character", name))
	}

	if len(errList) > 0 {
		return errList
	}

	return nil
}

func (u *ChangePassword) ValidateChangePassword() []error {
	var errList []error

	if u.NewPassword != u.ConfirmPassword {
		errList = append(errList, fmt.Errorf("new password and confirm password do not match"))
	}

next:
	for name, classes := range map[string][]*unicode.RangeTable{
		"upper case": {unicode.Upper, unicode.Title},
		"lower case": {unicode.Lower},
		"numeric":    {unicode.Number, unicode.Digit},
		"special":    {unicode.Space, unicode.Symbol, unicode.Punct, unicode.Mark},
	} {
		for _, r := range u.NewPassword {
			if unicode.IsOneOf(classes, r) {
				continue next
			}
		}
		errList = append(errList, fmt.Errorf("new password must have at least one %s character", name))
	}

	if len(errList) > 0 {
		return errList
	}

	return nil
}

func ToUserID(id string) (uuid.UUID, error) {
	return uuid.Parse(id)
}
