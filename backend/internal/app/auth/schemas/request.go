package schemas

// ============================================================
// REGISTRATION REQUEST
// ============================================================

// RegisterRequest for user self-registration (auto-sends verification OTP)
type RegisterRequest struct {
	Email           string `json:"email" validate:"required,email"`
	Username        string `json:"username" validate:"required,min=3,max=100"`
	Password        string `json:"password" validate:"required,min=8,max=72"`
	ConfirmPassword string `json:"confirmPassword" validate:"required"`
	FirstName       string `json:"firstName" validate:"required"`
	LastName        string `json:"lastName" validate:"required"`
}

// ============================================================
// LOGIN REQUEST
// ============================================================

type LoginRequest struct {
	Email      string `json:"email" validate:"required,email"`
	Password   string `json:"password" validate:"required"`
	RememberMe bool   `json:"rememberMe"`
}

// RefreshTokenRequest for refreshing access token
type RefreshTokenRequest struct {
	RefreshToken string `json:"refresh_token" validate:"required"`
}

// LogoutRequest for logout
type LogoutRequest struct {
	AllDevices bool `json:"allDevices"` // logout from all devices
}

// ============================================================
// OTP REQUESTS
// ============================================================

// VerifyOTPRequest for verifying OTP code
type VerifyOTPRequest struct {
	Email   string `json:"email" validate:"required,email"`
	OTPCode string `json:"otp_code" validate:"required,len=6"`
	OtpType string `json:"otp_type" validate:"required,oneof=verification forgot_password"`
}

// ResendOTPRequest for resending OTP
type ResendOTPRequest struct {
	Email   string `json:"email" validate:"required,email"`
	OtpType string `json:"otp_type" validate:"required,oneof=verification forgot_password"`
}

// ============================================================
// PASSWORD REQUESTS
// ============================================================

type ForgotPasswordRequest struct {
	Email string `json:"email" validate:"required,email"`
}

type ForgotPasswordVerifyRequest struct {
	Email           string `json:"email" validate:"required,email"`
	OTPCode         string `json:"otp_code" validate:"required,len=6"`
	NewPassword     string `json:"new_password" validate:"required,min=8"`
	ConfirmPassword string `json:"confirm_password" validate:"required"`
}

// ============================================================
// DEVICE INFO
// ============================================================

type DeviceInfo struct {
	DeviceName string `json:"device_name"`
	DeviceType string `json:"device_type"`
	Browser    string `json:"browser"`
	OS         string `json:"os"`
	IPAddress  string `json:"ip_address"`
	UserAgent  string `json:"user_agent"`
}
