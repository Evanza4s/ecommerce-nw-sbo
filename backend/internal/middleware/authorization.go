package middleware

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

func AdminOnly(
	db *gorm.DB,
) echo.MiddlewareFunc {

	return func(
		next echo.HandlerFunc,
	) echo.HandlerFunc {

		return func(
			c echo.Context,
		) error {

			payload := c.Get(
				"userInfo",
			).(*model.JwtPayload)

			var role model.MstRoles

			err := db.
				First(
					&role,
					payload.RoleID,
				).
				Error

			if err != nil {
				return echo.ErrForbidden
			}

			if !role.IsAdmin &&
				!role.IsSuperadmin {

				return echo.ErrForbidden
			}

			return next(c)
		}
	}
}

func SuperadminOnly(
	db *gorm.DB,
) echo.MiddlewareFunc {

	return func(
		next echo.HandlerFunc,
	) echo.HandlerFunc {

		return func(
			c echo.Context,
		) error {

			payload := c.Get(
				"userInfo",
			).(*model.JwtPayload)

			var role model.MstRoles

			err := db.
				First(
					&role,
					payload.RoleID,
				).
				Error

			if err != nil {
				return echo.ErrForbidden
			}

			if !role.IsSuperadmin {
				return echo.ErrForbidden
			}

			return next(c)
		}
	}
}
