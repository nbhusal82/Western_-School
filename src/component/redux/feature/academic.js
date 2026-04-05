import { indexSlice } from "./indexslice";

export const academicApi = indexSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEvent: builder.query({
      query: () => ({
        url:"/api/academic/event",
        method: "GET",
      }),

      providesTags: ["academic"],
    }),

    createEvent: builder.mutation({
      query: (data) => ({
        url:"/api/academic/event",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["academic"],
    }),

    updateEvent: builder.mutation({
      query: ({ id, data }) => ({
        url:`/api/academic/event/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["academic"],
    }),

    deleteEvent: builder.mutation({
      query: (id) => ({
        url:`/api/academic/event/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["academic"],
    }),
    getachievement: builder.query({
      query: () => ({
        url:"/api/academic/achievement",
        method: "GET",
      }),

      providesTags: ["academic"],
    }),

    createachievement: builder.mutation({
      query: (data) => ({
        url:"/api/academic/achievement",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["academic"],
    }),

    updateachievement: builder.mutation({
      query: ({ id, data }) => ({
        url:`/api/academic/achievement/${id}`,
        method:"PUT",
        body:data,
      }),
      invalidatesTags: ["academic"],
    }),

    deleteachievement: builder.mutation({
      query: (id) => ({
        url:`/api/academic/achievement/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["academic"],
    }),

    getquestion_bank: builder.query({
      query: () => ({
        url:"/api/academic/question-bank",
        method: "GET",
      }),

      providesTags: ["academic"],
    }),

    createquestion_bank: builder.mutation({
      query: (data) => ({
        url:"/api/academic/question-bank",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["academic"],
    }),

    updatequestion_bank: builder.mutation({
      query: ({ id, data }) => ({
        url:`/api/academic/question-bank/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["academic"],
    }),

    deletequestion_bank: builder.mutation({
      query: (id) => ({
        url:`/api/academic/question-bank/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["academic"],
    }),
  }),
});

export const {
  useCreateEventMutation,
  useGetEventQuery,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useCreateachievementMutation,
  useGetachievementQuery,
  useDeleteachievementMutation,
  useUpdateachievementMutation,
  useCreatequestion_bankMutation,
  useDeletequestion_bankMutation,
  useGetquestion_bankQuery,
  useUpdatequestion_bankMutation,
} = academicApi;
