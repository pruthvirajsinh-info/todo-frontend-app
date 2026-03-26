import { baseApi } from "../api/baseApi";

export const permissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPermissions: builder.query<any, void>({
      query: () => "/permissions",
      providesTags: ["Permission"],
    }),
    getModules: builder.query<any, void>({
      query: () => "/modules",
      providesTags: ["Module"],
    }),
    getActions: builder.query<any, void>({
      query: () => "/actions",
      providesTags: ["Action"],
    }),
    getPermissionById: builder.query<any, string>({
      query: (id) => `/permissions/${id}`,
      providesTags: (result, error, id) => [{ type: "Permission", id }],
    }),
    createPermission: builder.mutation<any, any>({
      query: (data) => ({
        url: "/permissions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Permission"],
    }),
    updatePermission: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/permissions/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ["Permission", { type: "Permission", id }],
    }),
    deletePermission: builder.mutation<any, string>({
      query: (id) => ({
        url: `/permissions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Permission"],
    }),
  }),
});

export const {
  useGetPermissionsQuery,
  useGetModulesQuery,
  useGetActionsQuery,
  useGetPermissionByIdQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} = permissionApi;
