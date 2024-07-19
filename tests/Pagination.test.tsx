import { render, screen } from '@testing-library/react';
import Pagination from '@components/Pagination/Pagination.tsx';
import { userEvent } from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

describe('Pagination component', () => {
  const setup = (currentPage = 1, totalItems = 100, itemsPerPage = 25) => {
    const history = createMemoryHistory();
    render(
      <Router location={history.location} navigator={history}>
        <Pagination currentPage={currentPage} totalItems={totalItems} itemsPerPage={itemsPerPage} />
      </Router>,
    );
    return { history };
  };

  test('updates URL query parameter when page changes', async () => {
    const { history } = setup(1);

    const nextButton = screen.getByText(/next/i);
    await userEvent.click(nextButton);

    expect(history.location.search).toBe('?page=2');
  });
});
