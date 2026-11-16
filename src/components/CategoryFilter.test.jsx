
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CategoryFilter from './CategoryFilter';

describe('CategoryFilter', () => {
  const categories = ['All', 'Electronics', 'Books', 'Clothing'];

  it('renders all category buttons', () => {
    render(
      <CategoryFilter
        categories={categories}
        active="All"
        onChange={vi.fn()}
      />
    );

    categories.forEach((category) => {
      expect(
        screen.getByRole('button', { name: category })
      ).toBeInTheDocument();
    });
  });

  it('applies the active class to the selected category', () => {
    render(
      <CategoryFilter
        categories={categories}
        active="Books"
        onChange={vi.fn()}
      />
    );

    expect(
      screen.getByRole('button', { name: 'Books' })
    ).toHaveClass('active');

    expect(
      screen.getByRole('button', { name: 'All' })
    ).not.toHaveClass('active');
  });

  it('calls onChange with the selected category when clicked', () => {
    const handleChange = vi.fn();

    render(
      <CategoryFilter
        categories={categories}
        active="All"
        onChange={handleChange}
      />
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Books' })
    );

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('Books');
  });
});
