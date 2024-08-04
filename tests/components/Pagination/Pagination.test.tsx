import { configureStore } from '@reduxjs/toolkit';
import { screen } from '@testing-library/react';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import React from 'react';
import { describe, expect, it } from 'vitest';

import { createMockRouter } from '../../mocks/nextRouterMock';
import { customRender } from '../../setupTests.tsx';
import Pagination from '@/components/Pagination/Pagination';
import currentPageReducer from '@/redux/slices/currentPageSlice';

const mockRouter = createMockRouter({});

const renderWithProviders = (
  ui: React.ReactElement,
  { store } = { store: configureStore({ reducer: { currentPage: currentPageReducer } }) },
) => {
  return customRender(<RouterContext.Provider value={mockRouter}>{ui}</RouterContext.Provider>, { store });
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

  // it('calls handlePageChange with the correct page number when a page button is clicked', () => {
  //   renderWithProviders(<Pagination currentPage={1} totalItems={50} itemsPerPage={10} />);
  //   fireEvent.click(screen.getByText('2'));
  //   expect(mockRouter.push).toHaveBeenCalledWith({ pathname: '/', query: { page: '2' } }, undefined, { shallow: true });
  // });
  //
  // it('calls handlePageChange with the correct page number when the next button is clicked', () => {
  //   renderWithProviders(<Pagination currentPage={1} totalItems={50} itemsPerPage={10} />);
  //   fireEvent.click(screen.getByText('Next'));
  //   expect(mockRouter.push).toHaveBeenCalledWith({ pathname: '/', query: { page: '2' } }, undefined, { shallow: true });
  // });
  //
  // it('calls handlePageChange with the correct page number when the previous button is clicked', () => {
  //   renderWithProviders(<Pagination currentPage={2} totalItems={50} itemsPerPage={10} />);
  //   fireEvent.click(screen.getByText('Previous'));
  //   expect(mockRouter.push).toHaveBeenCalledWith({ pathname: '/', query: { page: '1' } }, undefined, { shallow: true });
  // });

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
