
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

describe('Home Page', () => {
  const renderHome = () =>
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

  it('renders the main homepage components', () => {
    renderHome();

    expect(screen.getAllByText('Learners Hub').length).toBeGreaterThan(0);
   expect(screen.getAllByText('Marketplace').length).toBeGreaterThan(0);
   expect(screen.getAllByText('Lost & Found').length).toBeGreaterThan(0);
    expect(screen.getByText('Upcoming Events')).toBeInTheDocument();
  });

  it('renders the statistics section', () => {
    renderHome();

    expect(screen.getByText('500+')).toBeInTheDocument();
    expect(screen.getByText('200+')).toBeInTheDocument();
    expect(screen.getByText('50+')).toBeInTheDocument();
    expect(screen.getByText('30+')).toBeInTheDocument();

    expect(screen.getByText('Active Students')).toBeInTheDocument();
    expect(screen.getByText('Products Listed')).toBeInTheDocument();
    expect(screen.getByText('Events This Year')).toBeInTheDocument();
    expect(screen.getByText('Internships Posted')).toBeInTheDocument();
  });

  it('renders the Learners Hub preview and navigation link', () => {
    renderHome();

    expect(screen.getByText('Teach What You Know')).toBeInTheDocument();
    expect(screen.getByText('Learn What You Need')).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: /Explore Learners Hub/i })
    ).toHaveAttribute('href', '/learners');
  });

  it('renders marketplace and its navigation link', () => {
    renderHome();

    expect(
      screen.getByRole('link', { name: /View All Products/i })
    ).toHaveAttribute('href', '/marketplace');
  });

  it('renders Lost & Found and its navigation link', () => {
    renderHome();

    expect(
      screen.getByRole('link', { name: /Go to Lost & Found/i })
    ).toHaveAttribute('href', '/lost-found');
  });

  it('renders upcoming events and its navigation link', () => {
    renderHome();

    expect(
      screen.getByRole('link', { name: /View All Events/i })
    ).toHaveAttribute('href', '/events');
  });

  it('renders internship opportunities', () => {
    renderHome();

    expect(screen.getByText('Internship Opportunities')).toBeInTheDocument();
    expect(screen.getByText('Kickstart your career with these opportunities'))
      .toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Apply Now' }).length)
      .toBeGreaterThan(0);
  });

  it('renders student testimonials', () => {
    renderHome();

    expect(screen.getByText('What Students Say')).toBeInTheDocument();
    expect(screen.getByText('Hear from your fellow campus mates'))
      .toBeInTheDocument();
  });

  it('renders the FAQ section and its questions', () => {
    renderHome();

    expect(
      screen.getByText('Frequently Asked Questions')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Everything you need to know about UniHub')
    ).toBeInTheDocument();

    expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
  });

  it('opens an FAQ answer when its question is clicked', () => {
    renderHome();

    const question = screen.getAllByRole('button').find(
      button => button.querySelector('span')
    );

    expect(question).toBeTruthy();

    const answer = question.closest('.faq-item').querySelector('.faq-answer');

    fireEvent.click(question);

    expect(question.closest('.faq-item')).toHaveClass('open');
    expect(answer.querySelector('p').textContent).not.toBe('');
  });

  it('closes an FAQ answer when the same question is clicked again', () => {
    renderHome();

    const question = screen.getAllByRole('button').find(
      button => button.querySelector('span')
    );

    fireEvent.click(question);
    expect(question.closest('.faq-item')).toHaveClass('open');

    fireEvent.click(question);
    expect(question.closest('.faq-item')).not.toHaveClass('open');
  });

  it('keeps only one FAQ item open at a time', () => {
    renderHome();

    const questions = screen.getAllByRole('button').filter(
      button => button.classList.contains('faq-question')
    );

    expect(questions.length).toBeGreaterThan(1);

    fireEvent.click(questions[0]);
    expect(questions[0].closest('.faq-item')).toHaveClass('open');

    fireEvent.click(questions[1]);

    expect(questions[0].closest('.faq-item')).not.toHaveClass('open');
    expect(questions[1].closest('.faq-item')).toHaveClass('open');
  });
});
