import { describe, it, beforeAll } from 'vitest';
import { JSDOM } from 'jsdom';

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

import '../src/main';

describe('Main Application', () => {
  it('renders without crashing', () => {
    expect(document.getElementById('root')).toBeTruthy();
  });
});
