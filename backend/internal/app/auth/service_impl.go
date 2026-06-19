package auth

import (
	"context"
	"crypto/rand"
	"errors"
	"fmt"
	"math/big"
	"net/http"
	"time"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/auth/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/repository"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/repository/repository_impl"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/constant"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/jwt"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/mail"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/redis"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/res"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// ============================================================
// SERVICE IMPLEMENTATION
// ============================================================

type ServiceImpl struct {
	userRepo      repository.UserRepository
	roleRepo      repository.RolesRepository
	otpRepo       repository.OtpRepository
	sessionRepo   repository.SessionRepository
	loginHistRepo repository.LoginHistoryRepository
	identityRepo  repository.UserIdentityRepository
	mailSvc       *mail.Service
}

func NewServiceImpl() *ServiceImpl {
	return &ServiceImpl{
		userRepo:      repository_impl.NewUserRepositoryImpl(),
		roleRepo:      repository_impl.NewRolesRepositoryImpl(),
		otpRepo:       repository_impl.NewOtpRepositoryImpl(),
		sessionRepo:   repository_impl.NewSessionRepositoryImpl(),
		loginHistRepo: repository_impl.NewLoginHistoryRepositoryImpl(),
		identityRepo:  repository_impl.NewUserIdentityRepositoryImpl(),
		mailSvc:       mail.GetService(),
	}
}

// ============================================================
// CONFIGURATION
// ============================================================

const (
	OTP_LENGTH         = 6
	OTP_EXPIRY_MINUTES = 5
	OTP_RESEND_LIMIT   = 3
	OTP_MAX_ATTEMPTS   = 5
	DEFAULT_ROLE_NAME  = "customer"
)

var ctx = context.Background()

// ============================================================
// LOGIN
// ============================================================

func (s ServiceImpl) Login(req *schemas.LoginRequest, deviceInfo *schemas.DeviceInfo) (int, interface{}) {
	// Find user by email
	user, err := s.userRepo.FindByEmail(req.Email)
	if err != nil {
		s.logLoginAttempt(nil, req.Email, deviceInfo, "failed", "user not found")
		return res.BuildCustomResponse(res.StatusFailed, http.StatusUnauthorized, []string{"invalid email or password"}, res.MsgGetFailed, nil)
	}

	// Check if user is active
	if !user.IsActive {
		s.logLoginAttempt(&user.ID, req.Email, deviceInfo, "failed", "account is deactivated")
		return res.BuildCustomResponse(res.StatusFailed, http.StatusUnauthorized, []string{"account is deactivated"}, res.MsgGetFailed, nil)
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		s.logLoginAttempt(&user.ID, req.Email, deviceInfo, "failed", "invalid password")
		return res.BuildCustomResponse(res.StatusFailed, http.StatusUnauthorized, []string{"invalid email or password"}, res.MsgGetFailed, nil)
	}

	if !user.IsVerified {
		s.logLoginAttempt(&user.ID, req.Email, deviceInfo, "failed", "account is not verified")
		return res.BuildCustomResponse(res.StatusFailed, http.StatusUnauthorized, []string{"account is not verified"}, res.MsgGetFailed, nil)
	}

	// Create session
	sessionID := uuid.New()
	now, _ := util.GetTimeNow("Asia/Jakarta")

	// Set refresh token expiry based on RememberMe
	refreshExpiry := jwt.GetRefreshTokenExpiry()
	if req.RememberMe {
		refreshExpiry = 30 * 24 * time.Hour // 30 days for remember me
	}

	session := model.UserSession{
		UserID:           user.ID,
		RefreshTokenHash: "",
		DeviceName:       deviceInfo.DeviceName,
		DeviceType:       deviceInfo.DeviceType,
		Browser:          deviceInfo.Browser,
		OS:               deviceInfo.OS,
		IPAddress:        deviceInfo.IPAddress,
		UserAgent:        deviceInfo.UserAgent,
		LoginAt:          &now,
		LastActivityAt:   &now,
		ExpiredAt:        now.Add(refreshExpiry),
		RevokedAt:        nil,
	}
	session.ID = sessionID
	session.CreatedAt = now

	// Generate tokens
	accessToken, _, err := jwt.GenerateAccessToken(user.ID, sessionID, user.RoleID, user.Email, user.Username)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{"failed to generate access token"}, res.MsgGetFailed, nil)
	}

	refreshToken, _, err := jwt.GenerateRefreshToken(user.ID, sessionID, user.RoleID, user.Email)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{"failed to generate refresh token"}, res.MsgGetFailed, nil)
	}

	// Hash refresh token and save session
	session.RefreshTokenHash = jwt.HashToken(refreshToken)
	_, err = s.sessionRepo.Create(session)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{"failed to create session"}, res.MsgGetFailed, nil)
	}

	// Log successful login
	s.logLoginAttempt(&user.ID, req.Email, deviceInfo, "success", "")

	// Get user identity for firstName, lastName, phone, avatar
	var firstName, lastName, phone, avatar string
	if user.Identity != nil {
		firstName = user.Identity.FirstName
		lastName = user.Identity.LastName
		phone = user.Identity.PhoneNumber
		avatar = user.Identity.AvatarURL
	} else {
		// Try to fetch identity separately
		identity, _ := s.identityRepo.FindByUserID(user.ID)
		if identity != nil {
			firstName = identity.FirstName
			lastName = identity.LastName
			phone = identity.PhoneNumber
			avatar = identity.AvatarURL
		}
	}

	// Use actual role_name from mst_roles: "admin", "super admin", or "customer"
	role := "customer"
	if user.RoleRef != nil {
		role = user.RoleRef.RoleName
	}

	// Format dates
	createdAt := user.CreatedAt.Format(time.RFC3339)
	updatedAt := createdAt
	if user.UpdatedAt != nil {
		updatedAt = user.UpdatedAt.Format(time.RFC3339)
	}

	// Build response
	response := schemas.LoginResponse{
		Success:            true,
		Message:            "login successful",
		AccessToken:        accessToken,
		RefreshToken:       refreshToken,
		AccessTokenExpiry:  jwt.GetAccessTokenExpiryMinutes() * 60,
		RefreshTokenExpiry: int(refreshExpiry.Seconds()),
		User: &schemas.LoginUserResponse{
			ID:         user.ID,
			Email:      user.Email,
			Username:   user.Username,
			FirstName:  firstName,
			LastName:   lastName,
			Phone:      phone,
			Avatar:     avatar,
			Role:       role,
			IsActive:   user.IsActive,
			IsVerified: user.IsVerified,
			CreatedAt:  createdAt,
			UpdatedAt:  updatedAt,
		},
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, "login successful", response)
}

