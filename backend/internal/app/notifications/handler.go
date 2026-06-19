package notifications

import (
	"net/http"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/res"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type Handler struct {
	service Service
}

func NewNotificationHandler() *Handler {
	return &Handler{
		service: NewService(),
	}
}

func (h *Handler) GetMyNotifications(c echo.Context) error {
	jwtPayload := util.UserIDFromToken(c)
	if jwtPayload == nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusUnauthorized, []string{"unauthorized"}, res.MsgGetFailed, nil))
	}

	notifs, err := h.service.GetMyNotifications(jwtPayload)
	if err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgGetFailed, nil))
	}

	return c.JSON(res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgGetSuccess, notifs))
}

func (h *Handler) GetUnreadCount(c echo.Context) error {
	jwtPayload := util.UserIDFromToken(c)
	if jwtPayload == nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusUnauthorized, []string{"unauthorized"}, res.MsgGetFailed, nil))
	}

	count, err := h.service.GetUnreadCount(jwtPayload)
	if err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgGetFailed, nil))
	}

	return c.JSON(res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgGetSuccess, count))
}

func (h *Handler) MarkAsRead(c echo.Context) error {
	jwtPayload := util.UserIDFromToken(c)
	if jwtPayload == nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusUnauthorized, []string{"unauthorized"}, res.MsgUpdateFailed, nil))
	}

	id := c.Param("id")
	notifID, err := uuid.Parse(id)
	if err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid notification id"}, res.MsgUpdateFailed, nil))
	}

	err = h.service.MarkAsRead(jwtPayload, notifID)
	if err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgUpdateFailed, nil))
	}

	return c.JSON(res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgUpdateSuccess, nil))
}

func (h *Handler) MarkAllAsRead(c echo.Context) error {
	jwtPayload := util.UserIDFromToken(c)
	if jwtPayload == nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusUnauthorized, []string{"unauthorized"}, res.MsgUpdateFailed, nil))
	}

	err := h.service.MarkAllAsRead(jwtPayload)
	if err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgUpdateFailed, nil))
	}

	return c.JSON(res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgUpdateSuccess, nil))
}
