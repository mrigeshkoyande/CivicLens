import { cn, formatDate, getDaysUntil, truncate, sleep } from '../utils';

describe('utils', () => {
  describe('cn', () => {
    it('merges class names correctly', () => {
      expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
    });

    it('handles conditional class names', () => {
      expect(cn('bg-red-500', false && 'text-white', true && 'p-4')).toBe('bg-red-500 p-4');
    });
  });

  describe('formatDate', () => {
    it('formats string date correctly', () => {
      const dateStr = '2024-05-20T00:00:00.000Z';
      const formatted = formatDate(dateStr);
      expect(formatted).toMatch(/(May 20, 2024|20 May 2024)/i);
    });

    it('formats date object correctly', () => {
      const dateObj = new Date('2024-11-05T00:00:00.000Z');
      const formatted = formatDate(dateObj);
      expect(formatted).toMatch(/(November 5, 2024|5 November 2024)/i);
    });
  });

  describe('getDaysUntil', () => {
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
    });
    
    afterAll(() => {
      jest.useRealTimers();
    });

    it('calculates days until future date', () => {
      expect(getDaysUntil('2024-01-05T00:00:00.000Z')).toBe(4);
    });

    it('returns 0 for past dates', () => {
      expect(getDaysUntil('2023-12-31T00:00:00.000Z')).toBe(0);
    });
  });

  describe('truncate', () => {
    it('truncates long text', () => {
      expect(truncate('hello world', 5)).toBe('hello…');
    });

    it('does not truncate short text', () => {
      expect(truncate('hello', 10)).toBe('hello');
    });
  });

  describe('sleep', () => {
    it('resolves after specified ms', async () => {
      jest.useFakeTimers();
      const promise = sleep(100);
      jest.advanceTimersByTime(100);
      await expect(promise).resolves.toBeUndefined();
      jest.useRealTimers();
    });
  });
});
