package midtrans

import (
	"os"

	"github.com/midtrans/midtrans-go"
	"github.com/midtrans/midtrans-go/coreapi"
	"github.com/midtrans/midtrans-go/snap"
)

var (
	SnapClient snap.Client
	CoreAPIClient coreapi.Client
)

func InitMidtrans() {
	serverKey := os.Getenv("MIDTRANS_SERVER")
	env := midtrans.Sandbox // change to midtrans.Production for live

	SnapClient.New(serverKey, env)
	CoreAPIClient.New(serverKey, env)
}

func CreateSnapTransaction(req *snap.Request) (*snap.Response, *midtrans.Error) {
	return SnapClient.CreateTransaction(req)
}
