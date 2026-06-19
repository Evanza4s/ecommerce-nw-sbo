package vouchers

import (
	"net/http"
	"time"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/db"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/vouchers/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/repository"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/repository/repository_impl"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/res"
	"gorm.io/gorm"
)

type ServiceImpl struct {
	VoucherRepo repository.VoucherRepository
	DB          *gorm.DB
}

func NewServiceImpl() Service {
	return &ServiceImpl{
		VoucherRepo: repository_impl.NewVoucherRepositoryImpl(),
		DB:          db.GetManager(),
	}
}

func (s *ServiceImpl) GetAll(req *schemas.GetAllPagination) (int, interface{}) {
	params := map[string]interface{}{
		"code":   req.Code,
		"status": req.Status,
	}

	vouchers, total, err := s.VoucherRepo.GetAll(s.DB, params, req.Page, req.PageSize)
	if err != nil {
		return res.BuildCustomResponsePagination(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgGetFailed, nil, nil)
	}

	paginateInfo := &utils.PaginationInfoDTO{
		Page:       req.Page,
		PageSize:   req.PageSize,
		Count:      total,
		TotalPages: utils.CalculateTotalPages(total, req.PageSize),
	}

	responses := schemas.ToVoucherResponses(vouchers)
	return res.BuildCustomResponsePagination(res.StatusSuccess, http.StatusOK, nil, res.MsgGetSuccess, responses, paginateInfo)
}

func (s *ServiceImpl) GetAllNoPagination(req *schemas.GetAllPagination) (int, interface{}) {
	params := map[string]interface{}{
		"code":   req.Code,
		"status": req.Status,
	}

	vouchers, err := s.VoucherRepo.GetAllNoPagination(s.DB, params)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgGetFailed, nil)
	}

	responses := schemas.ToVoucherResponses(vouchers)
	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgGetSuccess, responses)
}

func (s *ServiceImpl) GetByID(id string) (int, interface{}) {
	voucher, err := s.VoucherRepo.GetByID(s.DB, id)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgGetFailed, nil)
	}

	if voucher == nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusNotFound, nil, "Data not found", nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgGetSuccess, schemas.ToVoucherResponse(*voucher))
}

func (s *ServiceImpl) Create(req *schemas.CreateVoucher) (int, interface{}) {
	existingVoucher, err := s.VoucherRepo.GetByCode(s.DB, req.Code)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgAddFailed, nil)
	}
	if existingVoucher != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusConflict, nil, "Voucher code already exists", nil)
	}

	voucher := &model.MstVoucher{
		Code:            req.Code,
		DiscountType:    req.DiscountType,
		DiscountValue:   req.DiscountValue,
		MinimumPurchase: req.MinimumPurchase,
		MaxUsage:        req.MaxUsage,
		StartDate:       req.StartDate,
		EndDate:         req.EndDate,
		IsActive:        *req.IsActive,
	}

	err = s.VoucherRepo.Create(s.DB, voucher)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgAddFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusCreated, nil, res.MsgAddSuccess, schemas.ToVoucherResponse(*voucher))
}

func (s *ServiceImpl) Update(id string, req *schemas.UpdateVoucher) (int, interface{}) {
	voucher, err := s.VoucherRepo.GetByID(s.DB, id)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgUpdateFailed, nil)
	}
	if voucher == nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusNotFound, nil, "Data not found", nil)
	}

	if req.DiscountType != "" {
		voucher.DiscountType = req.DiscountType
	}
	if req.DiscountValue > 0 {
		voucher.DiscountValue = req.DiscountValue
	}
	if req.MinimumPurchase >= 0 {
		voucher.MinimumPurchase = req.MinimumPurchase
	}
	if req.MaxUsage > 0 {
		voucher.MaxUsage = req.MaxUsage
	}
	if req.StartDate != nil {
		voucher.StartDate = req.StartDate
	}
	if req.EndDate != nil {
		voucher.EndDate = req.EndDate
	}
	if req.IsActive != nil {
		voucher.IsActive = *req.IsActive
	}

	err = s.VoucherRepo.Update(s.DB, voucher)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgUpdateFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgUpdateSuccess, schemas.ToVoucherResponse(*voucher))
}

func (s *ServiceImpl) Delete(id string) (int, interface{}) {
	voucher, err := s.VoucherRepo.GetByID(s.DB, id)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgDeleteFailed, nil)
	}
	if voucher == nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusNotFound, nil, "Data not found", nil)
	}

	err = s.VoucherRepo.Delete(s.DB, id)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, res.MsgDeleteFailed, nil)
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, res.MsgDeleteSuccess, nil)
}

func (s *ServiceImpl) Validate(req *schemas.ValidateVoucherRequest) (int, interface{}) {
	voucher, err := s.VoucherRepo.GetByCode(s.DB, req.Code)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return res.BuildCustomResponse(res.StatusFailed, http.StatusNotFound, []string{"voucher not found"}, "Kode voucher tidak valid", nil)
		}
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, "Gagal memvalidasi voucher", nil)
	}

	// 1. Cek IsActive
	if !voucher.IsActive {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"voucher inactive"}, "Voucher sudah tidak aktif", nil)
	}

	// 2. Cek Masa Berlaku
	now := time.Now()
	if voucher.StartDate != nil && voucher.StartDate.After(now) {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"voucher not started"}, "Voucher belum bisa digunakan", nil)
	}
	if voucher.EndDate != nil && voucher.EndDate.Before(now) {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"voucher expired"}, "Masa berlaku voucher sudah habis", nil)
	}

	// 3. Cek Kuota (Max Usage)
	if voucher.MaxUsage > 0 && voucher.UsedCount >= voucher.MaxUsage {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"voucher quota reached"}, "Kuota penggunaan voucher sudah habis", nil)
	}

	// 4. Cek Minimum Purchase
	if req.CartSubtotal < voucher.MinimumPurchase {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{"minimum purchase not met"}, "Subtotal belanja belum memenuhi syarat voucher", nil)
	}

	// 5. Hitung Diskon
	var discountAmount float64
	if voucher.DiscountType == "Percentage" {
		discountAmount = (voucher.DiscountValue / 100.0) * req.CartSubtotal
	} else if voucher.DiscountType == "Nominal" {
		discountAmount = voucher.DiscountValue
	}

	// Pastikan diskon tidak melebihi subtotal
	if discountAmount > req.CartSubtotal {
		discountAmount = req.CartSubtotal
	}

	resp := schemas.ValidateVoucherResponse{
		IsValid:        true,
		DiscountAmount: discountAmount,
		VoucherCode:    voucher.Code,
		Message:        "Voucher berhasil digunakan",
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, "Voucher valid", resp)
}

