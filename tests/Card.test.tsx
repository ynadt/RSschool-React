import { customRender as render, screen } from './setupTests';
import Card from '../src/components/Card';
import { userEvent } from '@testing-library/user-event';
import styles from '../src/components/Card.module.css';

describe('Card component', () => {
  const mockCardData = { mal_id: 1, title: 'Title 1', synopsis: 'Synopsis 1' };

  test('renders the relevant card data', () => {
    render(<Card {...mockCardData} />);
    expect(screen.getByText(mockCardData.title)).toBeInTheDocument();
    expect(screen.getByText(mockCardData.synopsis)).toBeInTheDocument();
  });

  test('clicking on a card opens a detailed card component', async () => {
    render(<Card {...mockCardData} />);

    const cardElement = screen.getByText(mockCardData.title).closest(`.${styles.card}`);
    if (cardElement) {
      await userEvent.click(cardElement);
      expect(window.location.search).toBe(`?page=1&details=${mockCardData.mal_id}`);
    } else {
      throw new Error('Card element not found');
    }
  });
});
