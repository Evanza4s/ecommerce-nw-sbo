package users

import (
	"errors"
	"net/http"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/users/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/repository"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/repository/repository_impl"
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
	userRepo repository.UserRepository
	roleRepo repository.RolesRepository
}

func NewServiceImpl() *ServiceImpl {
	return &ServiceImpl{
		userRepo: repository_impl.NewUserRepositoryImpl(),
		roleRepo: repository_impl.NewRolesRepositoryImpl(),
	}
}

// ============================================================
// USER CRUD OPERATIONS
// ============================================================

// GetAll retrieves paginated users
func (s ServiceImpl) GetAll(payload *model.JwtPayload, req *schemas.GetAllPagination) (int, interface{}) {
	data, err := util.StructToMap(req)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgGetFailed, nil)
	}

	mapper := util.MapToCriteriaObject(data, "mst_users")
	criteria := utils.CustomCriteria(mapper)
	pagination, pageInfo := utils.Paginate(data)

	users, count, err := s.userRepo.GetAllPagination(criteria, pagination)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, []string{"no users found"}, res.MsgGetFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgGetFailed, nil)
	}

	pageInfo.Count = count

	// Convert to response
	var responses []schemas.UserResponse
	for _, user := range users {
		responses = append(responses, schemas.ToUserResponse(user))
	}

	return res.BuildCustomResponsePagination(res.StatusSuccess, http.StatusOK, nil, res.MsgGetSuccess, responses, pageInfo)
}

// GetAllWithoutPagination retrieves all users without pagination
func (s ServiceImpl) GetAllWithoutPagination(payload *model.JwtPayload, req *schemas.GetAll) (int, interface{}) {
	data, err := util.StructToMap(req)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgGetFailed, nil)
	}

	mapper := util.MapToCriteriaObject(data, "mst_users")
	criteria := utils.CustomCriteria(mapper)

	users, err := s.userRepo.FindAll(criteria)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, []string{"no users found"}, res.MsgGetFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgGetFailed, nil)
	}

	// Convert to response
	var responses []schemas.UserResponse
	for _, user := range users {
		responses = append(responses, schemas.ToUserResponse(user))
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgGetSuccess, responses)
}

// GetByID retrieves user by ID
func (s ServiceImpl) GetByID(payload *model.JwtPayload, id string) (int, interface{}) {
	parsedID, err := uuid.Parse(id)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id format"}, res.MsgGetFailed, nil)
	}

	user, err := s.userRepo.FindByIDWithRelations(parsedID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusSuccess, http.StatusNotFound, []string{"user not found"}, res.MsgGetFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgGetFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgGetSuccess, schemas.ToUserDetailResponse(*user))
}

// GetProfile retrieves user profile
func (s ServiceImpl) GetProfile(payload *model.JwtPayload, userID string) (int, interface{}) {
	parsedID, err := uuid.Parse(userID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id format"}, res.MsgGetFailed, nil)
	}

	user, err := s.userRepo.FindByIDWithRelations(parsedID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusSuccess, http.StatusNotFound, []string{"user not found"}, res.MsgGetFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgGetFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgGetSuccess, schemas.ToProfileResponse(*user))
}

// Create creates a new user
func (s ServiceImpl) Create(payload *model.JwtPayload, req *schemas.CreateUser) (int, interface{}) {
	// Validate password
	if errs := req.ValidatePassword(); len(errs) > 0 {
		var errList []string
		for _, e := range errs {
			errList = append(errList, e.Error())
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, errList, res.MsgAddFailed, nil)
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

	// Validate role
	roleID, err := uuid.Parse(req.RoleID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid role id format"}, res.MsgAddFailed, nil)
	}

	role, err := s.roleRepo.FindById(roleID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"role not found"}, res.MsgAddFailed, nil)
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"failed to hash password"}, res.MsgAddFailed, nil)
	}

	// Create user
	now, _ := util.GetTimeNow("Asia/Jakarta")
	user := model.MstUsers{
		Fullname:   req.Fullname,
		Username:   req.Username,
		Email:      req.Email,
		Password:   string(hashedPassword),
		RoleID:     role.ID,
		IsActive:   req.IsActive,
		IsVerified: false,
	}
	user.CreatedAt = now
	if payload != nil {
		user.CreatedBy = payload.UserID
	}

	result, err := s.userRepo.Save(user)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgAddFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusCreated, nil, res.MsgCreated, schemas.ToUserResponse(*result))
}

