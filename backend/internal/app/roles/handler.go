package roles

import (
	"fmt"
	"net/http"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/roles/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/res"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

type Handler struct {
	service Service
}

func NewRoleshandler() *Handler {
	return &Handler{
		service: NewServiceImpl(),
	}
}

// @Summary GET Roles All
// @Description Get all roles with pagination
// @Tags Roles
// @Accept json
// @Produce json
// @Param role_name query string false "name roles"
// @Param is_admin query bool false "is admin roles"
// @Param is_superadmin query bool false "is super admin roles"
// @Param page query int true "page" default(1)
// @Param page_size query int true "page size" default(10)
// @Success 200 {object} res.ResponsePageConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /roles/get-all [get]
func (h Handler) GetAllPagination(c echo.Context) (err error) {
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
	return c.JSON(h.service.GetAllPagination(jwtPayload, req))
}

// @Summary GET Roles
// @Description Get all roles without pagination
// @Tags Roles
// @Accept json
// @Produce json
// @Param role_name query string false "name roles"
// @Param is_admin query bool false "is admin roles"
// @Param is_superadmin query bool false "is super admin roles"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /roles [get]
func (h Handler) GetAll(c echo.Context) (err error) {
	req := new(schemas.GetAll)
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

// @Summary GET Role By ID
// @Description Get role by ID
// @Tags Roles
// @Accept json
// @Produce json
// @Param id path string true "Id Roles"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /roles/{id} [get]
func (h Handler) GetByID(c echo.Context) (err error) {
	id := c.Param("id")
	validate := validator.New()
	if err := validate.Var(id, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgGetFailed, nil))
	}
	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.GetByID(jwtPayload, id))
}

// @Summary POST Roles
// @Description Create a new Roles
// @Tags Roles
// @Accept json
// @Produce json
// @Param request body schemas.RequestRoles true "request body Create Roles"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /roles [post]
func (h *Handler) Create(c echo.Context) (err error) {
	req := new(schemas.RequestRoles)
	if err := c.Bind(&req); err != nil {
		return res.RespError(c, &res.ErrBadRequest)
	}

	fmt.Println(req)

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
	return c.JSON(h.service.Create(jwtPayload, req))
}

// @Summary PUT Roles
// @Description Update Roles by ID
// @Tags Roles
// @Accept json
// @Produce json
// @Param id path string true "Id Roles"
// @Param request body schemas.RequestRoles true "request body Update Roles"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /roles/{id} [put]
func (h *Handler) Update(c echo.Context) (err error) {
	id := c.Param("id")
	req := new(schemas.RequestRoles)
	if err := c.Bind(&req); err != nil {
		return res.RespError(c, &res.ErrorConstant{})
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
	return c.JSON(h.service.Update(jwtPayload, id, req))
}

// @Summary DELETE Roles
// @Description Delete Roles by ID
// @Tags Roles
// @Accept json
// @Produce json
// @Param id path string true "Id Roles"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /roles/{id} [delete]
func (h *Handler) Delete(c echo.Context) (err error) {
	id := c.Param("id")
	validate := validator.New()
	if err := validate.Var(id, "uuid"); err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgDeleteFailed, nil))
	}
	jwtPayload := util.UserIDFromToken(c)
	return c.JSON(h.service.Delete(jwtPayload, id))
}