// ============================================================
// REFRESH TOKEN
// ============================================================

func (s ServiceImpl) RefreshToken(req *schemas.RefreshTokenRequest) (int, interface{}) {
	// Validate refresh token
	claims, err := jwt.ValidateRefreshToken(req.RefreshToken)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusUnauthorized, []string{"invalid or expired refresh token"}, res.MsgGetFailed, nil)
	}

	// Find session
	session, err := s.sessionRepo.FindByID(claims.SessionID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusUnauthorized, []string{"session not found"}, res.MsgGetFailed, nil)
	}

	// Check if session is revoked
	if session.RevokedAt != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusUnauthorized, []string{"session has been revoked"}, res.MsgGetFailed, nil)
	}

	// Check if session is expired
	if session.ExpiredAt.Before(time.Now()) {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusUnauthorized, []string{"session has expired"}, res.MsgGetFailed, nil)
	}

	// Verify refresh token hash
	if session.RefreshTokenHash != jwt.HashToken(req.RefreshToken) {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusUnauthorized, []string{"invalid refresh token"}, res.MsgGetFailed, nil)
	}

	// Find user
	user, err := s.userRepo.FindByID(claims.UserID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusUnauthorized, []string{"user not found"}, res.MsgGetFailed, nil)
	}

	// Check if user is still active
	if !user.IsActive {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusUnauthorized, []string{"account is deactivated"}, res.MsgGetFailed, nil)
	}

	// Generate new access token
	accessToken, _, err := jwt.GenerateAccessToken(user.ID, claims.SessionID, user.RoleID, user.Email, user.Username)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{"failed to generate access token"}, res.MsgGetFailed, nil)
	}

	// Update last activity
	now := time.Now()
	session.LastActivityAt = &now
	s.sessionRepo.Update(*session)

	response := schemas.RefreshTokenResponse{
		Success:           true,
		Message:           "token refreshed successfully",
		AccessToken:       accessToken,
		AccessTokenExpiry: jwt.GetAccessTokenExpiryMinutes() * 60,
		SessionID:         claims.SessionID,
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, "token refreshed", response)
}

// ============================================================
// LOGOUT
// ============================================================

func (s ServiceImpl) Logout(sessionID uuid.UUID, allDevices bool) (int, interface{}) {
	// Find session
	session, err := s.sessionRepo.FindByID(sessionID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusNotFound, []string{"session not found"}, res.MsgGetFailed, nil)
	}

	if allDevices {
		// Revoke all sessions for this user except current
		if err := s.sessionRepo.RevokeAllByUserID(session.UserID, sessionID); err != nil {
			return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{"failed to revoke all sessions"}, res.MsgUpdateFailed, nil)
		}
	}

	// Revoke current session
	if err := s.sessionRepo.Revoke(sessionID); err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{"failed to logout"}, res.MsgUpdateFailed, nil)
	}

	response := schemas.LogoutResponse{
		Success: true,
		Message: "logout successful",
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, "logout successful", response)
}

// ============================================================
// GET SESSIONS
// ============================================================

func (s ServiceImpl) GetSessions(userID uuid.UUID, currentSessionID uuid.UUID) (int, interface{}) {
	sessions, err := s.sessionRepo.FindActiveByUserID(userID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgGetFailed, nil)
	}

	var responses []schemas.SessionResponse
	for _, session := range sessions {
		responses = append(responses, schemas.SessionResponse{
			ID:             session.ID,
			DeviceName:     session.DeviceName,
			DeviceType:     session.DeviceType,
			Browser:        session.Browser,
			OS:             session.OS,
			IPAddress:      session.IPAddress,
			LoginAt:        session.LoginAt,
			LastActivityAt: session.LastActivityAt,
			ExpiredAt:      session.ExpiredAt,
			IsCurrent:      session.ID == currentSessionID,
		})
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgGetSuccess, responses)
}

// ============================================================
// REVOKE SESSION
// ============================================================

func (s ServiceImpl) RevokeSession(userID uuid.UUID, sessionID uuid.UUID) (int, interface{}) {
	session, err := s.sessionRepo.FindByID(sessionID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusNotFound, []string{"session not found"}, res.MsgGetFailed, nil)
	}

	// Verify session belongs to user
	if session.UserID != userID {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusForbidden, []string{"unauthorized"}, res.MsgUpdateFailed, nil)
	}

	// Revoke session
	if err := s.sessionRepo.Revoke(sessionID); err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{"failed to revoke session"}, res.MsgUpdateFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, "session revoked successfully", nil)
}

// ============================================================
// REGISTRATION
// ============================================================

func (s ServiceImpl) Register(req *schemas.RegisterRequest) (int, interface{}) {
	// Validate passwords match
	if req.Password != req.ConfirmPassword {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"passwords do not match"}, res.MsgAddFailed, nil)
	}

	// Check if email exists
	exists, _ := s.userRepo.ExistsByEmail(req.Email)
	if exists {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusConflict, []string{"email already exists"}, res.MsgAddFailed, nil)
	}

	// Check if username exists
	exists, _ = s.userRepo.ExistsByUsername(req.Username)
	if exists {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusConflict, []string{"username already exists"}, res.MsgAddFailed, nil)
	}

	// Get default role (customer)
	roles, err := s.roleRepo.FindAll()
	if err != nil || len(roles) == 0 {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"default role not found"}, res.MsgAddFailed, nil)
	}

	var defaultRole model.MstRoles
	for _, r := range roles {
		if r.RoleName == DEFAULT_ROLE_NAME {
			defaultRole = r
			break
		}
	}

	if defaultRole.ID == uuid.Nil {
		defaultRole = roles[0]
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"failed to hash password"}, res.MsgAddFailed, nil)
	}

	// Create user
	now, _ := util.GetTimeNow("Asia/Jakarta")
	user := model.MstUsers{
		Fullname:   req.FirstName + " " + req.LastName,
		Username:   req.Username,
		Email:      req.Email,
		Password:   string(hashedPassword),
		RoleID:     defaultRole.ID,
		IsActive:   true,
		IsVerified: false,
	}
	user.CreatedAt = now

	result, err := s.userRepo.Save(user)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgAddFailed, nil)
	}

	// Create user identity with firstName and lastName
	identity := model.UserIdentity{
		UserID:    result.ID,
		FirstName: req.FirstName,
		LastName:  req.LastName,
	}
	identity.CreatedAt = now

	_, err = s.identityRepo.Save(identity)
	if err != nil {
		fmt.Printf("Warning: failed to create user identity: %v\n", err)
	}

	// Auto-send verification OTP
	otpCode, err := s.generateOTP()
	if err != nil {
		fmt.Printf("Warning: failed to generate OTP: %v\n", err)
	} else {
		expiry := OTP_EXPIRY_MINUTES * time.Minute
		if err := redis.SetOTP(ctx, req.Email, constant.OtpTypeVerification, otpCode, expiry); err != nil {
			fmt.Printf("Warning: failed to store OTP: %v\n", err)
		} else {
			userName := result.Fullname
			if userName == "" {
				userName = result.Email
			}
			if err := s.mailSvc.SendOTP(result.Email, userName, otpCode, constant.OtpTypeVerification); err != nil {
				fmt.Printf("Warning: failed to send OTP email: %v\n", err)
			}
		}
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusCreated, nil, "registration successful, verification OTP sent to your email", schemas.RegisterResponse{
		Success: true,
		Message: "registration successful, verification OTP sent to your email",
		UserID:  result.ID,
		Email:   result.Email,
	})
}

