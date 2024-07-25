import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import Pagination from '@/components/Pagination/Pagination';
import currentPageReducer from '@/redux/slices/currentPageSlice.ts';

const renderWithProviders = (
  ui: React.ReactElement,
  { store } = { store: configureStore({ reducer: { currentPage: currentPageReducer } }) },
) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>,
  );
};

describe('Pagination component', () => {
  it('renders the pagination buttons correctly', () => {
    renderWithProviders(<Pagination currentPage={1} totalItems={50} itemsPerPage={10} />);
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.queryByText('4')).toBeNull();
  });

  it('disables the previous button on the first page', () => {
    renderWithProviders(<Pagination currentPage={1} totalItems={50} itemsPerPage={10} />);
    expect(screen.getByText('Previous')).toBeDisabled();
  });

  it('disables the next button on the last page', () => {
    renderWithProviders(<Pagination currentPage={5} totalItems={50} itemsPerPage={10} />);
    expect(screen.getByText('Next')).toBeDisabled();
  });

  it('calls handlePageChange with the correct page number when a page button is clicked', () => {
    renderWithProviders(<Pagination currentPage={1} totalItems={50} itemsPerPage={10} />);
    fireEvent.click(screen.getByText('2'));
    expect(screen.getByText('2')).toHaveClass('_pageNumber_4a2aa2');
  });

  it('calls handlePageChange with the correct page number when the next button is clicked', () => {
    renderWithProviders(<Pagination currentPage={1} totalItems={50} itemsPerPage={10} />);
    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByText('2')).toHaveClass('_pageNumber_4a2aa2');
  });

  it('calls handlePageChange with the correct page number when the previous button is clicked', () => {
    renderWithProviders(<Pagination currentPage={2} totalItems={50} itemsPerPage={10} />);
    fireEvent.click(screen.getByText('Previous'));
    expect(screen.getByText('1')).toHaveClass('_pageNumber_4a2aa2');
  });

  it('renders ellipsis when there are more than 5 pages', () => {
    renderWithProviders(<Pagination currentPage={1} totalItems={100} itemsPerPage={10} />);
    expect(screen.getAllByText('...')).toHaveLength(1);
  });

  it('renders page numbers correctly with ellipsis for more than 5 pages', () => {
    renderWithProviders(<Pagination currentPage={4} totalItems={100} itemsPerPage={10} />);
    expect(screen.queryByText('1')).toBeNull();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getAllByText('...')).toHaveLength(2);
  });
});
