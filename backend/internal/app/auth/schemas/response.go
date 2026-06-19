package schemas

import (
	"time"

	"github.com/google/uuid"
)

// ============================================================
// LOGIN RESPONSE
// ============================================================

type LoginResponse struct {
	Success            bool               `json:"success"`
	Message            string             `json:"message"`
	AccessToken        string             `json:"access_token"`
	RefreshToken       string             `json:"refresh_token"`
	AccessTokenExpiry  int                `json:"access_token_expiry"`  // in seconds
	RefreshTokenExpiry int                `json:"refresh_token_expiry"` // in seconds
	User               *LoginUserResponse `json:"user"`
}

type LoginUserResponse struct {
	ID         uuid.UUID `json:"id"`
	Email      string    `json:"email"`
	Username   string    `json:"username"`
	FirstName  string    `json:"firstName"`
	LastName   string    `json:"lastName"`
	Phone      string    `json:"phone,omitempty"`
	Avatar     string    `json:"avatar,omitempty"`
	Role       string    `json:"role"`
	IsActive   bool      `json:"is_active"`
	IsVerified bool      `json:"is_verified"`
	CreatedAt  string    `json:"createdAt"`
	UpdatedAt  string    `json:"updatedAt"`
}

// ============================================================
// REGISTER RESPONSE
// ============================================================

type RegisterResponse struct {
	Success bool      `json:"success"`
	Message string    `json:"message"`
	UserID  uuid.UUID `json:"userId,omitempty"`
	Email   string    `json:"email,omitempty"`
}

// ============================================================
// REFRESH TOKEN RESPONSE
// ============================================================

type RefreshTokenResponse struct {
	Success           bool      `json:"success"`
	Message           string    `json:"message"`
	AccessToken       string    `json:"access_token"`
	AccessTokenExpiry int       `json:"access_token_expiry"`
	SessionID         uuid.UUID `json:"session_id"`
}

// ============================================================
// LOGOUT RESPONSE
// ============================================================

type LogoutResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

// ============================================================
// SESSION RESPONSE
// ============================================================

type SessionResponse struct {
	ID             uuid.UUID  `json:"id"`
	DeviceName     string     `json:"device_name"`
	DeviceType     string     `json:"device_type"`
	Browser        string     `json:"browser"`
	OS             string     `json:"os"`
	IPAddress      string     `json:"ip_address"`
	LoginAt        *time.Time `json:"login_at"`
	LastActivityAt *time.Time `json:"last_activity_at"`
	ExpiredAt      time.Time  `json:"expired_at"`
	IsCurrent      bool       `json:"is_current"`
}

// ============================================================
// OTP RESPONSE
// ============================================================

type VerifyOTPResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

type SendOTPResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	OtpType string `json:"otp_type"`
}

type ResendOTPResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}
