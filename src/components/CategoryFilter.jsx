import React from 'react';
import { motion } from 'framer-motion';

const CategoryFilter = ({ categories, active, onChange }) => {
  return (
    <div className="category-filter">
      {categories.map((cat) => (
        <motion.button
          key={cat}
          className={`category-btn ${active === cat ? 'active' : ''}`}
          onClick={() => onChange(cat)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {cat}
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryFilter;