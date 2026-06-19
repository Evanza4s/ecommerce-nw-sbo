package mail

import (
	"bytes"
	"crypto/tls"
	"fmt"
	"html/template"
	"net/smtp"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/constant"
)

// ============================================================
// BREVO EMAIL SERVICE
// ============================================================

// Config holds Brevo SMTP configuration
type Config struct {
	APIKey     string
	SMTPServer string
	SMTPPort    string
	SMTPLogin   string
	SenderEmail string
	AppName     string
	AppURL      string
}

// Service provides email functionality
type Service struct {
	config Config
}

// ============================================================
// INITIALIZATION
// ============================================================

var mailService *Service

// Init initializes the mail service
func Init() error {
	config := Config{
		APIKey:      os.Getenv("BREVO_API_KEY"),
		SMTPServer:  os.Getenv("SMTP_SERVER"),
		SMTPPort:    os.Getenv("PORT_SMTP"),
		SMTPLogin:   os.Getenv("LOGIN_SMTP"),
		SenderEmail: os.Getenv("SENDER_EMAIL"),
		AppName:     os.Getenv("APP"),
		AppURL:      os.Getenv("APP_URL"),
	}

	if config.SenderEmail == "" {
		config.SenderEmail = config.SMTPLogin
	}

	if config.APIKey == "" {
		return fmt.Errorf("BREVO_API_KEY is not set")
	}
	if config.SMTPServer == "" {
		config.SMTPServer = "smtp-relay.brevo.com"
	}
	if config.SMTPPort == "" {
		config.SMTPPort = "587"
	}

	mailService = &Service{config: config}
	return nil
}

// GetService returns the mail service instance
func GetService() *Service {
	if mailService == nil {
		Init()
	}
	return mailService
}

// ============================================================
// EMAIL TEMPLATES
// ============================================================

// OTPData contains data for OTP email template
type OTPData struct {
	AppName  string
	OTPCode  string
	UserName string
	OtpType  string
	ExpireIn int
	Year     int
}

// VerificationData contains data for verification email
type VerificationData struct {
	AppName        string
	UserName       string
	VerificationURL string
	Year           int
}

// WelcomeData contains data for welcome email
type WelcomeData struct {
	AppName  string
	UserName string
	LoginURL string
	Year     int
}

// PasswordResetData contains data for password reset email
type PasswordResetData struct {
	AppName    string
	UserName   string
	ResetURL   string
	ExpireIn   int
	Year       int
}

// ============================================================
// SEND EMAIL METHODS
// ============================================================

// SendOTP sends OTP code via email
func (s *Service) SendOTP(toEmail, userName, otpCode, otpType string) error {
	subject := s.getOTPSubject(otpType)
	
	data := OTPData{
		AppName:  s.config.AppName,
		OTPCode:  otpCode,
		UserName: userName,
		OtpType:  otpType,
		ExpireIn: 5, // 5 minutes
		Year:     time.Now().Year(),
	}

	body, err := s.renderTemplate("otp", data)
	if err != nil {
		// Fallback to simple text email
		body = s.renderOTPSimpleText(data)
	}

	return s.SendEmail(toEmail, subject, body, true)
}

// SendVerification sends verification email
func (s *Service) SendVerification(toEmail, userName, verificationURL string) error {
	subject := fmt.Sprintf("Verify Your Email - %s", s.config.AppName)
	
	data := VerificationData{
		AppName:         s.config.AppName,
		UserName:        userName,
		VerificationURL: verificationURL,
		Year:            time.Now().Year(),
	}

	body, err := s.renderTemplate("verification", data)
	if err != nil {
		body = s.renderVerificationSimpleText(data)
	}

	return s.SendEmail(toEmail, subject, body, true)
}

// SendWelcome sends welcome email after successful registration
func (s *Service) SendWelcome(toEmail, userName string) error {
	subject := fmt.Sprintf("Welcome to %s!", s.config.AppName)
	
	data := WelcomeData{
		AppName:  s.config.AppName,
		UserName: userName,
		LoginURL: s.config.AppURL + "/login",
		Year:     time.Now().Year(),
	}

	body, err := s.renderTemplate("welcome", data)
	if err != nil {
		body = s.renderWelcomeSimpleText(data)
	}

	return s.SendEmail(toEmail, subject, body, true)
}

// SendPasswordReset sends password reset email
func (s *Service) SendPasswordReset(toEmail, userName, resetURL string) error {
	subject := fmt.Sprintf("Reset Your Password - %s", s.config.AppName)
	
	data := PasswordResetData{
		AppName:  s.config.AppName,
		UserName: userName,
		ResetURL: resetURL,
		ExpireIn: 30, // 30 minutes
		Year:     time.Now().Year(),
	}

	body, err := s.renderTemplate("password_reset", data)
	if err != nil {
		body = s.renderPasswordResetSimpleText(data)
	}

	return s.SendEmail(toEmail, subject, body, true)
}

// ============================================================
// CORE EMAIL FUNCTION
// ============================================================

