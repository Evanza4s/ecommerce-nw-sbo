package model

import "github.com/Evanza4s/ecommerce-nw-sbo.git/internal/model/utils"

type MstRoles struct {
	utils.DefaultModel
	RoleName     string     `json:"role_name" gorm:"type:varchar(100)"`
	IsAdmin      bool       `json:"is_admin" gorm:"default:false"`
	IsSuperadmin bool       `json:"is_superadmin" gorm:"default:false"`
	Users        []MstUsers `gorm:"foreignKey:RoleID"`
}

func (MstRoles) TableName() string {
	return "public.mst_roles"
}
