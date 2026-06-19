package user_identities

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/user_identities/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"mime/multipart"
)

type Service interface {
	// GetIdentity retrieves user identity
	GetIdentity(payload *model.JwtPayload, userID string) (int, interface{})

	// UpdateIdentity updates user identity
	UpdateIdentity(payload *model.JwtPayload, userID string, req *schemas.UpdateIdentity) (int, interface{})

	// UploadAvatar uploads avatar image and updates identity
	UploadAvatar(payload *model.JwtPayload, userID string, file *multipart.FileHeader) (int, interface{})

	// DeleteAvatar removes avatar from identity
	DeleteAvatar(payload *model.JwtPayload, userID string) (int, interface{})
}
