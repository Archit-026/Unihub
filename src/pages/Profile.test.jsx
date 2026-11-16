
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Profile from './Profile';

const mocks = vi.hoisted(() => ({
  onAuthStateChanged: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  doc: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  onSnapshot: vi.fn(),
  serverTimestamp: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: mocks.onAuthStateChanged,
}));

vi.mock('firebase/firestore', () => ({
  doc: mocks.doc,
  getDoc: mocks.getDoc,
  setDoc: mocks.setDoc,
  serverTimestamp: mocks.serverTimestamp,
  collection: mocks.collection,
  onSnapshot: mocks.onSnapshot,
  query: mocks.query,
  where: mocks.where,
}));

vi.mock('../firebase', () => ({
  auth: {},
  db: {},
}));

describe('Profile Page', () => {
  const collegeUser = {
    uid: 'student123',
    email: 'student@mitsgwl.ac.in',
    emailVerified: true,
    displayName: 'Priya Sharma',
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mocks.doc.mockReturnValue({});
    mocks.collection.mockReturnValue({});
    mocks.query.mockReturnValue({});
    mocks.where.mockReturnValue({});
    mocks.serverTimestamp.mockReturnValue('mock-timestamp');

    mocks.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        name: 'Priya Sharma',
        branch: 'CSE',
        year: 'Second Year',
        bio: 'I enjoy programming.',
        skills: ['Python', 'React'],
        socialLinks: ['https://example.com'],
      }),
    });

    mocks.onSnapshot.mockImplementation((ref, callback) => {
      callback({ docs: [] });
      return vi.fn();
    });

    mocks.onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(collegeUser);
      return vi.fn();
    });
  });

  it('shows the loading state initially', () => {
    mocks.onAuthStateChanged.mockImplementation(() => vi.fn());

    render(<Profile />);

    expect(screen.getByText('Loading profile...')).toBeInTheDocument();
  });

  it('shows the login message when no user is signed in', async () => {
    mocks.onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
      return vi.fn();
    });

    render(<Profile />);

    expect(
      await screen.findByText('Please log in to view and edit your profile.')
    ).toBeInTheDocument();
  });

  it('loads and displays a verified college user profile', async () => {
    render(<Profile />);

    expect(await screen.findByText('Priya Sharma')).toBeInTheDocument();
    expect(screen.getByText('student@mitsgwl.ac.in')).toBeInTheDocument();
    expect(screen.getByText('CSE - Second Year')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('displays the profile editor and other sections', async () => {
    render(<Profile />);

    expect(await screen.findByText('Edit Profile')).toBeInTheDocument();
    expect(screen.getByText('Achievements')).toBeInTheDocument();
    expect(screen.getByText('Bookmarks')).toBeInTheDocument();
    expect(screen.getByText('My Listings')).toBeInTheDocument();
  });

  it('shows the empty listings message when no listings exist', async () => {
    render(<Profile />);

    expect(
      await screen.findByText('You have no marketplace listings yet.')
    ).toBeInTheDocument();
  });

  it('saves updated profile information', async () => {
    render(<Profile />);

    const nameInput = await screen.findByDisplayValue('Priya Sharma');

    fireEvent.change(nameInput, {
      target: { value: 'Priya Jain' },
    });

    fireEvent.click(screen.getByRole('button', { name: /save profile/i }));

    await waitFor(() => {
      expect(mocks.setDoc).toHaveBeenCalled();
    });

    expect(
      await screen.findByText('Profile saved successfully!')
    ).toBeInTheDocument();
  });

  it('shows an error when profile saving fails', async () => {
    mocks.setDoc.mockRejectedValue(new Error('Save failed'));
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<Profile />);

    await screen.findByText('Edit Profile');

    fireEvent.click(screen.getByRole('button', { name: /save profile/i }));

    expect(
      await screen.findByText(/Unable to save profile/i)
    ).toBeInTheDocument();
  });
});
