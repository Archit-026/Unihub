
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  initializeApp: vi.fn(),
  getAuth: vi.fn(),
  getFirestore: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  app: { name: 'mock-firebase-app' },
  auth: { name: 'mock-auth' },
  db: { name: 'mock-firestore' },
}));

vi.mock('firebase/app', () => ({
  initializeApp: mocks.initializeApp,
}));

vi.mock('firebase/auth', () => ({
  getAuth: mocks.getAuth,
  GoogleAuthProvider: mocks.GoogleAuthProvider,
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: mocks.getFirestore,
}));

describe('Firebase initialization', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    mocks.initializeApp.mockReturnValue(mocks.app);
    mocks.getAuth.mockReturnValue(mocks.auth);
    mocks.getFirestore.mockReturnValue(mocks.db);
  });

  it('initializes the Firebase application', async () => {
    await import('./firebase');

    expect(mocks.initializeApp).toHaveBeenCalledTimes(1);
    expect(mocks.initializeApp).toHaveBeenCalledWith(
      expect.objectContaining({
        projectId: 'unihub-bc6a9',
        authDomain: 'unihub-bc6a9.firebaseapp.com',
      })
    );
  });

  it('initializes Firebase Authentication', async () => {
    await import('./firebase');

    expect(mocks.getAuth).toHaveBeenCalledWith(mocks.app);
  });

  it('initializes Cloud Firestore', async () => {
    await import('./firebase');

    expect(mocks.getFirestore).toHaveBeenCalledWith(mocks.app);
  });

  it('creates a Google Authentication provider', async () => {
    await import('./firebase');

    expect(mocks.GoogleAuthProvider).toHaveBeenCalledTimes(1);
  });

  it('exports the initialized Firebase services', async () => {
    const firebase = await import('./firebase');

    expect(firebase.auth).toBe(mocks.auth);
    expect(firebase.db).toBe(mocks.db);
    expect(firebase.googleProvider).toBeInstanceOf(mocks.GoogleAuthProvider);
  });
});
