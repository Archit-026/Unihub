
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Features from './Features';

describe('Features', () => {
  it('renders the section heading', () => {
    render(<Features />);

    expect(screen.getByText('Everything You Need')).toBeInTheDocument();
  });

  it('renders the section subtitle', () => {
    render(<Features />);

    expect(
      screen.getByText(/One platform for all your campus needs/i)
    ).toBeInTheDocument();
  });

  it('renders all six feature cards', () => {
    render(<Features />);

    const featureTitles = [
      'Marketplace',
      'Lost & Found',
      'Events',
      'Internships',
      'Student Clubs',
      'Achievements',
    ];

    featureTitles.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it('renders the correct descriptions for the features', () => {
    render(<Features />);

    expect(
      screen.getByText(/Buy and sell items within your campus community/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Report lost items or return found belongings/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Discover and register for campus events/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Find internship opportunities tailored for students/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Explore and join student clubs/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Earn badges and recognition/i)
    ).toBeInTheDocument();
  });

  it('renders the features section with the correct id', () => {
    const { container } = render(<Features />);

    expect(container.querySelector('#features')).toBeInTheDocument();
  });
});
