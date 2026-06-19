package auth

import (
	"net/http"
	"strings"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/auth/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/res"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

// Handler handles HTTP requests for auth endpoints
type Handler struct {
	service Service
}

// NewAuthHandler creates a new auth handler
func NewAuthHandler() *Handler {
	return &Handler{
		service: NewServiceImpl(),
	}
}

// ============================================================
// LOGIN
// ============================================================

// Login authenticates user and returns tokens
// @Summary POST Login
// @Description Login with email and password
// @Tags Auth
// @Accept json
// @Produce json
// @Param request body schemas.LoginRequest true "Login credentials"
// @Success 200 {object} res.ErrorConstant
// @Failure 401 {object} res.ErrorConstant
// @Router /auth/login [post]
func (h Handler) Login(c echo.Context) error {
	req := new(schemas.LoginRequest)
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
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, errList, res.MsgGetFailed, nil))
	}

	// Extract device info
	deviceInfo := extractDeviceInfo(c)

	return c.JSON(h.service.Login(req, deviceInfo))
}

// ============================================================
// REFRESH TOKEN
// ============================================================

// RefreshToken refreshes access token
// @Summary POST Refresh Token
// @Description Refresh access token using refresh token
// @Tags Auth
// @Accept json
// @Produce json
// @Param request body schemas.RefreshTokenRequest true "Refresh token"
// @Success 200 {object} res.ErrorConstant
// @Failure 401 {object} res.ErrorConstant
// @Router /auth/refresh-token [post]
func (h Handler) RefreshToken(c echo.Context) error {
	req := new(schemas.RefreshTokenRequest)
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
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, errList, res.MsgGetFailed, nil))
	}

	return c.JSON(h.service.RefreshToken(req))
}

// ============================================================
// LOGOUT
// ============================================================

// Logout revokes user session
// @Summary POST Logout
// @Description Logout and revoke session
// @Tags Auth
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer token"
// @Param request body schemas.LogoutRequest false "Logout options"
// @Success 200 {object} res.ErrorConstant
// @Failure 401 {object} res.ErrorConstant
// @Router /auth/logout [post]
func (h Handler) Logout(c echo.Context) error {
	userInfo := c.Get("userInfo")
	if userInfo == nil {
		return res.RespError(c, &res.ErrUnauthorized)
	}

	claims, ok := userInfo.(*model.JwtPayload)
	if !ok {
		return res.RespError(c, &res.ErrUnauthorized)
	}

	req := new(schemas.LogoutRequest)
	c.Bind(&req)

	return c.JSON(h.service.Logout(claims.SessionID, req.AllDevices))
}

// ============================================================
// SESSIONS
// ============================================================

// GetSessions lists active sessions
// @Summary GET Sessions
// @Description Get all active sessions for current user
// @Tags Auth
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer token"
// @Success 200 {object} res.ErrorConstant
// @Failure 401 {object} res.ErrorConstant
// @Router /auth/sessions [get]
func (h Handler) GetSessions(c echo.Context) error {
	userInfo := c.Get("userInfo")
	if userInfo == nil {
		return res.RespError(c, &res.ErrUnauthorized)
	}

	claims, ok := userInfo.(*model.JwtPayload)
	if !ok {
		return res.RespError(c, &res.ErrUnauthorized)
	}

	return c.JSON(h.service.GetSessions(claims.UserID, claims.SessionID))
}

// RevokeSession revokes a specific session
// @Summary DELETE Session
// @Description Revoke a specific session
// @Tags Auth
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer token"
// @Param session_id path string true "Session ID"
// @Success 200 {object} res.ErrorConstant
// @Failure 401 {object} res.ErrorConstant
// @Router /auth/sessions/{session_id} [delete]
func (h Handler) RevokeSession(c echo.Context) error {
	userInfo := c.Get("userInfo")
	if userInfo == nil {
		return res.RespError(c, &res.ErrUnauthorized)
	}

	claims, ok := userInfo.(*model.JwtPayload)
	if !ok {
		return res.RespError(c, &res.ErrUnauthorized)
	}

	sessionID := c.Param("session_id")
	if sessionID == "" {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"session_id is required"}, res.MsgUpdateFailed, nil))
	}

	parsedSessionID, err := uuid.Parse(sessionID)
	if err != nil {
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid session_id format"}, res.MsgUpdateFailed, nil))
	}

	return c.JSON(h.service.RevokeSession(claims.UserID, parsedSessionID))
}

// ============================================================
// REGISTRATION
// ============================================================

// Register registers a new user and automatically sends verification OTP
// @Summary POST Register
// @Description Register a new user account and send verification OTP
// @Tags Auth
// @Accept json
// @Produce json
// @Param request body schemas.RegisterRequest true "Registration data"
// @Success 201 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /auth/register [post]
func (h Handler) Register(c echo.Context) error {
	req := new(schemas.RegisterRequest)
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

	return c.JSON(h.service.Register(req))
}

// ============================================================
// OTP
// ============================================================

