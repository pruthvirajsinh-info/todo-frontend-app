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
  }),
});

export const {
  useGetPermissionsQuery,
  useGetModulesQuery,
  useGetActionsQuery,
} = permissionApi;
