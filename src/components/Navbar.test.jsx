
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

const mocks = vi.hoisted(() => ({
  onAuthStateChanged: vi.fn(),
  signOut: vi.fn(),
  toggleTheme: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: mocks.onAuthStateChanged,
  signOut: mocks.signOut,
}));

vi.mock('../firebase', () => ({
  auth: {},
}));

vi.mock('../context/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: mocks.toggleTheme,
  }),
}));

describe('Navbar', () => {
  const collegeUser = {
    uid: 'user123',
    email: 'student@mitsgwl.ac.in',
    emailVerified: true,
  };

  const renderNavbar = (initialRoute = '/') =>
    render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Navbar />
      </MemoryRouter>
    );

  beforeEach(() => {
    vi.clearAllMocks();

    mocks.onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
      return vi.fn();
    });

    mocks.signOut.mockResolvedValue();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the UniHub logo', () => {
    renderNavbar();

    expect(screen.getByText('UniHub')).toBeInTheDocument();
  });

  it('renders public navigation links', () => {
    renderNavbar();

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Marketplace' })).toHaveAttribute('href', '/marketplace');
    expect(screen.getByRole('link', { name: 'Lost & Found' })).toHaveAttribute('href', '/lost-found');
    expect(screen.getByRole('link', { name: 'Events' })).toHaveAttribute('href', '/events');
    expect(screen.getByRole('link', { name: 'Learners Hub' })).toHaveAttribute('href', '/learners');
    expect(screen.getByRole('link', { name: 'Help' })).toHaveAttribute('href', '/help');
  });

  it('hides protected links for unauthenticated users', () => {
    renderNavbar();

    expect(screen.queryByRole('link', { name: 'Dashboard' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Profile' })).not.toBeInTheDocument();
  });

  it('shows protected links for verified MITS users', () => {
    mocks.onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(collegeUser);
      return vi.fn();
    });

    renderNavbar();

    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/dashboard');
    expect(screen.getByRole('link', { name: 'Profile' })).toHaveAttribute('href', '/profile');
  });

  it('hides the navbar on the login page', () => {
    const { container } = renderNavbar('/login');

    expect(container.querySelector('.navbar')).not.toBeInTheDocument();
  });

  it('opens and closes the mobile menu', async () => {
    renderNavbar();

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));

    expect(screen.getByRole('button', { name: 'Close menu' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Marketplace' })).toHaveLength(2);

    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }));

    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByRole('link', { name: 'Marketplace' })).toHaveLength(1);
    });
  });

  it('calls the theme toggle when clicked', () => {
    renderNavbar();

    const themeButtons = screen.getAllByRole('button', {
      name: 'Switch to dark mode',
    });

    fireEvent.click(themeButtons[0]);

    expect(mocks.toggleTheme).toHaveBeenCalledTimes(1);
  });

  it('logs out successfully and displays the Login link', async () => {
    mocks.onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(collegeUser);
      return vi.fn();
    });

    renderNavbar();

    fireEvent.click(screen.getByRole('button', { name: /logout/i }));

    await waitFor(() => {
      expect(mocks.signOut).toHaveBeenCalled();
      expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument();
    });
  });

  it('displays an error when logout fails', async () => {
    mocks.onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(collegeUser);
      return vi.fn();
    });

    mocks.signOut.mockRejectedValue(new Error('Logout error'));
    vi.spyOn(console, 'error').mockImplementation(() => {});

    renderNavbar();

    fireEvent.click(screen.getByRole('button', { name: /logout/i }));

    expect(
      await screen.findByRole('alert')
    ).toHaveTextContent('Logout failed. Please try again.');
  });
});
