import { logAnalyticsEvent } from '../bigquery';

describe('bigquery analytics', () => {
  it('logs event without throwing', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    await expect(logAnalyticsEvent({ eventName: 'test', timestamp: new Date().toISOString() })).resolves.toBeUndefined();
    consoleSpy.mockRestore();
  });
});
