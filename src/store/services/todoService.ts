import { baseApi } from "../api/baseApi";

export const todoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTodos: builder.query<any, void>({
      query: () => "/todos",
      providesTags: ["Todo"],
    }),
    getTodoById: builder.query<any, string>({
      query: (id) => `/todos/${id}`,
      providesTags: (result, error, id) => [{ type: "Todo", id }],
    }),
    createTodo: builder.mutation<any, any>({
      query: (data) => ({
        url: "/todos",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Todo"],
    }),
    updateTodo: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/todos/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ["Todo", { type: "Todo", id }],
    }),
    deleteTodo: builder.mutation<any, string>({
      query: (id) => ({
        url: `/todos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Todo"],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useGetTodoByIdQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todoApi;
