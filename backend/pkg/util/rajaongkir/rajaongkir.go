package rajaongkir

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
	"strings"
)

type CostRequest struct {
	Origin      string `json:"origin"`
	Destination string `json:"destination"`
	Weight      int    `json:"weight"`
	Courier     string `json:"courier"` // "jne", "pos", "tiki"
}

// Legacy Response to keep frontend working
type CostResponse struct {
	RajaOngkir struct {
		Query struct {
			Origin      string `json:"origin"`
			Destination string `json:"destination"`
			Weight      int    `json:"weight"`
			Courier     string `json:"courier"`
		} `json:"query"`
		Status struct {
			Code        int    `json:"code"`
			Description string `json:"description"`
		} `json:"status"`
		Results []struct {
			Code  string `json:"code"`
			Name  string `json:"name"`
			Costs []struct {
				Service     string `json:"service"`
				Description string `json:"description"`
				Cost        []struct {
					Value int    `json:"value"`
					Etd   string `json:"etd"`
					Note  string `json:"note"`
				} `json:"cost"`
			} `json:"costs"`
		} `json:"results"`
	} `json:"rajaongkir"`
}

type Province struct {
	ProvinceID   string `json:"province_id"`
	ProvinceName string `json:"province"`
}

type ProvinceResponse struct {
	RajaOngkir struct {
		Results []Province `json:"results"`
	} `json:"rajaongkir"`
}

type City struct {
	CityID     string `json:"city_id"`
	CityName   string `json:"city_name"`
	ProvinceID string `json:"province_id"`
	Province   string `json:"province"`
	Type       string `json:"type"`
	PostalCode string `json:"postal_code"`
}

type District struct {
	DistrictID   string `json:"district_id"`
	DistrictName string `json:"district_name"`
	CityID       string `json:"city_id"`
}

type CityResponse struct {
	RajaOngkir struct {
		Results []City `json:"results"`
	} `json:"rajaongkir"`
}

type DistrictResponse struct {
	RajaOngkir struct {
		Results []District `json:"results"`
	} `json:"rajaongkir"`
}

// Komerce struct definitions
type KomerceMeta struct {
	Message string `json:"message"`
	Code    int    `json:"code"`
	Status  string `json:"status"`
}

type KomerceData struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type KomerceListResponse struct {
	Meta KomerceMeta   `json:"meta"`
	Data []KomerceData `json:"data"`
}

type KomerceCost struct {
	Name        string `json:"name"`
	Code        string `json:"code"`
	Service     string `json:"service"`
	Description string `json:"description"`
	Cost        int    `json:"cost"`
	Etd         string `json:"etd"`
}

type KomerceCostResponse struct {
	Meta KomerceMeta   `json:"meta"`
	Data []KomerceCost `json:"data"`
}

func GetCityIDByName(cityName string) (string, error) {
	// Not easily supported by Komerce (requires Province ID to search City).
	// We shouldn't need this anymore as we'll pass IDs directly.
	return "", fmt.Errorf("city name resolution not supported in Komerce API")
}

