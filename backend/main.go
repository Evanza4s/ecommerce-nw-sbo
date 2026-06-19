package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/sirupsen/logrus"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/db"
	_ "github.com/Evanza4s/ecommerce-nw-sbo.git/docs"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/routes"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/mail"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/redis"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/cloud"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/crypto"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/pkg/util/midtrans"
)

// @title E-Commerce NW API
// @version 1.0
// @description E-Commerce NW SBO Backend API
// @host localhost:8080
// @BasePath /
// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization

func init() {
	ENV := os.Getenv("ENV")
	env := util.NewEnv()
	env.Load(ENV)
	logrus.Info("choose environment " + ENV)
}

func main() {
	var (
		APP  = os.Getenv("APP")
		ENV  = os.Getenv("ENV")
		PORT = os.Getenv("PORT")
		NAME = fmt.Sprintf("%s-%s", APP, ENV)
	)

	// Initialize Database
	db.Init()

	// Initialize Crypto
	crypto.Init()

	// Initialize Redis
	if err := redis.Init(); err != nil {
		logrus.Warn("Redis init failed: ", err)
	} else {
		logrus.Info("Redis connected successfully")
	}
	defer redis.Close()

	// Initialize Cloudinary
	if err := cloud.InitCloudinary(); err != nil {
		logrus.Warn("Cloudinary init failed: ", err)
	}

	// Initialize Midtrans
	midtrans.InitMidtrans()

	// Initialize Mail Service
	if err := mail.Init(); err != nil {
		logrus.Warn("Mail service init failed: ", err)
	}

	e := echo.New()

	e.Use(
		middleware.Recover(),
		middleware.CORSWithConfig(middleware.CORSConfig{
			AllowOrigins:     []string{"http://localhost:3000", "http://localhost:8080"},
			AllowMethods:     []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete, http.MethodOptions, http.MethodPatch},
			AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
			AllowCredentials: true,
		}),
		middleware.LoggerWithConfig(middleware.LoggerConfig{
			Format: fmt.Sprintf("\n%s | ${host} | ${time_custom} | ${status} | ${latency_human} | ${remote_ip} | ${method} | ${uri}",
				NAME,
			),
			CustomTimeFormat: "2006/01/02 15:04:05",
			Output:           os.Stdout,
		}),
	)

	routes.Init(e.Group(""))

	if err := e.Start(":" + PORT); err != nil {
		logrus.Fatal("failed to start server: ", err)
	}
}
