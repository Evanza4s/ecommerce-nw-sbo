package util

import (
	"flag"
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
)

// ============================================================
// ENV CONFIGURATION
// ============================================================

type Env interface {
	GetString(name string) string
}

type env struct {
	Env
}

type EnvGetter struct{}

func NewEnv() *env {
	return &env{Env: &EnvGetter{}}
}

func (e *env) Load(env string) {
	cwd, _ := os.Getwd()

	// Set up a command-line flag to specify the environment
	environment := flag.String("env", "dev", "Environment: 'dev' or 'prod'")
	flag.Parse()

	var envFile string
	switch *environment {
	case "dev":
		envFile = "development"
	case "prod":
		envFile = "production"
	default:
		envFile = "development"
	}

	fmt.Println("ENV", envFile)

	err := godotenv.Load(`.env.` + envFile)
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"cause": err,
			"cwd":   cwd,
		}).Fatal("Load .env file error")

		os.Exit(-1)
	}
}

func (r *EnvGetter) GetString(name string) string {
	return os.Getenv(name)
}

func (e *env) GetString(name string) string {
	if e.Env == nil {
		return ""
	}
	return e.Env.GetString(name)
}

func (e *env) GetBool(name string) bool {
	s := e.GetString(name)
	i, err := strconv.ParseBool(s)
	if err != nil {
		return false
	}
	return i
}

func (e *env) GetInt(name string) int {
	s := e.GetString(name)
	i, err := strconv.Atoi(s)
	if err != nil {
		return 0
	}
	return i
}

func (e *env) GetFloat(name string) float64 {
	s := e.GetString(name)
	i, err := strconv.ParseFloat(s, 64)
	if err != nil {
		return 0
	}
	return i
}

// ============================================================
// TIME HELPERS
// ============================================================

// GetTimeNow returns current time in specified timezone
func GetTimeNow(timezone string) (time.Time, error) {
	loc, err := time.LoadLocation(timezone)
	if err != nil {
		return time.Now(), err
	}
	return time.Now().In(loc), nil
}
