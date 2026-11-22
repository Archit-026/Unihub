
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Marketplace from './Marketplace';

const mocks = vi.hoisted(() => ({
  addDoc: vi.fn(),
  collection: vi.fn(),
  deleteDoc: vi.fn(),
  deleteField: vi.fn(),
  doc: vi.fn(),
  documentId: vi.fn(),
  getDocs: vi.fn(),
  limit: vi.fn(),
  onSnapshot: vi.fn(),
  orderBy: vi.fn(),
  query: vi.fn(),
  startAfter: vi.fn(),
  updateDoc: vi.fn(),
  auth: {
    currentUser: {
      uid: 'student123',
      email: 'student@mitsgwl.ac.in',
      emailVerified: true,
    },
  },
}));

vi.mock('firebase/firestore', () => ({
  addDoc: mocks.addDoc,
  collection: mocks.collection,
  deleteDoc: mocks.deleteDoc,
  deleteField: mocks.deleteField,
  doc: mocks.doc,
  documentId: mocks.documentId,
  getDocs: mocks.getDocs,
  limit: mocks.limit,
  onSnapshot: mocks.onSnapshot,
  orderBy: mocks.orderBy,
  query: mocks.query,
  startAfter: mocks.startAfter,
  updateDoc: mocks.updateDoc,
}));

vi.mock('../firebase', () => ({
  auth: mocks.auth,
  db: {},
}));

vi.mock('../firestore', () => ({
  db: {},
}));

vi.mock('../data/mockData', () => ({
  categories: ['All', 'Books', 'Electronics', 'Stationery'],
}));

vi.mock('../components/SearchBar', () => ({
  default: ({ value, onChange, placeholder }) => (
    <input
      aria-label="Search products"
      placeholder={placeholder}
      value={value}
      onChange={event => onChange(event.target.value)}
    />
  ),
}));

