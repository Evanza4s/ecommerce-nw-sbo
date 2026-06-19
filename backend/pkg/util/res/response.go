package res

import (
	"fmt"
	"net/http"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/labstack/echo/v4"
	"github.com/sirupsen/logrus"
)

// ============================================================
// RESPONSE TYPES
// ============================================================

// MetaResponse represents metadata for pagination
type MetaResponse struct {
	Success bool                     `json:"success"`
	Message string                   `json:"message"`
	Info    *utils.PaginationInfoDTO `json:"info,omitempty"`
}

// Pagination represents pagination details
type Pagination struct {
	Index int `json:"index"`
	Page  int `json:"page"`
	Limit int `json:"limit"`
}

// SuccessResponseInfo represents a simple success response
type SuccessResponseInfo struct {
	Status      bool        `json:"status"`
	Message     string      `json:"message"`
	Data        interface{} `json:"data,omitempty"`
	ErrorFields interface{} `json:"error_fields,omitempty"`
}

// SuccessResponse represents a success response with pagination
type SuccessResponse struct {
	Status      bool        `json:"status"`
	Message     string      `json:"message"`
	Data        interface{} `json:"data,omitempty"`
	ErrorFields interface{} `json:"error_fields,omitempty"`
	Pagination  interface{} `json:"pagination,omitempty"`
}

// ErrorConstant represents an error response
type ErrorConstant struct {
	Code        int         `json:"code"`
	Status      bool        `json:"status"`
	Message     string      `json:"message"`
	Data        interface{} `json:"data,omitempty"`
	ErrorFields []Message   `json:"error_fields,omitempty"`
}

// ResponsePageConstant represents a paginated response
type ResponsePageConstant struct {
	Code        int                      `json:"code"`
	Status      bool                     `json:"status"`
	Message     string                   `json:"message"`
	Data        interface{}              `json:"data,omitempty"`
	Paginate    *utils.PaginationInfoDTO `json:"pagination,omitempty"`
	ErrorFields []Message                `json:"error_fields,omitempty"`
}

// Message represents a single error message
type Message struct {
	Field   string `json:"field,omitempty"`
	Message string `json:"message"`
}

// ============================================================
// RESPONSE CONSTANTS
// ============================================================

const (
	StatusSuccess = "success"
	StatusFailed  = "failed"

	ErrTypeDuplicate           = "duplicate"
	ErrTypeNotFound            = "not_found"
	ErrTypeUnprocessableEntity = "unprocessable_entity"
	ErrTypeUnauthorized        = "unauthorized"
	ErrTypeBadRequest          = "bad_request"
	ErrTypeServerError         = "server_error"
	ErrTypeForbidden           = "forbidden"

	MsgCreated       = "Data created successfully"
	MsgAddSuccess    = "Data added successfully"
	MsgAddFailed     = "Data failed to add"
	MsgUpdateSuccess = "Data updated successfully"
	MsgUpdateFailed  = "Data failed to update"
	MsgDeleteSuccess = "Data deleted successfully"
	MsgDeleteFailed  = "Data failed to delete"
	MsgGetSuccess    = "Data retrieved successfully"
	MsgGetFailed     = "Failed to retrieve data"
)

// ============================================================
// PREDEFINED ERRORS
// ============================================================

var (
	ErrDuplicate = ErrorConstant{
		Code:        http.StatusConflict,
		Status:      false,
		Message:     "Data already exists",
		Data:        nil,
		ErrorFields: []Message{{Message: ErrTypeDuplicate}},
	}

	ErrDataNotFound = ErrorConstant{
		Code:        http.StatusNotFound,
		Status:      false,
		Message:     "Data not found",
		Data:        nil,
		ErrorFields: []Message{{Message: ErrTypeNotFound}},
	}

	ErrRouteNotFound = ErrorConstant{
		Code:        http.StatusNotFound,
		Status:      false,
		Message:     "Route not found",
		Data:        nil,
		ErrorFields: []Message{{Message: ErrTypeNotFound}},
	}

	ErrUnprocessableEntity = ErrorConstant{
		Code:        http.StatusUnprocessableEntity,
		Status:      false,
		Message:     "Invalid parameters or payload",
		Data:        nil,
		ErrorFields: []Message{{Message: ErrTypeUnprocessableEntity}},
	}

	ErrUnauthorized = ErrorConstant{
		Code:        http.StatusUnauthorized,
		Status:      false,
		Message:     "Unauthorized, please login",
		Data:        nil,
		ErrorFields: []Message{{Message: ErrTypeUnauthorized}},
	}

	ErrForbidden = ErrorConstant{
		Code:        http.StatusForbidden,
		Status:      false,
		Message:     "Access denied",
		Data:        nil,
		ErrorFields: []Message{{Message: ErrTypeForbidden}},
	}

	ErrBadRequest = ErrorConstant{
		Code:        http.StatusBadRequest,
		Status:      false,
		Message:     "Bad request",
		Data:        nil,
		ErrorFields: []Message{{Message: ErrTypeBadRequest}},
	}

	ErrValidation = ErrorConstant{
		Code:        http.StatusBadRequest,
		Status:      false,
		Message:     "Validation failed",
		Data:        nil,
		ErrorFields: []Message{{Message: ErrTypeBadRequest}},
	}

	ErrServerError = ErrorConstant{
		Code:        http.StatusInternalServerError,
		Status:      false,
		Message:     "Internal server error",
		Data:        nil,
		ErrorFields: []Message{{Message: ErrTypeServerError}},
	}
)

