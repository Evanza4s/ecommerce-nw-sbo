package cloud

import (
	"context"
	"errors"
	"fmt"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

// ============================================================
// CLOUDINARY CONFIGURATION
// ============================================================

var cld *cloudinary.Cloudinary

// Folder constants for organizing uploads
const (
	FolderProducts = "home/products"
	FolderAvatars  = "home/avatars"
	FolderRefunds  = "home/refund_evidence"
)

// Allowed image extensions
var allowedExtensions = map[string]bool{
	".jpg":  true,
	".jpeg": true,
	".png":  true,
	".gif":  true,
	".webp": true,
	".bmp":  true,
}

// MaxFileSize in bytes (10MB)
const MaxFileSize = 10 * 1024 * 1024

// ============================================================
// INITIALIZATION
// ============================================================

// InitCloudinary initializes the Cloudinary client
// Must be called once during application startup
func InitCloudinary() error {
	secretCloud := os.Getenv("API_SECRET_CLOUD")
	keyCloud := os.Getenv("API_KEY_CLOUD")
	cloudName := os.Getenv("CLOUD_NAME")

	// Validate environment variables
	if secretCloud == "" || keyCloud == "" {
		return errors.New("missing Cloudinary credentials: API_SECRET_CLOUD and API_KEY_CLOUD must be set")
	}

	// Use cloud name from env or default
	if cloudName == "" {
		cloudName = "dkvp1k2hh"
	}

	// Build Cloudinary URL
	cldURL := fmt.Sprintf("cloudinary://%s:%s@%s", keyCloud, secretCloud, cloudName)

	var err error
	cld, err = cloudinary.NewFromURL(cldURL)
	if err != nil {
		return fmt.Errorf("failed to initialize Cloudinary: %w", err)
	}

	return nil
}

// ============================================================
// UPLOAD FUNCTIONS
// ============================================================

// UploadImage uploads an image to a specific folder in Cloudinary
func UploadImage(fileHeader *multipart.FileHeader, folderName string) (string, error) {
	if cld == nil {
		return "", errors.New("cloudinary not initialized, call InitCloudinary() first")
	}

	// Validate file size
	if fileHeader.Size > MaxFileSize {
		return "", fmt.Errorf("file size exceeds maximum allowed (%d bytes)", MaxFileSize)
	}

	// Validate file extension
	ext := strings.ToLower(filepath.Ext(fileHeader.Filename))
	if !allowedExtensions[ext] {
		return "", fmt.Errorf("file extension %s is not allowed", ext)
	}

	// Open file stream
	file, err := fileHeader.Open()
	if err != nil {
		return "", fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	// Upload to Cloudinary
	ctx := context.Background()
	uploadResult, err := cld.Upload.Upload(ctx, file, uploader.UploadParams{
		Folder:         folderName,
		Transformation: "q_auto,f_auto", // Auto optimize quality and format
	})
	if err != nil {
		return "", fmt.Errorf("failed to upload image: %w", err)
	}

	return uploadResult.SecureURL, nil
}

// UploadImageWithPublicID uploads an image with a custom public ID
func UploadImageWithPublicID(fileHeader *multipart.FileHeader, folderName string, publicID string) (string, error) {
	if cld == nil {
		return "", errors.New("cloudinary not initialized, call InitCloudinary() first")
	}

	// Validate file size
	if fileHeader.Size > MaxFileSize {
		return "", fmt.Errorf("file size exceeds maximum allowed (%d bytes)", MaxFileSize)
	}

	// Validate file extension
	ext := strings.ToLower(filepath.Ext(fileHeader.Filename))
	if !allowedExtensions[ext] {
		return "", fmt.Errorf("file extension %s is not allowed", ext)
	}

	// Open file stream
	file, err := fileHeader.Open()
	if err != nil {
		return "", fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	// Upload to Cloudinary with custom public ID
	ctx := context.Background()
	uploadResult, err := cld.Upload.Upload(ctx, file, uploader.UploadParams{
		PublicID:       publicID,
		Folder:         folderName,
		Transformation: "q_auto,f_auto",
	})
	if err != nil {
		return "", fmt.Errorf("failed to upload image: %w", err)
	}

	return uploadResult.SecureURL, nil
}

// ============================================================
// DELETE FUNCTIONS
// ============================================================

// DeleteImage deletes an image from Cloudinary by public ID
func DeleteImage(publicID string) error {
	if cld == nil {
		return errors.New("cloudinary not initialized, call InitCloudinary() first")
	}

	if publicID == "" {
		return errors.New("public ID cannot be empty")
	}

	ctx := context.Background()
	_, err := cld.Upload.Destroy(ctx, uploader.DestroyParams{
		PublicID: publicID,
	})
	if err != nil {
		return fmt.Errorf("failed to delete image: %w", err)
	}

	return nil
}

// DeleteFolder deletes all images in a folder
// Note: This requires admin API access
func DeleteFolder(folderPath string) error {
	if cld == nil {
		return errors.New("cloudinary not initialized, call InitCloudinary() first")
	}

	ctx := context.Background()
	_, err := cld.Upload.Destroy(ctx, uploader.DestroyParams{
		PublicID: folderPath,
	})
	if err != nil {
		return fmt.Errorf("failed to delete folder: %w", err)
	}

	return nil
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

// ExtractPublicIDFromURL extracts the public ID from a Cloudinary URL
func ExtractPublicIDFromURL(url string) string {
	// Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{folder}/{public_id}.{format}
	// or: https://res.cloudinary.com/{cloud_name}/image/upload/{folder}/{public_id}.{format}

	parts := strings.Split(url, "/image/upload/")
	if len(parts) != 2 {
		return ""
	}

	// Get the part after /image/upload/
	pathPart := parts[1]

	// Remove version if present (v1234567890/)
	if strings.HasPrefix(pathPart, "v") {
		versionEnd := strings.Index(pathPart, "/")
		if versionEnd != -1 {
			pathPart = pathPart[versionEnd+1:]
		}
	}

	// Remove file extension
	ext := filepath.Ext(pathPart)
	if ext != "" {
		pathPart = pathPart[:len(pathPart)-len(ext)]
	}

	return pathPart
}

// ValidateImageFile validates if the file is a valid image
func ValidateImageFile(fileHeader *multipart.FileHeader) error {
	// Check file size
	if fileHeader.Size > MaxFileSize {
		return fmt.Errorf("file size exceeds maximum allowed (%d bytes)", MaxFileSize)
	}

	// Check file extension
	ext := strings.ToLower(filepath.Ext(fileHeader.Filename))
	if !allowedExtensions[ext] {
		return fmt.Errorf("file extension %s is not allowed. Allowed: jpg, jpeg, png, gif, webp, bmp", ext)
	}

	return nil
}

// IsCloudinaryInitialized checks if Cloudinary has been initialized
func IsCloudinaryInitialized() bool {
	return cld != nil
}
