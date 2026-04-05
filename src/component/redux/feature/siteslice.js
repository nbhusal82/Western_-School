import { indexSlice } from "./indexslice";

export const siteApi = indexSlice.injectEndpoints({
  endpoints: (builder) => ({
    // REVIEWS
    getreview: builder.query({
      query: () => ({
        url: `/api/site/reviews`,
        method: "GET",
      }),
      providesTags: ["site"],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: "/api/site/reviews",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["site"],
    }),
    updateReview: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/site/reviews/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["site"],
    }),
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/api/site/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["site"],
    }),

    // FAQS
    getFaqs: builder.query({
      query: () => ({
        url: "/api/site/faqs",
        method: "GET",
      }),
      providesTags: ["site"],
    }),
    createFaq: builder.mutation({
      query: (data) => ({
        url: "/api/site/faqs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["site"],
    }),
    updateFaq: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/site/faqs/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["site"],
    }),
    deleteFaq: builder.mutation({
      query: (id) => ({
        url: `/api/site/faqs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["site"],
    }),

    // TEAM
    getTeam: builder.query({
      query: () => ({
        url: "/api/team",
        method: "GET",
      }),
      providesTags: ["site"],
    }),
    createTeam: builder.mutation({
      query: (data) => ({
        url: "/api/team",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["site"],
    }),
    updateTeam: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/team/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["site"],
    }),
    deleteTeam: builder.mutation({
      query: (id) => ({
        url: `/api/team/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["site"],
    }),
  }), 
});

export const {
  useGetreviewQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useCreateFaqMutation,
  useGetFaqsQuery,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
  useCreateTeamMutation,
  useGetTeamQuery,
  useDeleteTeamMutation,
  useUpdateTeamMutation,
} = siteApi;
