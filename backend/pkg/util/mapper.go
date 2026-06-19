package util

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"reflect"
	"regexp"
	"slices"
	"strings"

	"github.com/Evanza4s/ecommerce-nw-sbo.git/db"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model"
	"github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type Relation struct {
	Name   string
	Fields []string
	Alias  string
}

// UserAccess represents user access information
type UserAccess struct {
	UserID string `json:"user_id"`
}

// RemoveFromMaps interface for map manipulation
type RemoveFromMaps interface {
	RemoveMaps() map[string]interface{}
}

// AllKeys removes specified keys from map
type AllKeys struct {
	Input map[string]interface{}
	Keys  []string
}

// ExcludeKey removes keys except excluded ones
type ExcludeKey struct {
	Input   map[string]interface{}
	Keys    []string
	Exclude []string
}

func MapToCriteriaObject(data map[string]interface{}, mainTable string, relations ...Relation) utils.Criteria {
	var (
		order []utils.OrderCriteria
		where []utils.WhereCriteria
	)

	for key, val := range data {
		isRelation, processedKey := containRelation(key, relations...)

		if (!strings.HasPrefix(key, "page") || isRelation) && !isEmpty(val) {
			if strings.HasPrefix(key, "sort_by_") {
				// Handle sort criteria
				tempKey := strings.TrimPrefix(key, "sort_by_")
				isRelation, processedKey = containRelation(tempKey, relations...)

				if !isRelation {
					processedKey = fmt.Sprintf(`"%s"."%s"`, mainTable, tempKey)
				}

				// Safely assert bool value
				if boolVal, ok := val.(bool); ok {
					order = append(order, utils.OrderCriteria{
						Column: processedKey,
						Order:  boolVal,
					})
				}
			} else {
				// Handle where criteria
				if !isRelation {
					processedKey = fmt.Sprintf(`"%s"."%s"`, mainTable, key)
				}

				whereCriteria := buildWhereCriteria(processedKey, val)
				where = append(where, whereCriteria)
			}
		}
	}

	return utils.Criteria{
		Order: order,
		Where: where,
	}
}

func buildWhereCriteria(column string, val interface{}) utils.WhereCriteria {
	criteria := utils.WhereCriteria{
		Column:   column,
		Operator: utils.And,
	}

	switch v := val.(type) {
	case string:
		if strings.Contains(v, "%") {
			criteria.Value = v
			criteria.Expr = utils.ILike
		} else {
			criteria.Value = v
			criteria.Expr = utils.Equals
		}
	case bool:
		criteria.Value = v
		criteria.Expr = utils.Equals
	case int, int8, int16, int32, int64, uint, uint8, uint16, uint32, uint64:
		criteria.Value = v
		criteria.Expr = utils.Equals
	case float32, float64:
		criteria.Value = v
		criteria.Expr = utils.Equals
	case []interface{}:
		criteria.Values = v
		criteria.Expr = utils.In
	case []string:
		var values []interface{}
		for _, s := range v {
			values = append(values, s)
		}
		criteria.Values = values
		criteria.Expr = utils.In
	default:
		criteria.Value = v
		criteria.Expr = utils.Equals
	}

	return criteria
}

func containRelation(key string, relations ...Relation) (bool, string) {
	for _, relation := range relations {
		if strings.HasPrefix(key, relation.Name+"_") {
			field := strings.TrimPrefix(key, relation.Name+"_")
			for _, f := range relation.Fields {
				if field == f {
					relationKey := fmt.Sprintf(`"%s"."%s"`, relation.Alias, field)
					return true, relationKey
				}
			}
		}
	}
	return false, key
}

func UserIDFromToken(c echo.Context) *model.JwtPayload {
	userInfo := c.Get("userInfo")
	if userInfo == nil {
		return nil
	}

	payload := &model.JwtPayload{}
	jsonBytes, err := json.Marshal(userInfo)
	if err != nil {
		return nil
	}

	if err := json.Unmarshal(jsonBytes, payload); err != nil {
		return nil
	}

	return payload
}

// GetUserAccessFromToken retrieves user access list from token (for GET requests)
func GetUserAccessFromToken(c echo.Context, payload *model.JwtPayload) []interface{} {
	if c.Request().Method != http.MethodGet {
		return nil
	}

	tx := db.GetManager()

	// Get user access based on role
	var accessList []interface{}

	// Simple implementation: return user's own ID as access
	if payload.UserID != uuid.Nil {
		accessList = append(accessList, payload.UserID.String())
	}

	// If user is admin, get all users they can access
	if payload.RoleID != uuid.Nil {
		var role model.MstRoles
		if err := tx.First(&role, "id = ?", payload.RoleID).Error; err == nil {
			if role.IsAdmin || role.IsSuperadmin {
				// Admin can access all users
				var userIDs []string
				tx.Model(&model.MstUsers{}).Pluck("id::text", &userIDs)
				for _, id := range userIDs {
					accessList = append(accessList, id)
				}
			}
		}
	}

	return accessList
}

func isLike(val bool) string {
	if val {
		return utils.ILike
	}
	return utils.Equals
}

