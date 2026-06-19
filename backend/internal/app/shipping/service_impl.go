package shipping

import (
	"net/http"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/app/shipping/schemas"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/repository"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/repository/repository_impl"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/rajaongkir"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/res"
)

type ServiceImpl struct {
	shippingRepo repository.ShippingRepository
}

func NewServiceImpl() *ServiceImpl {
	return &ServiceImpl{
		shippingRepo: repository_impl.NewShippingRepositoryImpl(),
	}
}

func (s ServiceImpl) GetRates(req *schemas.ShippingRatesRequest) (int, interface{}) {
	destCityID := req.Destination
	originCityID := req.Origin
	// With Komerce we expect these to be district IDs directly without name-resolution fallbacks.
	if originCityID == "" {
		originCityID = "423" // Fallback origin if somehow empty
	}

	roReq := &rajaongkir.CostRequest{
		Origin:      originCityID,
		Destination: destCityID,
		Weight:      req.Weight,
		Courier:     req.Courier,
	}

	roRes, err := rajaongkir.CalculateCost(roReq)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, "Failed to get shipping rates", nil)
	}

	if len(roRes.RajaOngkir.Results) == 0 {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusNotFound, []string{"no couriers found"}, "No couriers found", nil)
	}

	result := roRes.RajaOngkir.Results[0]
	
	var costs []schemas.ShippingCost
	for _, c := range result.Costs {
		if len(c.Cost) > 0 {
			costs = append(costs, schemas.ShippingCost{
				Service:     c.Service,
				Description: c.Description,
				Cost:        c.Cost[0].Value,
				Etd:         c.Cost[0].Etd,
			})
		}
	}

	resp := schemas.ShippingRatesResponse{
		Courier: result.Code,
		Name:    result.Name,
		Costs:   costs,
	}

	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, "Successfully got shipping rates", resp)
}

func (s ServiceImpl) GetAllPagination(payload *model.JwtPayload, req *schemas.GetAllPagination) (int, interface{}) {
	offset := (req.Page - 1) * req.PageSize
	shippings, total, err := s.shippingRepo.GetAllPagination(req.PageSize, offset, req.TrackingNumber, req.ShippingStatus)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusInternalServerError, []string{err.Error()}, "Failed to fetch shippings", nil)
	}

	pageInfo := &utils.PaginationInfoDTO{
		PageSize:   req.PageSize,
		Page:       req.Page,
		Count:      total,
		TotalPages: utils.CalculateTotalPages(total, req.PageSize),
	}

	return res.BuildCustomResponsePagination(res.StatusSuccess, http.StatusOK, nil, "Successfully fetched shippings", shippings, pageInfo)
}

func (s ServiceImpl) GetProvinces() (int, interface{}) {
	provinces, err := rajaongkir.GetProvinces()
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, "Failed to get provinces", nil)
	}
	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, "Successfully got provinces", provinces)
}

func (s ServiceImpl) GetCities(provinceID string) (int, interface{}) {
	cities, err := rajaongkir.GetCities(provinceID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, "Failed to get cities", nil)
	}
	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, "Successfully got cities", cities)
}

func (s ServiceImpl) GetDistricts(cityID string) (int, interface{}) {
	districts, err := rajaongkir.GetDistricts(cityID)
	if err != nil {
		return res.BuildCustomResponse(res.StatusFailed, http.StatusBadRequest, []string{err.Error()}, "Failed to get districts", nil)
	}
	return res.BuildCustomResponse(res.StatusSuccess, http.StatusOK, nil, "Successfully got districts", districts)
}
