
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import Help from './Help';

describe('Help Page', () => {
  it('renders the Help Center heading and subtitle', () => {
    render(<Help />);

    expect(screen.getByText('Help Center')).toBeInTheDocument();
    expect(screen.getByText('Find answers and get support')).toBeInTheDocument();
  });

  it('renders all four support options', () => {
    render(<Help />);

    expect(screen.getByText('Email Support')).toBeInTheDocument();
    expect(screen.getByText('Live Chat')).toBeInTheDocument();
    expect(screen.getByText('Phone Support')).toBeInTheDocument();
    expect(screen.getByText('Documentation')).toBeInTheDocument();
  });

  it('renders contact information', () => {
    render(<Help />);

    expect(screen.getByText('support@unihub.edu')).toBeInTheDocument();
    expect(screen.getByText('+91 1800-123-4567')).toBeInTheDocument();
    expect(screen.getByText('Available 9 AM - 6 PM')).toBeInTheDocument();
    expect(screen.getByText('Response within 24 hours')).toBeInTheDocument();
  });

  it('renders the FAQ section and questions', () => {
    render(<Help />);

    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();

    expect(
      screen.getAllByRole('button').length
    ).toBeGreaterThan(0);
  });

  it('opens an FAQ answer when its question is clicked', () => {
    render(<Help />);

    const faqButtons = screen.getAllByRole('button');
    const firstQuestion = faqButtons[0];

    const answer = firstQuestion.parentElement.querySelector('.faq-answer');

    expect(answer).toBeInTheDocument();

    fireEvent.click(firstQuestion);

    expect(firstQuestion.parentElement).toHaveClass('open');
  });

  it('closes an FAQ answer when the same question is clicked again', () => {
    render(<Help />);

    const firstQuestion = screen.getAllByRole('button')[0];
    const faqItem = firstQuestion.parentElement;

    fireEvent.click(firstQuestion);
    expect(faqItem).toHaveClass('open');

    fireEvent.click(firstQuestion);
    expect(faqItem).not.toHaveClass('open');
  });

  it('allows only one FAQ item to remain open', () => {
    render(<Help />);

    const faqButtons = screen.getAllByRole('button');

    if (faqButtons.length < 2) return;

    fireEvent.click(faqButtons[0]);
    fireEvent.click(faqButtons[1]);

    expect(faqButtons[0].parentElement).not.toHaveClass('open');
    expect(faqButtons[1].parentElement).toHaveClass('open');
  });
});
