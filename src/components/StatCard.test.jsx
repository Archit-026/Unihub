
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatCard from './StatCard';

describe('StatCard', () => {
  it('renders the statistic number', () => {
    render(
      <StatCard
        number="150+"
        label="Active Students"
        icon={<span>Users Icon</span>}
        index={0}
      />
    );

    expect(screen.getByText('150+')).toBeInTheDocument();
  });

  it('renders the statistic label', () => {
    render(
      <StatCard
        number="150+"
        label="Active Students"
        icon={<span>Users Icon</span>}
        index={0}
      />
    );

    expect(screen.getByText('Active Students')).toBeInTheDocument();
  });

  it('renders the supplied icon', () => {
    render(
      <StatCard
        number="150+"
        label="Active Students"
        icon={<span>Users Icon</span>}
        index={0}
      />
    );

    expect(screen.getByText('Users Icon')).toBeInTheDocument();
  });
});
