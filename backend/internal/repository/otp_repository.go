package repository

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/google/uuid"
)

// ============================================================
// OTP REPOSITORY INTERFACE
// ============================================================

type OtpRepository interface {
	// Query
	FindByID(id uuid.UUID) (*model.MstOtp, error)
	FindByUserIDAndType(userID uuid.UUID, otpType string) (*model.MstOtp, error)
	FindByEmailAndType(email string, otpType string) (*model.MstOtp, error)
	FindByOTPCode(otpCode string, otpType string) (*model.MstOtp, error)
	FindValidOTP(userID uuid.UUID, otpCode string, otpType string) (*model.MstOtp, error)
	FindLatestValidOTPByEmail(email string, otpType string) (*model.MstOtp, error)

	// Mutation
	Save(data model.MstOtp) (*model.MstOtp, error)
	Update(data model.MstOtp) (*model.MstOtp, error)
	Delete(data *model.MstOtp) error
	MarkAsUsed(id uuid.UUID) error
	IncrementResendCount(id uuid.UUID) error
	DeleteExpiredOTPs() error
}
