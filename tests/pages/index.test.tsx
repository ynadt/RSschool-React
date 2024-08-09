// import { fireEvent, render, screen, waitFor } from '@testing-library/react';
// import { http, HttpResponse } from 'msw';
// import { setupServer } from 'msw/node';
// import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
// import React from 'react';
// import { Provider } from 'react-redux';
// import { describe, expect, it, vi } from 'vitest';
//
// import Home from '../../app/page.tsx';
// import { createMockRouter } from '../mocks/nextRouterMock';
// import { ThemeProvider } from '@/context/ThemeContext';
// import { makeStore } from '@/redux/store';
//
// const mockAnimeListResponse = {
//   data: [
//     {
//       mal_id: 1,
//       title: 'Naruto',
//       synopsis: 'A story about a ninja.',
//       images: {
//         webp: { large_image_url: 'https://example.com/naruto.webp' },
//       },
//     },
//   ],
//   pagination: { items: { total: 1 } },
// };
//
// const mockAnimeDetailResponse = {
//   data: {
//     mal_id: 1,
//     title: 'Naruto',
//     synopsis: 'A story about a ninja.',
//     images: {
//       webp: { large_image_url: 'https://example.com/naruto.webp' },
//     },
//     genres: [{ name: 'Action' }, { name: 'Adventure' }],
//     rating: 'PG-13',
//     aired: { string: '2002 to 2007' },
//     type: 'TV',
//     episodes: 220,
//     score: 7.81,
//     scored_by: 12345,
//     url: 'https://myanimelist.net/anime/1/Naruto',
//   },
// };
//
// const server = setupServer(
//   http.get('https://api.jikan.moe/v4/anime', () => {
//     return HttpResponse.json(mockAnimeListResponse);
//   }),
//   http.get('https://api.jikan.moe/v4/anime/:id', () => {
//     return HttpResponse.json(mockAnimeDetailResponse);
//   }),
// );
//
// beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
// afterEach(() => {
//   server.resetHandlers();
//   vi.resetAllMocks();
// });
// afterAll(() => server.close());
//
// const renderWithProviders = (ui: React.ReactElement, { router } = { router: createMockRouter({}) }) => {
//   const store = makeStore();
//
//   return render(
//     <Provider store={store}>
//       <RouterContext.Provider value={router}>
//         <ThemeProvider>{ui}</ThemeProvider>
//       </RouterContext.Provider>
//     </Provider>,
//   );
// };
//
// describe('App', () => {
//   it('renders search component', () => {
//     renderWithProviders(<Home />);
//     expect(screen.getByPlaceholderText('Search for anime')).toBeInTheDocument();
//   });
//
//   it('handles search term input', async () => {
//     renderWithProviders(<Home />);
//     const input = screen.getByPlaceholderText('Search for anime');
//     fireEvent.change(input, { target: { value: 'Naruto' } });
//     fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
//
//     await waitFor(() => expect(screen.getByText('Naruto')).toBeInTheDocument());
//   });
//
//   it('handles pagination', async () => {
//     renderWithProviders(<Home />);
//     const input = screen.getByPlaceholderText('Search for anime');
//     fireEvent.change(input, { target: { value: 'Naruto' } });
//     fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
//
//     await waitFor(() => expect(screen.getByText('Naruto')).toBeInTheDocument());
//
//     const nextPageButton = screen.getByRole('button', { name: /next/i });
//     fireEvent.click(nextPageButton);
//
//     await waitFor(() => expect(screen.getByText('Naruto')).toBeInTheDocument());
//   });
//
//   it('handles details view', async () => {
//     const router = createMockRouter({ query: { details: '1' } });
//     renderWithProviders(<Home />, { router });
//
//     const input = screen.getByPlaceholderText('Search for anime');
//     fireEvent.change(input, { target: { value: 'Naruto' } });
//     fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
//
//     await waitFor(() => expect(screen.getByText('Naruto')).toBeInTheDocument());
//
//     const card = screen.getByText('Naruto');
//     fireEvent.click(card);
//
//     await waitFor(() => {
//       const details = screen.getAllByText('A story about a ninja.');
//       expect(details.length).toBeGreaterThan(0);
//     });
//   });
//
//   it('handles theme change', () => {
//     const { container } = renderWithProviders(<Home />);
//     expect(container.firstChild).toHaveClass('light');
//   });
//
//   it('handles API error', async () => {
//     server.use(
//       http.get('https://api.jikan.moe/v4/anime', () => {
//         return new HttpResponse('Internal Server Error', {
//           status: 500,
//         });
//       }),
//     );
//
//     renderWithProviders(<Home />);
//     const input = screen.getByPlaceholderText('Search for anime');
//     fireEvent.change(input, { target: { value: 'Naruto' } });
//     fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
//
//     await waitFor(() => expect(screen.getByText(/error/i)).toBeInTheDocument());
//   });
// });
