
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from './Footer';

describe('Footer', () => {
  const renderFooter = () =>
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

  it('renders the UniHub branding and tagline', () => {
    renderFooter();

    expect(screen.getByText('UniHub')).toBeInTheDocument();
    expect(
      screen.getByText('One Campus. Endless Connections.')
    ).toBeInTheDocument();
  });

  it('renders the footer description', () => {
    renderFooter();

    expect(
      screen.getByText(/A modern student ecosystem combining marketplace/i)
    ).toBeInTheDocument();
  });

  it('renders all Quick Links with correct destinations', () => {
    renderFooter();

    expect(screen.getByRole('link', { name: 'Marketplace' }))
      .toHaveAttribute('href', '/marketplace');

    expect(screen.getByRole('link', { name: 'Lost & Found' }))
      .toHaveAttribute('href', '/lost-found');

    expect(screen.getByRole('link', { name: 'Events' }))
      .toHaveAttribute('href', '/events');

    expect(screen.getByRole('link', { name: 'Dashboard' }))
      .toHaveAttribute('href', '/dashboard');
  });

  it('renders Support links', () => {
    renderFooter();

    expect(screen.getByRole('link', { name: 'Help Center' }))
      .toHaveAttribute('href', '/help');

    expect(screen.getByRole('link', { name: 'FAQ' }))
      .toHaveAttribute('href', '/help');

    expect(screen.getByRole('link', { name: 'Contact Us' }))
      .toHaveAttribute('href', '/help');

    expect(screen.getByRole('link', { name: 'Privacy Policy' }))
      .toHaveAttribute('href', '/');
  });

  it('renders contact information', () => {
    renderFooter();

    expect(screen.getByText('University Campus, Main Building'))
      .toBeInTheDocument();

    expect(screen.getByText('support@unihub.edu'))
      .toBeInTheDocument();

    expect(screen.getByText('+91 1800-123-4567'))
      .toBeInTheDocument();
  });

  it('renders the copyright notice', () => {
    renderFooter();

    expect(
      screen.getByText('© 2026 UniHub. All rights reserved.')
    ).toBeInTheDocument();
  });
});