// VerifyOTP verifies OTP code
// @Summary POST Verify OTP
// @Description Verify OTP code for email verification or password reset
// @Tags Auth
// @Accept json
// @Produce json
// @Param request body schemas.VerifyOTPRequest true "OTP verification data"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /auth/verify-otp [post]
func (h Handler) VerifyOTP(c echo.Context) error {
	req := new(schemas.VerifyOTPRequest)
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
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, errList, res.MsgGetFailed, nil))
	}

	return c.JSON(h.service.VerifyOTP(req))
}

// ResendOTP resends OTP code
// @Summary POST Resend OTP
// @Description Resend OTP code to email
// @Tags Auth
// @Accept json
// @Produce json
// @Param request body schemas.ResendOTPRequest true "Resend OTP data"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /auth/resend-otp [post]
func (h Handler) ResendOTP(c echo.Context) error {
	req := new(schemas.ResendOTPRequest)
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

	return c.JSON(h.service.ResendOTP(req))
}

// ============================================================
// FORGOT PASSWORD
// ============================================================

// ForgotPassword sends password reset OTP
// @Summary POST Forgot Password
// @Description Send OTP for password reset
// @Tags Auth
// @Accept json
// @Produce json
// @Param request body schemas.ForgotPasswordRequest true "Email"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /auth/forgot-password [post]
func (h Handler) ForgotPassword(c echo.Context) error {
	req := new(schemas.ForgotPasswordRequest)
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

	return c.JSON(h.service.ForgotPassword(req))
}

// ResetPasswordWithOTP resets password using OTP
// @Summary POST Reset Password with OTP
// @Description Reset password using OTP code
// @Tags Auth
// @Accept json
// @Produce json
// @Param request body schemas.ForgotPasswordVerifyRequest true "Password reset data"
// @Success 200 {object} res.ErrorConstant
// @Failure 400 {object} res.ErrorConstant
// @Router /auth/reset-password [post]
func (h Handler) ResetPasswordWithOTP(c echo.Context) error {
	req := new(schemas.ForgotPasswordVerifyRequest)
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
		return c.JSON(res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, errList, res.MsgUpdateFailed, nil))
	}

	return c.JSON(h.service.ResetPasswordWithOTP(req))
}

// ============================================================
// HELPERS
// ============================================================

func extractDeviceInfo(c echo.Context) *schemas.DeviceInfo {
	req := c.Request()

	// Get IP address
	ip := c.RealIP()
	if ip == "" {
		ip = req.RemoteAddr
	}

	// Get User-Agent
	userAgent := req.UserAgent()

	// Parse device info from User-Agent
	deviceName := "Unknown Device"
	deviceType := "Desktop"
	browser := "Unknown"
	os := "Unknown"

	if userAgent != "" {
		// Detect Browser
		if strings.Contains(userAgent, "Chrome") && !strings.Contains(userAgent, "Edg") {
			browser = "Chrome"
		} else if strings.Contains(userAgent, "Firefox") {
			browser = "Firefox"
		} else if strings.Contains(userAgent, "Safari") && !strings.Contains(userAgent, "Chrome") {
			browser = "Safari"
		} else if strings.Contains(userAgent, "Edg") {
			browser = "Edge"
		} else if strings.Contains(userAgent, "Opera") || strings.Contains(userAgent, "OPR") {
			browser = "Opera"
		}

		// Detect OS
		if strings.Contains(userAgent, "Windows") {
			os = "Windows"
		} else if strings.Contains(userAgent, "Mac") {
			os = "MacOS"
		} else if strings.Contains(userAgent, "Linux") {
			os = "Linux"
		} else if strings.Contains(userAgent, "Android") {
			os = "Android"
			deviceType = "Mobile"
		} else if strings.Contains(userAgent, "iPhone") || strings.Contains(userAgent, "iPad") {
			os = "iOS"
			deviceType = "Mobile"
		}

		// Detect Device Type
		if strings.Contains(userAgent, "Mobile") || strings.Contains(userAgent, "Android") || strings.Contains(userAgent, "iPhone") {
			deviceType = "Mobile"
		} else if strings.Contains(userAgent, "Tablet") || strings.Contains(userAgent, "iPad") {
			deviceType = "Tablet"
		}
	}

	return &schemas.DeviceInfo{
		DeviceName: deviceName,
		DeviceType: deviceType,
		Browser:    browser,
		OS:         os,
		IPAddress:  ip,
		UserAgent:  userAgent,
	}
}

// GetUserInfoFromContext extracts user info from echo context
func GetUserInfoFromContext(c echo.Context) (*model.JwtPayload, error) {
	userInfo := c.Get("userInfo")
	if userInfo == nil {
		return nil, echo.NewHTTPError(http.StatusUnauthorized, "unauthorized")
	}

	claims, ok := userInfo.(*model.JwtPayload)
	if !ok {
		return nil, echo.NewHTTPError(http.StatusUnauthorized, "invalid token claims")
	}

	return claims, nil
}

// GetUserIDFromContext extracts user ID from echo context
func GetUserIDFromContext(c echo.Context) (uuid.UUID, error) {
	claims, err := GetUserInfoFromContext(c)
	if err != nil {
		return uuid.Nil, err
	}
	return claims.UserID, nil
}
