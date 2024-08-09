'use client';

import { ThemeProvider } from '@/context/ThemeContext';
import ErrorBoundaryWithTheme from '@components/ErrorBoundary/ErrorBoundary';
import './index.css';
import './themes.css';
import StoreProvider from '@components/StoreProvider/StoreProvider.tsx';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <ThemeProvider>
            <ErrorBoundaryWithTheme>{children}</ErrorBoundaryWithTheme>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
