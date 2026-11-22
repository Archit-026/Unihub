
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getFirestore: vi.fn(),
  app: { name: 'mock-firebase-app' },
  db: { name: 'mock-firestore' },
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: mocks.getFirestore,
}));

vi.mock('./firebase', () => ({
  app: mocks.app,
}));

describe('Firestore initialization', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    mocks.getFirestore.mockReturnValue(mocks.db);
  });

  it('initializes Cloud Firestore with the Firebase app', async () => {
    await import('./firestore');

    expect(mocks.getFirestore).toHaveBeenCalledTimes(1);
    expect(mocks.getFirestore).toHaveBeenCalledWith(mocks.app);
  });

  it('exports the initialized Firestore database', async () => {
    const firestore = await import('./firestore');

    expect(firestore.db).toBe(mocks.db);
  });
});