func isEmpty(obj interface{}) bool {
	if obj == nil {
		return true
	}

	val := reflect.ValueOf(obj)
	switch val.Kind() {
	case reflect.String:
		return strings.TrimSpace(val.String()) == ""
	case reflect.Slice, reflect.Array, reflect.Map:
		return val.Len() == 0
	case reflect.Ptr:
		return val.IsNil()
	case reflect.Bool:
		return !val.Bool()
	case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
		return val.Int() == 0
	case reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64:
		return val.Uint() == 0
	case reflect.Float32, reflect.Float64:
		return val.Float() == 0
	}

	return false
}

func containsUUID(input string) string {
	uuidPattern := `[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}`
	reg := regexp.MustCompile(uuidPattern)
	return reg.ReplaceAllString(input, "{id}")
}

func StructToMap(data interface{}) (map[string]interface{}, error) {
	var result map[string]interface{}
	d, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}

	err = json.Unmarshal(d, &result)
	if err != nil {
		return nil, err
	}
	return result, nil
}

// StructToMapWithoutZeroValues converts a struct to map, excluding zero values
func StructToMapWithoutZeroValues(data interface{}) map[string]interface{} {
	result := make(map[string]interface{})
	s := reflect.ValueOf(data)

	// Handle pointer
	if s.Kind() == reflect.Ptr {
		s = s.Elem()
	}

	if s.Kind() != reflect.Struct {
		return result
	}

	typeOfT := s.Type()
	for i := 0; i < s.NumField(); i++ {
		field := s.Field(i)
		fieldType := typeOfT.Field(i)

		// Skip unexported fields
		if !field.CanInterface() {
			continue
		}

		if field.Kind() == reflect.Ptr && !field.IsNil() {
			result[fieldType.Name] = field.Elem().Interface()
		} else if field.Kind() != reflect.Ptr && !reflect.DeepEqual(field.Interface(), reflect.Zero(field.Type()).Interface()) {
			result[fieldType.Name] = field.Interface()
		}
	}

	return result
}

// MapStruct maps source struct fields to destination struct fields by name
func MapStruct(source interface{}, destination interface{}) error {
	sourceVal := reflect.ValueOf(source)
	destVal := reflect.ValueOf(destination)

	// Destination must be a pointer
	if destVal.Kind() != reflect.Ptr {
		return fmt.Errorf("destination must be a pointer")
	}

	// Dereference pointers
	if sourceVal.Kind() == reflect.Ptr {
		sourceVal = sourceVal.Elem()
	}
	destVal = destVal.Elem()

	if sourceVal.Kind() != reflect.Struct || destVal.Kind() != reflect.Struct {
		return fmt.Errorf("source and destination must be structs")
	}

	for i := 0; i < sourceVal.NumField(); i++ {
		sourceField := sourceVal.Field(i)
		fieldName := sourceVal.Type().Field(i).Name
		destField := destVal.FieldByName(fieldName)

		if destField.IsValid() && destField.CanSet() {
			if sourceField.Type().AssignableTo(destField.Type()) {
				destField.Set(sourceField)
			}
		}
	}

	return nil
}

// ============================================================
// MAP MANIPULATION METHODS
// ============================================================

// RemoveMaps removes specified keys from the map
func (t *AllKeys) RemoveMaps() map[string]interface{} {
	for _, key := range t.Keys {
		delete(t.Input, key)
	}
	return t.Input
}

// RemoveMaps removes keys except excluded ones from the map
func (t *ExcludeKey) RemoveMaps() map[string]interface{} {
	for _, key := range t.Keys {
		if !slices.Contains(t.Exclude, key) {
			delete(t.Input, key)
		}
	}
	return t.Input
}

// ============================================================
// PAGINATION HELPERS
// ============================================================

// GetPagination extracts pagination parameters from map
func GetPagination(data map[string]interface{}) (page, pageSize int) {
	page = 1
	pageSize = 10

	if p, ok := data["page"]; ok {
		switch v := p.(type) {
		case float64:
			page = int(v)
		case int:
			page = v
		case string:
			fmt.Sscanf(v, "%d", &page)
		}
	}

	if ps, ok := data["page_size"]; ok {
		switch v := ps.(type) {
		case float64:
			pageSize = int(v)
		case int:
			pageSize = v
		case string:
			fmt.Sscanf(v, "%d", &pageSize)
		}
	}

	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 10
	}

	return page, pageSize
}

// ============================================================
// ERROR HELPERS
// ============================================================

// IsRecordNotFound checks if error is gorm record not found
func IsRecordNotFound(err error) bool {
	return errors.Is(err, gorm.ErrRecordNotFound)
}

// NewErrorResponse creates a standardized error response
func NewErrorResponse(message string, err error) error {
	if err != nil {
		return fmt.Errorf("%s: %w", message, err)
	}
	return fmt.Errorf("%s", message)
}

// ============================================================
// SLUG & STRING HELPERS
// ============================================================

// GenerateSlug generates a URL-friendly slug from a string
func GenerateSlug(s string) string {
	// Convert to lowercase
	s = strings.ToLower(s)

	// Replace spaces with hyphens
	s = strings.ReplaceAll(s, " ", "-")

	// Remove special characters
	reg := regexp.MustCompile("[^a-z0-9-]")
	s = reg.ReplaceAllString(s, "")

	// Remove multiple hyphens
	reg = regexp.MustCompile("-+")
	s = reg.ReplaceAllString(s, "-")

	// Trim hyphens from start and end
	s = strings.Trim(s, "-")

	return s
}
