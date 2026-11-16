
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import Login from './Login';

const mocks = vi.hoisted(() => ({
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  navigate: vi.fn(),
  auth: {},
  googleProvider: {},
}));

vi.mock('firebase/auth', () => ({
  signInWithPopup: mocks.signInWithPopup,
  signOut: mocks.signOut,
}));

vi.mock('../firebase', () => ({
  auth: mocks.auth,
  googleProvider: mocks.googleProvider,
}));

function LocationDisplay() {
  const location = useLocation();
  return <p data-testid="current-path">{location.pathname}</p>;
}

describe('Login Page', () => {
  const verifiedUser = {
    email: 'student@mitsgwl.ac.in',
    emailVerified: true,
  };

  const renderLogin = (initialEntry = '/login') =>
    render(
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<LocationDisplay />} />
          <Route path="/marketplace" element={<LocationDisplay />} />
        </Routes>
      </MemoryRouter>
    );

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.signInWithPopup.mockResolvedValue({ user: verifiedUser });
    mocks.signOut.mockResolvedValue();
  });

  it('renders the login page heading and description', () => {
    renderLogin();

    expect(screen.getByRole('heading', { name: 'Welcome to UniHub' }))
      .toBeInTheDocument();

    expect(
      screen.getByText('Sign in with your MITS Gwalior college account.')
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Continue with Google' })
    ).toBeInTheDocument();
  });

  it('signs in a verified MITS user and redirects to dashboard', async () => {
    renderLogin();

    fireEvent.click(screen.getByRole('button', { name: 'Continue with Google' }));

    expect(await screen.findByTestId('current-path')).toHaveTextContent('/dashboard');

    expect(mocks.signInWithPopup).toHaveBeenCalledWith(
      mocks.auth,
      mocks.googleProvider
    );

    expect(mocks.signOut).not.toHaveBeenCalled();
  });

  it('redirects to the original requested page when provided', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/login',
            state: { from: { pathname: '/marketplace' } },
          },
        ]}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/marketplace" element={<LocationDisplay />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Continue with Google' }));

    expect(await screen.findByTestId('current-path'))
      .toHaveTextContent('/marketplace');
  });

  it('rejects an account outside the MITS college domain', async () => {
    mocks.signInWithPopup.mockResolvedValue({
      user: {
        email: 'student@gmail.com',
        emailVerified: true,
      },
    });

    renderLogin();

    fireEvent.click(screen.getByRole('button', { name: 'Continue with Google' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Please sign in using a verified MITS college account (@mitsgwl.ac.in).'
    );

    expect(mocks.signOut).toHaveBeenCalledWith(mocks.auth);
  });

  it('rejects an unverified MITS account', async () => {
    mocks.signInWithPopup.mockResolvedValue({
      user: {
        email: 'student@mitsgwl.ac.in',
        emailVerified: false,
      },
    });

    renderLogin();

    fireEvent.click(screen.getByRole('button', { name: 'Continue with Google' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Please sign in using a verified MITS college account (@mitsgwl.ac.in).'
    );

    expect(mocks.signOut).toHaveBeenCalledWith(mocks.auth);
  });

  it('shows an error when the login popup is closed', async () => {
    mocks.signInWithPopup.mockRejectedValue({
      code: 'auth/popup-closed-by-user',
    });

    renderLogin();

    fireEvent.click(screen.getByRole('button', { name: 'Continue with Google' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Login cancelled. Please try again.'
    );
  });

  it('shows an error when the login popup is blocked', async () => {
    mocks.signInWithPopup.mockRejectedValue({
      code: 'auth/popup-blocked',
    });

    renderLogin();

    fireEvent.click(screen.getByRole('button', { name: 'Continue with Google' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Your browser blocked the login popup. Allow popups and retry.'
    );
  });

  it('shows an error for an unauthorized Firebase domain', async () => {
    mocks.signInWithPopup.mockRejectedValue({
      code: 'auth/unauthorized-domain',
    });

    renderLogin();

    fireEvent.click(screen.getByRole('button', { name: 'Continue with Google' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'This website domain is not authorized in Firebase Authentication.'
    );
  });

  it('shows a generic error for other login failures', async () => {
    mocks.signInWithPopup.mockRejectedValue(new Error('Unknown error'));

    vi.spyOn(console, 'error').mockImplementation(() => {});

    renderLogin();

    fireEvent.click(screen.getByRole('button', { name: 'Continue with Google' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Login failed. Please try again.'
    );
  });

  it('disables the login button while authentication is in progress', async () => {
    let resolveLogin;

    mocks.signInWithPopup.mockReturnValue(
      new Promise(resolve => {
        resolveLogin = resolve;
      })
    );

    renderLogin();

    fireEvent.click(screen.getByRole('button', { name: 'Continue with Google' }));

    expect(screen.getByRole('button', { name: 'Signing in...' }))
      .toBeDisabled();

    resolveLogin({ user: verifiedUser });

    await waitFor(() => {
      expect(screen.getByTestId('current-path')).toHaveTextContent('/dashboard');
    });
  });
});
