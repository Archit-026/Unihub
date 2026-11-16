
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SkillSwap from './SkillSwap';

describe('SkillSwap Page', () => {
  it('renders the Learners Hub heading and subtitle', () => {
    render(<SkillSwap />);

    expect(screen.getByRole('heading', { name: 'Learners Hub' }))
      .toBeInTheDocument();

    expect(
      screen.getByText('Swap skills with fellow learners and grow together')
    ).toBeInTheDocument();
  });

  it('renders all four statistics', () => {
    render(<SkillSwap />);

    expect(screen.getByText('Active Learners')).toBeInTheDocument();
    expect(screen.getByText('Active Exchanges')).toBeInTheDocument();
    expect(screen.getByText('Skills Available')).toBeInTheDocument();
    expect(screen.getByText('Avg. Rating')).toBeInTheDocument();

    expect(screen.getByText('Avg. Rating').parentElement).toHaveTextContent('4.7');
  });

  it('displays the learner and exchange tabs', () => {
    render(<SkillSwap />);

    expect(screen.getByRole('button', { name: /Find Learners/i }))
      .toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Live Exchanges/i }))
      .toBeInTheDocument();
  });

  it('shows learner cards by default', () => {
    render(<SkillSwap />);

    expect(document.querySelector('.learners-grid')).toBeInTheDocument();
    expect(document.querySelector('.swap-filters')).toBeInTheDocument();
  });

  it('filters learners using the search field', () => {
    render(<SkillSwap />);

    const searchInput = screen.getByPlaceholderText(
      'Search learners or skills...'
    );

    fireEvent.change(searchInput, {
      target: { value: 'Python' },
    });

    expect(document.querySelector('.learners-grid')).toBeInTheDocument();
    expect(screen.queryByText('No learners found')).not.toBeInTheDocument();
  });

  it('shows an empty state when no learners match the search', () => {
    render(<SkillSwap />);

    fireEvent.change(
      screen.getByPlaceholderText('Search learners or skills...'),
      { target: { value: 'nonexistent-skill-xyz' } }
    );

    expect(screen.getByText('No learners found')).toBeInTheDocument();
    expect(
      screen.getByText('Try adjusting your search or skill filter')
    ).toBeInTheDocument();
  });

  it('filters learners using a skill chip', () => {
    render(<SkillSwap />);

    const skillButtons = document.querySelectorAll(
      '.swap-skill-chip:not(.clear)'
    );

    expect(skillButtons.length).toBeGreaterThan(0);

    fireEvent.click(skillButtons[0]);

    expect(skillButtons[0]).toHaveClass('active');
  });

  it('clears the selected skill filter', () => {
    render(<SkillSwap />);

    const skillButton = document.querySelector(
      '.swap-skill-chip:not(.clear)'
    );

    fireEvent.click(skillButton);

    expect(screen.getByRole('button', { name: 'Clear All' }))
      .toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Clear All' }));

    expect(screen.queryByRole('button', { name: 'Clear All' }))
      .not.toBeInTheDocument();
  });

  it('switches to the Live Exchanges tab', async () => {
    render(<SkillSwap />);

    fireEvent.click(screen.getByRole('button', { name: /Live Exchanges/i }));

    await waitFor(() => {
      expect(document.querySelector('.exchanges-grid')).toBeInTheDocument();
    });

    expect(document.querySelector('.swap-filters')).not.toBeInTheDocument();
  });

  it('renders skill exchange cards or the empty state', async () => {
    render(<SkillSwap />);

    fireEvent.click(screen.getByRole('button', { name: /Live Exchanges/i }));

    await waitFor(() => {
      expect(document.querySelector('.exchanges-grid')).toBeInTheDocument();
    });

    const exchangeContent = document.querySelector('.exchanges-grid');

    expect(exchangeContent.children.length).toBeGreaterThan(0);
  });

  it('switches back to the learner tab', async () => {
    render(<SkillSwap />);

    fireEvent.click(screen.getByRole('button', { name: /Live Exchanges/i }));

    await waitFor(() => {
      expect(document.querySelector('.exchanges-grid')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Find Learners/i }));

    await waitFor(() => {
      expect(document.querySelector('.learners-grid')).toBeInTheDocument();
    });

    expect(document.querySelector('.swap-filters')).toBeInTheDocument();
  });
});
