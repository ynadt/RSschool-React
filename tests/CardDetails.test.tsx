import { render, screen, waitFor } from '@testing-library/react';
import CardDetails from '@components/CardDetails/CardDetails.tsx';
import { vi } from 'vitest';

// Mock data for the API response
const mockApiResponse = {
  data: {
    title: 'Kimitachi wa Dou Ikiru ka',
    synopsis: 'three years into the war',
    rating: 'PG-13 - Teens 13 or older',
    score: 7.61,
    type: 'Movie',
    premiered: 'Jul 14, 2023',
    genres: [{ name: 'Adventure' }, { name: 'Drama' }],
    aired: { string: 'Jul 14, 2023 to Sep 21, 2023' },
    images: {
      jpg: {
        image_url: 'https://cdn.myanimelist.net/images/anime/1664/104082.jpg',
      },
    },
    trailer: {
      embed_url: 'https://www.youtube.com/embed/sample_trailer',
    },
  },
};

// Mock fetch function
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(mockApiResponse),
  } as Response),
);

describe('CardDetails component', () => {
  const mockId = '36699';

  test('displays a loading indicator while fetching data', async () => {
    render(<CardDetails id={mockId} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
  });

  test('correctly displays the detailed card data', async () => {
    render(<CardDetails id={mockId} />);
    await waitFor(() => {
      expect(screen.getByText(/Kimitachi wa Dou Ikiru ka/i)).toBeInTheDocument();
      expect(screen.getByText(/three years into the war/i)).toBeInTheDocument();
      expect(screen.getByText(/PG-13 - Teens 13 or older/i)).toBeInTheDocument();
      expect(screen.getByText(/7.61/i)).toBeInTheDocument();
      expect(screen.getByText(/Movie/i)).toBeInTheDocument();
      expect(screen.getByText(/Jul 14, 2023/i)).toBeInTheDocument();
      expect(screen.getByText(/Adventure/i)).toBeInTheDocument();
      expect(screen.getByText(/Drama/i)).toBeInTheDocument();
      expect(screen.getByText(/Jul 14, 2023 to Sep 21, 2023/i)).toBeInTheDocument();
      expect(screen.getByTitle(/YouTube video player/i)).toBeInTheDocument();
    });
  });
});
