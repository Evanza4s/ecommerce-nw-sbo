package model

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/crypto"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type JwtPayload struct {
	UserID        uuid.UUID      `json:"user_id"`
	SessionID     uuid.UUID      `json:"session_id"`
	RoleID        uuid.UUID      `json:"role_id"`
	Email         string         `json:"email"`
	Username      string         `json:"username"`
	ListUserAccess []interface{} `json:"list_user_access,omitempty"`
	jwt.RegisteredClaims
}

type JwtRefreshToken struct {
	UserID    uuid.UUID `json:"user_id"`
	SessionID uuid.UUID `json:"session_id"`
	RoleID    uuid.UUID `json:"role_id"`
	Email     string    `json:"email"`
	jwt.RegisteredClaims
}

type User struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	RoleID   string `json:"role_id"`
	RoleName string `json:"role_name"`
}

func DecryptPayload(
	in JwtPayload,
) JwtPayload {

	return JwtPayload{
		UserID: in.UserID,

		SessionID: in.SessionID,

		RoleID: in.RoleID,

		Email: in.Email,

		Username: in.Username,

		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: in.ExpiresAt,

			ID: crypto.RsaDecrypt(in.ID),

			IssuedAt: in.IssuedAt,

			Issuer: crypto.RsaDecrypt(in.Issuer),

			Subject: crypto.RsaDecrypt(in.Subject),
		},
	}
}
