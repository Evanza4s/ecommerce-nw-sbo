package middleware

import (
	"os"
	"strings"
	"time"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/res"
	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

func JWTRefreshMiddleware(
	db *gorm.DB,
) echo.MiddlewareFunc {

	refreshKey := os.Getenv(
		"JWT_REFRESH_TOKEN_SECRET",
	)

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
				&model.JwtRefreshToken{},
				func(token *jwt.Token) (interface{}, error) {
					return []byte(refreshKey), nil
				},
			)

			if err != nil {
				return res.RespError(
					c,
					&res.ErrUnauthorized,
				)
			}

			claims, ok := token.Claims.(*model.JwtRefreshToken)

			if !ok || !token.Valid {
				return res.RespError(
					c,
					&res.ErrUnauthorized,
				)
			}

			var session model.UserSession

			err = db.
				Where(
					"id = ?",
					claims.SessionID,
				).
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

			c.Set(
				"refreshInfo",
				claims,
			)

			return next(c)
		}
	}
}
