package repository

import (
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/google/uuid"
)

// SessionRepository handles user session operations
type SessionRepository interface {
	// Create creates a new session
	Create(session model.UserSession) (*model.UserSession, error)

	// FindByID finds session by ID
	FindByID(id uuid.UUID) (*model.UserSession, error)

	// FindByUserID finds all sessions for a user
	FindByUserID(userID uuid.UUID) ([]model.UserSession, error)

	// FindActiveByUserID finds active sessions for a user
	FindActiveByUserID(userID uuid.UUID) ([]model.UserSession, error)

	// Update updates a session
	Update(session model.UserSession) (*model.UserSession, error)

	// Revoke revokes a session
	Revoke(id uuid.UUID) error

	// RevokeAllByUserID revokes all sessions for a user (except current)
	RevokeAllByUserID(userID uuid.UUID, exceptSessionID uuid.UUID) error

	// DeleteExpired deletes all expired sessions
	DeleteExpired() error

	// Delete deletes a session
	Delete(session model.UserSession) error
}

// LoginHistoryRepository handles login history operations
type LoginHistoryRepository interface {
	// Create creates a login history entry
	Create(history model.TrxLoginHistory) (*model.TrxLoginHistory, error)

	// FindByUserID finds login history for a user
	FindByUserID(userID uuid.UUID, limit int) ([]model.TrxLoginHistory, error)

	// FindRecentByIP finds recent login attempts by IP
	FindRecentByIP(ipAddress string, minutes int) ([]model.TrxLoginHistory, error)
}
