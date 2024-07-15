import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.jikan.moe/v4' }),
  endpoints: (builder) => ({
    getItems: builder.query<
      { data: { mal_id: number; title: string; synopsis: string }[]; pagination: { items: { total: number } } },
      { term: string; page: number }
    >({
      query: ({ term, page }) => `anime?q=${term}&page=${page}`,
    }),
  }),
});

export const { useGetItemsQuery } = apiSlice;
