package user_identities

import (
	"net/http"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/user_identities/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/res"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

type Handler struct {
	service Service
}

func NewUserIdentityHandler() *Handler {
	return &Handler{
		service: NewServiceImpl(),
	}
}

// ============================================================
// GET IDENTITY
// ============================================================

// GetIdentity retrieves user identity
// @Summary GET User Identity
// @Description Get user identity by user ID
// @Tags User Identity
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /user-identities/{id}/identity [get]
func (h Handler) GetIdentity(c echo.Context) error {
	id := c.Param("id")
	validate := validator.New()
	if err := validate.Var(id, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id format"}, res.MsgGetFailed, nil))
	}
	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.GetIdentity(jwtPayload, id))
}

// ============================================================
// UPDATE IDENTITY
// ============================================================

// UpdateIdentity updates user identity
// @Summary PUT User Identity
// @Description Update user identity
// @Tags User Identity
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Param request body schemas.UpdateIdentity true "Identity data"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /user-identities/{id}/identity [put]
func (h *Handler) UpdateIdentity(c echo.Context) error {
	id := c.Param("id")
	req := new(schemas.UpdateIdentity)
	if err := c.Bind(&req); err != nil {
		return res.RespError(c, &res.ErrBadRequest)
	}

	validate := validator.New()
	if err := validate.Var(id, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id format"}, res.MsgUpdateFailed, nil))
	}

	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.UpdateIdentity(jwtPayload, id, req))
}

// ============================================================
// AVATAR UPLOAD
// ============================================================

// UploadAvatar uploads avatar image
// @Summary POST Upload Avatar
// @Description Upload user avatar image
// @Tags User Identity
// @Accept multipart/form-data
// @Produce json
// @Param id path string true "User ID"
// @Param avatar formData file true "Avatar image file"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /user-identities/{id}/avatar [post]
func (h *Handler) UploadAvatar(c echo.Context) error {
	id := c.Param("id")

	validate := validator.New()
	if err := validate.Var(id, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id format"}, res.MsgUpdateFailed, nil))
	}

	// Get uploaded file
	file, err := c.FormFile("avatar")
	if err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"avatar file is required"}, res.MsgUpdateFailed, nil))
	}

	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.UploadAvatar(jwtPayload, id, file))
}

// DeleteAvatar deletes avatar image
// @Summary DELETE Avatar
// @Description Delete user avatar image
// @Tags User Identity
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /user-identities/{id}/avatar [delete]
func (h *Handler) DeleteAvatar(c echo.Context) error {
	id := c.Param("id")

	validate := validator.New()
	if err := validate.Var(id, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id format"}, res.MsgUpdateFailed, nil))
	}

	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.DeleteAvatar(jwtPayload, id))
}
