
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  it('renders the search input with the provided placeholder', () => {
    render(
      <SearchBar
        placeholder="Search products..."
        value=""
        onChange={vi.fn()}
      />
    );

    expect(
      screen.getByPlaceholderText('Search products...')
    ).toBeInTheDocument();
  });

  it('displays the current search value', () => {
    render(
      <SearchBar
        placeholder="Search products..."
        value="Laptop"
        onChange={vi.fn()}
      />
    );

    expect(
      screen.getByDisplayValue('Laptop')
    ).toBeInTheDocument();
  });

  it('calls onChange with the typed search value', () => {
    const handleChange = vi.fn();

    render(
      <SearchBar
        placeholder="Search products..."
        value=""
        onChange={handleChange}
      />
    );

    fireEvent.change(
      screen.getByPlaceholderText('Search products...'),
      { target: { value: 'Laptop' } }
    );

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('Laptop');
  });

  it('uses the default placeholder when none is provided', () => {
    render(
      <SearchBar
        value=""
        onChange={vi.fn()}
      />
    );

    expect(
      screen.getByPlaceholderText('Search...')
    ).toBeInTheDocument();
  });
});