// ============================================================
// ERROR METHODS
// ============================================================

// Error implements the error interface
func (r *ErrorConstant) Error() string {
	return fmt.Sprintf("error code %d: %s", r.Code, r.Message)
}

// Builder returns the error constant for method chaining
func (r *ErrorConstant) Builder() *ErrorConstant {
	return r
}

// ============================================================
// ERROR BUILDERS
// ============================================================

// BuildError creates an error with custom message
func BuildError(err ErrorConstant, msg error) error {
	errCopy := err
	errCopy.ErrorFields = []Message{{Message: msg.Error()}}
	return &errCopy
}

// BuildValidationError creates a validation error with field-specific messages
func BuildValidationError(errors []Message) error {
	return &ErrorConstant{
		Code:        http.StatusBadRequest,
		Status:      false,
		Message:     "Validation failed",
		Data:        nil,
		ErrorFields: errors,
	}
}

// BuildCustomError creates a custom error
func BuildCustomError(code int, message string, errors []string) error {
	var errorFields []Message
	for _, val := range errors {
		errorFields = append(errorFields, Message{Message: val})
	}

	return &ErrorConstant{
		Code:        code,
		Status:      false,
		Message:     message,
		Data:        nil,
		ErrorFields: errorFields,
	}
}

// ============================================================
// RESPONSE BUILDERS
// ============================================================

// BuildCustomResponse creates a custom response
func BuildCustomResponse(status string, code int, errors []string, message string, data interface{}) (int, interface{}) {
	var errorFields []Message
	var response ErrorConstant

	for _, val := range errors {
		errorFields = append(errorFields, Message{Message: val})
	}

	switch status {
	case StatusSuccess:
		response = ErrorConstant{
			Code:        code,
			Status:      true,
			Message:     message,
			Data:        data,
			ErrorFields: errorFields,
		}
	case StatusFailed:
		response = ErrorConstant{
			Code:        code,
			Status:      false,
			Message:     message,
			Data:        nil,
			ErrorFields: errorFields,
		}
	}

	return code, response
}

// BuildCustomResponsePagination creates a paginated response
func BuildCustomResponsePagination(status string, code int, errors []string, message string, data interface{}, page *utils.PaginationInfoDTO) (int, interface{}) {
	var errorFields []Message
	var response ResponsePageConstant

	for _, val := range errors {
		errorFields = append(errorFields, Message{Message: val})
	}

	switch status {
	case StatusSuccess:
		response = ResponsePageConstant{
			Code:        code,
			Status:      true,
			Message:     message,
			Data:        data,
			Paginate:    page,
			ErrorFields: errorFields,
		}
	case StatusFailed:
		response = ResponsePageConstant{
			Code:        code,
			Status:      false,
			Message:     message,
			Data:        nil,
			Paginate:    page,
			ErrorFields: errorFields,
		}
	}

	return code, response
}

// ============================================================
// ECHO RESPONSE HELPERS
// ============================================================

// RespSuccess sends a success response with pagination
func RespSuccess(c echo.Context, message string, data interface{}, err interface{}, pagination Pagination) error {
	response := SuccessResponse{
		Status:      true,
		Message:     message,
		Data:        data,
		ErrorFields: err,
		Pagination:  pagination,
	}
	return c.JSON(http.StatusOK, response)
}

// RespSuccessInfo sends a simple success response
func RespSuccessInfo(c echo.Context, message string, data interface{}, err interface{}) error {
	response := SuccessResponseInfo{
		Status:      true,
		Message:     message,
		Data:        data,
		ErrorFields: err,
	}
	return c.JSON(http.StatusOK, response)
}

// RespError sends an error response
func RespError(c echo.Context, err error) error {
	re, ok := err.(*ErrorConstant)
	if ok {
		logrus.WithFields(logrus.Fields{
			"url":    c.Request().URL.Path,
			"method": c.Request().Method,
			"error":  re.Message,
		}).Error("request error")

		return c.JSON(re.Builder().Code, re.Builder())
	}

	logrus.WithFields(logrus.Fields{
		"url":    c.Request().URL.Path,
		"method": c.Request().Method,
		"error":  err.Error(),
	}).Error("unhandled error")

	return c.JSON(ErrServerError.Code, ErrServerError)
}

// RespCreated sends a created response (201)
func RespCreated(c echo.Context, message string, data interface{}) error {
	response := SuccessResponseInfo{
		Status:  true,
		Message: message,
		Data:    data,
	}
	return c.JSON(http.StatusCreated, response)
}

// RespNoContent sends a no content response (204)
func RespNoContent(c echo.Context) error {
	return c.NoContent(http.StatusNoContent)
}

// RespPaginated sends a paginated response
func RespPaginated(c echo.Context, message string, data interface{}, pagination *utils.PaginationInfoDTO) error {
	response := ResponsePageConstant{
		Code:     http.StatusOK,
		Status:   true,
		Message:  message,
		Data:     data,
		Paginate: pagination,
	}
	return c.JSON(http.StatusOK, response)
}