func CalculateCost(req *CostRequest) (*CostResponse, error) {
	apiKey := os.Getenv("SHIPPING_COST")
	url := os.Getenv("DISTRICT_CALCULATE_COST")
	if apiKey == "" || url == "" {
		return nil, fmt.Errorf("Komerce API key or endpoint is not configured")
	}

	formPayload := fmt.Sprintf("origin=%s&destination=%s&weight=%d&courier=%s", req.Origin, req.Destination, req.Weight, req.Courier)
	request, err := http.NewRequest("POST", url, bytes.NewBufferString(formPayload))
	if err != nil {
		return nil, err
	}
	request.Header.Add("key", apiKey)
	request.Header.Add("content-type", "application/x-www-form-urlencoded")

	client := &http.Client{}
	res, err := client.Do(request)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	var komerceRes KomerceCostResponse
	if err := json.Unmarshal(body, &komerceRes); err != nil {
		return nil, err
	}

	if komerceRes.Meta.Code != 200 {
		return nil, fmt.Errorf("Komerce API Error: %s", komerceRes.Meta.Message)
	}

	// Map back to legacy CostResponse
	var legacyRes CostResponse
	legacyRes.RajaOngkir.Status.Code = 200
	legacyRes.RajaOngkir.Query.Origin = req.Origin
	legacyRes.RajaOngkir.Query.Destination = req.Destination
	legacyRes.RajaOngkir.Query.Weight = req.Weight
	legacyRes.RajaOngkir.Query.Courier = req.Courier

	var result struct {
		Code  string `json:"code"`
		Name  string `json:"name"`
		Costs []struct {
			Service     string `json:"service"`
			Description string `json:"description"`
			Cost        []struct {
				Value int    `json:"value"`
				Etd   string `json:"etd"`
				Note  string `json:"note"`
			} `json:"cost"`
		} `json:"costs"`
	}

	result.Code = req.Courier
	if len(komerceRes.Data) > 0 {
		result.Name = komerceRes.Data[0].Name
	} else {
		result.Name = strings.ToUpper(req.Courier)
	}

	for _, kCost := range komerceRes.Data {
		var mappedCost struct {
			Service     string `json:"service"`
			Description string `json:"description"`
			Cost        []struct {
				Value int    `json:"value"`
				Etd   string `json:"etd"`
				Note  string `json:"note"`
			} `json:"cost"`
		}
		mappedCost.Service = kCost.Service
		mappedCost.Description = kCost.Description
		mappedCost.Cost = []struct {
			Value int    `json:"value"`
			Etd   string `json:"etd"`
			Note  string `json:"note"`
		}{
			{
				Value: kCost.Cost,
				Etd:   kCost.Etd,
				Note:  "",
			},
		}
		result.Costs = append(result.Costs, mappedCost)
	}

	legacyRes.RajaOngkir.Results = append(legacyRes.RajaOngkir.Results, result)
	return &legacyRes, nil
}

func GetProvinces() ([]Province, error) {
	apiKey := os.Getenv("SHIPPING_COST")
	url := os.Getenv("RAJAONGKIR_PROVINCE")
	if apiKey == "" || url == "" {
		return nil, fmt.Errorf("Komerce API key or endpoint is not configured")
	}

	request, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	request.Header.Add("key", apiKey)

	client := &http.Client{}
	response, err := client.Do(request)
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()

	body, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}

	var komerceRes KomerceListResponse
	if err := json.Unmarshal(body, &komerceRes); err != nil {
		return nil, err
	}

	var provinces []Province
	for _, data := range komerceRes.Data {
		provinces = append(provinces, Province{
			ProvinceID:   strconv.Itoa(data.ID),
			ProvinceName: data.Name,
		})
	}

	return provinces, nil
}

func GetCities(provinceID string) ([]City, error) {
	apiKey := os.Getenv("SHIPPING_COST")
	urlPattern := os.Getenv("RAJAONGKIR_CITY")
	if apiKey == "" || urlPattern == "" {
		return nil, fmt.Errorf("Komerce API key or endpoint is not configured")
	}

	url := strings.Replace(urlPattern, "{province_id}", provinceID, 1)

	request, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	request.Header.Add("key", apiKey)

	client := &http.Client{}
	response, err := client.Do(request)
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()

	body, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}

	var komerceRes KomerceListResponse
	if err := json.Unmarshal(body, &komerceRes); err != nil {
		return nil, err
	}

	var cities []City
	for _, data := range komerceRes.Data {
		cities = append(cities, City{
			CityID:     strconv.Itoa(data.ID),
			CityName:   data.Name,
			ProvinceID: provinceID,
		})
	}

	return cities, nil
}

func GetDistricts(cityID string) ([]District, error) {
	apiKey := os.Getenv("SHIPPING_COST")
	urlPattern := os.Getenv("RAJAONGKIR_DISTRICT")
	if apiKey == "" || urlPattern == "" {
		return nil, fmt.Errorf("Komerce API key or endpoint is not configured")
	}

	url := strings.Replace(urlPattern, "{city_id}", cityID, 1)

	request, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	request.Header.Add("key", apiKey)

	client := &http.Client{}
	response, err := client.Do(request)
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()

	body, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}

	var komerceRes KomerceListResponse
	if err := json.Unmarshal(body, &komerceRes); err != nil {
		return nil, err
	}

	var districts []District
	for _, data := range komerceRes.Data {
		districts = append(districts, District{
			DistrictID:   strconv.Itoa(data.ID),
			DistrictName: data.Name,
			CityID:       cityID,
		})
	}

	return districts, nil
}
