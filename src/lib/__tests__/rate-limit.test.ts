import { rateLimit, getClientIp } from '../rate-limit';

jest.mock('@upstash/redis', () => ({
  Redis: { fromEnv: jest.fn() }
}));

jest.mock('@upstash/ratelimit', () => ({
  Ratelimit: jest.fn().mockImplementation(() => ({
    limit: jest.fn()
  }))
}));


describe('rate-limit', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('allows requests within limit', async () => {
    const id = 'test-ip';
    const result1 = await rateLimit(id, { limit: 2, windowMs: 1000 });
    expect(result1.success).toBe(true);
    expect(result1.remaining).toBe(1);

    const result2 = await rateLimit(id, { limit: 2, windowMs: 1000 });
    expect(result2.success).toBe(true);
    expect(result2.remaining).toBe(0);
  });

  it('blocks requests over limit', async () => {
    const id = 'test-ip-2';
    await rateLimit(id, { limit: 1, windowMs: 1000 });
    const result = await rateLimit(id, { limit: 1, windowMs: 1000 });
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('resets after window expires', async () => {
    const id = 'test-ip-3';
    await rateLimit(id, { limit: 1, windowMs: 1000 });
    
    let result = await rateLimit(id, { limit: 1, windowMs: 1000 });
    expect(result.success).toBe(false);

    jest.advanceTimersByTime(1001);

    result = await rateLimit(id, { limit: 1, windowMs: 1000 });
    expect(result.success).toBe(true);
  });

  describe('getClientIp', () => {
    it('gets ip from x-forwarded-for', () => {
      const req = {
        headers: new Map([['x-forwarded-for', '192.168.1.1, 10.0.0.1']])
      } as unknown as Request;
      expect(getClientIp(req)).toBe('192.168.1.1');
    });

    it('gets ip from x-real-ip if x-forwarded-for is absent', () => {
      const req = {
        headers: new Map([['x-real-ip', '10.0.0.1']])
      } as unknown as Request;
      expect(getClientIp(req)).toBe('10.0.0.1');
    });

    it('returns unknown if headers absent', () => {
      const req = { headers: new Map() } as unknown as Request;
      expect(getClientIp(req)).toBe('unknown');
    });
  });
});
