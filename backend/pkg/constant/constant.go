package constant

// ============================================================
// ORDER STATUS CONSTANTS
// ============================================================
const (
	OrderStatusPending   = "pending"
	OrderStatusConfirmed = "confirmed"
	OrderStatusProcessing = "processing"
	OrderStatusShipped   = "shipped"
	OrderStatusDelivered = "delivered"
	OrderStatusCancelled = "cancelled"
	OrderStatusReturned  = "returned"
)

// ============================================================
// PAYMENT STATUS CONSTANTS
// ============================================================
const (
	PaymentStatusPending   = "pending"
	PaymentStatusPaid      = "paid"
	PaymentStatusFailed    = "failed"
	PaymentStatusRefunded  = "refunded"
	PaymentStatusCancelled = "cancelled"
)

// ============================================================
// SHIPPING STATUS CONSTANTS
// ============================================================
const (
	ShippingStatusPending     = "pending"
	ShippingStatusProcessing  = "processing"
	ShippingStatusShipped     = "shipped"
	ShippingStatusInTransit   = "in_transit"
	ShippingStatusDelivered   = "delivered"
	ShippingStatusReturned    = "returned"
	ShippingStatusFailed      = "failed"
)

// ============================================================
// REFUND STATUS CONSTANTS
// ============================================================
const (
	RefundStatusPending   = "pending"
	RefundStatusApproved  = "approved"
	RefundStatusRejected  = "rejected"
	RefundStatusProcessed = "processed"
	RefundStatusCompleted = "completed"
)

// ============================================================
// REFUND TYPE CONSTANTS
// ============================================================
const (
	RefundTypeFull    = "full"
	RefundTypePartial = "partial"
)

// ============================================================
// VOUCHER DISCOUNT TYPE CONSTANTS
// ============================================================
const (
	DiscountTypePercentage = "percentage"
	DiscountTypeFixed      = "fixed"
)

// ============================================================
// OTP TYPE CONSTANTS
// ============================================================
const (
	OtpTypeVerification    = "verification"
	OtpTypeForgotPassword  = "forgot_password"
	OtpTypeChangeEmail     = "change_email"
	OtpTypeTwoFactor       = "two_factor"
)

// ============================================================
// LOGIN STATUS CONSTANTS
// ============================================================
const (
	LoginStatusSuccess = "success"
	LoginStatusFailed  = "failed"
)

// ============================================================
// PRODUCT STATUS CONSTANTS
// ============================================================
const (
	ProductStatusDraft     = "draft"
	ProductStatusPublished = "published"
	ProductStatusArchived  = "archived"
	ProductStatusOutOfStock = "out_of_stock"
)

// ============================================================
// PROMOTION TYPE CONSTANTS
// ============================================================
const (
	PromotionTypeFlashSale  = "flash_sale"
	PromotionTypeSeasonal   = "seasonal"
	PromotionTypeBundle     = "bundle"
	PromotionTypeClearance  = "clearance"
)

// ============================================================
// PAYMENT PROVIDER TYPE CONSTANTS
// ============================================================
const (
	ProviderTypeEWallet     = "e_wallet"
	ProviderTypeBankTransfer = "bank_transfer"
	ProviderTypeCreditCard  = "credit_card"
	ProviderTypeVirtualAccount = "virtual_account"
	ProviderTypeCOD         = "cod"
)

// ============================================================
// GENDER CONSTANTS
// ============================================================
const (
	GenderMale   = "male"
	GenderFemale = "female"
	GenderUnisex = "unisex"
)

// ============================================================
// USER GENDER CONSTANTS (for UserIdentity)
// ============================================================
const (
	UserGenderMale   = "L"
	UserGenderFemale = "P"
)

// ============================================================
// DEFAULT VALUES
// ============================================================
const (
	DefaultPage     = 1
	DefaultPageSize = 10
	MaxPageSize     = 100
)

// ============================================================
// DATE FORMAT CONSTANTS
// ============================================================
const (
	DateFormat     = "2006-01-02"
	DateTimeFormat = "2006-01-02 15:04:05"
	TimeFormat     = "15:04:05"
)

// ============================================================
// ERROR MESSAGES
// ============================================================
const (
	ErrRecordNotFound      = "record not found"
	ErrInvalidCredentials  = "invalid credentials"
	ErrUnauthorized        = "unauthorized access"
	ErrForbidden           = "forbidden access"
	ErrBadRequest          = "bad request"
	ErrInternalServerError = "internal server error"
	ErrDuplicateEntry      = "duplicate entry"
	ErrInvalidToken        = "invalid or expired token"
	ErrOtpExpired          = "otp has expired"
	ErrOtpAlreadyUsed      = "otp has already been used"
)

// ============================================================
// SUCCESS MESSAGES
// ============================================================
const (
	SuccessCreate        = "data successfully created"
	SuccessUpdate        = "data successfully updated"
	SuccessDelete        = "data successfully deleted"
	SuccessLogin         = "login successful"
	SuccessLogout        = "logout successful"
	SuccessRegister      = "registration successful"
	SuccessVerification  = "verification successful"
	SuccessPasswordReset = "password reset successful"
)

// ============================================================
// JWT CLAIMS KEYS
// ============================================================
const (
	JwtClaimUserID    = "user_id"
	JwtClaimSessionID = "session_id"
	JwtClaimRoleID    = "role_id"
	JwtClaimEmail     = "email"
	JwtClaimUsername  = "username"
)

// ============================================================
// REQUEST CONTEXT KEYS
// ============================================================
const (
	ContextUserInfo = "userInfo"
	ContextUserID   = "user_id"
	ContextRoleID   = "role_id"
)

// ============================================================
// HEADER KEYS
// ============================================================
const (
	HeaderAuthorization = "Authorization"
	HeaderBearer        = "Bearer"
	HeaderRefreshToken  = "X-Refresh-Token"
	HeaderUserID        = "X-User-ID"
	HeaderRequestID     = "X-Request-ID"
)
