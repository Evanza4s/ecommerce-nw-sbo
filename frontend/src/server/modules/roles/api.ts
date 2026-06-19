import { getApi, postApi, putApi, deleteApi } from "../../core/client";
import type { AuthResponse } from "../auth/types";
import { Role, CreateRoleRequest, UpdateRoleRequest, PaginationInfo } from "./types";

interface PaginatedRolesResponse extends AuthResponse<Role[]> {
  pagination?: PaginationInfo;
}

export const rolesApi = {
  getAll: async (params?: Record<string, any>) => {
    const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
    const url = `/roles/get-all${queryString ? `?${queryString}` : ''}`;
    return getApi<PaginatedRolesResponse>(url);
  },

  getAllNoPagination: async (params?: Record<string, any>) => {
    const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
    const url = `/roles${queryString ? `?${queryString}` : ''}`;
    return getApi<AuthResponse<Role[]>>(url);
  },

  getById: async (id: string) => {
    return getApi<AuthResponse<Role>>(`/roles/${id}`);
  },

  create: async (data: CreateRoleRequest) => {
    return postApi<AuthResponse<Role>>("/roles", data);
  },

  update: async (id: string, data: UpdateRoleRequest) => {
    return putApi<AuthResponse<Role>>(`/roles/${id}`, data);
  },

  delete: async (id: string) => {
    return deleteApi<AuthResponse<null>>(`/roles/${id}`);
  },
};
