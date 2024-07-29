import '@testing-library/jest-dom';

import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';

import makeStore, { AppStore } from '@/redux/store';

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver;

interface CustomRenderOptions extends Omit<RenderOptions, 'queries'> {
  store?: AppStore;
}

const customRender = (ui: ReactElement, { store = makeStore(), ...renderOptions }: CustomRenderOptions = {}) => {
  const Wrapper = ({ children }: { children: ReactNode }) => <Provider store={store}>{children}</Provider>;

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};

export * from '@testing-library/react';
export { customRender };
