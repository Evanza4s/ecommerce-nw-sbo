package users

import (
	"net/http"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/users/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/res"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

// Handler handles HTTP requests for user endpoints
type Handler struct {
	service Service
}

// NewUserHandler creates a new user handler
func NewUserHandler() *Handler {
	return &Handler{
		service: NewServiceImpl(),
	}
}

// ============================================================
// USER CRUD HANDLERS
// ============================================================

// GetAll retrieves all users with pagination
// @Summary GET Users All
// @Description Get all users with pagination
// @Tags Users
// @Accept json
// @Produce json
// @Param email query string false "Filter by email"
// @Param username query string false "Filter by username"
// @Param is_active query bool false "Filter by active status"
// @Param is_verified query bool false "Filter by verified status"
// @Param role_id query string false "Filter by role ID"
// @Param page query int true "Page number" default(1)
// @Param page_size query int true "Page size" default(10)
// @Success 200 {object} res.ResponsePageConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /users/get-all [get]
func (h Handler) GetAll(c echo.Context) error {
	req := new(schemas.GetAllPagination)
	if err := c.Bind(req); err != nil {
		return res.RespError(c, &res.ErrBadRequest)
	}

	validate := validator.New()
	if errValid := validate.Struct(req); errValid != nil {
		var errList []string
		errors := util.TranslateError(errValid, util.Translator("en", validate))
		for _, msgErr := range errors {
			errList = append(errList, msgErr.Error())
		}
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, errList, res.MsgGetFailed, nil))
	}

	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.GetAll(jwtPayload, req))
}

// GetAllWithoutPagination retrieves all users without pagination
// @Summary GET Users
// @Description Get all users without pagination
// @Tags Users
// @Accept json
// @Produce json
// @Param email query string false "Filter by email"
// @Param username query string false "Filter by username"
// @Param is_active query bool false "Filter by active status"
// @Param is_verified query bool false "Filter by verified status"
// @Param role_id query string false "Filter by role ID"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /users [get]
func (h Handler) GetAllWithoutPagination(c echo.Context) error {
	req := new(schemas.GetAll)
	if err := c.Bind(req); err != nil {
		return res.RespError(c, &res.ErrBadRequest)
	}

	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.GetAllWithoutPagination(jwtPayload, req))
}

// GetByID retrieves a user by ID
// @Summary GET User by ID
// @Description Get user details by ID
// @Tags Users
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /users/{id} [get]
func (h Handler) GetByID(c echo.Context) error {
	id := c.Param("id")
	validate := validator.New()
	if err := validate.Var(id, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id format"}, res.MsgGetFailed, nil))
	}
	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.GetByID(jwtPayload, id))
}

// Create creates a new user
// @Summary POST User
// @Description Create a new user
// @Tags Users
// @Accept json
// @Produce json
// @Param request body schemas.CreateUser true "User data"
// @Success 201 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /users [post]
func (h *Handler) Create(c echo.Context) error {
	req := new(schemas.CreateUser)
	if err := c.Bind(&req); err != nil {
		return res.RespError(c, &res.ErrBadRequest)
	}

	validate := validator.New()
	if errValid := validate.Struct(req); errValid != nil {
		var errList []string
		errors := util.TranslateError(errValid, util.Translator("en", validate))
		for _, msgErr := range errors {
			errList = append(errList, msgErr.Error())
		}
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, errList, res.MsgAddFailed, nil))
	}

	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.Create(jwtPayload, req))
}

// Update updates a user
// @Summary PUT User
// @Description Update user by ID
// @Tags Users
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Param request body schemas.UpdateUser true "User data"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /users/{id} [put]
func (h *Handler) Update(c echo.Context) error {
	id := c.Param("id")
	req := new(schemas.UpdateUser)
	if err := c.Bind(&req); err != nil {
		return res.RespError(c, &res.ErrBadRequest)
	}

	validate := validator.New()
	if err := validate.Var(id, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id format"}, res.MsgUpdateFailed, nil))
	}

	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.Update(jwtPayload, id, req))
}

// Delete soft deletes a user
// @Summary DELETE User
// @Description Delete user by ID
// @Tags Users
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /users/{id} [delete]
func (h *Handler) Delete(c echo.Context) error {
	id := c.Param("id")
	validate := validator.New()
	if err := validate.Var(id, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id format"}, res.MsgDeleteFailed, nil))
	}
	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.Delete(jwtPayload, id))
}

