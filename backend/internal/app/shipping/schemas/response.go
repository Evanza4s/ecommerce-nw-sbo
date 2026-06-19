package schemas

type ShippingRatesResponse struct {
	Courier string `json:"courier"`
	Name    string `json:"name"`
	Costs   []ShippingCost `json:"costs"`
}

type ShippingCost struct {
	Service     string `json:"service"`
	Description string `json:"description"`
	Cost        int    `json:"cost"`
	Etd         string `json:"etd"`
}
