import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { apiSlice, useGetAnimeListQuery, useGetAnimeDetailsQuery } from '@/redux/services/apiSlice';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import React from 'react';
import { cleanup, renderHook, waitFor } from '@testing-library/react';

const mockAnimeListResponse = {
  data: [{ id: 1, title: 'Naruto' }],
  pagination: { items: { total: 1 } },
};

const mockAnimeDetailsResponse = {
  data: { id: 1, title: 'Naruto' },
};

const server = setupServer(
  http.get('https://api.jikan.moe/v4/anime', ({ request }) => {
    const url = new URL(request.url);
    const term = url.searchParams.get('q');
    const page = url.searchParams.get('page');

    if (term === 'Naruto' && page === '1') {
      return HttpResponse.json(mockAnimeListResponse);
    }

    return new HttpResponse(JSON.stringify({ message: 'Not Found' }), { status: 404 });
  }),
  http.get('https://api.jikan.moe/v4/anime/:id', ({ params }) => {
    const { id } = params;
    if (id === '1') {
      return HttpResponse.json(mockAnimeDetailsResponse);
    }

    return new HttpResponse(JSON.stringify({ message: 'Not Found' }), { status: 404 });
  }),
);

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => server.close());

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const store = configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  });
  return <Provider store={store}>{children}</Provider>;
};

describe('apiSlice', () => {
  it('fetches anime list successfully', async () => {
    const { result } = renderHook(() => useGetAnimeListQuery({ term: 'Naruto', page: 1 }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockAnimeListResponse);
  });

  it('handles not found error for anime list', async () => {
    const { result } = renderHook(() => useGetAnimeListQuery({ term: 'Unknown', page: 1 }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('fetches anime details successfully', async () => {
    const { result } = renderHook(() => useGetAnimeDetailsQuery('1'), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockAnimeDetailsResponse);
  });

  it('handles not found error for anime details', async () => {
    const { result } = renderHook(() => useGetAnimeDetailsQuery('999'), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
