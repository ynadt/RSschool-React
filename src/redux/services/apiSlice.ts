import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Anime } from '@/types/types.ts';

export interface GetAnimeListResponse {
  data: Anime[];
  pagination: {
    items: {
      total: number;
    };
  };
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.jikan.moe/v4' }),
  endpoints: (builder) => ({
    getAnimeList: builder.query<GetAnimeListResponse, { term: string; page: number }>({
      query: ({ term, page }) => `anime?q=${encodeURIComponent(term)}&page=${page}`,
    }),
    getAnimeDetails: builder.query<{ data: Anime }, string>({
      query: (id) => `anime/${id}`,
    }),
  }),
});

export const { useGetAnimeListQuery, useGetAnimeDetailsQuery } = apiSlice;
