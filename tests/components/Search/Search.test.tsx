import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import Search from '@/components/Search/Search';
import { ThemeProvider } from '@/context/ThemeContext';

describe('Search component', () => {
  const renderWithThemeProvider = (ui: React.ReactElement) => {
    return render(<ThemeProvider>{ui}</ThemeProvider>);
  };

  it('renders input and buttons correctly', () => {
    renderWithThemeProvider(<Search onSearch={vi.fn()} initialTerm="" throwError={vi.fn()} />);
    expect(screen.getByPlaceholderText('Search for anime')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Throw Error')).toBeInTheDocument();
  });

  it('initializes with the initial term', () => {
    renderWithThemeProvider(<Search onSearch={vi.fn()} initialTerm="initial term" throwError={vi.fn()} />);
    expect(screen.getByDisplayValue('initial term')).toBeInTheDocument();
  });

  it('updates the input value when typing', () => {
    renderWithThemeProvider(<Search onSearch={vi.fn()} initialTerm="" throwError={vi.fn()} />);
    const input = screen.getByPlaceholderText('Search for anime');
    fireEvent.change(input, { target: { value: 'new term' } });
    expect(screen.getByDisplayValue('new term')).toBeInTheDocument();
  });

  it('calls onSearch with trimmed input value when clicking the search button', () => {
    const onSearchMock = vi.fn();
    renderWithThemeProvider(<Search onSearch={onSearchMock} initialTerm="" throwError={vi.fn()} />);
    const input = screen.getByPlaceholderText('Search for anime');
    fireEvent.change(input, { target: { value: '  new term  ' } });
    fireEvent.click(screen.getByText('Search'));
    expect(onSearchMock).toHaveBeenCalledWith('new term');
  });

  it('calls onSearch with trimmed input value when pressing Enter', () => {
    const onSearchMock = vi.fn();
    renderWithThemeProvider(<Search onSearch={onSearchMock} initialTerm="" throwError={vi.fn()} />);
    const input = screen.getByPlaceholderText('Search for anime');
    fireEvent.change(input, { target: { value: '  new term  ' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    expect(onSearchMock).toHaveBeenCalledWith('new term');
  });

  it('calls throwError when clicking the throw error button', () => {
    const throwErrorMock = vi.fn();
    renderWithThemeProvider(<Search onSearch={vi.fn()} initialTerm="" throwError={throwErrorMock} />);
    fireEvent.click(screen.getByText('Throw Error'));
    expect(throwErrorMock).toHaveBeenCalled();
  });
});
