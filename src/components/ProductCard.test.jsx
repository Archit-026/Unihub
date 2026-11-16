
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProductCard from './ProductCard';

describe('ProductCard', () => {
  const product = {
    title: 'HP Laptop',
    price: '₹35,000',
    seller: 'Rahul Sharma',
    condition: 'Used - Good',
  };

  it('renders the product title', () => {
    render(<ProductCard product={product} index={0} />);

    expect(
      screen.getByRole('heading', { name: 'HP Laptop' })
    ).toBeInTheDocument();
  });

  it('renders the product price', () => {
    render(<ProductCard product={product} index={0} />);

    expect(screen.getByText('₹35,000')).toBeInTheDocument();
  });

  it('renders the seller name', () => {
    render(<ProductCard product={product} index={0} />);

    expect(screen.getByText('Rahul Sharma')).toBeInTheDocument();
  });

  it('renders the product condition and Buy Now button', () => {
    render(<ProductCard product={product} index={0} />);

    expect(screen.getByText('Used - Good')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /buy now/i })
    ).toBeInTheDocument();
  });
});
