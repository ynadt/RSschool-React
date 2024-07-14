import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

const customRender = (ui: ReactElement, options?: RenderOptions) =>
  rtlRender(ui, { wrapper: BrowserRouter, ...options });

export * from '@testing-library/react';
export { customRender };
