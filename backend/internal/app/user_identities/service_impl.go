package user_identities

import (
	"fmt"
	"mime/multipart"
	"net/http"
	"time"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/user_identities/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/repository"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/repository/repository_impl"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/cloud"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/res"
	"github.com/google/uuid"
)

type ServiceImpl struct {
	userIdentityRepo repository.UserIdentityRepository
}

func NewServiceImpl() *ServiceImpl {
	return &ServiceImpl{
		userIdentityRepo: repository_impl.NewUserIdentityRepositoryImpl(),
	}
}

// ============================================================
// GET IDENTITY
// ============================================================

// GetIdentity retrieves user identity
func (s ServiceImpl) GetIdentity(payload *model.JwtPayload, userID string) (int, interface{}) {
	parsedID, err := uuid.Parse(userID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id format"}, res.MsgGetFailed, nil)
	}

	identity, err := s.userIdentityRepo.FindByUserID(parsedID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgGetFailed, nil)
	}

	if identity == nil {
		return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, []string{"identity not found, please complete your profile"}, res.MsgGetFailed, nil)
	}

	response := schemas.IdentityResponse{
		ID:          identity.ID,
		UserID:      identity.UserID,
		FirstName:   identity.FirstName,
		LastName:    identity.LastName,
		PhoneNumber: identity.PhoneNumber,
		Gender:      identity.Gender,
		BirthPlace:  identity.BirthPlace,
		BirthDate:   identity.BirthDate,
		AvatarURL:   identity.AvatarURL,
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgGetSuccess, response)
}

// ============================================================
// UPDATE IDENTITY
// ============================================================

// UpdateIdentity updates user identity
func (s ServiceImpl) UpdateIdentity(payload *model.JwtPayload, userID string, req *schemas.UpdateIdentity) (int, interface{}) {
	parsedID, err := uuid.Parse(userID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id format"}, res.MsgUpdateFailed, nil)
	}

	identity, err := s.userIdentityRepo.FindByUserID(parsedID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgUpdateFailed, nil)
	}

	now, _ := util.GetTimeNow("Asia/Jakarta")

	// If identity doesn't exist, create new
	if identity == nil {
		identity = &model.UserIdentity{
			UserID:      parsedID,
			FirstName:   req.FirstName,
			LastName:    req.LastName,
			PhoneNumber: req.PhoneNumber,
			Gender:      req.Gender,
			BirthPlace:  req.BirthPlace,
		}
		identity.CreatedAt = now

		if req.BirthDate != "" {
			birthDate, err := time.Parse("2006-01-02", req.BirthDate)
			if err != nil {
				return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid birth date format, use YYYY-MM-DD"}, res.MsgUpdateFailed, nil)
			}
			identity.BirthDate = &birthDate
		}
		if req.AvatarURL != "" {
			identity.AvatarURL = req.AvatarURL
		}

		if payload != nil {
			identity.CreatedBy = payload.UserID
		}

		result, err := s.userIdentityRepo.Save(*identity)
		if err != nil {
			return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgUpdateFailed, nil)
		}

		return res.BuildCustomResponse(res.StatusSuccess, http.StatusCreated, nil, res.MsgCreated, schemas.IdentityResponse{
			ID:          result.ID,
			UserID:      result.UserID,
			FirstName:   result.FirstName,
			LastName:    result.LastName,
			PhoneNumber: result.PhoneNumber,
			Gender:      result.Gender,
			BirthPlace:  result.BirthPlace,
			BirthDate:   result.BirthDate,
			AvatarURL:   result.AvatarURL,
		})
	}

	// Update existing identity
	if req.FirstName != "" {
		identity.FirstName = req.FirstName
	}
	if req.LastName != "" {
		identity.LastName = req.LastName
	}
	if req.PhoneNumber != "" {
		identity.PhoneNumber = req.PhoneNumber
	}
	if req.Gender != "" {
		identity.Gender = req.Gender
	}
	if req.BirthPlace != "" {
		identity.BirthPlace = req.BirthPlace
	}
	if req.BirthDate != "" {
		birthDate, err := time.Parse("2006-01-02", req.BirthDate)
		if err != nil {
			return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid birth date format, use YYYY-MM-DD"}, res.MsgUpdateFailed, nil)
		}
		identity.BirthDate = &birthDate
	}
	// Only update AvatarURL if provided (for direct URL updates)
	if req.AvatarURL != "" {
		identity.AvatarURL = req.AvatarURL
	}

	identity.UpdatedAt = &now

	if payload != nil {
		identity.UpdatedBy = &payload.UserID
	}

	result, err := s.userIdentityRepo.Update(*identity)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgUpdateFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgUpdateSuccess, schemas.IdentityResponse{
		ID:          result.ID,
		UserID:      result.UserID,
		FirstName:   result.FirstName,
		LastName:    result.LastName,
		PhoneNumber: result.PhoneNumber,
		Gender:      result.Gender,
		BirthPlace:  result.BirthPlace,
		BirthDate:   result.BirthDate,
		AvatarURL:   result.AvatarURL,
	})
}

