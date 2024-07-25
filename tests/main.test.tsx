import { JSDOM } from 'jsdom';
import React, { act } from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

beforeAll(() => {
  const dom = new JSDOM('<!DOCTYPE html><html lang="en"><body><div id="root"></div></body></html>');

  (global as unknown as { document: Document }).document = dom.window.document;
  (global as unknown as { window: Window & typeof globalThis }).window = dom.window as unknown as Window &
    typeof globalThis;
  (global as unknown as { navigator: Navigator }).navigator = {
    userAgent: 'node.js',
  } as Navigator;
  (global as unknown as { requestAnimationFrame: (callback: FrameRequestCallback) => number }).requestAnimationFrame = (
    callback: FrameRequestCallback,
  ) => setTimeout(callback, 0);
  (global as unknown as { cancelAnimationFrame: (id: number) => void }).cancelAnimationFrame = (id: number) =>
    clearTimeout(id);
});

const renderMock = vi.fn();
const createRootMock = vi.fn(() => ({
  render: renderMock,
}));

vi.mock('react-dom/client', async () => {
  const original = await vi.importActual<typeof ReactDOMClient>('react-dom/client');
  return {
    ...original,
    createRoot: createRootMock,
  };
});

vi.mock('@/redux/store', () => ({
  default: {
    getState: vi.fn(),
    subscribe: vi.fn(),
    dispatch: vi.fn(),
  },
}));

vi.mock('@/context/ThemeContext', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/ErrorBoundary/ErrorBoundary.tsx', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/AppRoutes', () => ({
  default: () => <div>AppRoutes</div>,
}));

describe('Main Application', () => {
  let consoleErrorMock: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.clearAllMocks();
    vi.resetModules();
  });

  afterEach(() => {
    consoleErrorMock.mockRestore();
  });

  it('renders without crashing', async () => {
    await act(async () => {
      await import('@/main');
    });
    const rootElement = document.getElementById('root');
    expect(rootElement).toBeTruthy();
    expect(createRootMock).toHaveBeenCalledTimes(0);
    expect(renderMock).toHaveBeenCalledTimes(0);
  });

  it('logs an error if the root element is missing', async () => {
    document.body.innerHTML = '';

    await act(async () => {
      await import('@/main');
    });
    expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    expect(consoleErrorMock).toHaveBeenCalledWith('Failed to find the root element');
  });
});
