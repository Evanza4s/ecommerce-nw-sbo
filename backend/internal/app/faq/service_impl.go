package faq

import (
	"errors"
	"net/http"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/faq/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/repository"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/repository/repository_impl"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/res"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ServiceImpl struct {
	FaqRepository repository.FaqRepository
}

func NewServiceImpl() *ServiceImpl {
	service := repository_impl.NewFaqRepositoryImpl()
	return &ServiceImpl{FaqRepository: service}
}
func (s ServiceImpl) GetAllPagination(payload *model.JwtPayload, req *schemas.GetAllPagination) (int, interface{}) {
	data, err := util.StructToMap(req)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgGetFailed, nil)
	}

	mapper := util.MapToCriteriaObject(data, "mst_faq")
	criteria := utils.CustomCriteria(mapper)
	pagination, pageInfo := utils.Paginate(data)

	dCategory, count, errGet := s.FaqRepository.GetAllPagination(criteria, pagination)
	if errGet != nil {
		if errors.Is(errGet, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, []string{errGet.Error()}, res.MsgGetFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{errGet.Error()}, res.MsgGetFailed, nil)
	}

	pageInfo.Count = count
	pageInfo.TotalPages = utils.CalculateTotalPages(count, pageInfo.PageSize)
	return res.BuildCustomResponsePagination(res.StatusSuccess, http.StatusOK, nil, res.MsgGetSuccess, dCategory, pageInfo)
}

func (s ServiceImpl) GetAll(payload *model.JwtPayload, req *schemas.GetAll) (int, interface{}) {
	data, err := util.StructToMap(req)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgGetFailed, nil)
	}
	mapper := util.MapToCriteriaObject(data, "mst_faq")
	criteria := utils.CustomCriteria(mapper)

	dCategory, _, errGet := s.FaqRepository.GetAllPagination(criteria)
	if errGet != nil {
		if errors.Is(errGet, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, []string{errGet.Error()}, res.MsgGetFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{errGet.Error()}, res.MsgGetFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgGetSuccess, dCategory)
}

func (s ServiceImpl) GetById(payload *model.JwtPayload, id string) (int, interface{}) {
	parsedId, err := uuid.Parse(id)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid id"}, res.MsgGetFailed, nil)
	}
	isExist, err := s.FaqRepository.FindById(parsedId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, []string{err.Error()}, res.MsgGetFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgGetFailed, nil)
	}
	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgGetSuccess, isExist)
}
func (s ServiceImpl) Create(payload *model.JwtPayload, req *schemas.FAQRequest) (int, interface{}) {
	checkDuplicate, _ := s.FaqRepository.FindByQuestion(req.Question)
	if checkDuplicate != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"data already exist"}, res.MsgAddFailed, nil)
	}

	createData := schemas.MapToFAQRequest(req)
	now, _ := util.GetTimeNow("Asia/Jakarta")
	createData.CreatedAt = now
	if payload != nil {
		createData.CreatedBy = payload.UserID
	}

	result, err := s.FaqRepository.Save(createData)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgCreated, nil)
	}
	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgCreated, result)
}
func (s ServiceImpl) Update(payload *model.JwtPayload, id string, req *schemas.FAQRequest) (int, interface{}) {
	isExist, err := s.FaqRepository.FindById(uuid.MustParse(id))
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, []string{err.Error()}, res.MsgUpdateFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgUpdateFailed, nil)
	}

	updateData := schemas.MapToFAQRequest(req)
	updateData.ID = isExist.ID
	now, _ := util.GetTimeNow("Asia/Jakarta")
	updateData.UpdatedAt = &now
	if payload != nil {
		updateData.UpdatedBy = &payload.UserID
	}

	result, err := s.FaqRepository.Update(updateData)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgUpdateFailed, nil)
	}
	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgUpdateSuccess, result)
}

func (s ServiceImpl) Delete(payload *model.JwtPayload, id string) (int, interface{}) {
	isExist, err := s.FaqRepository.FindById(uuid.MustParse(id))
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, []string{err.Error()}, res.MsgDeleteFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgDeleteFailed, nil)
	}

	now, _ := util.GetTimeNow("Asia/Jakarta")
	isExist.DeletedAt = gorm.DeletedAt{Time: now, Valid: true}
	if payload != nil {
		isExist.DeletedBy = &payload.UserID
	}
	errDelete := s.FaqRepository.Delete(isExist)
	if errDelete != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{errDelete.Error()}, res.MsgDeleteFailed, nil)
	}
	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgDeleteSuccess, nil)
}
