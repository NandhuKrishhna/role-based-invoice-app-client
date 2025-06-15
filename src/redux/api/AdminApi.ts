import type { IGetAllUsersParams } from "@/utils/types/super-admins.types";
import { apiSlice } from "./EntryApi";
import { getCurrentUserRole } from "@/utils/GetCurrentUser";
import { ADMIN_URLS, Role, SUPER_ADMIN_URLS, UNIT_MANAGER_URLS, URLS } from "@/utils/contants";
import type { InvoiceQueryParams } from "@/utils/types/invoice.types";


export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: "/login",
                method: "POST",
                body: data,
            }),
        }),
        getAllUsers: builder.query({
            query: (params: IGetAllUsersParams) => {
                const role = getCurrentUserRole();
                let BASE_URL = ""
                if (role === Role.SUPER_ADMIN) {
                    BASE_URL = URLS.SUPER_ADMIN_URL
                } else if (role === Role.ADMIN) {
                    BASE_URL = URLS.ADMIN_URL
                } else if (role === Role.UNIT_MANAGER) {
                    BASE_URL = URLS.UNIT_MANAGER_URL
                } else {
                    BASE_URL = URLS.USER_URL
                }
                const queryParams = Object.entries(params).reduce((acc, [key, value]) => {
                    acc[key] = value === undefined ? "" : value;
                    return acc;
                }, {} as Record<string, string | number>);

                const queryString = Object.entries(queryParams)
                    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
                    .join("&");

                return {
                    url: `${BASE_URL}/get-all-users${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: ["Users"],
        }),
        deleteUser: builder.mutation({
            query: (userId) => {

                const role = getCurrentUserRole();
                let BASE_URL = ""
                if (role === Role.SUPER_ADMIN) {
                    BASE_URL = URLS.SUPER_ADMIN_URL
                } else if (role === Role.ADMIN) {
                    BASE_URL = URLS.ADMIN_URL
                } else {
                    BASE_URL = URLS.UNIT_MANAGER_URL
                }

                return {
                    url: `${BASE_URL}/delete-user`,
                    method: "DELETE",
                    body: { userId },
                }
            },
            invalidatesTags: ["Users"],
        }),
        createAdmin: builder.mutation({
            query: (data) => {
                const role = getCurrentUserRole();
                let BASE_URL = ""
                if (role === Role.SUPER_ADMIN) {
                    BASE_URL = URLS.SUPER_ADMIN_URL + SUPER_ADMIN_URLS.CREATE_ADMIN
                } else if (role === Role.ADMIN) {
                    BASE_URL = URLS.ADMIN_URL + ADMIN_URLS.CREATE_UNIT_MANAGER
                } else {
                    BASE_URL = URLS.UNIT_MANAGER_URL + UNIT_MANAGER_URLS.CREATE_USERS
                }

                return {

                    url: `${BASE_URL}`,
                    method: "POST",
                    body: data,
                }
            },
            invalidatesTags: ["Users"],
        }),
        updateUserRole: builder.mutation({
            query: (data) => ({
                url: `/admin/update-role`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Users"],
        }),
        logout: builder.query({
            query: () => ({
                url: "/logout",
                method: "GET",
            }),
        }),

        getAllInvoices: builder.query({
            query: (params: InvoiceQueryParams) => {
                const role = getCurrentUserRole();
                let BASE_URL = ""
                if (role === Role.ADMIN) {
                    BASE_URL = URLS.ADMIN_URL
                } else if (role === Role.UNIT_MANAGER) {
                    BASE_URL = URLS.UNIT_MANAGER_URL
                } else {
                    BASE_URL = URLS.USER_URL
                }
                const queryParams = Object.entries(params).reduce((acc, [key, value]) => {
                    acc[key] = value === undefined ? "" : value;
                    return acc;
                }, {} as Record<string, string | number>);

                const queryString = Object.entries(queryParams)
                    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
                    .join("&");

                return {
                    url: `${BASE_URL}/get-invoices${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: ["Invoices"],

        }),

        deleteInvoice: builder.mutation({
            query: (invoiceId) => {
                let BASE_URL = ""
                const role = getCurrentUserRole();
                if (role === Role.ADMIN) {
                    BASE_URL = URLS.ADMIN_URL
                } else if (role === Role.UNIT_MANAGER) {
                    BASE_URL = URLS.UNIT_MANAGER_URL
                } else {
                    BASE_URL = URLS.USER_URL
                }
                return {
                    url: `${BASE_URL}/delete-invoice`,
                    method: "DELETE",
                    body: { invoiceId },
                }
            },
            invalidatesTags: ["Invoices"],
        }),
        updateInvoice: builder.mutation({
            query: (data) => {
                let BASE_URL = ""
                const role = getCurrentUserRole();
                if (role === Role.ADMIN) {
                    BASE_URL = URLS.ADMIN_URL
                } else if (role === Role.UNIT_MANAGER) {
                    BASE_URL = URLS.UNIT_MANAGER_URL
                } else {
                    BASE_URL = URLS.USER_URL
                }
                return {
                    url: `${BASE_URL}/update-invoice`,
                    method: "PATCH",
                    body: data,
                }
            },
            invalidatesTags: ["Invoices"],
        }),
        createInvoice: builder.mutation({
            query: (data) => {
                let BASE_URL = ""
                const role = getCurrentUserRole();
                if (role === Role.ADMIN) {
                    BASE_URL = URLS.ADMIN_URL
                } else if (role === Role.UNIT_MANAGER) {
                    BASE_URL = URLS.UNIT_MANAGER_URL
                } else {
                    BASE_URL = URLS.USER_URL
                }
                return {
                    url: `${BASE_URL}/create-invoice`,
                    method: "POST",
                    body: data,
                }
            },
            invalidatesTags: ["Invoices"],
        }),


    }),
});

export const {
    useLoginMutation,
    useGetAllUsersQuery,
    useDeleteUserMutation,
    useCreateAdminMutation,
    useUpdateUserRoleMutation,
    useLazyLogoutQuery,
    useGetAllInvoicesQuery,
    useDeleteInvoiceMutation,
    useUpdateInvoiceMutation,
    useCreateInvoiceMutation
} = authApi;