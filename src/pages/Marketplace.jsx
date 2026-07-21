import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import ProductCard from '../components/ProductCard';
import { products, categories } from '../data/mockData';

const Marketplace = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = products.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === 'All' || p.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="page page-marketplace">
      <div className="page-header">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="page-title"><ShoppingBag size={28} /> Marketplace</h1>
          <p className="page-subtitle">Buy and sell items within your campus community</p>
        </motion.div>
      </div>
      <div className="marketplace-controls">
        <SearchBar placeholder="Search products..." value={search} onChange={setSearch} />
        <CategoryFilter categories={categories} active={activeCategory} onChange={setActiveCategory} />
      </div>
      <div className="products-grid">
        {filtered.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="empty-state">
          <p>No products found. Try a different search or category.</p>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