vi.mock('../components/CategoryFilter', () => ({
  default: ({ categories, active, onChange }) => (
    <div>
      {categories.map(category => (
        <button
          key={category}
          type="button"
          aria-pressed={active === category}
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  ),
}));

vi.mock('../components/ProductCard', () => ({
  default: ({ product }) => (
    <div data-testid="product-card">
      {product.title}
    </div>
  ),
}));

describe('Marketplace Page', () => {
  const sampleProducts = [
    {
      id: 'p1',
      title: 'Engineering Mathematics Book',
      category: 'Books',
      price: 300,
      description: 'Good condition',
      ownerId: 'student123',
    },
    {
      id: 'p2',
      title: 'Scientific Calculator',
      category: 'Electronics',
      price: 500,
      description: 'Working perfectly',
      ownerId: 'another-user',
    },
  ];

  const makeDocs = products =>
    products.map(product => ({
      id: product.id,
      data: () => ({ ...product }),
    }));

  beforeEach(() => {
    vi.clearAllMocks();

    mocks.auth.currentUser = {
      uid: 'student123',
      email: 'student@mitsgwl.ac.in',
      emailVerified: true,
    };

    mocks.collection.mockReturnValue({});
    mocks.query.mockReturnValue({});
    mocks.doc.mockReturnValue({});
    mocks.documentId.mockReturnValue('documentId');
    mocks.limit.mockImplementation(value => value);
    mocks.orderBy.mockReturnValue('orderBy');
    mocks.startAfter.mockReturnValue('startAfter');
    mocks.deleteField.mockReturnValue('DELETE_FIELD');

    mocks.addDoc.mockResolvedValue({});
    mocks.updateDoc.mockResolvedValue();
    mocks.deleteDoc.mockResolvedValue();

    mocks.getDocs.mockResolvedValue({
      docs: makeDocs(sampleProducts),
    });

    mocks.onSnapshot.mockImplementation((query, success) => {
      success({
        docs: makeDocs(sampleProducts),
      });
      return vi.fn();
    });

    vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ recommendations: [] }),
      })
    );
  });

  const renderMarketplace = () =>
    render(
      <MemoryRouter>
        <Marketplace />
      </MemoryRouter>
    );

  it('renders the Marketplace heading and subtitle', () => {
    renderMarketplace();

    expect(screen.getByRole('heading', { name: 'Marketplace' }))
      .toBeInTheDocument();

    expect(
      screen.getByText('Buy and sell items within your campus community')
    ).toBeInTheDocument();
  });

  it('loads and displays marketplace products', () => {
    renderMarketplace();

    expect(screen.getByText('Engineering Mathematics Book')).toBeInTheDocument();
    expect(screen.getByText('Scientific Calculator')).toBeInTheDocument();

    expect(mocks.collection).toHaveBeenCalledWith({}, 'marketplace');
  });

  it('filters products by search term', async () => {
    renderMarketplace();

    fireEvent.change(screen.getByRole('textbox', { name: 'Search products' }), {
      target: { value: 'calculator' },
    });

    expect(await screen.findByText('Scientific Calculator')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Engineering Mathematics Book'))
        .not.toBeInTheDocument();
    });

    expect(mocks.getDocs).toHaveBeenCalled();
  });

  it('filters products by category', async () => {
    renderMarketplace();

    fireEvent.click(screen.getByRole('button', { name: 'Books', exact: true }));

    expect(await screen.findByText('Engineering Mathematics Book'))
      .toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Scientific Calculator'))
        .not.toBeInTheDocument();
    });

    expect(mocks.getDocs).toHaveBeenCalled();
  });

  it('shows an empty message when no products match', async () => {
    mocks.getDocs.mockResolvedValue({
      docs: [],
    });

    renderMarketplace();

    fireEvent.change(screen.getByRole('textbox', { name: 'Search products' }), {
      target: { value: 'nonexistent item' },
    });

    expect(
      await screen.findByText('No listings match your search or category.')
    ).toBeInTheDocument();
  });

  it('shows an error when Firestore loading fails', () => {
    mocks.onSnapshot.mockImplementation((query, success, error) => {
      error(new Error('Permission denied'));
      return vi.fn();
    });

    renderMarketplace();

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Could not load listings. Check your Firestore rules and connection.'
    );
  });

  it('opens the create listing form', () => {
    renderMarketplace();

    fireEvent.click(screen.getByRole('button', { name: 'Add Listing' }));

    expect(screen.getByRole('heading', { name: 'Create Listing' }))
      .toBeInTheDocument();

    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Price (₹)')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  it('creates a listing with valid details', async () => {
    renderMarketplace();

    fireEvent.click(screen.getByRole('button', { name: 'Add Listing' }));

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: '  Used Laptop  ' },
    });

    fireEvent.change(screen.getByLabelText('Category'), {
      target: { value: 'Electronics' },
    });

    fireEvent.change(screen.getByLabelText('Price (₹)'), {
      target: { value: '12000' },
    });

    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Good working condition' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Publish Listing' }));

    await waitFor(() => {
      expect(mocks.addDoc).toHaveBeenCalled();
    });

    expect(mocks.addDoc.mock.calls[0][1]).toMatchObject({
      title: 'Used Laptop',
      category: 'Electronics',
      price: 12000,
      description: 'Good working condition',
      ownerId: 'student123',
    });

    expect(await screen.findByRole('status'))
      .toHaveTextContent('Listing created successfully.');
  });

  it('rejects invalid or negative listing prices', () => {
    renderMarketplace();

    fireEvent.click(screen.getByRole('button', { name: 'Add Listing' }));

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Laptop' },
    });

    fireEvent.change(screen.getByLabelText('Category'), {
      target: { value: 'Electronics' },
    });

    fireEvent.change(screen.getByLabelText('Price (₹)'), {
      target: { value: '-100' },
    });

    fireEvent.submit(
      screen.getByRole('heading', { name: 'Create Listing' }).closest('form')
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Enter a title, category and valid non-negative price.'
    );

    expect(mocks.addDoc).not.toHaveBeenCalled();
  });

  it('rejects listing creation for an unverified or non-college account', () => {
    mocks.auth.currentUser = {
      uid: 'user1',
      email: 'user@gmail.com',
      emailVerified: true,
    };

    renderMarketplace();

    fireEvent.click(screen.getByRole('button', { name: 'Add Listing' }));

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Laptop' },
    });

    fireEvent.change(screen.getByLabelText('Category'), {
      target: { value: 'Electronics' },
    });

    fireEvent.change(screen.getByLabelText('Price (₹)'), {
      target: { value: '1000' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Publish Listing' }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Please sign in with your verified MITS college account.'
    );

    expect(mocks.addDoc).not.toHaveBeenCalled();
  });

  it('opens the edit form with existing product details', () => {
    renderMarketplace();

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

    expect(screen.getByRole('heading', { name: 'Edit Listing' }))
      .toBeInTheDocument();

    expect(screen.getByLabelText('Title'))
      .toHaveValue('Engineering Mathematics Book');

    expect(screen.getByLabelText('Price (₹)')).toHaveValue(300);
  });

  it('updates a listing owned by the current user', async () => {
    renderMarketplace();

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Updated Mathematics Book' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    await waitFor(() => {
      expect(mocks.updateDoc).toHaveBeenCalled();
    });

    expect(mocks.deleteField).toHaveBeenCalled();

    expect(await screen.findByRole('status'))
      .toHaveTextContent('Listing updated successfully.');
  });

  it('prevents editing a listing owned by another user', () => {
    mocks.onSnapshot.mockImplementation((query, success) => {
      success({
        docs: [{
          id: 'other',
          data: () => ({
            title: 'Other Listing',
            category: 'Books',
            price: 100,
            ownerId: 'another-user',
          }),
        }],
      });
      return vi.fn();
    });

    renderMarketplace();

    expect(screen.queryByRole('button', { name: 'Edit' }))
      .not.toBeInTheDocument();
  });

  it('deletes an owned listing after confirmation', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    renderMarketplace();

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(mocks.deleteDoc).toHaveBeenCalled();
    });

    expect(window.confirm).toHaveBeenCalledWith(
      'Delete "Engineering Mathematics Book"?'
    );

    expect(await screen.findByRole('status'))
      .toHaveTextContent('Listing deleted successfully.');
  });

  it('does not delete a listing when confirmation is cancelled', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    renderMarketplace();

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(mocks.deleteDoc).not.toHaveBeenCalled();
  });

  it('fetches recommendations when a search is entered', async () => {
    renderMarketplace();

    fireEvent.change(screen.getByRole('textbox', { name: 'Search products' }), {
      target: { value: 'calculator' },
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'https://unihub-xd9r.onrender.com/api/recommendations',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });
  });

  it('renders recommendations returned by the API', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        recommendations: [
          {
            id: 'rec1',
            title: 'Recommended Calculator',
            category: 'Electronics',
            price: 400,
          },
        ],
      }),
    });

    renderMarketplace();

    fireEvent.change(screen.getByRole('textbox', { name: 'Search products' }), {
      target: { value: 'calculator' },
    });

    expect(await screen.findByText('Recommended for You')).toBeInTheDocument();
    expect(await screen.findByText('Recommended Calculator')).toBeInTheDocument();
  });

  it('shows a login link when no user is signed in', () => {
    mocks.auth.currentUser = null;

    renderMarketplace();

    expect(
      screen.getByRole('link', { name: /Sign in with your college account/i })
    ).toHaveAttribute('href', '/login');

    expect(screen.queryByRole('button', { name: 'Add Listing' }))
      .not.toBeInTheDocument();
  });

  it('closes the listing form when Cancel is clicked', () => {
    renderMarketplace();

    fireEvent.click(screen.getByRole('button', { name: 'Add Listing' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('heading', { name: 'Create Listing' }))
      .not.toBeInTheDocument();
  });

  it('loads the first page with the configured page size', () => {
    renderMarketplace();

    expect(mocks.documentId).toHaveBeenCalled();
    expect(mocks.orderBy).toHaveBeenCalled();
    expect(mocks.limit).toHaveBeenCalledWith(12);
  });

  it('loads the next page when Load More Listings is clicked', async () => {
    const firstPage = Array.from({ length: 12 }, (_, index) => ({
      id: `p${index + 1}`,
      title: `Product ${index + 1}`,
      category: 'Books',
      price: 100,
      description: 'Test product',
      ownerId: 'another-user',
    }));

    const nextProduct = {
      id: 'p13',
      title: 'Product 13',
      category: 'Books',
      price: 100,
      description: 'Test product',
      ownerId: 'another-user',
    };

    mocks.onSnapshot.mockImplementation((query, success) => {
      success({
        docs: makeDocs(firstPage),
      });
      return vi.fn();
    });

    mocks.getDocs.mockResolvedValue({
      docs: makeDocs([nextProduct]),
    });

    renderMarketplace();

    expect(await screen.findByText('Product 12')).toBeInTheDocument();

    fireEvent.click(
      await screen.findByRole('button', { name: 'Load More Listings' })
    );

    expect(await screen.findByText('Product 13')).toBeInTheDocument();
    expect(mocks.getDocs).toHaveBeenCalled();
    expect(mocks.startAfter).toHaveBeenCalled();
  });
});
