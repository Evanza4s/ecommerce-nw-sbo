package categories

import (
	"errors"
	"net/http"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/categories/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/repository"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/repository/repository_impl"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/res"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// ============================================================
// SERVICE IMPLEMENTATION
// ============================================================

type ServiceImpl struct {
	CategoryRepository repository.CategoryRepository
}

func NewServiceImpl() *ServiceImpl {
	repo := repository_impl.NewCategoryRepositoryImpl()
	return &ServiceImpl{CategoryRepository: repo}
}

// GetAllPagination retrieves paginated categories
func (s ServiceImpl) GetAllPagination(payload *model.JwtPayload, req *schemas.GetAllPagination) (int, interface{}) {
	data, err := util.StructToMap(req)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgGetFailed, nil)
	}

	mapper := util.MapToCriteriaObject(data, "mst_category")
	criteria := utils.CustomCriteria(mapper)
	pagination, pageInfo := utils.Paginate(data)

	dCategory, count, errGet := s.CategoryRepository.GetAllPagination(criteria, pagination)
	if errGet != nil {
		if errors.Is(errGet, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, []string{errGet.Error()}, res.MsgGetFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{errGet.Error()}, res.MsgGetFailed, nil)
	}

	pageInfo.Count = count
	return res.BuildCustomResponsePagination(res.StatusSuccess, http.StatusOK, nil, res.MsgGetSuccess, dCategory, pageInfo)
}

// GetAll retrieves all categories without pagination
func (s ServiceImpl) GetAll(payload *model.JwtPayload, req *schemas.GetAll) (int, interface{}) {
	data, err := util.StructToMap(req)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgGetFailed, nil)
	}

	mapper := util.MapToCriteriaObject(data, "mst_category")
	criteria := utils.CustomCriteria(mapper)

	dCategory, _, errGet := s.CategoryRepository.GetAllPagination(criteria)
	if errGet != nil {
		if errors.Is(errGet, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, []string{errGet.Error()}, res.MsgGetFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{errGet.Error()}, res.MsgGetFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgGetSuccess, dCategory)
}

// GetById retrieves category by ID
func (s ServiceImpl) GetById(payload *model.JwtPayload, id string) (int, interface{}) {
	parsedID, err := uuid.Parse(id)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid uuid format"}, res.MsgGetFailed, nil)
	}

	isExist, err := s.CategoryRepository.FindByID(parsedID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusSuccess, http.StatusNotFound, []string{"category not found"}, res.MsgGetFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgGetFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgGetSuccess, isExist)
}

// Create creates a new category
func (s ServiceImpl) Create(payload *model.JwtPayload, req *schemas.RequestCategory) (int, interface{}) {
	// Check if slug already exists
	exists, err := s.CategoryRepository.ExistsBySlug(req.Slug)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgAddFailed, nil)
	}
	if exists {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusConflict, []string{"category slug already exists"}, res.MsgAddFailed, nil)
	}

	createData := schemas.MaptoRequestCategory(req)
	now, _ := util.GetTimeNow("Asia/Jakarta")
	createData.CreatedAt = now
	if payload != nil {
		createData.CreatedBy = payload.UserID
	}

	result, err := s.CategoryRepository.Save(createData)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgAddFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusCreated, nil, res.MsgCreated, result)
}

// Update updates an existing category
func (s ServiceImpl) Update(payload *model.JwtPayload, id string, req *schemas.RequestCategory) (int, interface{}) {
	parsedID, err := uuid.Parse(id)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid uuid format"}, res.MsgUpdateFailed, nil)
	}

	isExist, err := s.CategoryRepository.FindByID(parsedID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusSuccess, http.StatusNotFound, []string{"category not found"}, res.MsgUpdateFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgUpdateFailed, nil)
	}

	// Check if new slug conflicts with another category
	if req.Slug != isExist.Slug {
		exists, _ := s.CategoryRepository.ExistsBySlug(req.Slug)
		if exists {
			return res.BuildCustomResponse(res.StatusFailed, http.StatusConflict, []string{"category slug already exists"}, res.MsgUpdateFailed, nil)
		}
	}

	updateData := schemas.MaptoRequestCategory(req)
	updateData.ID = isExist.ID
	now, _ := util.GetTimeNow("Asia/Jakarta")
	updateData.UpdatedAt = &now
	if payload != nil {
		updateData.UpdatedBy = &payload.UserID
	}

	result, err := s.CategoryRepository.Update(updateData)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgUpdateFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgUpdateSuccess, result)
}

// Delete soft deletes a category
func (s ServiceImpl) Delete(payload *model.JwtPayload, id string) (int, interface{}) {
	parsedID, err := uuid.Parse(id)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid uuid format"}, res.MsgDeleteFailed, nil)
	}

	isExist, err := s.CategoryRepository.FindByID(parsedID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusSuccess, http.StatusNotFound, []string{"category not found"}, res.MsgDeleteFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgDeleteFailed, nil)
	}

	now, _ := util.GetTimeNow("Asia/Jakarta")
	isExist.DeletedAt = gorm.DeletedAt{Time: now, Valid: true}
	if payload != nil {
		isExist.DeletedBy = &payload.UserID
	}

	errDelete := s.CategoryRepository.Delete(isExist)
	if errDelete != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{errDelete.Error()}, res.MsgDeleteFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgDeleteSuccess, nil)
}
