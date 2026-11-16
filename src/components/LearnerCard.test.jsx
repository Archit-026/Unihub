
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import LearnerCard from './LearnerCard';

describe('LearnerCard', () => {
  const learner = {
    name: 'Priya Sharma',
    branch: 'CSE 2nd Year',
    bio: 'Love coding and want to expand my skillset',
    rating: 4.8,
    canTeach: ['Python', 'HTML/CSS'],
    wantToLearn: ['Java', 'React'],
    exchanges: 7,
  };

  it('renders learner name and initials', () => {
    render(<LearnerCard learner={learner} index={0} />);

    expect(screen.getByText('Priya Sharma')).toBeInTheDocument();
    expect(screen.getByText('PS')).toBeInTheDocument();
  });

  it('renders branch, bio and rating', () => {
    render(<LearnerCard learner={learner} index={0} />);

    expect(screen.getByText('CSE 2nd Year')).toBeInTheDocument();
    expect(
      screen.getByText('Love coding and want to expand my skillset')
    ).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
  });

  it('renders skills the learner can teach', () => {
    render(<LearnerCard learner={learner} index={0} />);

    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('HTML/CSS')).toBeInTheDocument();
    expect(screen.getByText('I can teach')).toBeInTheDocument();
  });

  it('renders skills the learner wants to learn', () => {
    render(<LearnerCard learner={learner} index={0} />);

    expect(screen.getByText('Java')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('I want to learn')).toBeInTheDocument();
  });

  it('renders exchange count and action buttons', () => {
    render(<LearnerCard learner={learner} index={0} />);

    expect(screen.getByText('7 exchanges')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /connect & swap/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /request skill/i })
    ).toBeInTheDocument();
  });
});
