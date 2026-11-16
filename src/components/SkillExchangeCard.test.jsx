
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import SkillExchangeCard from './SkillExchangeCard';

describe('SkillExchangeCard', () => {
  const exchange = {
    status: 'active',
    from: {
      name: 'Priya Sharma',
      skill: 'Python',
    },
    to: {
      name: 'Rahul Verma',
      skill: 'Java',
    },
    description: 'A skill exchange between Python and Java learners.',
  };

  it('renders both participants and their initials', () => {
    render(<SkillExchangeCard exchange={exchange} index={0} />);

    expect(screen.getByText('Priya Sharma')).toBeInTheDocument();
    expect(screen.getByText('Rahul Verma')).toBeInTheDocument();
    expect(screen.getByText('PS')).toBeInTheDocument();
    expect(screen.getByText('RV')).toBeInTheDocument();
  });

  it('renders the skills of both participants', () => {
    render(<SkillExchangeCard exchange={exchange} index={0} />);

    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('Java')).toBeInTheDocument();
  });

  it('displays Active status and Join Exchange for active exchanges', () => {
    render(<SkillExchangeCard exchange={exchange} index={0} />);

    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /join exchange/i })
    ).toBeInTheDocument();
  });

  it('displays Completed status and View Details for completed exchanges', () => {
    const completedExchange = {
      ...exchange,
      status: 'completed',
    };

    render(<SkillExchangeCard exchange={completedExchange} index={0} />);

    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /view details/i })
    ).toBeInTheDocument();
  });

  it('renders the exchange description', () => {
    render(<SkillExchangeCard exchange={exchange} index={0} />);

    expect(
      screen.getByText('A skill exchange between Python and Java learners.')
    ).toBeInTheDocument();
  });
});
