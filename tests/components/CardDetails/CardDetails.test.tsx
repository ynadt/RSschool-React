import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

import store from '@/redux/store';
import CardDetails from '@components/CardDetails/CardDetails.tsx';

const mockApiResponse = {
  data: {
    mal_id: 36699,
    title: 'Kimitachi wa Dou Ikiru ka',
    synopsis: 'three years into the war',
    rating: 'PG-13 - Teens 13 or older',
    score: 7.61,
    type: 'Movie',
    aired: { string: 'Jul 14, 2023 to Sep 21, 2023' },
    images: {
      jpg: {
        image_url: 'https://cdn.myanimelist.net/images/anime/1664/104082.jpg',
      },
    },
    genres: [{ name: 'Adventure' }, { name: 'Drama' }],
    url: 'https://myanimelist.net/anime/36699/Kimitachi_wa_Dou_Ikiru_ka',
  },
};

const server = setupServer(
  http.get('https://api.jikan.moe/v4/anime/:id', () => {
    return HttpResponse.json(mockApiResponse);
  }),
);

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => {
  server.resetHandlers();
  vi.resetAllMocks();
});
afterAll(() => server.close());

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>,
  );
};

describe('CardDetails component', () => {
  const mockId = '36699';

  test('displays a loading indicator while fetching data', async () => {
    renderWithProviders(<CardDetails id={mockId} onClose={() => {}} />);
    expect(screen.getByLabelText(/vortex-loading/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByLabelText(/vortex-loading/i)).not.toBeInTheDocument());
  });

  test('correctly displays the detailed card data', async () => {
    renderWithProviders(<CardDetails id={mockId} onClose={() => {}} />);

    expect(await screen.findByText('Kimitachi wa Dou Ikiru ka')).toBeInTheDocument();
    expect(await screen.findByText('three years into the war')).toBeInTheDocument();
    expect(await screen.findByText('PG-13 - Teens 13 or older')).toBeInTheDocument();
    expect(
      await screen.findByText((content, element) => {
        return element?.tagName.toLowerCase() === 'p' && /7.61/.test(content);
      }),
    ).toBeInTheDocument();
    expect(await screen.findByText('Movie')).toBeInTheDocument();
    expect(await screen.findByText('Jul 14, 2023 to Sep 21, 2023')).toBeInTheDocument();
    expect(
      await screen.findByText((content, element) => {
        return element?.tagName.toLowerCase() === 'p' && /Adventure/.test(content);
      }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText((content, element) => {
        return element?.tagName.toLowerCase() === 'p' && /Drama/.test(content);
      }),
    ).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: /check it out on MyAnimeList/i })).toBeInTheDocument();
  });
});
