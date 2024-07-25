import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import useSearchTerm from '@/hooks/useSearchTerm';

describe('useSearchTerm', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('initializes with the correct value', () => {
    const { result } = renderHook(() => useSearchTerm('initial'));

    expect(result.current[0]).toBe('initial');
  });

  it('initializes with the value from localStorage if it exists', () => {
    localStorage.setItem('searchTerm', 'storedValue');
    const { result } = renderHook(() => useSearchTerm('initial'));

    expect(result.current[0]).toBe('storedValue');
  });

  it('updates the value and saves it to localStorage', () => {
    const { result } = renderHook(() => useSearchTerm('initial'));

    act(() => {
      result.current[1]('newValue');
    });

    expect(result.current[0]).toBe('newValue');
    expect(localStorage.getItem('searchTerm')).toBe('newValue');
  });
});
