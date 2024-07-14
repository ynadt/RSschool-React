import { render, screen, fireEvent } from '@testing-library/react';
import Search from '../src/components/Search';
import { vi } from 'vitest';

describe('Search component', () => {
  const mockOnSearch = vi.fn();
  const mockThrowError = vi.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
    mockThrowError.mockClear();
  });

  test('renders input and buttons', () => {
    render(<Search onSearch={mockOnSearch} initialTerm="" throwError={mockThrowError} />);

    const input = screen.getByRole('textbox');
    const searchButton = screen.getByText(/search/i);
    const throwErrorButton = screen.getByText(/throw error/i);

    expect(input).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
    expect(throwErrorButton).toBeInTheDocument();
  });

  test('calls onSearch with the correct term when search button is clicked', () => {
    render(<Search onSearch={mockOnSearch} initialTerm="" throwError={mockThrowError} />);

    const input = screen.getByRole('textbox');
    const searchButton = screen.getByText(/search/i);

    fireEvent.change(input, { target: { value: 'test term' } });
    fireEvent.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith('test term');
  });

  test('calls onSearch with the correct term when enter key is pressed', () => {
    render(<Search onSearch={mockOnSearch} initialTerm="" throwError={mockThrowError} />);

    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'test term' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(mockOnSearch).toHaveBeenCalledWith('test term');
  });

  test('calls throwError when throw error button is clicked', () => {
    render(<Search onSearch={mockOnSearch} initialTerm="" throwError={mockThrowError} />);

    const throwErrorButton = screen.getByText(/throw error/i);
    fireEvent.click(throwErrorButton);

    expect(mockThrowError).toHaveBeenCalled();
  });

  test('displays initial search term correctly', () => {
    render(<Search onSearch={mockOnSearch} initialTerm="initial term" throwError={mockThrowError} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('initial term');
  });
});