// Update updates an existing user
func (s ServiceImpl) Update(payload *model.JwtPayload, id string, req *schemas.UpdateUser) (int, interface{}) {
	parsedID, err := uuid.Parse(id)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id format"}, res.MsgUpdateFailed, nil)
	}

	// Find user
	user, err := s.userRepo.FindByID(parsedID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusSuccess, http.StatusNotFound, []string{"user not found"}, res.MsgUpdateFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgUpdateFailed, nil)
	}

	// Check email uniqueness if provided
	if req.Email != "" && req.Email != user.Email {
		exists, _ := s.userRepo.ExistsByEmailExceptID(req.Email, parsedID)
		if exists {
			return res.BuildCustomResponse(res.StatusFailed, http.StatusConflict, []string{"email already exists"}, res.MsgUpdateFailed, nil)
		}
		user.Email = req.Email
	}

	// Check username uniqueness if provided
	if req.Username != "" && req.Username != user.Username {
		exists, _ := s.userRepo.ExistsByUsernameExceptID(req.Username, parsedID)
		if exists {
			return res.BuildCustomResponse(res.StatusFailed, http.StatusConflict, []string{"username already exists"}, res.MsgUpdateFailed, nil)
		}
		user.Username = req.Username
	}

	// Update fields
	if req.Fullname != "" {
		user.Fullname = req.Fullname
	}

	if req.RoleID != "" {
		roleID, err := uuid.Parse(req.RoleID)
		if err != nil {
			return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid role id format"}, res.MsgUpdateFailed, nil)
		}
		user.RoleID = roleID
	}

	if req.IsActive != nil {
		user.IsActive = *req.IsActive
	}

	if req.IsVerified != nil {
		user.IsVerified = *req.IsVerified
	}

	now, _ := util.GetTimeNow("Asia/Jakarta")
	user.UpdatedAt = &now
	if payload != nil {
		user.UpdatedBy = &payload.UserID
	}

	result, err := s.userRepo.Update(*user)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgUpdateFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgUpdateSuccess, schemas.ToUserResponse(*result))
}

// UpdateProfile updates user's own profile
func (s ServiceImpl) UpdateProfile(payload *model.JwtPayload, userID string, req *schemas.UpdateProfile) (int, interface{}) {
	parsedID, err := uuid.Parse(userID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id format"}, res.MsgUpdateFailed, nil)
	}

	user, err := s.userRepo.FindByID(parsedID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusSuccess, http.StatusNotFound, []string{"user not found"}, res.MsgUpdateFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgUpdateFailed, nil)
	}

	// Update fields
	if req.Fullname != "" {
		user.Fullname = req.Fullname
	}

	if req.Username != "" && req.Username != user.Username {
		exists, _ := s.userRepo.ExistsByUsernameExceptID(req.Username, parsedID)
		if exists {
			return res.BuildCustomResponse(res.StatusFailed, http.StatusConflict, []string{"username already exists"}, res.MsgUpdateFailed, nil)
		}
		user.Username = req.Username
	}

	now, _ := util.GetTimeNow("Asia/Jakarta")
	user.UpdatedAt = &now
	if payload != nil {
		user.UpdatedBy = &payload.UserID
	}

	result, err := s.userRepo.Update(*user)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgUpdateFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgUpdateSuccess, schemas.ToUserResponse(*result))
}

// UpdateStatus updates user status
func (s ServiceImpl) UpdateStatus(payload *model.JwtPayload, id string, req *schemas.UpdateStatus) (int, interface{}) {
	parsedID, err := uuid.Parse(id)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id format"}, res.MsgUpdateFailed, nil)
	}

	user, err := s.userRepo.FindByID(parsedID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusSuccess, http.StatusNotFound, []string{"user not found"}, res.MsgUpdateFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgUpdateFailed, nil)
	}

	user.IsActive = *req.IsActive
	now, _ := util.GetTimeNow("Asia/Jakarta")
	user.UpdatedAt = &now
	if payload != nil {
		user.UpdatedBy = &payload.UserID
	}

	result, err := s.userRepo.Update(*user)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgUpdateFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgUpdateSuccess, schemas.ToUserResponse(*result))
}

