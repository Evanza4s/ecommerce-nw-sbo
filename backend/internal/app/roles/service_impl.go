package roles

import (
	"errors"
	"net/http"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/roles/schemas"
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
	RolesRepository repository.RolesRepository
}

func NewServiceImpl() *ServiceImpl {
	service := repository_impl.NewRolesRepositoryImpl()
	return &ServiceImpl{RolesRepository: service}
}

func (s ServiceImpl) GetAllPagination(payload *model.JwtPayload, req *schemas.GetAllPagination) (int, interface{}) {
	data, err := util.StructToMap(req)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgGetFailed, nil)
	}

	mapper := util.MapToCriteriaObject(data, "mst_roles")
	criteria := utils.CustomCriteria(mapper)
	pagination, pageInfo := utils.Paginate(data)

	dRoles, count, errGet := s.RolesRepository.GetAllPagination(criteria, pagination)
	if errGet != nil {
		if errors.Is(errGet, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, []string{errGet.Error()}, res.MsgGetFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{errGet.Error()}, res.MsgGetFailed, nil)
	}

	pageInfo.Count = count
	return res.BuildCustomResponsePagination(res.StatusSuccess, http.StatusOK, nil, res.MsgGetSuccess, dRoles, pageInfo)
}

func (s ServiceImpl) GetAll(payload *model.JwtPayload, req *schemas.GetAll) (int, interface{}) {
	data, err := util.StructToMap(req)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgGetFailed, nil)
	}

	mapper := util.MapToCriteriaObject(data, "mst_roles")
	criteria := utils.CustomCriteria(mapper)

	dRoles, _, errGet := s.RolesRepository.GetAllPagination(criteria)
	if errGet != nil {
		if errors.Is(errGet, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, []string{errGet.Error()}, res.MsgGetFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{errGet.Error()}, res.MsgGetFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgGetSuccess, dRoles)
}

func (s ServiceImpl) GetByID(payload *model.JwtPayload, id string) (int, interface{}) {
	parsedID, err := uuid.Parse(id)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid role id"}, res.MsgGetFailed, nil)
	}

	role, err := s.RolesRepository.FindById(parsedID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusFailed, http.StatusNotFound, []string{"role not found"}, res.MsgGetFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgGetFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgGetSuccess, role)
}

func (s ServiceImpl) Create(payload *model.JwtPayload, req *schemas.RequestRoles) (int, interface{}) {
	checkDuplicate, _ := s.RolesRepository.FindByName(req.RoleName)
	if checkDuplicate != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"data already exist"}, res.MsgAddFailed, nil)
	}

	createData := schemas.MaptoRequestRoles(req)
	now, _ := util.GetTimeNow("Asia/Jakarta")
	createData.CreatedAt = now
	if payload != nil {
		createData.CreatedBy = payload.UserID
	}

	result, err := s.RolesRepository.Save(createData)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgCreated, nil)
	}
	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgCreated, result)
}

func (s ServiceImpl) Update(payload *model.JwtPayload, id string, req *schemas.RequestRoles) (int, interface{}) {
	isExist, err := s.RolesRepository.FindById(uuid.MustParse(id))
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, []string{err.Error()}, res.MsgUpdateFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgUpdateFailed, nil)
	}

	updateData := schemas.MaptoRequestRoles(req)
	updateData.ID = isExist.ID
	now, _ := util.GetTimeNow("Asia/Jakarta")
	updateData.UpdatedAt = &now
	if payload != nil {
		updateData.UpdatedBy = &payload.UserID
	}

	result, err := s.RolesRepository.Update(updateData)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgUpdateFailed, nil)
	}
	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgUpdateSuccess, result)
}

func (s ServiceImpl) Delete(payload *model.JwtPayload, id string) (int, interface{}) {
	isExist, err := s.RolesRepository.FindById(uuid.MustParse(id))
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
	errDelete := s.RolesRepository.Delete(isExist)
	if errDelete != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{errDelete.Error()}, res.MsgDeleteFailed, nil)
	}
	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgDeleteSuccess, nil)
}
