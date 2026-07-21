import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, User, Tag } from 'lucide-react';

const ProductCard = ({ product, index }) => {
  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
    >
      <div className="product-card-image">
        <div className="product-image-placeholder">
          <Tag size={32} color="var(--text-muted)" />
        </div>
        <span className="product-condition">{product.condition}</span>
      </div>
      <div className="product-card-body">
        <h3 className="product-card-title">{product.title}</h3>
        <p className="product-card-price">{product.price}</p>
        <div className="product-card-seller">
          <User size={14} />
          <span>{product.seller}</span>
        </div>
        <button className="btn btn-primary product-btn">
          <ShoppingCart size={16} />
          Buy Now
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;