// ============================================================
// PROFILE MANAGEMENT (Self)
// ============================================================

// GetProfile retrieves the logged-in user's profile
// @Summary GET My Profile
// @Description Get current logged-in user profile
// @Tags Users
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} res.ErrorConstant
// @Failure 401 {object} res.ErrorConstant
// @Router /users/profile [get]
func (h Handler) GetProfile(c echo.Context) error {
	userInfo := util.UserIDFromToken(c)
	if userInfo == nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusUnauthorized, []string{"unauthorized"}, res.MsgGetFailed, nil))
	}
	return c.JSON(h.service.GetProfile(userInfo, userInfo.UserID.String()))
}

// UpdateProfile updates the logged-in user's profile
// @Summary PUT Update My Profile
// @Description Update current logged-in user profile
// @Tags Users
// @Accept json
// @Produce json
// @Param request body schemas.UpdateProfile true "Profile data"
// @Security BearerAuth
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /users/profile [put]
func (h *Handler) UpdateProfile(c echo.Context) error {
	userInfo := util.UserIDFromToken(c)
	if userInfo == nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusUnauthorized, []string{"unauthorized"}, res.MsgUpdateFailed, nil))
	}

	req := new(schemas.UpdateProfile)
	if err := c.Bind(&req); err != nil {
		return res.RespError(c, &res.ErrBadRequest)
	}

	return c.JSON(h.service.UpdateProfile(userInfo, userInfo.UserID.String(), req))
}

// ChangePasswordProfile changes the logged-in user's password
// @Summary PUT Change My Password
// @Description Change current logged-in user password
// @Tags Users
// @Accept json
// @Produce json
// @Param request body schemas.ChangePassword true "Password data"
// @Security BearerAuth
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /users/change-password [put]
func (h *Handler) ChangePasswordProfile(c echo.Context) error {
	userInfo := util.UserIDFromToken(c)
	if userInfo == nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusUnauthorized, []string{"unauthorized"}, res.MsgUpdateFailed, nil))
	}

	req := new(schemas.ChangePassword)
	if err := c.Bind(&req); err != nil {
		return res.RespError(c, &res.ErrBadRequest)
	}

	return c.JSON(h.service.ChangePassword(userInfo, userInfo.UserID.String(), req))
}

// ============================================================
// STATUS AND ROLE MANAGEMENT
// ============================================================

// UpdateStatus updates user status
// @Summary PUT User Status
// @Description Update user active status
// @Tags Users
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Param request body schemas.UpdateStatus true "Status data"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /users/{id}/status [put]
func (h *Handler) UpdateStatus(c echo.Context) error {
	id := c.Param("id")
	req := new(schemas.UpdateStatus)
	if err := c.Bind(&req); err != nil {
		return res.RespError(c, &res.ErrBadRequest)
	}

	validate := validator.New()
	if err := validate.Var(id, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id format"}, res.MsgUpdateFailed, nil))
	}

	if req.IsActive == nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"is_active is required"}, res.MsgUpdateFailed, nil))
	}

	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.UpdateStatus(jwtPayload, id, req))
}

// UpdateRole updates user role
// @Summary PUT User Role
// @Description Update user role
// @Tags Users
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Param role_id path string true "Role ID"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /users/{id}/role/{role_id} [put]
func (h *Handler) UpdateRole(c echo.Context) error {
	userID := c.Param("id")
	roleID := c.Param("role_id")

	validate := validator.New()
	if err := validate.Var(userID, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id format"}, res.MsgUpdateFailed, nil))
	}
	if err := validate.Var(roleID, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid role id format"}, res.MsgUpdateFailed, nil))
	}

	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.UpdateUserRole(jwtPayload, userID, roleID))
}

// ============================================================
// PASSWORD MANAGEMENT
// ============================================================

// ChangePassword changes user password
// @Summary PUT Change Password
// @Description Change user password
// @Tags Users
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Param request body schemas.ChangePassword true "Password data"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /users/{id}/change-password [put]
func (h *Handler) ChangePassword(c echo.Context) error {
	id := c.Param("id")
	req := new(schemas.ChangePassword)
	if err := c.Bind(&req); err != nil {
		return res.RespError(c, &res.ErrBadRequest)
	}

	validate := validator.New()
	if err := validate.Var(id, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id format"}, res.MsgUpdateFailed, nil))
	}

	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.ChangePassword(jwtPayload, id, req))
}
