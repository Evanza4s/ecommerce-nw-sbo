package utils

import (
	"fmt"
	"strings"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type Criteria struct {
	Order      []OrderCriteria
	Where      []WhereCriteria
	Pagination PaginationInfoDTO
}
type OrderCriteria struct {
	Column string
	Order  bool `default:"false"`
}

type WhereCriteria struct {
	Column   string
	Value    interface{}
	Values   []interface{}
	Expr     string
	Operator string
}

func CustomCriteria(criteria Criteria) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {

		//Filter Builder
		var whereExprsAnd []clause.Expression
		var whereExprsOr []clause.Expression

		for _, whereCriteria := range criteria.Where {
			switch whereCriteria.Expr {
			case Equals:
				switch whereCriteria.Operator {
				case And:
					whereExprsAnd = append(whereExprsAnd, clause.Eq{
						Column: clause.Column{Name: whereCriteria.Column},
						Value:  whereCriteria.Value,
					})
				case Or:
					whereExprsOr = append(whereExprsOr, clause.Eq{
						Column: clause.Column{Name: whereCriteria.Column},
						Value:  whereCriteria.Value,
					})
				default:
					whereExprsAnd = append(whereExprsAnd, clause.Eq{
						Column: clause.Column{Name: whereCriteria.Column},
						Value:  whereCriteria.Value,
					})
				}
			case NotEq:
				switch whereCriteria.Operator {
				case And:
					whereExprsAnd = append(whereExprsAnd, clause.Neq{
						Column: clause.Column{Name: whereCriteria.Column},
						Value:  whereCriteria.Value,
					})
				case Or:
					whereExprsOr = append(whereExprsOr, clause.Neq{
						Column: clause.Column{Name: whereCriteria.Column},
						Value:  whereCriteria.Value,
					})
				default:
					whereExprsAnd = append(whereExprsAnd, clause.Neq{
						Column: clause.Column{Name: whereCriteria.Column},
						Value:  whereCriteria.Value,
					})
				}
			case Like:
				switch whereCriteria.Operator {
				case And:
					whereExprsAnd = append(whereExprsAnd, clause.Like{
						Column: clause.Column{Name: whereCriteria.Column},
						Value:  whereCriteria.Value,
					})
				case Or:
					whereExprsOr = append(whereExprsOr, clause.Like{
						Column: clause.Column{Name: whereCriteria.Column},
						Value:  whereCriteria.Value,
					})
				default:
					whereExprsAnd = append(whereExprsAnd, clause.Like{
						Column: clause.Column{Name: whereCriteria.Column},
						Value:  whereCriteria.Value,
					})
				}
			case ILike:
				switch whereCriteria.Operator {
				case And:
					whereExprsAnd = append(whereExprsAnd, clause.Expr{
						SQL:                fmt.Sprintf("%s ILIKE ?", whereCriteria.Column),
						Vars:               []interface{}{whereCriteria.Value},
						WithoutParentheses: false,
					})
				case Or:
					whereExprsOr = append(whereExprsOr, clause.Expr{
						SQL:                fmt.Sprintf("%s ILIKE ?", whereCriteria.Column),
						Vars:               []interface{}{whereCriteria.Value},
						WithoutParentheses: false,
					})
				default:
					whereExprsAnd = append(whereExprsAnd, clause.Expr{
						SQL:                fmt.Sprintf("%s ILIKE ?", whereCriteria.Column),
						Vars:               []interface{}{whereCriteria.Value},
						WithoutParentheses: false,
					})
				}
			case In:
				switch whereCriteria.Operator {
				case And:
					whereExprsAnd = append(whereExprsAnd, clause.IN{
						Column: clause.Column{Name: whereCriteria.Column},
						Values: whereCriteria.Values,
					})
				case Or:
					whereExprsOr = append(whereExprsOr, clause.IN{
						Column: clause.Column{Name: whereCriteria.Column},
						Values: whereCriteria.Values,
					})
				default:
					whereExprsAnd = append(whereExprsAnd, clause.IN{
						Column: clause.Column{Name: whereCriteria.Column},
						Values: whereCriteria.Values,
					})
				}
			case Greater:
				switch whereCriteria.Operator {
				case And:
					whereExprsAnd = append(whereExprsAnd, clause.Gt{
						Column: clause.Column{Name: whereCriteria.Column},
						Value:  whereCriteria.Value,
					})
				case Or:
					whereExprsOr = append(whereExprsOr, clause.Gt{
						Column: clause.Column{Name: whereCriteria.Column},
						Value:  whereCriteria.Value,
					})
				default:
					whereExprsAnd = append(whereExprsAnd, clause.Gt{
						Column: clause.Column{Name: whereCriteria.Column},
						Value:  whereCriteria.Value,
					})
				}
			case Gte:
				switch whereCriteria.Operator {
				case And:
					whereExprsAnd = append(whereExprsAnd, clause.Gte{
						Column: clause.Column{Name: whereCriteria.Column},
						Value:  whereCriteria.Value,
					})
				case Or:
					whereExprsOr = append(whereExprsOr, clause.Gte{
						Column: clause.Column{Name: whereCriteria.Column},
						Value:  whereCriteria.Value,
					})
				default:
					whereExprsAnd = append(whereExprsAnd, clause.Gte{
						Column: clause.Column{Name: whereCriteria.Column},
						Value:  whereCriteria.Value,
					})
				}
			case Less:
				switch whereCriteria.Operator {
				case And:
					whereExprsAnd = append(whereExprsAnd, clause.Lt{
						Column: clause.Column{Name: whereCriteria.Column},
						Value:  whereCriteria.Value,
					})
				case Or:
					whereExprsOr = append(whereExprsOr, clause.Lt{
						Column: clause.Column{Name: whereCriteria.Column},
						Value:  whereCriteria.Value,
					})
				default:
					whereExprsAnd = append(whereExprsAnd, clause.Lt{
						Column: clause.Column{Name: whereCriteria.Column},
						Value:  whereCriteria.Value,
					})
				}
			case Lte:
				switch whereCriteria.Operator {
				case And:
					whereExprsAnd = append(whereExprsAnd, clause.Lte{
						Column: clause.Column{Name: whereCriteria.Column},
						Value:  whereCriteria.Value,
					})
				case Or:
					whereExprsOr = append(whereExprsOr, clause.Lte{
						Column: clause.Column{Name: whereCriteria.Column},
						Value:  whereCriteria.Value,
					})
				default:
					whereExprsAnd = append(whereExprsAnd, clause.Lte{
						Column: clause.Column{Name: whereCriteria.Column},
						Value:  whereCriteria.Value,
					})
				}
			case Raw:
				switch whereCriteria.Operator {
				case And:
					if strings.Contains(whereCriteria.Value.(string), "%") {
						whereExprsAnd = append(whereExprsOr, clause.Expr{
							SQL:                fmt.Sprintf("%s ILIKE ?", whereCriteria.Column),
							Vars:               []interface{}{whereCriteria.Value},
							WithoutParentheses: false,
						})
					} else {
						whereExprsAnd = append(whereExprsAnd, clause.Eq{Column: clause.Expr{SQL: whereCriteria.Column},
							Value: whereCriteria.Value,
						})
					}
				case Or:
					if strings.Contains(whereCriteria.Value.(string), "%") {
						whereExprsOr = append(whereExprsOr, clause.Expr{
							SQL:                fmt.Sprintf("%s ILIKE ?", whereCriteria.Column),
							Vars:               []interface{}{whereCriteria.Value},
							WithoutParentheses: false,
						})
					} else {
						whereExprsOr = append(whereExprsOr, clause.Eq{Column: clause.Expr{SQL: whereCriteria.Column},
							Value: whereCriteria.Value,
						})
					}
				default:
					whereExprsAnd = append(whereExprsAnd, clause.Eq{Column: clause.Expr{SQL: whereCriteria.Column},
						Value: whereCriteria.Value,
					})
				}
			default:
				switch whereCriteria.Operator {
				case And:
					whereExprsAnd = append(whereExprsAnd, clause.Eq{
						Column: clause.Column{Name: whereCriteria.Column},
						Value:  whereCriteria.Value,
					})
				case Or:
					whereExprsOr = append(whereExprsOr, clause.Eq{
						Column: clause.Column{Name: whereCriteria.Column},
						Value:  whereCriteria.Value,
					})
				default:
					whereExprsAnd = append(whereExprsAnd, clause.Eq{
						Column: clause.Column{Name: whereCriteria.Column},
						Value:  whereCriteria.Value,
					})
				}
			}
		}

		for _, orderCriteria := range criteria.Order {
			db = db.Order(clause.OrderByColumn{
				Column: clause.Column{
					Name: orderCriteria.Column,
				},
				Desc: orderCriteria.Order,
			})
		}

		if len(whereExprsOr) > 0 && (len(whereExprsOr) < len(whereExprsAnd)) {
			return db.Clauses(clause.Or(clause.Or(whereExprsOr...), clause.And(whereExprsAnd...)))
		}

		return db.Clauses(clause.Or(whereExprsOr...), clause.And(whereExprsAnd...))
	}
}

func RemoveOrder(db *gorm.DB) *gorm.DB {
	return db.Order("").Offset(-1).Limit(-1)
}
