import '@testing-library/jest-dom';

import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { Provider } from 'react-redux';

import store from '@/redux/store';

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver;

const customRender = (ui: ReactElement, options?: RenderOptions) =>
  rtlRender(ui, {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    ...options,
  });

export * from '@testing-library/react';
export { customRender };