// ============================================================
// VERIFY OTP
// ============================================================

func (s ServiceImpl) VerifyOTP(req *schemas.VerifyOTPRequest) (int, interface{}) {
	// Find user by email
	user, err := s.userRepo.FindByEmail(req.Email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusFailed, http.StatusNotFound, []string{"user not found"}, res.MsgGetFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgGetFailed, nil)
	}

	// Get OTP from Redis
	storedOTP, err := redis.GetOTP(ctx, req.Email, req.OtpType)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"OTP expired or not found"}, res.MsgGetFailed, nil)
	}

	// Verify OTP
	if storedOTP != req.OTPCode {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid OTP code"}, res.MsgGetFailed, nil)
	}

	// Delete OTP from Redis (one-time use)
	redis.DeleteOTP(ctx, req.Email, req.OtpType)
	redis.ResetAttempts(ctx, req.Email, req.OtpType)

	// If verification type, mark user as verified
	if req.OtpType == constant.OtpTypeVerification {
		now, _ := util.GetTimeNow("Asia/Jakarta")
		user.IsVerified = true
		user.EmailVerifiedAt = &now
		user.UpdatedAt = &now

		_, err = s.userRepo.Update(*user)
		if err != nil {
			return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgUpdateFailed, nil)
		}
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, "verification successful", schemas.VerifyOTPResponse{
		Success: true,
		Message: "verification successful",
	})
}

// ============================================================
// RESEND OTP
// ============================================================

func (s ServiceImpl) ResendOTP(req *schemas.ResendOTPRequest) (int, interface{}) {
	// Find user by email
	user, err := s.userRepo.FindByEmail(req.Email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusFailed, http.StatusNotFound, []string{"user not found"}, res.MsgGetFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgGetFailed, nil)
	}

	// For verification type, check if already verified
	if req.OtpType == constant.OtpTypeVerification && user.IsVerified {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"email already verified"}, res.MsgAddFailed, nil)
	}

	// Check attempt count (rate limiting)
	attemptCount, err := redis.GetAttemptCount(ctx, req.Email, req.OtpType)
	if err == nil && attemptCount >= OTP_RESEND_LIMIT {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusTooManyRequests, []string{"too many resend attempts, please try again later"}, res.MsgAddFailed, nil)
	}

	// Generate new OTP
	otpCode, err := s.generateOTP()
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{"failed to generate OTP"}, res.MsgAddFailed, nil)
	}

	// Store OTP in Redis with expiry
	expiry := OTP_EXPIRY_MINUTES * time.Minute
	if err := redis.SetOTP(ctx, req.Email, req.OtpType, otpCode, expiry); err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgAddFailed, nil)
	}

	// Increment attempt count
	redis.IncrementAttempt(ctx, req.Email, req.OtpType, 15*time.Minute)

	// Send OTP email
	userName := user.Fullname
	if userName == "" {
		userName = user.Email
	}

	if err := s.mailSvc.SendOTP(user.Email, userName, otpCode, req.OtpType); err != nil {
		fmt.Printf("Warning: failed to send OTP email: %v\n", err)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, "OTP resent successfully", schemas.ResendOTPResponse{
		Success: true,
		Message: "OTP sent to your email",
	})
}

// ============================================================
// FORGOT PASSWORD
// ============================================================

