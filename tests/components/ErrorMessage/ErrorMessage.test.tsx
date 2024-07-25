import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import { ApiError } from '@/types/types';

describe('ErrorMessage component', () => {
  it('renders nothing when there is no error', () => {
    render(<ErrorMessage error={null} />);
    expect(screen.queryByText(/Error:/)).toBeNull();
  });

  it('displays generic error message for an unknown error', () => {
    const error = { message: 'Unknown error' } as ApiError;
    render(<ErrorMessage error={error} />);
    expect(
      screen.getByText((content) => {
        return content.startsWith('Error:') && content.includes('Unknown error');
      }),
    ).toBeInTheDocument();
  });

  it('displays Bad Request error message for 400 status code', () => {
    const error = { status: 400 } as ApiError;
    render(<ErrorMessage error={error} />);
    expect(screen.getByText('Error: Bad Request')).toBeInTheDocument();
  });

  it('displays Not Found error message for 404 status code', () => {
    const error = { status: 404 } as ApiError;
    render(<ErrorMessage error={error} />);
    expect(screen.getByText('Error: Not Found')).toBeInTheDocument();
  });

  it('displays Too Many Requests error message for 429 status code', () => {
    const error = { status: 429 } as ApiError;
    render(<ErrorMessage error={error} />);
    expect(screen.getByText('Error: Too Many Requests')).toBeInTheDocument();
  });

  it('displays Internal Server Error error message for 500 status code', () => {
    const error = { status: 500 } as ApiError;
    render(<ErrorMessage error={error} />);
    expect(screen.getByText('Error: Internal Server Error')).toBeInTheDocument();
  });

  it('displays Service Unavailable error message for 503 status code', () => {
    const error = { status: 503 } as ApiError;
    render(<ErrorMessage error={error} />);
    expect(screen.getByText('Error: Service Unavailable')).toBeInTheDocument();
  });

  it('displays custom error message if message property exists', () => {
    const error = { message: 'Custom error message' } as ApiError;
    render(<ErrorMessage error={error} />);
    expect(screen.getByText('Error: Custom error message')).toBeInTheDocument();
  });

  it('displays Network error for unhandled status codes', () => {
    const error = { status: 418 } as ApiError;
    render(<ErrorMessage error={error} />);
    expect(screen.getByText('Error: Network error')).toBeInTheDocument();
  });
});
