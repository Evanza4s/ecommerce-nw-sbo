package redis

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/redis/go-redis/v9"
)

// ============================================================
// REDIS CLIENT
// ============================================================

var client *redis.Client

// Config holds Redis configuration
type Config struct {
	Host     string
	Port     string
	Password string
	DB       int
}

// Init initializes Redis client
func Init() error {
	config := Config{
		Host:     getEnv("REDIS_HOST", "localhost"),
		Port:     getEnv("REDIS_PORT", "6379"),
		Password: getEnv("REDIS_PASSWORD", ""),
		DB:       0,
	}

	client = redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", config.Host, config.Port),
		Password: config.Password,
		DB:       config.DB,
	})

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := client.Ping(ctx).Result()
	if err != nil {
		return fmt.Errorf("failed to connect to Redis: %w", err)
	}

	return nil
}

// GetClient returns the Redis client
func GetClient() *redis.Client {
	return client
}

// Close closes the Redis connection
func Close() error {
	if client != nil {
		return client.Close()
	}
	return nil
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

// ============================================================
// OTP KEY HELPERS
// ============================================================

// OTP key patterns
const (
	OtpKeyPattern     = "otp:%s:%s"     // otp:{email}:{type}
	OtpAttemptPattern = "otp:attempt:%s:%s" // otp:attempt:{email}:{type}
)

// GenerateOtpKey generates Redis key for OTP
func GenerateOtpKey(email, otpType string) string {
	return fmt.Sprintf(OtpKeyPattern, email, otpType)
}

// GenerateOtpAttemptKey generates Redis key for OTP attempts
func GenerateOtpAttemptKey(email, otpType string) string {
	return fmt.Sprintf(OtpAttemptPattern, email, otpType)
}

// ============================================================
// OTP OPERATIONS
// ============================================================

// SetOTP stores OTP in Redis with expiry
func SetOTP(ctx context.Context, email, otpType, otpCode string, expiry time.Duration) error {
	key := GenerateOtpKey(email, otpType)
	return client.Set(ctx, key, otpCode, expiry).Err()
}

// GetOTP retrieves OTP from Redis
func GetOTP(ctx context.Context, email, otpType string) (string, error) {
	key := GenerateOtpKey(email, otpType)
	return client.Get(ctx, key).Result()
}

// DeleteOTP removes OTP from Redis
func DeleteOTP(ctx context.Context, email, otpType string) error {
	key := GenerateOtpKey(email, otpType)
	return client.Del(ctx, key).Err()
}

// ExistsOTP checks if OTP exists
func ExistsOTP(ctx context.Context, email, otpType string) (bool, error) {
	key := GenerateOtpKey(email, otpType)
	result, err := client.Exists(ctx, key).Result()
	if err != nil {
		return false, err
	}
	return result > 0, nil
}

// GetOTPTTL returns remaining TTL of OTP
func GetOTPTTL(ctx context.Context, email, otpType string) (time.Duration, error) {
	key := GenerateOtpKey(email, otpType)
	return client.TTL(ctx, key).Result()
}

// ============================================================
// ATTEMPT TRACKING
// ============================================================

// IncrementAttempt increments and returns attempt count
func IncrementAttempt(ctx context.Context, email, otpType string, expiry time.Duration) (int64, error) {
	key := GenerateOtpAttemptKey(email, otpType)
	
	result, err := client.Incr(ctx, key).Result()
	if err != nil {
		return 0, err
	}
	
	// Set expiry on first attempt
	if result == 1 {
		client.Expire(ctx, key, expiry)
	}
	
	return result, nil
}

// GetAttemptCount returns current attempt count
func GetAttemptCount(ctx context.Context, email, otpType string) (int64, error) {
	key := GenerateOtpAttemptKey(email, otpType)
	return client.Get(ctx, key).Int64()
}

// ResetAttempts resets attempt count
func ResetAttempts(ctx context.Context, email, otpType string) error {
	key := GenerateOtpAttemptKey(email, otpType)
	return client.Del(ctx, key).Err()
}

// ============================================================
// GENERIC OPERATIONS
// ============================================================

// Set stores a key-value pair with expiry
func Set(ctx context.Context, key string, value interface{}, expiry time.Duration) error {
	return client.Set(ctx, key, value, expiry).Err()
}

// Get retrieves a value by key
func Get(ctx context.Context, key string) (string, error) {
	return client.Get(ctx, key).Result()
}

// Delete removes a key
func Delete(ctx context.Context, key string) error {
	return client.Del(ctx, key).Err()
}

// Exists checks if key exists
func Exists(ctx context.Context, key string) (bool, error) {
	result, err := client.Exists(ctx, key).Result()
	if err != nil {
		return false, err
	}
	return result > 0, nil
}
