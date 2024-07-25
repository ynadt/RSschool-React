import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

const TestComponent: React.FC = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <span>{theme}</span>
      <button onClick={() => setTheme('dark')}>Set Dark Theme</button>
      <button onClick={() => setTheme('light')}>Set Light Theme</button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('initializes theme from localStorage', () => {
    localStorage.setItem('theme', 'dark');
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );
    expect(screen.getByText('dark')).toBeInTheDocument();
  });

  it('defaults to light theme if no theme is in localStorage', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );
    expect(screen.getByText('light')).toBeInTheDocument();
  });

  it('updates theme and saves to localStorage', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByText('Set Dark Theme'));
    expect(screen.getByText('dark')).toBeInTheDocument();
    expect(localStorage.getItem('theme')).toBe('dark');

    fireEvent.click(screen.getByText('Set Light Theme'));
    expect(screen.getByText('light')).toBeInTheDocument();
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('throws an error if useTheme is used outside of ThemeProvider', () => {
    const consoleError = console.error;
    console.error = vi.fn(); // Suppress the error boundary warning in the test output

    expect(() => render(<TestComponent />)).toThrow('useTheme must be used within a ThemeProvider');

    console.error = consoleError; // Restore console error
  });

  it('provides correct context within ThemeProvider', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByText('light')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Set Dark Theme'));
    expect(screen.getByText('dark')).toBeInTheDocument();
  });
});
