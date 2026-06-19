package utils

// ============================================================
// ORM OPERATOR CONSTANTS
// ============================================================

const (
	And    = "and"
	Or     = "or"
	Like   = "like"
	ILike  = "ilike"
	Equals = "eq"
	In     = "in"
	NotEq  = "neq"
	Greater = "gt"
	Less   = "lt"
	Gte    = "gte"
	Lte    = "lte"
	Raw    = "raw"
	IsNull = "is_null"
	IsNotNull = "is_not_null"
)

// ============================================================
// OTP TYPE CONSTANTS
// ============================================================

const (
	OtpTypeVerification   = "verification"
	OtpTypeForgotPassword = "forgot_password"
	OtpTypeChangeEmail    = "change_email"
	OtpTypeTwoFactor      = "two_factor"
)

// ============================================================
// DEFAULT ENTITY FIELDS
// ============================================================

var (
	DefaultEntity = []string{"id", "created_at", "created_by", "updated_at", "updated_by", "deleted_at", "deleted_by"}
)
