package addresses

import (
	"errors"
	"net/http"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/addresses/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/repository"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/repository/repository_impl"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/res"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ServiceImpl struct {
	addressRepo repository.AddressRepository
}

func NewServiceImpl() *ServiceImpl {
	return &ServiceImpl{
		addressRepo: repository_impl.NewAddressRepositoryImpl(),
	}
}

// GetAddresses retrieves all addresses for a user
func (s ServiceImpl) GetAddresses(payload *model.JwtPayload, userID string) (int, interface{}) {
	parsedID, err := uuid.Parse(userID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id format"}, res.MsgGetFailed, nil)
	}

	addresses, err := s.addressRepo.FindAllByUserID(parsedID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgGetFailed, nil)
	}

	// Convert to response
	var responses []schemas.AddressResponse
	for _, addr := range addresses {
		responses = append(responses, schemas.AddressResponse{
			ID:           addr.ID,
			UserID:       addr.UserID,
			ReceiverName: addr.ReceiverName,
			PhoneNumber:  addr.PhoneNumber,
			Province:     addr.Province,
			City:         addr.City,
			District:     addr.District,
			Village:      addr.Village,
			PostalCode:   addr.PostalCode,
			FullAddress:  addr.FullAddress,
			AddressLabel: addr.AddressLabel,
			IsDefault:    addr.IsDefault,
			Latitude:     addr.Latitude,
			Longitude:    addr.Longitude,
		})
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgGetSuccess, responses)
}

// GetAddressByID retrieves a specific address
func (s ServiceImpl) GetAddressByID(payload *model.JwtPayload, userID string, addressID string) (int, interface{}) {
	parsedUserID, err := uuid.Parse(userID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id format"}, res.MsgGetFailed, nil)
	}

	parsedAddressID, err := uuid.Parse(addressID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid address id format"}, res.MsgGetFailed, nil)
	}

	address, err := s.addressRepo.FindByIDAndUserID(parsedAddressID, parsedUserID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusSuccess, http.StatusNotFound, []string{"address not found"}, res.MsgGetFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgGetFailed, nil)
	}

	response := schemas.AddressResponse{
		ID:           address.ID,
		UserID:       address.UserID,
		ReceiverName: address.ReceiverName,
		PhoneNumber:  address.PhoneNumber,
		Province:     address.Province,
		City:         address.City,
		District:     address.District,
		Village:      address.Village,
		PostalCode:   address.PostalCode,
		FullAddress:  address.FullAddress,
		AddressLabel: address.AddressLabel,
		IsDefault:    address.IsDefault,
		Latitude:     address.Latitude,
		Longitude:    address.Longitude,
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgGetSuccess, response)
}

// CreateAddress creates a new address
func (s ServiceImpl) CreateAddress(payload *model.JwtPayload, userID string, req *schemas.CreateAddress) (int, interface{}) {
	parsedID, err := uuid.Parse(userID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id format"}, res.MsgAddFailed, nil)
	}

	// Check if this is the first address, make it default
	count, _ := s.addressRepo.CountByUserID(parsedID)
	isDefault := req.IsDefault
	if count == 0 {
		isDefault = true
	}

	now, _ := util.GetTimeNow("Asia/Jakarta")
	address := model.MstAddress{
		UserID:       parsedID,
		ReceiverName: req.ReceiverName,
		PhoneNumber:  req.PhoneNumber,
		Province:     req.Province,
		City:         req.City,
		District:     req.District,
		Village:      req.Village,
		PostalCode:   req.PostalCode,
		FullAddress:  req.FullAddress,
		AddressLabel: req.AddressLabel,
		IsDefault:    isDefault,
		Latitude:     req.Latitude,
		Longitude:    req.Longitude,
	}
	address.CreatedAt = now
	if payload != nil {
		address.CreatedBy = payload.UserID
	}

	result, err := s.addressRepo.Save(address)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgAddFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusCreated, nil, res.MsgCreated, result)
}

