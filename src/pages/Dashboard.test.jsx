
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from './Dashboard';

const mocks = vi.hoisted(() => ({
  onAuthStateChanged: vi.fn(),
  collection: vi.fn(),
  onSnapshot: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: mocks.onAuthStateChanged,
}));

vi.mock('firebase/firestore', () => ({
  collection: mocks.collection,
  onSnapshot: mocks.onSnapshot,
  query: mocks.query,
  where: mocks.where,
}));

vi.mock('../firebase', () => ({
  auth: {},
  db: {},
}));

vi.mock('../data/mockData', () => ({
  recentActivity: [
    { id: 'a1', action: 'New listing added', time: '2 hours ago', type: 'listing' },
    { id: 'a2', action: 'Event registered', time: 'Yesterday', type: 'event' },
  ],
  notifications: [
    { id: 'n1', title: 'Welcome', message: 'Welcome to UniHub!', time: 'Today', read: false },
    { id: 'n2', title: 'Update', message: 'Your profile is ready.', time: 'Yesterday', read: true },
  ],
  quickActions: [
    { id: 'q1', title: 'Add Listing', color: '#123456' },
    { id: 'q2', title: 'Create Event', color: '#234567' },
    { id: 'q3', title: 'Report Lost Item', color: '#345678' },
    { id: 'q4', title: 'Share Skill', color: '#456789' },
  ],
}));

describe('Dashboard Page', () => {
  const collegeUser = {
    uid: 'student123',
    email: 'student@mitsgwl.ac.in',
    emailVerified: true,
    displayName: 'Priya Sharma',
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mocks.collection.mockImplementation((db, name) => ({ name }));
    mocks.query.mockImplementation((collectionRef) => collectionRef);
    mocks.where.mockReturnValue({});

    mocks.onSnapshot.mockImplementation((ref, callback) => {
      callback({
        docs: ref.name === 'marketplace'
          ? [
              { id: 'p1', data: () => ({ title: 'Book' }) },
              { id: 'p2', data: () => ({ title: 'Laptop' }) },
            ]
          : [
              { id: 'e1', data: () => ({ title: 'Tech Fest' }) },
            ],
      });

      return vi.fn();
    });

    mocks.onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(collegeUser);
      return vi.fn();
    });
  });

  const renderDashboard = () =>
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

  it('shows the loading state initially', () => {
    mocks.onAuthStateChanged.mockImplementation(() => vi.fn());

    renderDashboard();

    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
  });

  it('shows the login message when no user is signed in', async () => {
    mocks.onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
      return vi.fn();
    });

    renderDashboard();

    expect(
      await screen.findByText(
        'Please sign in with your verified MITS college account to view your dashboard.'
      )
    ).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'Login with Google' }))
      .toHaveAttribute('href', '/login');
  });

  it('restricts access for unverified or non-college users', async () => {
    mocks.onAuthStateChanged.mockImplementation((auth, callback) => {
      callback({
        uid: 'user1',
        email: 'student@gmail.com',
        emailVerified: true,
      });
      return vi.fn();
    });

    renderDashboard();

    expect(
      await screen.findByRole('alert')
    ).toHaveTextContent(
      'Access restricted. Please sign in with a verified MITS college email.'
    );
  });

  it('displays the dashboard for a verified college user', async () => {
    renderDashboard();

    expect(await screen.findByText('Dashboard')).toBeInTheDocument();
    expect(
      screen.getByText(/Welcome back, Priya Sharma! Here's your campus overview./)
    ).toBeInTheDocument();

    expect(screen.getByText('My Listings')).toBeInTheDocument();
    expect(screen.getByText('My Events')).toBeInTheDocument();
    expect(screen.getByText('Lost Reports')).toBeInTheDocument();
    expect(screen.getByText('Achievements')).toBeInTheDocument();
    expect(screen.getByText('Connections')).toBeInTheDocument();
  });

  it('displays marketplace and event counts from Firestore', async () => {
    renderDashboard();

    await screen.findByText('My Listings');

    const listingCard = screen.getByText('My Listings').closest('.dash-stat-info');
    const eventCard = screen.getByText('My Events').closest('.dash-stat-info');

    expect(listingCard.querySelector('h3')).toHaveTextContent('2');
    expect(eventCard.querySelector('h3')).toHaveTextContent('1');

    expect(mocks.where).toHaveBeenCalledWith('ownerId', '==', 'student123');
  });

  it('renders recent activity and notifications', async () => {
    renderDashboard();

    expect(await screen.findByText('New listing added')).toBeInTheDocument();
    expect(screen.getByText('Event registered')).toBeInTheDocument();

    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.getByText('Welcome to UniHub!')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
  });

  it('renders quick actions with their correct destinations', async () => {
    renderDashboard();

    expect(await screen.findByText('Add Listing')).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /Add Listing/i }))
      .toHaveAttribute('href', '/marketplace');

    expect(screen.getByRole('link', { name: /Create Event/i }))
      .toHaveAttribute('href', '/events');

    expect(screen.getByRole('link', { name: /Report Lost Item/i }))
      .toHaveAttribute('href', '/lost-found');

    expect(screen.getByRole('link', { name: /Share Skill/i }))
      .toHaveAttribute('href', '/learners');
  });

  it('shows an error when marketplace data cannot be loaded', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    mocks.onSnapshot.mockImplementation((ref, callback, errorCallback) => {
      if (ref.name === 'marketplace') {
        errorCallback(new Error('Permission denied'));
      } else {
        callback({ docs: [] });
      }

      return vi.fn();
    });

    renderDashboard();

    expect(
      await screen.findByRole('alert')
    ).toHaveTextContent(
      'Could not load marketplace statistics. Check Firestore permissions.'
    );
  });
});