// SendEmail sends an email via Brevo SMTP
func (s *Service) SendEmail(to, subject, body string, isHTML bool) error {
	if s.config.APIKey == "" {
		return fmt.Errorf("brevo API key not configured")
	}

	from := s.config.SenderEmail
	
	// Build message
	var msg bytes.Buffer
	msg.WriteString(fmt.Sprintf("From: %s\r\n", from))
	msg.WriteString(fmt.Sprintf("To: %s\r\n", to))
	msg.WriteString(fmt.Sprintf("Subject: %s\r\n", subject))
	msg.WriteString("MIME-Version: 1.0\r\n")
	if isHTML {
		msg.WriteString("Content-Type: text/html; charset=UTF-8\r\n")
	} else {
		msg.WriteString("Content-Type: text/plain; charset=UTF-8\r\n")
	}
	msg.WriteString("\r\n")
	msg.WriteString(body)

	// Setup authentication
	auth := smtp.PlainAuth("", s.config.SMTPLogin, s.config.APIKey, s.config.SMTPServer)

	// Connect to SMTP server
	addr := fmt.Sprintf("%s:%s", s.config.SMTPServer, s.config.SMTPPort)
	
	client, err := smtp.Dial(addr)
	if err != nil {
		return fmt.Errorf("failed to connect to SMTP server: %w", err)
	}
	defer client.Close()

	// TLS config
	tlsConfig := &tls.Config{
		InsecureSkipVerify: true,
		ServerName:         s.config.SMTPServer,
	}

	// Upgrade to TLS
	if err := client.StartTLS(tlsConfig); err != nil {
		return fmt.Errorf("failed to start TLS: %w", err)
	}

	// Authenticate
	if err := client.Auth(auth); err != nil {
		return fmt.Errorf("SMTP authentication failed: %w", err)
	}

	// Set sender and recipient
	if err := client.Mail(from); err != nil {
		return fmt.Errorf("failed to set sender: %w", err)
	}
	if err := client.Rcpt(to); err != nil {
		return fmt.Errorf("failed to set recipient: %w", err)
	}

	// Send email
	writer, err := client.Data()
	if err != nil {
		return fmt.Errorf("failed to get data writer: %w", err)
	}

	_, err = writer.Write(msg.Bytes())
	if err != nil {
		return fmt.Errorf("failed to write email: %w", err)
	}

	if err := writer.Close(); err != nil {
		return fmt.Errorf("failed to close writer: %w", err)
	}

	return client.Quit()
}

// ============================================================
// HELPER METHODS
// ============================================================

func (s *Service) getOTPSubject(otpType string) string {
	switch otpType {
	case constant.OtpTypeVerification:
		return fmt.Sprintf("Email Verification Code - %s", s.config.AppName)
	case constant.OtpTypeForgotPassword:
		return fmt.Sprintf("Password Reset Code - %s", s.config.AppName)
	case constant.OtpTypeChangeEmail:
		return fmt.Sprintf("Email Change Verification - %s", s.config.AppName)
	case constant.OtpTypeTwoFactor:
		return fmt.Sprintf("Two-Factor Authentication Code - %s", s.config.AppName)
	default:
		return fmt.Sprintf("Verification Code - %s", s.config.AppName)
	}
}

func (s *Service) renderTemplate(name string, data interface{}) (string, error) {
	// Try to find template file
	templatePath := filepath.Join("templates", "emails", name+".html")
	
	tmpl, err := template.ParseFiles(templatePath)
	if err != nil {
		return "", err
	}

	var buf bytes.Buffer
	if err := tmpl.Execute(&buf, data); err != nil {
		return "", err
	}

	return buf.String(), nil
}

func (s *Service) renderOTPSimpleText(data OTPData) string {
	return fmt.Sprintf(`
		<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
			<h2 style="color: #333;">%s</h2>
			<p>Hi %s,</p>
			<p>Your verification code is:</p>
			<div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
				<span style="font-size: 32px; font-weight: bold; letter-spacing: 5px;">%s</span>
			</div>
			<p>This code will expire in %d minutes.</p>
			<p>If you did not request this code, please ignore this email.</p>
			<p>Best regards,<br>%s Team</p>
		</div>
	`, data.AppName, data.UserName, data.OTPCode, data.ExpireIn, data.AppName)
}

func (s *Service) renderVerificationSimpleText(data VerificationData) string {
	return fmt.Sprintf(`
		<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
			<h2 style="color: #333;">%s</h2>
			<p>Hi %s,</p>
			<p>Thank you for registering. Please verify your email by clicking the link below:</p>
			<div style="text-align: center; margin: 20px 0;">
				<a href="%s" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Verify Email</a>
			</div>
			<p>This link will expire in 24 hours.</p>
			<p>If you did not create an account, please ignore this email.</p>
			<p>Best regards,<br>%s Team</p>
		</div>
	`, data.AppName, data.UserName, data.VerificationURL, data.AppName)
}

func (s *Service) renderWelcomeSimpleText(data WelcomeData) string {
	return fmt.Sprintf(`
		<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
			<h2 style="color: #333;">Welcome to %s!</h2>
			<p>Hi %s,</p>
			<p>Thank you for joining us. Your account has been created successfully.</p>
			<p>You can now login and start using our services.</p>
			<div style="text-align: center; margin: 20px 0;">
				<a href="%s" style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Login Now</a>
			</div>
			<p>Best regards,<br>%s Team</p>
		</div>
	`, data.AppName, data.UserName, data.LoginURL, data.AppName)
}

func (s *Service) renderPasswordResetSimpleText(data PasswordResetData) string {
	return fmt.Sprintf(`
		<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
			<h2 style="color: #333;">%s</h2>
			<p>Hi %s,</p>
			<p>You requested to reset your password. Click the link below to proceed:</p>
			<div style="text-align: center; margin: 20px 0;">
				<a href="%s" style="background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Reset Password</a>
			</div>
			<p>This link will expire in %d minutes.</p>
			<p>If you did not request this, please ignore this email.</p>
			<p>Best regards,<br>%s Team</p>
		</div>
	`, data.AppName, data.UserName, data.ResetURL, data.ExpireIn, data.AppName)
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

// IsValidEmail checks if email format is valid
func IsValidEmail(email string) bool {
	return strings.Contains(email, "@") && strings.Contains(email, ".")
}
