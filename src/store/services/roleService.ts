import { baseApi } from "../api/baseApi";

export const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<any, void>({
      query: () => "/roles",
      providesTags: ["Role"],
    }),
    getRoleById: builder.query<any, string>({
      query: (id) => `/roles/${id}`,
      providesTags: (result, error, id) => [{ type: "Role", id }],
    }),
    createRole: builder.mutation<any, any>({
      query: (data) => ({
        url: "/roles",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Role"],
    }),
    updateRole: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/roles/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ["Role", { type: "Role", id }],
    }),
    deleteRole: builder.mutation<any, string>({
      query: (id) => ({
        url: `/roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Role"],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = roleApi;
