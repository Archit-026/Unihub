
import { describe, expect, it, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import EventCard from './EventCard';

describe('EventCard', () => {
  const event = {
    title: 'Tech Fest 2026',
    description: 'Annual college technology festival',
    category: 'Technology',
    date: '2099-12-25',
    time: '10:00 AM',
    location: 'College Auditorium',
    registered: 120,
  };

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('renders the event title and description', () => {
    render(<EventCard event={event} index={0} />);

    expect(
      screen.getByRole('heading', { name: 'Tech Fest 2026' })
    ).toBeInTheDocument();

    expect(
      screen.getByText('Annual college technology festival')
    ).toBeInTheDocument();
  });

  it('renders the event category and date', () => {
    render(<EventCard event={event} index={0} />);

    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('2099-12-25')).toBeInTheDocument();
  });

  it('renders event time, location and registration count', () => {
    render(<EventCard event={event} index={0} />);

    expect(screen.getByText('10:00 AM')).toBeInTheDocument();
    expect(screen.getByText('College Auditorium')).toBeInTheDocument();
    expect(screen.getByText('120 registered')).toBeInTheDocument();
  });

  it('renders the Register Now button', () => {
    render(<EventCard event={event} index={0} />);

    expect(
      screen.getByRole('button', { name: 'Register Now' })
    ).toBeInTheDocument();
  });

  it('displays a countdown for a future event', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-15T00:00:00'));

    render(<EventCard event={event} index={0} />);

    expect(
      screen.getByText(/^\d+ days left$/)
    ).toBeInTheDocument();
  });
});
