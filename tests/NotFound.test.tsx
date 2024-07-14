import { render, screen } from '@testing-library/react';
import NotFound from '../src/components/NotFound';

describe('NotFound component', () => {
  test('renders the 404 heading', () => {
    render(<NotFound />);
    const headingElement = screen.getByText(/404 - page not found/i);
    expect(headingElement).toBeInTheDocument();
  });

  test('renders the not found message', () => {
    render(<NotFound />);
    const messageElement = screen.getByText(/the page you are looking for does not exist/i);
    expect(messageElement).toBeInTheDocument();
  });
});
