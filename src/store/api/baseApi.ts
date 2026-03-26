import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001/api/v1",
    prepareHeaders: (headers, { getState }) => {
      // 1. Try to get token from Redux state first
      const state = getState() as any;
      const tokenFromState = state.auth?.token;
      
      // 2. Fallback to localStorage if state is not hydrated
      const tokenFromStorage = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      
      const token = tokenFromState || tokenFromStorage;
      
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "Todo", "Role", "Permission", "Module", "Action", "SidebarTab"],
  endpoints: () => ({}),
});
