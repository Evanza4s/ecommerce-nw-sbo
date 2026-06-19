package repository_impl

import (
	"time"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/db"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// ============================================================
// OTP REPOSITORY IMPLEMENTATION
// ============================================================

type OtpRepositoryImpl struct {
	db *gorm.DB
}

func NewOtpRepositoryImpl() *OtpRepositoryImpl {
	return &OtpRepositoryImpl{db: db.GetManager()}
}

// ============================================================
// QUERY METHODS
// ============================================================

// FindByID finds OTP by ID
func (r OtpRepositoryImpl) FindByID(id uuid.UUID) (*model.MstOtp, error) {
	var otp model.MstOtp
	if err := r.db.First(&otp, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &otp, nil
}

// FindByUserIDAndType finds OTP by user ID and type
func (r OtpRepositoryImpl) FindByUserIDAndType(userID uuid.UUID, otpType string) (*model.MstOtp, error) {
	var otp model.MstOtp
	if err := r.db.Where("user_id = ? AND otp_type = ?", userID, otpType).
		Order("created_at DESC").
		First(&otp).Error; err != nil {
		return nil, err
	}
	return &otp, nil
}

// FindByEmailAndType finds OTP by email and type
func (r OtpRepositoryImpl) FindByEmailAndType(email string, otpType string) (*model.MstOtp, error) {
	var otp model.MstOtp
	if err := r.db.Where("email = ? AND otp_type = ?", email, otpType).
		Order("created_at DESC").
		First(&otp).Error; err != nil {
		return nil, err
	}
	return &otp, nil
}

// FindByOTPCode finds OTP by code and type
func (r OtpRepositoryImpl) FindByOTPCode(otpCode string, otpType string) (*model.MstOtp, error) {
	var otp model.MstOtp
	if err := r.db.Where("otp_code = ? AND otp_type = ?", otpCode, otpType).
		First(&otp).Error; err != nil {
		return nil, err
	}
	return &otp, nil
}

// FindValidOTP finds a valid (not used, not expired) OTP
func (r OtpRepositoryImpl) FindValidOTP(userID uuid.UUID, otpCode string, otpType string) (*model.MstOtp, error) {
	var otp model.MstOtp
	now := time.Now()

	if err := r.db.Where(
		"user_id = ? AND otp_code = ? AND otp_type = ? AND is_used = ? AND expired_at > ?",
		userID, otpCode, otpType, false, now,
	).First(&otp).Error; err != nil {
		return nil, err
	}
	return &otp, nil
}

// FindLatestValidOTPByEmail finds the latest valid OTP by email
func (r OtpRepositoryImpl) FindLatestValidOTPByEmail(email string, otpType string) (*model.MstOtp, error) {
	var otp model.MstOtp
	now := time.Now()

	if err := r.db.Where(
		"email = ? AND otp_type = ? AND is_used = ? AND expired_at > ?",
		email, otpType, false, now,
	).Order("created_at DESC").First(&otp).Error; err != nil {
		return nil, err
	}
	return &otp, nil
}

// ============================================================
// MUTATION METHODS
// ============================================================

// Save creates a new OTP
func (r OtpRepositoryImpl) Save(data model.MstOtp) (*model.MstOtp, error) {
	if err := r.db.Create(&data).Error; err != nil {
		return nil, err
	}
	return &data, nil
}

// Update updates an existing OTP
func (r OtpRepositoryImpl) Update(data model.MstOtp) (*model.MstOtp, error) {
	if err := r.db.Save(&data).Error; err != nil {
		return nil, err
	}
	return &data, nil
}

// Delete soft deletes an OTP
func (r OtpRepositoryImpl) Delete(data *model.MstOtp) error {
	return r.db.Delete(&data).Error
}

// MarkAsUsed marks an OTP as used
func (r OtpRepositoryImpl) MarkAsUsed(id uuid.UUID) error {
	now := time.Now()
	return r.db.Model(&model.MstOtp{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"is_used":     true,
			"verified_at": now,
		}).Error
}

// IncrementResendCount increments the resend count (if using trx_otp with resend_count field)
func (r OtpRepositoryImpl) IncrementResendCount(id uuid.UUID) error {
	return r.db.Model(&model.MstOtp{}).
		Where("id = ?", id).
		UpdateColumn("resend_count", gorm.Expr("resend_count + ?", 1)).Error
}

// DeleteExpiredOTPs deletes all expired OTPs (cleanup)
func (r OtpRepositoryImpl) DeleteExpiredOTPs() error {
	now := time.Now()
	return r.db.Where("expired_at < ?", now).Delete(&model.MstOtp{}).Error
}

// ============================================================
// HELPER METHODS
// ============================================================

// InvalidatePreviousOTPs marks all previous OTPs of the same type as used
func (r OtpRepositoryImpl) InvalidatePreviousOTPs(userID uuid.UUID, otpType string) error {
	return r.db.Model(&model.MstOtp{}).
		Where("user_id = ? AND otp_type = ? AND is_used = ?", userID, otpType, false).
		Update("is_used", true).Error
}

// InvalidatePreviousOTPsByEmail marks all previous OTPs of the same type as used by email
func (r OtpRepositoryImpl) InvalidatePreviousOTPsByEmail(email string, otpType string) error {
	return r.db.Model(&model.MstOtp{}).
		Where("email = ? AND otp_type = ? AND is_used = ?", email, otpType, false).
		Update("is_used", true).Error
}