// Delete soft deletes a user
func (s ServiceImpl) Delete(payload *model.JwtPayload, id string) (int, interface{}) {
	parsedID, err := uuid.Parse(id)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id format"}, res.MsgDeleteFailed, nil)
	}

	user, err := s.userRepo.FindByID(parsedID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusSuccess, http.StatusNotFound, []string{"user not found"}, res.MsgDeleteFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgDeleteFailed, nil)
	}

	now, _ := util.GetTimeNow("Asia/Jakarta")
	user.DeletedAt = gorm.DeletedAt{Time: now, Valid: true}
	if payload != nil {
		user.DeletedBy = &payload.UserID
	}
	
	// Ensure we save the DeletedBy field using gorm Updates before actually soft deleting,
	// or perform soft delete and update fields simultaneously.
	// Since s.userRepo.Delete might just call gorm.Delete, we should update the audit field first
	if payload != nil {
		s.userRepo.Update(*user)
	}

	if err := s.userRepo.Delete(user); err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgDeleteFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgDeleteSuccess, nil)
}

// ============================================================
// PASSWORD MANAGEMENT
// ============================================================

// ChangePassword changes user password
func (s ServiceImpl) ChangePassword(payload *model.JwtPayload, userID string, req *schemas.ChangePassword) (int, interface{}) {
	parsedID, err := uuid.Parse(userID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id format"}, res.MsgUpdateFailed, nil)
	}

	// Validate passwords
	if errs := req.ValidateChangePassword(); len(errs) > 0 {
		var errList []string
		for _, e := range errs {
			errList = append(errList, e.Error())
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, errList, res.MsgUpdateFailed, nil)
	}

	user, err := s.userRepo.FindByID(parsedID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusSuccess, http.StatusNotFound, []string{"user not found"}, res.MsgUpdateFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgUpdateFailed, nil)
	}

	// Verify current password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.CurrentPassword)); err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"current password is incorrect"}, res.MsgUpdateFailed, nil)
	}

	// Hash new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"failed to hash password"}, res.MsgUpdateFailed, nil)
	}

	user.Password = string(hashedPassword)
	now, _ := util.GetTimeNow("Asia/Jakarta")
	user.UpdatedAt = &now
	if payload != nil {
		user.UpdatedBy = &payload.UserID
	}

	_, err = s.userRepo.Update(*user)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgUpdateFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, "password changed successfully", nil)
}

// ============================================================
// ROLE MANAGEMENT
// ============================================================

// UpdateUserRole updates user's role
func (s ServiceImpl) UpdateUserRole(payload *model.JwtPayload, userID string, roleID string) (int, interface{}) {
	parsedUserID, err := uuid.Parse(userID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id format"}, res.MsgUpdateFailed, nil)
	}

	parsedRoleID, err := uuid.Parse(roleID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid role id format"}, res.MsgUpdateFailed, nil)
	}

	// Verify user exists
	user, err := s.userRepo.FindByID(parsedUserID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusSuccess, http.StatusNotFound, []string{"user not found"}, res.MsgUpdateFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgUpdateFailed, nil)
	}

	// Verify role exists
	_, err = s.roleRepo.FindById(parsedRoleID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"role not found"}, res.MsgUpdateFailed, nil)
	}

	user.RoleID = parsedRoleID
	now, _ := util.GetTimeNow("Asia/Jakarta")
	user.UpdatedAt = &now
	if payload != nil {
		user.UpdatedBy = &payload.UserID
	}

	result, err := s.userRepo.Update(*user)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgUpdateFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgUpdateSuccess, schemas.ToUserResponse(*result))
}

// ============================================================
// INTERNAL METHODS (for auth)
// ============================================================

// FindByEmail finds user by email (for authentication)
func (s ServiceImpl) FindByEmail(email string) (*model.MstUsers, error) {
	return s.userRepo.FindByEmail(email)
}

// FindByUsername finds user by username (for authentication)
func (s ServiceImpl) FindByUsername(username string) (*model.MstUsers, error) {
	return s.userRepo.FindByUsername(username)
}
