package auth

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/auth/schemas"
	"github.com/google/uuid"
)

// ============================================================
// AUTH SERVICE INTERFACE
// ============================================================

type Service interface {
	// Authentication
	Login(req *schemas.LoginRequest, deviceInfo *schemas.DeviceInfo) (int, interface{})
	RefreshToken(req *schemas.RefreshTokenRequest) (int, interface{})
	Logout(sessionID uuid.UUID, allDevices bool) (int, interface{})
	GetSessions(userID uuid.UUID, currentSessionID uuid.UUID) (int, interface{})
	RevokeSession(userID uuid.UUID, sessionID uuid.UUID) (int, interface{})

	// Registration (auto-sends verification OTP)
	Register(req *schemas.RegisterRequest) (int, interface{})

	// OTP Management
	VerifyOTP(req *schemas.VerifyOTPRequest) (int, interface{})
	ResendOTP(req *schemas.ResendOTPRequest) (int, interface{})

	// Forgot Password
	ForgotPassword(req *schemas.ForgotPasswordRequest) (int, interface{})
	ResetPasswordWithOTP(req *schemas.ForgotPasswordVerifyRequest) (int, interface{})
}
