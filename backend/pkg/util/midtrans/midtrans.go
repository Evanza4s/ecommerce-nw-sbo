package midtrans

import (
	"os"

	"github.com/midtrans/midtrans-go"
	"github.com/midtrans/midtrans-go/coreapi"
	"github.com/midtrans/midtrans-go/snap"
	"github.com/sirupsen/logrus"
)

var (
	SnapClient snap.Client
	CoreAPIClient coreapi.Client
)

func InitMidtrans() {
	serverKey := os.Getenv("MIDTRANS_SERVER")
	logrus.Infof("Midtrans InitMidtrans - server key length: %d", len(serverKey))
	env := midtrans.Sandbox // FORCED SANDBOX

	SnapClient.New(serverKey, env)
	CoreAPIClient.New(serverKey, env)
}

func CreateSnapTransaction(req *snap.Request) (*snap.Response, *midtrans.Error) {
	return SnapClient.CreateTransaction(req)
}
