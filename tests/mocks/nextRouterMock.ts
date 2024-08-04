import { NextRouter } from 'next/router';
import { vi } from 'vitest';

export const createMockRouter = (overrides: Partial<NextRouter> = {}): NextRouter => ({
  route: '/',
  pathname: '/',
  query: {},
  asPath: '/',
  basePath: '',
  locale: undefined,
  locales: undefined,
  defaultLocale: undefined,
  domainLocales: undefined,
  isLocaleDomain: false,
  isReady: true,
  push: vi.fn(),
  replace: vi.fn(),
  reload: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
  beforePopState: vi.fn(),
  events: {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
  },
  isFallback: false,
  isPreview: false,
  ...overrides,
});
