import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  credentials: "include",
});
export const indexSlice = createApi({
  baseQuery,
  tagTypes: ["auth", "site", "academic", "category"],
  endpoints: () => ({}),
});