// ============================================================
// AVATAR UPLOAD
// ============================================================

// UploadAvatar uploads avatar image and updates identity
func (s ServiceImpl) UploadAvatar(payload *model.JwtPayload, userID string, fileHeader *multipart.FileHeader) (int, interface{}) {
	parsedID, err := uuid.Parse(userID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id format"}, res.MsgUpdateFailed, nil)
	}

	// Validate image file
	if err := cloud.ValidateImageFile(fileHeader); err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgUpdateFailed, nil)
	}

	// Generate public ID for the avatar
	publicID := fmt.Sprintf("avatar_%s", userID)

	// Upload to Cloudinary
	avatarURL, err := cloud.UploadImageWithPublicID(fileHeader, cloud.FolderAvatars, publicID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{fmt.Sprintf("failed to upload avatar: %s", err.Error())}, res.MsgUpdateFailed, nil)
	}

	// Get or create identity
	identity, err := s.userIdentityRepo.FindByUserID(parsedID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgUpdateFailed, nil)
	}

	now, _ := util.GetTimeNow("Asia/Jakarta")

	if identity == nil {
		// Create new identity with avatar
		identity = &model.UserIdentity{
			UserID:    parsedID,
			AvatarURL: avatarURL,
		}
		identity.CreatedAt = now

		if payload != nil {
			identity.CreatedBy = payload.UserID
		}

		result, err := s.userIdentityRepo.Save(*identity)
		if err != nil {
			return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgUpdateFailed, nil)
		}

		return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, "avatar uploaded successfully", schemas.IdentityResponse{
			ID:        result.ID,
			UserID:    result.UserID,
			AvatarURL: result.AvatarURL,
		})
	}

	// Update existing identity avatar
	identity.AvatarURL = avatarURL
	identity.UpdatedAt = &now

	if payload != nil {
		identity.UpdatedBy = &payload.UserID
	}

	result, err := s.userIdentityRepo.Update(*identity)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgUpdateFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, "avatar uploaded successfully", schemas.IdentityResponse{
		ID:          result.ID,
		UserID:      result.UserID,
		FirstName:   result.FirstName,
		LastName:    result.LastName,
		PhoneNumber: result.PhoneNumber,
		Gender:      result.Gender,
		BirthPlace:  result.BirthPlace,
		BirthDate:   result.BirthDate,
		AvatarURL:   result.AvatarURL,
	})
}

// DeleteAvatar removes avatar from identity
func (s ServiceImpl) DeleteAvatar(payload *model.JwtPayload, userID string) (int, interface{}) {
	parsedID, err := uuid.Parse(userID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id format"}, res.MsgUpdateFailed, nil)
	}

	identity, err := s.userIdentityRepo.FindByUserID(parsedID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgUpdateFailed, nil)
	}

	if identity == nil {
		return res.BuildCustomResponse(res.StatusSuccess, http.StatusNotFound, []string{"identity not found"}, res.MsgUpdateFailed, nil)
	}

	if identity.AvatarURL == "" {
		return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, []string{"no avatar to delete"}, res.MsgUpdateSuccess, nil)
	}

	// Extract public ID and delete from Cloudinary
	publicID := cloud.ExtractPublicIDFromURL(identity.AvatarURL)
	if publicID != "" {
		cloud.DeleteImage(publicID)
	}

	// Clear avatar URL
	now, _ := util.GetTimeNow("Asia/Jakarta")
	identity.AvatarURL = ""
	identity.UpdatedAt = &now

	if payload != nil {
		identity.UpdatedBy = &payload.UserID
	}

	_, err = s.userIdentityRepo.Update(*identity)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgUpdateFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, "avatar deleted successfully", nil)
}

// ============================================================
// INTERNAL METHODS
// ============================================================

// FindByUserID finds identity by user ID (for internal use)
func (s ServiceImpl) FindByUserID(userID uuid.UUID) (*model.UserIdentity, error) {
	return s.userIdentityRepo.FindByUserID(userID)
}

// FindByID finds identity by ID (for internal use)
func (s ServiceImpl) FindByID(id uuid.UUID) (*model.UserIdentity, error) {
	return s.userIdentityRepo.FindByID(id)
}
