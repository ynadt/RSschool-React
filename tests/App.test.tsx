import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../src/App';
import { vi } from 'vitest';

const mockFetch = (
  response: {
    data: Array<{ mal_id: number; title: string; synopsis: string }>;
    pagination: { items: { total: number } };
  },
  reject: boolean = false,
) => {
  global.fetch = vi.fn(() =>
    reject
      ? Promise.reject(new Error('Fetch error'))
      : Promise.resolve({
          json: () => Promise.resolve(response),
        } as Response),
  );
};

const setup = async (initialLocalStorageTerm: string | null = null) => {
  if (initialLocalStorageTerm !== null) {
    localStorage.setItem('searchTerm', initialLocalStorageTerm);
  } else {
    localStorage.removeItem('searchTerm');
  }

  await act(async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );
  });
};

describe('App component', () => {
  let originalConsoleError: (...data: unknown[]) => void;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
    console.error = originalConsoleError;
  });

  test('renders search input and buttons', async () => {
    await setup();

    const searchInput = screen.getByRole('textbox');
    const searchButton = screen.getByText(/search/i);
    const throwErrorButton = screen.getByText(/throw error/i);

    expect(searchInput).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
    expect(throwErrorButton).toBeInTheDocument();
  });

  test('saves and retrieves search term from local storage', async () => {
    const testTerm = 'test term';
    await setup(testTerm);

    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toHaveValue(testTerm);
  });

  test('displays error message when fetch fails', async () => {
    mockFetch({ data: [], pagination: { items: { total: 0 } } }, true);

    await setup();

    const searchInput = screen.getByRole('textbox');
    const searchButton = screen.getByText(/search/i);

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'test' } });
      fireEvent.click(searchButton);
    });

    await waitFor(() => expect(screen.getByText(/error: fetch error/i)).toBeInTheDocument());
  });

  test('handles successful fetch and displays results', async () => {
    const mockData = {
      data: [
        { mal_id: 1, title: 'Title 1', synopsis: 'Synopsis 1' },
        { mal_id: 2, title: 'Title 2', synopsis: 'Synopsis 2' },
      ],
      pagination: { items: { total: 2 } },
    };
    mockFetch(mockData);

    await setup();

    const searchInput = screen.getByRole('textbox');
    const searchButton = screen.getByText(/search/i);

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'test' } });
      fireEvent.click(searchButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Title 1')).toBeInTheDocument();
      expect(screen.getByText('Title 2')).toBeInTheDocument();
    });
  });
});
