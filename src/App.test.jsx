
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import App from './App';

const mocks = vi.hoisted(() => ({
  onAuthStateChanged: vi.fn(),
  signOut: vi.fn(),
  authCallback: null,
  initialRoute: '/',
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');

  return {
    ...actual,
    BrowserRouter: ({ children }) =>
      React.createElement(
        actual.MemoryRouter,
        { initialEntries: [mocks.initialRoute] },
        children
      ),
  };
});

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: mocks.onAuthStateChanged,
  signOut: mocks.signOut,
}));

vi.mock('./firebase', () => ({
  auth: {},
}));

vi.mock('./components/Navbar', () => ({
  default: () => <nav>Navbar</nav>,
}));

vi.mock('./pages/Home', () => ({
  default: () => <div>Home Page</div>,
}));

vi.mock('./pages/Login', () => ({
  default: () => <div>Login Page</div>,
}));

vi.mock('./pages/Marketplace', () => ({
  default: () => <div>Marketplace Page</div>,
}));

vi.mock('./pages/LostFound', () => ({
  default: () => <div>Lost Found Page</div>,
}));

vi.mock('./pages/Events', () => ({
  default: () => <div>Events Page</div>,
}));

vi.mock('./pages/Dashboard', () => ({
  default: () => <div>Dashboard Page</div>,
}));

vi.mock('./pages/Profile', () => ({
  default: () => <div>Profile Page</div>,
}));

vi.mock('./pages/Help', () => ({
  default: () => <div>Help Page</div>,
}));

vi.mock('./pages/SkillSwap', () => ({
  default: () => <div>Learners Page</div>,
}));

describe('App integration', () => {
  const collegeUser = {
    uid: 'student123',
    email: 'student@mitsgwl.ac.in',
    emailVerified: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.authCallback = null;

    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    mocks.signOut.mockResolvedValue();

    mocks.onAuthStateChanged.mockImplementation((auth, callback) => {
      mocks.authCallback = callback;
      return vi.fn();
    });
  });

  const renderApp = async (path = '/', user = null) => {
    mocks.initialRoute = path;

    render(<App />);

    await waitFor(() => {
      expect(mocks.authCallback).toBeDefined();
    });

    await act(async () => {
      await mocks.authCallback(user);
    });
  };

  it('displays the loading state before authentication is resolved', () => {
    mocks.initialRoute = '/';

    render(<App />);

    expect(screen.getByText('Loading UniHub...')).toBeInTheDocument();
  });

  it('allows unauthenticated users to access the homepage', async () => {
    await renderApp('/');

    expect(screen.getByText('Home Page')).toBeInTheDocument();
    expect(screen.getByText('Navbar')).toBeInTheDocument();
  });

  it('allows unauthenticated users to access the marketplace', async () => {
    await renderApp('/marketplace');

    expect(screen.getByText('Marketplace Page')).toBeInTheDocument();
  });

  it('allows unauthenticated users to access the events page', async () => {
    await renderApp('/events');

    expect(screen.getByText('Events Page')).toBeInTheDocument();
  });

  it('redirects unauthenticated users from protected routes to login', async () => {
    await renderApp('/dashboard');

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('allows verified MITS users to access protected routes', async () => {
    await renderApp('/dashboard', collegeUser);

    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
  });

  it('allows verified MITS users to access their profile', async () => {
    await renderApp('/profile', collegeUser);

    expect(screen.getByText('Profile Page')).toBeInTheDocument();
  });

  it('signs out unverified or non-college users', async () => {
    const invalidUser = {
      uid: 'user456',
      email: 'student@gmail.com',
      emailVerified: true,
    };

    await renderApp('/dashboard', invalidUser);

    expect(mocks.signOut).toHaveBeenCalled();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('redirects authenticated users away from the login page', async () => {
    await renderApp('/login', collegeUser);

    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
  });

  it('redirects unknown routes to the homepage', async () => {
    await renderApp('/unknown-page', collegeUser);

    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });
});
