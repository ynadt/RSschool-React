import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Loader from '@/components/Loader/Loader';

vi.mock('react-loader-spinner', () => ({
  Vortex: vi.fn(() => <div data-testid="vortex-spinner" />),
}));

vi.mock('@/components/ErrorMessage/ErrorMessage', () => ({
  __esModule: true,
  default: vi.fn(() => <div>Error component</div>),
}));

describe('Loader component', () => {
  it('renders the Vortex spinner when isLoading is true', () => {
    render(<Loader isLoading={true} error={null} />);

    expect(screen.getByTestId('vortex-spinner')).toBeInTheDocument();
  });

  it('renders the ErrorMessage component when there is an error', () => {
    const error = { status: 500, message: 'Internal Server Error' };
    render(<Loader isLoading={false} error={error} />);

    expect(screen.getByText('Error component')).toBeInTheDocument();
  });

  it('renders null when isLoading is false and there is no error', () => {
    const { container } = render(<Loader isLoading={false} error={null} />);

    expect(container.firstChild).toBeNull();
  });

  it('does not render the Vortex spinner when isLoading is false', () => {
    render(<Loader isLoading={false} error={null} />);

    expect(screen.queryByTestId('vortex-spinner')).toBeNull();
  });

  it('does not render the ErrorMessage component when there is no error', () => {
    render(<Loader isLoading={true} error={null} />);

    expect(screen.queryByText('Error component')).toBeNull();
  });
});
