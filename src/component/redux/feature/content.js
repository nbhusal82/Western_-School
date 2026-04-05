import { indexSlice } from "./indexslice";

export const contentApi = indexSlice.injectEndpoints({
  endpoints: (builder) => ({
    getgallery: builder.query({
      query: () => ({
        url: "/api/content/gallery",
        method: "GET",
      }),

      providesTags: ["content"],
    }),

    creategallery: builder.mutation({
      query: (data) => ({
        url: "/api/content/gallery",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["content"],
    }),

    updategallery: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/content/gallery/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["content"],
    }),

    deletegallery: builder.mutation({
      query: (id) => ({
        url: `/api/content/gallery/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["content"],
    }),
    getNotice: builder.query({
      query: () => ({
        url: "/api/content/notice",
        method: "GET",
      }),

      providesTags: ["content"],
    }),
    createNotice: builder.mutation({
      query: (data) => ({
        url: "/api/content/notice",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["content"],
    }),
    deleteNotice: builder.mutation({
      query: (id) => ({
        url: `/api/content/notice/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["content"],
    }),
    getvacancy: builder.query({
      query: () => ({
        url: "/api/content/vacancy",
        method: "GET",
      }),
     providesTags: ["content"],
    }),
    createvacancy: builder.mutation({
      query: (data) => ({
        url: "/api/content/vacancy",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["content"],
    }),
    deletevacancy: builder.mutation({
      query: (id) => ({
        url: `/api/content/vacancy/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["content"],
    }),
    updatevacancy: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/content/vacancy/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["content"],
    }),
    getblogs: builder.query({
      query: (data) => ({
        url: "/api/content/blog",
        method: "GET",
        body: data,
      }),

     providesTags: ["content"],
    }),
    create_blogs: builder.mutation({
     query: (data) => ({
        url: "/api/content/blog",
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["content"],
    }),
    update_blogs: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/content/blog/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["content"],
    }),
    delete_blogs: builder.mutation({
      query: (id) => ({
        url: `/api/content/blog/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["content"],
    }),
  }),
});
export const {
  useCreategalleryMutation,
  useGetgalleryQuery,
  useUpdategalleryMutation,
  useDeletegalleryMutation,
  useCreateNoticeMutation,
  useDeleteNoticeMutation,
  useGetNoticeQuery,
  useCreatevacancyMutation,
  useGetvacancyQuery,
  useUpdatevacancyMutation,
  useDeletevacancyMutation,
  useCreate_blogsMutation,
  useDelete_blogsMutation,
  useUpdate_blogsMutation,
  useGetblogsQuery,
} = contentApi;
