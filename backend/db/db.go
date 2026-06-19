package db

import (
	"fmt"
	"os"
	"time"

	"github.com/sirupsen/logrus"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// ============================================================
// DATABASE MANAGER
// ============================================================

var db *gorm.DB

// Init initializes the database connection
func Init() {
	var (
		DB_HOST     = os.Getenv("DB_HOST")
		DB_USER     = os.Getenv("DB_USER")
		DB_PASS     = os.Getenv("DB_PASS")
		DB_NAME     = os.Getenv("DB_NAME")
		DB_PORT     = os.Getenv("DB_PORT")
		DB_SSLMODE  = os.Getenv("DB_SSLMODE")
		DB_TZ       = os.Getenv("DB_TZ")
		DB_TIMEZONE = os.Getenv("DB_TIMEZONE")
	)

	// Set defaults
	if DB_SSLMODE == "" {
		DB_SSLMODE = "disable"
	}
	if DB_TZ == "" && DB_TIMEZONE == "" {
		DB_TZ = "Asia/Jakarta"
	} else if DB_TIMEZONE != "" {
		DB_TZ = DB_TIMEZONE
	}

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=%s",
		DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT, DB_SSLMODE, DB_TZ,
	)

	var err error
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		logrus.Fatal("failed to connect database: ", err)
	}

	// Configure connection pool
	sqlDB, err := db.DB()
	if err != nil {
		logrus.Fatal("failed to get database instance: ", err)
	}

	// Set connection pool settings
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	logrus.Info("database connected successfully")
}

// GetManager returns the database instance
func GetManager() *gorm.DB {
	if db == nil {
		logrus.Fatal("database not initialized. Call db.Init() first.")
	}
	return db
}

// Close closes the database connection
func Close() error {
	if db != nil {
		sqlDB, err := db.DB()
		if err != nil {
			return err
		}
		return sqlDB.Close()
	}
	return nil
}

// DbManager returns the database instance (alias for GetManager for backward compatibility)
func DbManager() *gorm.DB {
	return GetManager()
}
