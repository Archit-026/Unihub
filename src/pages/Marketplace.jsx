
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Plus, Pencil, Trash2, X } from 'lucide-react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  
} from 'firebase/firestore';
import { Link } from 'react-router-dom';

import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import ProductCard from '../components/ProductCard';
import { categories } from '../data/mockData';
import { auth, db } from '../firebase';

const emptyForm = {
  title: '',
  category: '',
  price: '',
  description: ''
};

const Marketplace = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
   

    const listingsQuery = query(collection(db, 'marketplace'));

    const unsubscribe = onSnapshot(
      listingsQuery,
      (snapshot) => {
        setProducts(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data()
          }))
        );
        setLoading(false);
        setError('');
      },
      (err) => {
        console.error('Marketplace load error:', err);
        setError('Could not load listings. Check your Firestore rules and connection.');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const filtered = products.filter((product) => {
    const title = String(product.title || '');
    const matchSearch = title.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      activeCategory === 'All' || product.category === activeCategory;

    return matchSearch && matchCategory;
  });
  
useEffect(() => {
  const controller = new AbortController();

  async function fetchRecommendations() {
    if (!search.trim() && activeCategory === 'All') {
      setRecommendations([]);
      return;
    }

    try {
      const response = await fetch(
        'https://unihub-xd9r.onrender.com/api/recommendations',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            products,
            search,
            category: activeCategory,
            limit: 4,
          }),
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        throw new Error('Recommendation API request failed');
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Recommendation API error:', error);
        setRecommendations([]);
      }
    }
  }

  fetchRecommendations();

  return () => controller.abort();
}, [products, search, activeCategory]);


  const openCreateForm = () => {
    setForm({
      ...emptyForm,
      category: categories.find((category) => category !== 'All') || ''
    });
    setEditingId(null);
    setShowForm(true);
    setNotice('');
    setError('');
  };

  const openEditForm = (product) => {
    setForm({
      title: product.title || '',
      category: product.category || '',
      price: product.price ?? '',
      description: product.description || ''
    });
    setEditingId(product.id);
    setShowForm(true);
    setNotice('');
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');

    const user = auth.currentUser;
    const email = user?.email?.toLowerCase() || '';

    if (
      !user ||
      !user.emailVerified ||
      !email.endsWith('@mitsgwl.ac.in')
    ) {
      setError('Please sign in with your verified MITS college account.');
      return;
    }

    const price = Number(form.price);

    if (
      !form.title.trim() ||
      !form.category ||
      form.price === '' ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      setError('Enter a title, category and valid non-negative price.');
      return;
    }

    const data = {
      title: form.title.trim(),
      category: form.category,
      price,
      description: form.description.trim(),
      ownerId: user.uid,
      ownerEmail: user.email,
      updatedAt: new Date().toISOString()
    };

    setSaving(true);

    try {
      if (editingId) {
        const existing = products.find((item) => item.id === editingId);

        if (!existing || existing.ownerId !== user.uid) {
          throw new Error('You can only edit your own listings.');
        }

        await updateDoc(doc(db, 'marketplace', editingId), data);
        setNotice('Listing updated successfully.');
      } else {
        await addDoc(collection(db, 'marketplace'), {
          ...data,
          createdAt: new Date().toISOString()
        });
        setNotice('Listing created successfully.');
      }

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error('Marketplace save error:', err);
      setError(err.message || 'Could not save listing. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    const user = auth.currentUser;

    if (!user || product.ownerId !== user.uid) {
      setError('You can only delete your own listings.');
      return;
    }

    if (!window.confirm(`Delete "${product.title}"?`)) return;

    setError('');
    setNotice('');

    try {
      await deleteDoc(doc(db, 'marketplace', product.id));
      setNotice('Listing deleted successfully.');
    } catch (err) {
      console.error('Marketplace delete error:', err);
      setError('Could not delete listing. Please try again.');
    }
  };

  return (
    <div className="page page-marketplace">
      <div className="page-header">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="page-title">
            <ShoppingBag size={28} /> Marketplace
          </h1>
          <p className="page-subtitle">
            Buy and sell items within your campus community
          </p>
        </motion.div>
      </div>

      <div className="marketplace-controls">
        <SearchBar
          placeholder="Search products..."
          value={search}
          onChange={setSearch}
        />
        <CategoryFilter
          categories={categories}
          active={activeCategory}
          onChange={setActiveCategory}
        />
      </div>
      
{recommendations.length > 0 && (
  <section
    className="marketplace-recommendations"
    aria-labelledby="recommendations-title"
  >
    <div className="page-header">
      <div>
        <h2 id="recommendations-title">Recommended for You</h2>
        <p className="page-subtitle">
          Ranked by your selected category and search keywords.
        </p>
      </div>
    </div>

    <div className="products-grid">
      {recommendations.map((product, index) => (
        <div key={product.id}>
          <ProductCard product={product} index={index} />
        </div>
      ))}
    </div>
  </section>
)}


      <div style={{ margin: '20px 0' }}>
        {auth.currentUser ? (
          <button
            type="button"
            onClick={openCreateForm}
            style={buttonStyle}
          >
            <Plus size={18} /> Add Listing
          </button>
        ) : (
          <p>
            <Link to="/login">Sign in with your college account</Link> to
            create listings.
          </p>
        )}
      </div>

      {error && <p role="alert" style={errorStyle}>{error}</p>}
      {notice && <p role="status" style={successStyle}>{notice}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} style={formStyle}>
          <h2>{editingId ? 'Edit Listing' : 'Create Listing'}</h2>

          <label>
            Title
            <input
              required
              maxLength={100}
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
              placeholder="e.g. Used scientific calculator"
              style={inputStyle}
            />
          </label>

          <label>
            Category
            <select
              required
              value={form.category}
              onChange={(event) =>
                setForm({ ...form, category: event.target.value })
              }
              style={inputStyle}
            >
              <option value="">Select category</option>
              {categories
                .filter((category) => category !== 'All')
                .map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>
          </label>

          <label>
            Price (₹)
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(event) =>
                setForm({ ...form, price: event.target.value })
              }
              style={inputStyle}
            />
          </label>

          <label>
            Description
            <textarea
              maxLength={1000}
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
              placeholder="Describe the item's condition..."
              style={{ ...inputStyle, minHeight: 90 }}
            />
          </label>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button type="submit" disabled={saving} style={buttonStyle}>
              {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Publish Listing'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setForm(emptyForm);
              }}
              style={secondaryButtonStyle}
            >
              <X size={16} /> Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Loading marketplace listings...</p>
     ) : filtered.length === 0 ? (
        <div className="empty-state">
          <p>
            {search || activeCategory !== 'All'
              ? 'No listings match your search or category.'
              : 'No listings yet. Add the first marketplace listing!'}
          </p>
        </div>
      ) : (
        <div className="products-grid">
          {filtered.map((product, index) => (
            <div key={product.id}>
              <ProductCard product={product} index={index} />

              {product.ownerId === auth.currentUser?.uid && (
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => openEditForm(product)}
                    style={secondaryButtonStyle}
                  >
                    <Pencil size={15} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product)}
                    style={deleteButtonStyle}
                  >
                    <Trash2 size={15} /> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const buttonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '11px 18px',
  border: 'none',
  borderRadius: 9,
  background: '#2563eb',
  color: '#fff',
  cursor: 'pointer',
  fontWeight: 600
};

const secondaryButtonStyle = {
  ...buttonStyle,
  background: '#e5e7eb',
  color: '#111827'
};

const deleteButtonStyle = {
  ...buttonStyle,
  background: '#dc2626'
};

const inputStyle = {
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  marginTop: 6,
  padding: 11,
  border: '1px solid #d1d5db',
  borderRadius: 8,
  font: 'inherit'
};

const formStyle = {
  display: 'grid',
  gap: 16,
  maxWidth: 560,
  margin: '20px 0',
  padding: 20,
  border: '1px solid #e5e7eb',
  borderRadius: 12
};

const errorStyle = {
  color: '#b91c1c',
  padding: 12,
  background: '#fee2e2',
  borderRadius: 8
};

const successStyle = {
  color: '#166534',
  padding: 12,
  background: '#dcfce7',
  borderRadius: 8
};

export default Marketplace;
