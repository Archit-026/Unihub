
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import FeatureCard from './FeatureCard';

describe('FeatureCard', () => {
  it('renders the feature title', () => {
    render(
      <FeatureCard
        icon={<span>Test Icon</span>}
        title="Marketplace"
        description="Buy and sell products"
        index={0}
      />
    );

    expect(
      screen.getByRole('heading', { name: 'Marketplace' })
    ).toBeInTheDocument();
  });

  it('renders the feature description', () => {
    render(
      <FeatureCard
        icon={<span>Test Icon</span>}
        title="Marketplace"
        description="Buy and sell products"
        index={0}
      />
    );

    expect(
      screen.getByText('Buy and sell products')
    ).toBeInTheDocument();
  });

  it('renders the supplied icon', () => {
    render(
      <FeatureCard
        icon={<span>Test Icon</span>}
        title="Marketplace"
        description="Buy and sell products"
        index={0}
      />
    );

    expect(screen.getByText('Test Icon')).toBeInTheDocument();
  });
});
