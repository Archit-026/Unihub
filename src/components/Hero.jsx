import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, RefreshCw } from 'lucide-react';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      <div className="hero-container">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            One Campus.
            <br />
            <span className="hero-highlight">Endless Connections.</span>
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            UniHub brings together marketplace, lost & found, events, internships, and student networking —
            everything you need, right on your campus.
          </motion.p>
          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/marketplace" className="btn btn-primary btn-lg">
              Get Started <ArrowRight size={20} />
            </Link>
            <Link to="/marketplace" className="btn btn-outline btn-lg">
              <ShoppingBag size={20} /> Explore Marketplace
            </Link>
            <Link to="/learners" className="btn btn-outline btn-lg">
              <RefreshCw size={20} /> Learners Hub
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;