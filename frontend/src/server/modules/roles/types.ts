export interface Role {
  id: string;
  role_name: string;
  is_admin: boolean;
  is_superadmin: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateRoleRequest {
  role_name: string;
  is_admin: boolean;
  is_superadmin: boolean;
}

export interface UpdateRoleRequest {
  role_name: string;
  is_admin: boolean;
  is_superadmin: boolean;
}

export interface PaginationInfo {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
}
