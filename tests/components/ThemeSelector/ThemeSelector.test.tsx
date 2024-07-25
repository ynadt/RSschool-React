import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ThemeSelector from '@/components/ThemeSelector/ThemeSelector';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

vi.mock('@/context/ThemeContext', async () => {
  const actual = await vi.importActual<{ useTheme: typeof useTheme; ThemeProvider: typeof ThemeProvider }>(
    '@/context/ThemeContext',
  );
  return {
    ...actual,
    useTheme: vi.fn(),
  };
});

const renderWithThemeProvider = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('ThemeSelector component', () => {
  let mockSetTheme: ReturnType<typeof vi.fn>;
  let mockUseTheme: { theme: string; setTheme: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockSetTheme = vi.fn();
    mockUseTheme = {
      theme: 'light',
      setTheme: mockSetTheme,
    };
    (useTheme as jest.Mock).mockReturnValue(mockUseTheme);
  });

  it('renders the theme toggle switch correctly', () => {
    renderWithThemeProvider(<ThemeSelector />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('toggles the theme when the switch is clicked', () => {
    renderWithThemeProvider(<ThemeSelector />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('sets the theme to light when the switch is unchecked', () => {
    mockUseTheme.theme = 'dark';
    renderWithThemeProvider(<ThemeSelector />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });
});
