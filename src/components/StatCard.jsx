import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ number, label, icon, index }) => {
  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="stat-card-icon">{icon}</div>
      <h3 className="stat-card-number">{number}</h3>
      <p className="stat-card-label">{label}</p>
    </motion.div>
  );
};

export default StatCard;