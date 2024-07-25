import { describe, it, expect } from 'vitest';
import { truncateText } from '@/utils/truncateTextUtils';

describe('truncateText', () => {
  it('should return the original text if it is shorter than the maxLength', () => {
    const text = 'Hello, world!';
    const maxLength = 20;
    const result = truncateText(text, maxLength);
    expect(result).toBe(text);
  });

  it('should truncate the text and add ellipsis if it is longer than the maxLength', () => {
    const text = 'This is a long text that needs to be truncated';
    const maxLength = 10;
    const result = truncateText(text, maxLength);
    expect(result).toBe('This is a ...');
  });

  it('should handle empty text input', () => {
    const text = '';
    const maxLength = 5;
    const result = truncateText(text, maxLength);
    expect(result).toBe('');
  });

  it('should handle maxLength of 0', () => {
    const text = 'This text will be truncated';
    const maxLength = 0;
    const result = truncateText(text, maxLength);
    expect(result).toBe('...');
  });

  it('should handle text exactly equal to maxLength', () => {
    const text = 'Exactly ten';
    const maxLength = 10;
    const result = truncateText(text, maxLength);
    expect(result).toBe('Exactly te...');
  });
});
