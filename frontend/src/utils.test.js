import { describe, expect, it } from 'vitest';
import { formatPrice, timeAgo } from './utils.js';

describe('homepage display helpers', () => {
  it('formats Syrian pound prices consistently', () => {
    expect(formatPrice(1250000, 'SYP')).toContain('ل.س');
  });

  it('formats recent listing age without an empty value', () => {
    expect(timeAgo(Date.now() - 86400000)).toContain('يوم');
    expect(timeAgo(null)).toBe('حديثاً');
  });
});
