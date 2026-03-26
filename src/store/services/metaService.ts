import { baseApi } from "../api/baseApi";

export const metaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSidebarTabs: builder.query<any, void>({
      query: () => "/sidebar-tabs",
      providesTags: ["SidebarTab"],
    }),
    updateSidebarTab: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/sidebar-tabs/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["SidebarTab"],
    }),
  }),
});

export const {
  useGetSidebarTabsQuery,
  useUpdateSidebarTabMutation,
} = metaApi;
