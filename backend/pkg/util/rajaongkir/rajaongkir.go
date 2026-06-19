package rajaongkir

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
)

const (
	StarterBaseURL = "https://api.rajaongkir.com/starter"
)

type CostRequest struct {
	Origin      string `json:"origin"`
	Destination string `json:"destination"`
	Weight      int    `json:"weight"`
	Courier     string `json:"courier"` // "jne", "pos", "tiki"
}

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

type CityResponse struct {
	RajaOngkir struct {
		Results []struct {
			CityID   string `json:"city_id"`
			CityName string `json:"city_name"`
			Type     string `json:"type"`
		} `json:"results"`
	} `json:"rajaongkir"`
}

func GetCityIDByName(cityName string) (string, error) {
	apiKey := os.Getenv("SHIPPING_COST")
	if apiKey == "" {
		return "", fmt.Errorf("RajaOngkir API key is not configured")
	}

	url := fmt.Sprintf("%s/city", StarterBaseURL)
	request, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return "", err
	}
	request.Header.Add("key", apiKey)

	client := &http.Client{}
	response, err := client.Do(request)
	if err != nil {
		return "", err
	}
	defer response.Body.Close()

	body, err := io.ReadAll(response.Body)
	if err != nil {
		return "", err
	}

	var cityResponse CityResponse
	if err := json.Unmarshal(body, &cityResponse); err != nil {
		return "", err
	}

	// Clean city name (e.g. remove "Kota " or "Kabupaten ")
	cleanName := strings.ToLower(cityName)
	cleanName = strings.ReplaceAll(cleanName, "kota ", "")
	cleanName = strings.ReplaceAll(cleanName, "kabupaten ", "")
	cleanName = strings.TrimSpace(cleanName)

	for _, city := range cityResponse.RajaOngkir.Results {
		name := strings.ToLower(city.CityName)
		if strings.Contains(name, cleanName) || strings.Contains(cleanName, name) {
			return city.CityID, nil
		}
	}

	return "", fmt.Errorf("city %s not found in RajaOngkir", cityName)
}

func CalculateCost(req *CostRequest) (*CostResponse, error) {
	apiKey := os.Getenv("SHIPPING_COST") // using SHIPPING_COST from env as API key
	if apiKey == "" {
		return nil, fmt.Errorf("RajaOngkir API key is not configured")
	}

	payload, err := json.Marshal(req)
	if err != nil {
		return nil, err
	}

	url := fmt.Sprintf("%s/cost", StarterBaseURL)
	request, err := http.NewRequest("POST", url, bytes.NewBuffer(payload))
	if err != nil {
		return nil, err
	}

	request.Header.Add("key", apiKey)
	request.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	// RajaOngkir requires form-urlencoded, so we should encode it as such.
	// Wait, the documentation allows form-urlencoded. Let's fix the payload.
	
	formPayload := fmt.Sprintf("origin=%s&destination=%s&weight=%d&courier=%s", req.Origin, req.Destination, req.Weight, req.Courier)
	request, err = http.NewRequest("POST", url, bytes.NewBufferString(formPayload))
	if err != nil {
		return nil, err
	}
	request.Header.Add("key", apiKey)
	request.Header.Add("Content-Type", "application/x-www-form-urlencoded")

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

	var costResponse CostResponse
	if err := json.Unmarshal(body, &costResponse); err != nil {
		return nil, err
	}

	if costResponse.RajaOngkir.Status.Code != 200 {
		return nil, fmt.Errorf("RajaOngkir API Error: %s", costResponse.RajaOngkir.Status.Description)
	}

	return &costResponse, nil
}
