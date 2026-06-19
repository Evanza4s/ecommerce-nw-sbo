package auth

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/db"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/middleware"
	"github.com/labstack/echo/v4"
)

// Route registers auth routes
// Simplified auth endpoints:
// - POST /auth/register - Register and auto-send verification OTP
// - POST /auth/verify-otp - Verify OTP code
// - POST /auth/resend-otp - Resend OTP
// - POST /auth/login - Login
// - POST /auth/logout - Logout
// - POST /auth/refresh-token - Refresh access token
// - POST /auth/forgot-password - Request password reset OTP
// - POST /auth/reset-password - Reset password with OTP
// - GET /auth/sessions - List active sessions
// - DELETE /auth/sessions/{session_id} - Revoke specific session
func (h Handler) Route(g *echo.Group) {
	// ============================================================
	// PUBLIC ROUTES (No Authentication Required)
	// ============================================================

	// Authentication
	g.POST("/register", h.Register)
	g.POST("/verify-otp", h.VerifyOTP)
	g.POST("/resend-otp", h.ResendOTP)
	g.POST("/login", h.Login)
	g.POST("/refresh-token", h.RefreshToken)
	g.POST("/forgot-password", h.ForgotPassword)
	g.POST("/reset-password", h.ResetPasswordWithOTP)

	// ============================================================
	// PROTECTED ROUTES (Authentication Required)
	// ============================================================

	protected := g.Group("")
	protected.Use(middleware.JWTMiddleware(db.GetManager()))

	protected.POST("/logout", h.Logout)
	protected.GET("/sessions", h.GetSessions)
	protected.DELETE("/sessions/:session_id", h.RevokeSession)
}
