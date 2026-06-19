package jwt

import (
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

// ============================================================
// JWT CONFIGURATION
// ============================================================

var (
	ErrInvalidToken = errors.New("invalid token")
	ErrExpiredToken = errors.New("token has expired")
)

// Config holds JWT configuration
type Config struct {
	AccessTokenSecret   string
	RefreshTokenSecret  string
	AccessTokenExpiry   int // in minutes
	RefreshTokenExpiry  int // in hours
	Issuer              string
}

// GetConfig returns JWT config from environment
func GetConfig() Config {
	return Config{
		AccessTokenSecret:  getEnv("JWT_KEY", "default-secret-key"),
		RefreshTokenSecret: getEnv("JWT_REFRESH_TOKEN_SECRET", "default-refresh-secret"),
		AccessTokenExpiry:  getEnvInt("JWT_ACCESS_TOKEN_EXPIRE", 15),     // 15 minutes default
		RefreshTokenExpiry: getEnvInt("JWT_REFRESH_TOKEN_EXPIRE", 168),   // 168 hours = 7 days default
		Issuer:             getEnv("APP", "E-Commerce NW"),
	}
}

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

func getEnvInt(key string, defaultValue int) int {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	var result int
	fmt.Sscanf(value, "%d", &result)
	return result
}

// ============================================================
// ACCESS TOKEN
// ============================================================

// GenerateAccessToken generates a new access token
func GenerateAccessToken(userID, sessionID, roleID uuid.UUID, email, username string) (string, *model.JwtPayload, error) {
	config := GetConfig()
	now := time.Now()
	expiresAt := now.Add(time.Duration(config.AccessTokenExpiry) * time.Minute)

	claims := &model.JwtPayload{
		UserID:    userID,
		SessionID: sessionID,
		RoleID:    roleID,
		Email:     email,
		Username:  username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
			Issuer:    config.Issuer,
			Subject:   userID.String(),
			ID:        uuid.New().String(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(config.AccessTokenSecret))
	if err != nil {
		return "", nil, err
	}

	return tokenString, claims, nil
}

// ValidateAccessToken validates an access token
func ValidateAccessToken(tokenString string) (*model.JwtPayload, error) {
	config := GetConfig()

	token, err := jwt.ParseWithClaims(tokenString, &model.JwtPayload{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(config.AccessTokenSecret), nil
	})

	if err != nil {
		if errors.Is(err, jwt.ErrTokenExpired) {
			return nil, ErrExpiredToken
		}
		return nil, ErrInvalidToken
	}

	claims, ok := token.Claims.(*model.JwtPayload)
	if !ok || !token.Valid {
		return nil, ErrInvalidToken
	}

	return claims, nil
}

// ============================================================
// REFRESH TOKEN
// ============================================================

// GenerateRefreshToken generates a new refresh token
func GenerateRefreshToken(userID, sessionID, roleID uuid.UUID, email string) (string, *model.JwtRefreshToken, error) {
	config := GetConfig()
	now := time.Now()
	expiresAt := now.Add(time.Duration(config.RefreshTokenExpiry) * time.Hour)

	claims := &model.JwtRefreshToken{
		UserID:    userID,
		SessionID: sessionID,
		RoleID:    roleID,
		Email:     email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
			Issuer:    config.Issuer,
			Subject:   userID.String(),
			ID:        uuid.New().String(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(config.RefreshTokenSecret))
	if err != nil {
		return "", nil, err
	}

	return tokenString, claims, nil
}

// ValidateRefreshToken validates a refresh token
func ValidateRefreshToken(tokenString string) (*model.JwtRefreshToken, error) {
	config := GetConfig()

	token, err := jwt.ParseWithClaims(tokenString, &model.JwtRefreshToken{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(config.RefreshTokenSecret), nil
	})

	if err != nil {
		if errors.Is(err, jwt.ErrTokenExpired) {
			return nil, ErrExpiredToken
		}
		return nil, ErrInvalidToken
	}

	claims, ok := token.Claims.(*model.JwtRefreshToken)
	if !ok || !token.Valid {
		return nil, ErrInvalidToken
	}

	return claims, nil
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

// HashToken creates a SHA256 hash of a token
func HashToken(token string) string {
	hash := sha256.Sum256([]byte(token))
	return hex.EncodeToString(hash[:])
}

// GetAccessTokenExpiry returns access token expiry duration
func GetAccessTokenExpiry() time.Duration {
	config := GetConfig()
	return time.Duration(config.AccessTokenExpiry) * time.Minute
}

// GetRefreshTokenExpiry returns refresh token expiry duration
func GetRefreshTokenExpiry() time.Duration {
	config := GetConfig()
	return time.Duration(config.RefreshTokenExpiry) * time.Hour
}

// GetAccessTokenExpiryMinutes returns access token expiry in minutes
func GetAccessTokenExpiryMinutes() int {
	config := GetConfig()
	return config.AccessTokenExpiry
}

// GetRefreshTokenExpiryHours returns refresh token expiry in hours
func GetRefreshTokenExpiryHours() int {
	config := GetConfig()
	return config.RefreshTokenExpiry
}