func (s ServiceImpl) ForgotPassword(req *schemas.ForgotPasswordRequest) (int, interface{}) {
	// Find user by email
	user, err := s.userRepo.FindByEmail(req.Email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, "if email exists, OTP will be sent", nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgGetFailed, nil)
	}

	// Check attempt count (rate limiting)
	attemptCount, err := redis.GetAttemptCount(ctx, req.Email, constant.OtpTypeForgotPassword)
	if err == nil && attemptCount >= OTP_MAX_ATTEMPTS {
		return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, "if email exists, OTP will be sent", nil)
	}

	// Generate new OTP
	otpCode, err := s.generateOTP()
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{"failed to generate OTP"}, res.MsgAddFailed, nil)
	}

	// Store OTP in Redis with expiry
	expiry := OTP_EXPIRY_MINUTES * time.Minute
	if err := redis.SetOTP(ctx, req.Email, constant.OtpTypeForgotPassword, otpCode, expiry); err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgAddFailed, nil)
	}

	// Increment attempt count
	redis.IncrementAttempt(ctx, req.Email, constant.OtpTypeForgotPassword, 15*time.Minute)

	// Send OTP email
	userName := user.Fullname
	if userName == "" {
		userName = user.Email
	}

	if err := s.mailSvc.SendOTP(user.Email, userName, otpCode, constant.OtpTypeForgotPassword); err != nil {
		fmt.Printf("Warning: failed to send OTP email: %v\n", err)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, "if email exists, OTP will be sent", schemas.SendOTPResponse{
		Success: true,
		Message: "OTP sent to your email",
		OtpType: constant.OtpTypeForgotPassword,
	})
}

// ============================================================
// RESET PASSWORD WITH OTP
// ============================================================

func (s ServiceImpl) ResetPasswordWithOTP(req *schemas.ForgotPasswordVerifyRequest) (int, interface{}) {
	// Validate passwords match
	if req.NewPassword != req.ConfirmPassword {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"passwords do not match"}, res.MsgUpdateFailed, nil)
	}

	// Find user by email
	user, err := s.userRepo.FindByEmail(req.Email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusFailed, http.StatusNotFound, []string{"user not found"}, res.MsgGetFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgGetFailed, nil)
	}

	// Get OTP from Redis
	storedOTP, err := redis.GetOTP(ctx, req.Email, constant.OtpTypeForgotPassword)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"OTP expired or not found"}, res.MsgGetFailed, nil)
	}

	// Verify OTP
	if storedOTP != req.OTPCode {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid OTP code"}, res.MsgGetFailed, nil)
	}

	// Hash new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"failed to hash password"}, res.MsgUpdateFailed, nil)
	}

	// Update password
	now, _ := util.GetTimeNow("Asia/Jakarta")
	user.Password = string(hashedPassword)
	user.UpdatedAt = &now

	_, err = s.userRepo.Update(*user)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgUpdateFailed, nil)
	}

	// Delete OTP from Redis
	redis.DeleteOTP(ctx, req.Email, constant.OtpTypeForgotPassword)
	redis.ResetAttempts(ctx, req.Email, constant.OtpTypeForgotPassword)

	// Revoke all sessions for security
	s.sessionRepo.RevokeAllByUserID(user.ID, uuid.Nil)

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, "password reset successful", nil)
}

// ============================================================
// HELPER METHODS
// ============================================================

func (s ServiceImpl) generateOTP() (string, error) {
	otp := ""
	for i := 0; i < OTP_LENGTH; i++ {
		n, err := rand.Int(rand.Reader, big.NewInt(10))
		if err != nil {
			return "", err
		}
		otp += fmt.Sprintf("%d", n.Int64())
	}
	return otp, nil
}

func (s ServiceImpl) logLoginAttempt(userID *uuid.UUID, email string, deviceInfo *schemas.DeviceInfo, status, reason string) {
	history := model.TrxLoginHistory{
		UserID:        userID,
		Email:         email,
		IPAddress:     deviceInfo.IPAddress,
		Browser:       deviceInfo.Browser,
		OS:            deviceInfo.OS,
		LoginStatus:   status,
		FailureReason: reason,
	}
	now, _ := util.GetTimeNow("Asia/Jakarta")
	history.CreatedAt = now

	_, err := s.loginHistRepo.Create(history)
	if err != nil {
		fmt.Printf("Warning: failed to log login attempt: %v\n", err)
	}
}
