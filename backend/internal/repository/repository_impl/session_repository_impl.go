package repository_impl

import (
	"time"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/db"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// SessionRepositoryImpl implements SessionRepository
type SessionRepositoryImpl struct {
	db *gorm.DB
}

// NewSessionRepositoryImpl creates a new session repository
func NewSessionRepositoryImpl() *SessionRepositoryImpl {
	return &SessionRepositoryImpl{
		db: db.GetManager(),
	}
}

// Create creates a new session
func (r *SessionRepositoryImpl) Create(session model.UserSession) (*model.UserSession, error) {
	if err := r.db.Create(&session).Error; err != nil {
		return nil, err
	}
	return &session, nil
}

// FindByID finds session by ID
func (r *SessionRepositoryImpl) FindByID(id uuid.UUID) (*model.UserSession, error) {
	var session model.UserSession
	if err := r.db.Where("id = ?", id).First(&session).Error; err != nil {
		return nil, err
	}
	return &session, nil
}

// FindByUserID finds all sessions for a user
func (r *SessionRepositoryImpl) FindByUserID(userID uuid.UUID) ([]model.UserSession, error) {
	var sessions []model.UserSession
	if err := r.db.Where("user_id = ?", userID).Order("created_at DESC").Find(&sessions).Error; err != nil {
		return nil, err
	}
	return sessions, nil
}

// FindActiveByUserID finds active sessions for a user
func (r *SessionRepositoryImpl) FindActiveByUserID(userID uuid.UUID) ([]model.UserSession, error) {
	var sessions []model.UserSession
	if err := r.db.Where("user_id = ? AND revoked_at IS NULL AND expired_at > ?", userID, time.Now()).
		Order("created_at DESC").
		Find(&sessions).Error; err != nil {
		return nil, err
	}
	return sessions, nil
}

// Update updates a session
func (r *SessionRepositoryImpl) Update(session model.UserSession) (*model.UserSession, error) {
	if err := r.db.Save(&session).Error; err != nil {
		return nil, err
	}
	return &session, nil
}

// Revoke revokes a session
func (r *SessionRepositoryImpl) Revoke(id uuid.UUID) error {
	now := time.Now()
	return r.db.Model(&model.UserSession{}).Where("id = ?", id).Update("revoked_at", now).Error
}

// RevokeAllByUserID revokes all sessions for a user (except current)
func (r *SessionRepositoryImpl) RevokeAllByUserID(userID uuid.UUID, exceptSessionID uuid.UUID) error {
	now := time.Now()
	return r.db.Model(&model.UserSession{}).
		Where("user_id = ? AND id != ? AND revoked_at IS NULL", userID, exceptSessionID).
		Update("revoked_at", now).Error
}

// DeleteExpired deletes all expired sessions
func (r *SessionRepositoryImpl) DeleteExpired() error {
	return r.db.Where("expired_at < ? OR revoked_at IS NOT NULL", time.Now()).Delete(&model.UserSession{}).Error
}

// Delete deletes a session
func (r *SessionRepositoryImpl) Delete(session model.UserSession) error {
	return r.db.Delete(&session).Error
}

// ============================================================
// LOGIN HISTORY REPOSITORY
// ============================================================

// LoginHistoryRepositoryImpl implements LoginHistoryRepository
type LoginHistoryRepositoryImpl struct {
	db *gorm.DB
}

// NewLoginHistoryRepositoryImpl creates a new login history repository
func NewLoginHistoryRepositoryImpl() *LoginHistoryRepositoryImpl {
	return &LoginHistoryRepositoryImpl{
		db: db.GetManager(),
	}
}

// Create creates a login history entry
func (r *LoginHistoryRepositoryImpl) Create(history model.TrxLoginHistory) (*model.TrxLoginHistory, error) {
	if err := r.db.Create(&history).Error; err != nil {
		return nil, err
	}
	return &history, nil
}

// FindByUserID finds login history for a user
func (r *LoginHistoryRepositoryImpl) FindByUserID(userID uuid.UUID, limit int) ([]model.TrxLoginHistory, error) {
	var histories []model.TrxLoginHistory
	query := r.db.Where("user_id = ?", userID).Order("created_at DESC")
	if limit > 0 {
		query = query.Limit(limit)
	}
	if err := query.Find(&histories).Error; err != nil {
		return nil, err
	}
	return histories, nil
}

// FindRecentByIP finds recent login attempts by IP
func (r *LoginHistoryRepositoryImpl) FindRecentByIP(ipAddress string, minutes int) ([]model.TrxLoginHistory, error) {
	var histories []model.TrxLoginHistory
	since := time.Now().Add(-time.Duration(minutes) * time.Minute)
	if err := r.db.Where("ip_address = ? AND created_at > ?", ipAddress, since).
		Order("created_at DESC").
		Find(&histories).Error; err != nil {
		return nil, err
	}
	return histories, nil
}
