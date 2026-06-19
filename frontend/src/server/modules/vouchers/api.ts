import { getApi, postApi, putApi, deleteApi } from "../../core/client";
import type { AuthResponse } from "../auth/types";
import { Voucher, CreateVoucherRequest, UpdateVoucherRequest, PaginationInfo, ValidateVoucherRequest, ValidateVoucherResponse } from "./types";

interface PaginatedVouchersResponse extends AuthResponse<Voucher[]> {
  pagination?: PaginationInfo;
}

export const vouchersApi = {
  getAll: async (params?: Record<string, any>) => {
    const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
    const url = `/vouchers/get-all${queryString ? `?${queryString}` : ''}`;
    return getApi<PaginatedVouchersResponse>(url);
  },

  getAllNoPagination: async (params?: Record<string, any>) => {
    const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
    const url = `/vouchers${queryString ? `?${queryString}` : ''}`;
    return getApi<AuthResponse<Voucher[]>>(url);
  },

  getById: async (id: string) => {
    return getApi<AuthResponse<Voucher>>(`/vouchers/${id}`);
  },

  create: async (data: CreateVoucherRequest) => {
    return postApi<AuthResponse<Voucher>>("/vouchers", data);
  },

  update: async (id: string, data: UpdateVoucherRequest) => {
    return putApi<AuthResponse<Voucher>>(`/vouchers/${id}`, data);
  },

  delete: async (id: string) => {
    return deleteApi<AuthResponse<null>>(`/vouchers/${id}`);
  },

  validate: async (data: ValidateVoucherRequest) => {
    return postApi<AuthResponse<ValidateVoucherResponse>>("/vouchers/validate", data);
  },
};
