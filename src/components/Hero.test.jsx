
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Hero from './Hero';

describe('Hero', () => {
  const renderHero = () =>
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );

  it('renders the main heading', () => {
    renderHero();

    expect(screen.getByText('One Campus.')).toBeInTheDocument();
    expect(screen.getByText('Endless Connections.')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    renderHero();

    expect(
      screen.getByText(/UniHub brings together marketplace/i)
    ).toBeInTheDocument();
  });

  it('renders the Get Started link', () => {
    renderHero();

    const link = screen.getByRole('link', { name: /get started/i });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/marketplace');
  });

  it('renders the Explore Marketplace link', () => {
    renderHero();

    const link = screen.getByRole('link', {
      name: /explore marketplace/i,
    });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/marketplace');
  });

  it('renders the Learners Hub link', () => {
    renderHero();

    const link = screen.getByRole('link', { name: /learners hub/i });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/learners');
  });
});
