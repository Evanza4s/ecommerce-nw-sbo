package middleware

import (
	"context"
	"os"
	"strings"
	"time"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/res"
	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

func JWTMiddleware(
	db *gorm.DB,
) echo.MiddlewareFunc {

	jwtKey := os.Getenv("JWT_KEY")

	return func(
		next echo.HandlerFunc,
	) echo.HandlerFunc {

		return func(
			c echo.Context,
		) error {

			authHeader := c.Request().
				Header.
				Get("Authorization")

			if authHeader == "" {
				return res.RespError(
					c,
					&res.ErrUnauthorized,
				)
			}

			tokenString := strings.TrimPrefix(
				authHeader,
				"Bearer ",
			)

			token, err := jwt.ParseWithClaims(
				tokenString,
				&model.JwtPayload{},
				func(token *jwt.Token) (interface{}, error) {
					return []byte(jwtKey), nil
				},
			)

			if err != nil {
				return res.RespError(
					c,
					&res.ErrUnauthorized,
				)
			}

			claims, ok := token.Claims.(*model.JwtPayload)

			if !ok || !token.Valid {
				return res.RespError(
					c,
					&res.ErrUnauthorized,
				)
			}

			var session model.UserSession

			err = db.
				Where("id = ?", claims.SessionID).
				First(&session).
				Error

			if err != nil {
				return res.RespError(
					c,
					&res.ErrUnauthorized,
				)
			}

			if session.RevokedAt != nil {
				return res.RespError(
					c,
					&res.ErrUnauthorized,
				)
			}

			if session.ExpiredAt.Before(
				time.Now(),
			) {

				return res.RespError(
					c,
					&res.ErrUnauthorized,
				)
			}

			var user model.MstUsers

			err = db.
				Preload("RoleRef").
				Where(
					"id = ? AND is_active = true",
					claims.UserID,
				).
				First(&user).
				Error

			if err != nil {
				return res.RespError(
					c,
					&res.ErrUnauthorized,
				)
			}

			now := time.Now()

			if session.LastActivityAt == nil || time.Since(*session.LastActivityAt) > 5*time.Minute {
				db.Model(&session).
					Update(
						"last_activity_at",
						now,
					)
			}

			c.Set("userInfo", claims)
			c.Set("user", &user)

			ctx := context.WithValue(
				db.Statement.Context,
				"userInfo",
				claims,
			)

			db.Statement.Context = ctx

			return next(c)
		}
	}
}
