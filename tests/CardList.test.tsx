import { customRender as render, screen } from './setupTests';
import CardList from '@components/CardList/CardList.tsx';

describe('CardList component', () => {
  const mockResults = [
    { mal_id: 1, title: 'Title 1', synopsis: 'Synopsis 1' },
    { mal_id: 2, title: 'Title 2', synopsis: 'Synopsis 2' },
    { mal_id: 3, title: 'Title 3', synopsis: 'Synopsis 3' },
  ];

  test('renders the specified number of cards', () => {
    render(<CardList results={mockResults} />);
    const cards = screen.getAllByRole('heading', { level: 3 });
    expect(cards).toHaveLength(mockResults.length);
  });

  test('displays an appropriate message if no cards are present', () => {
    render(<CardList results={[]} />);
    expect(screen.getByText(/oops, nothing is found/i)).toBeInTheDocument();
  });
});
