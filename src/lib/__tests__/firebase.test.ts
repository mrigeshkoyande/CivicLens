import { firebaseReady, BOOTHS_COLLECTION, USERS_COLLECTION } from '../firebase';

describe('firebase', () => {
  it('exports collection names', () => {
    expect(BOOTHS_COLLECTION).toBe('pollingBooths');
    expect(USERS_COLLECTION).toBe('users');
  });

  it('determines firebaseReady based on config', () => {
    // In test environment, the NEXT_PUBLIC_FIREBASE_API_KEY is not set by default,
    // so firebaseReady should be false unless we mock process.env
    expect(firebaseReady).toBe(false);
  });
});