// UpdateAddress updates an existing address
func (s ServiceImpl) UpdateAddress(payload *model.JwtPayload, userID string, addressID string, req *schemas.UpdateAddress) (int, interface{}) {
	parsedUserID, err := uuid.Parse(userID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id format"}, res.MsgUpdateFailed, nil)
	}

	parsedAddressID, err := uuid.Parse(addressID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid address id format"}, res.MsgUpdateFailed, nil)
	}

	address, err := s.addressRepo.FindByIDAndUserID(parsedAddressID, parsedUserID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusSuccess, http.StatusNotFound, []string{"address not found"}, res.MsgUpdateFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgUpdateFailed, nil)
	}

	// Update fields
	if req.ReceiverName != "" {
		address.ReceiverName = req.ReceiverName
	}
	if req.PhoneNumber != "" {
		address.PhoneNumber = req.PhoneNumber
	}
	if req.Province != "" {
		address.Province = req.Province
	}
	if req.City != "" {
		address.City = req.City
	}
	if req.District != "" {
		address.District = req.District
	}
	if req.Village != "" {
		address.Village = req.Village
	}
	if req.PostalCode != "" {
		address.PostalCode = req.PostalCode
	}
	if req.FullAddress != "" {
		address.FullAddress = req.FullAddress
	}
	if req.AddressLabel != "" {
		address.AddressLabel = req.AddressLabel
	}
	if req.IsDefault != nil {
		address.IsDefault = *req.IsDefault
	}
	address.Latitude = req.Latitude
	address.Longitude = req.Longitude

	now, _ := util.GetTimeNow("Asia/Jakarta")
	address.UpdatedAt = &now
	if payload != nil {
		address.UpdatedBy = &payload.UserID
	}

	result, err := s.addressRepo.Update(*address)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgUpdateFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgUpdateSuccess, result)
}

// DeleteAddress soft deletes an address
func (s ServiceImpl) DeleteAddress(payload *model.JwtPayload, userID string, addressID string) (int, interface{}) {
	parsedUserID, err := uuid.Parse(userID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id format"}, res.MsgDeleteFailed, nil)
	}

	parsedAddressID, err := uuid.Parse(addressID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid address id format"}, res.MsgDeleteFailed, nil)
	}

	address, err := s.addressRepo.FindByIDAndUserID(parsedAddressID, parsedUserID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusSuccess, http.StatusNotFound, []string{"address not found"}, res.MsgDeleteFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgDeleteFailed, nil)
	}

	// If deleting default address, set another as default
	if address.IsDefault {
		s.addressRepo.UnsetDefault(parsedUserID)
	}

	if payload != nil {
		now, _ := util.GetTimeNow("Asia/Jakarta")
		address.DeletedAt = gorm.DeletedAt{Time: now, Valid: true}
		address.DeletedBy = &payload.UserID
		s.addressRepo.Update(*address)
	}

	if err := s.addressRepo.Delete(address); err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgDeleteFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgDeleteSuccess, nil)
}

// SetDefaultAddress sets an address as default
func (s ServiceImpl) SetDefaultAddress(payload *model.JwtPayload, userID string, addressID string) (int, interface{}) {
	parsedUserID, err := uuid.Parse(userID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid user id format"}, res.MsgUpdateFailed, nil)
	}

	parsedAddressID, err := uuid.Parse(addressID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"invalid address id format"}, res.MsgUpdateFailed, nil)
	}

	// Verify address belongs to user
	_, err = s.addressRepo.FindByIDAndUserID(parsedAddressID, parsedUserID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return res.BuildCustomResponse(res.StatusSuccess, http.StatusNotFound, []string{"address not found"}, res.MsgUpdateFailed, nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgUpdateFailed, nil)
	}

	if err := s.addressRepo.SetDefault(parsedUserID, parsedAddressID); err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, res.MsgUpdateFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgUpdateSuccess, nil)
}
