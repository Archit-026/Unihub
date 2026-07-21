const fs = require('fs');
const path = require('path');

function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  // Remove existing directory if it exists with the same name
  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      fs.rmdirSync(filePath, { recursive: true });
    }
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Created:', filePath);
}

// Navbar
writeFile('src/components/Navbar.jsx', `import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, GraduationCap, Home, ShoppingBag, Search, Calendar, LayoutDashboard, User, HelpCircle } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
  { to: '/lost-found', label: 'Lost & Found', icon: Search },
  { to: '/events', label: 'Events', icon: Calendar },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/help', label: 'Help', icon: HelpCircle },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <GraduationCap size={28} color="#2563EB" />
          <span className="navbar-logo-text">UniHub</span>
        </Link>

        <div className="navbar-desktop">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={\`navbar-link \${isActive ? 'active' : ''}\`}
              >
                <Icon size={16} />
                <span>{link.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="navbar-indicator"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        <button className="navbar-hamburger" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="navbar-mobile"
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={\`navbar-mobile-link \${isActive ? 'active' : ''}\`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon size={18} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
`);

// Footer
writeFile('src/components/Footer.jsx', `import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-logo">
            <GraduationCap size={28} color="#2563EB" />
            <span className="footer-logo-text">UniHub</span>
          </div>
          <p className="footer-tagline">One Campus. Endless Connections.</p>
          <p className="footer-desc">
            A modern student ecosystem combining marketplace, lost & found, events, internships, clubs and student networking.
          </p>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Quick Links</h3>
          <Link to="/marketplace" className="footer-link">Marketplace</Link>
          <Link to="/lost-found" className="footer-link">Lost & Found</Link>
          <Link to="/events" className="footer-link">Events</Link>
          <Link to="/dashboard" className="footer-link">Dashboard</Link>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Support</h3>
          <Link to="/help" className="footer-link">Help Center</Link>
          <Link to="/help" className="footer-link">FAQ</Link>
          <Link to="/help" className="footer-link">Contact Us</Link>
          <Link to="/" className="footer-link">Privacy Policy</Link>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Contact</h3>
          <div className="footer-contact-item">
            <MapPin size={16} />
            <span>University Campus, Main Building</span>
          </div>
          <div className="footer-contact-item">
            <Mail size={16} />
            <span>support@unihub.edu</span>
          </div>
          <div className="footer-contact-item">
            <Phone size={16} />
            <span>+91 1800-123-4567</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 UniHub. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
`);

// FeatureCard
writeFile('src/components/FeatureCard.jsx', `import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon, title, description, index }) => {
  return (
    <motion.div
      className="feature-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <div className="feature-card-icon">{icon}</div>
      <h3 className="feature-card-title">{title}</h3>
      <p className="feature-card-desc">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
`);

// ProductCard
writeFile('src/components/ProductCard.jsx', `import React from 'react';
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
          <Tag size={32} color="#94A3B8" />
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
`);

// EventCard
writeFile('src/components/EventCard.jsx', `import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

const EventCard = ({ event, index }) => {
  const eventDate = new Date(event.date);
  const today = new Date();
  const diffTime = eventDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const countdown = diffDays > 0 ? \`\${diffDays} days left\` : 'Ongoing';

  return (
    <motion.div
      className="event-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <div className="event-card-header">
        <span className="event-badge">{event.category}</span>
        <span className="event-countdown">{countdown}</span>
      </div>
      <div className="event-card-body">
        <h3 className="event-card-title">{event.title}</h3>
        <p className="event-card-desc">{event.description}</p>
        <div className="event-card-meta">
          <div className="event-meta-item">
            <Calendar size={14} />
            <span>{event.date}</span>
          </div>
          <div className="event-meta-item">
            <Clock size={14} />
            <span>{event.time}</span>
          </div>
          <div className="event-meta-item">
            <MapPin size={14} />
            <span>{event.location}</span>
          </div>
          <div className="event-meta-item">
            <Users size={14} />
            <span>{event.registered} registered</span>
          </div>
        </div>
        <button className="btn btn-primary event-btn">Register Now</button>
      </div>
    </motion.div>
  );
};

export default EventCard;
`);

// StatCard
writeFile('src/components/StatCard.jsx', `import React from 'react';
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
`);

// SearchBar
writeFile('src/components/SearchBar.jsx', `import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ placeholder, value, onChange }) => {
  return (
    <div className="search-bar">
      <Search size={20} className="search-icon" />
      <input
        type="text"
        placeholder={placeholder || 'Search...'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;
`);

// CategoryFilter
writeFile('src/components/CategoryFilter.jsx', `import React from 'react';
import { motion } from 'framer-motion';

const CategoryFilter = ({ categories, active, onChange }) => {
  return (
    <div className="category-filter">
      {categories.map((cat) => (
        <motion.button
          key={cat}
          className={\`category-btn \${active === cat ? 'active' : ''}\`}
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
`);

// Hero
writeFile('src/components/Hero.jsx', `import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag } from 'lucide-react';

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
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
`);

// Features
writeFile('src/components/Features.jsx', `import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Search, Calendar, Briefcase, Users, Award } from 'lucide-react';
import FeatureCard from './FeatureCard';

const featuresData = [
  { icon: <ShoppingBag size={32} />, title: 'Marketplace', description: 'Buy and sell items within your campus community. From textbooks to electronics, find great deals.' },
  { icon: <Search size={32} />, title: 'Lost & Found', description: 'Report lost items or return found belongings. Help keep our campus community connected.' },
  { icon: <Calendar size={32} />, title: 'Events', description: 'Discover and register for campus events, workshops, fests, and more.' },
  { icon: <Briefcase size={32} />, title: 'Internships', description: 'Find internship opportunities tailored for students, from startups to top companies.' },
  { icon: <Users size={32} />, title: 'Student Clubs', description: 'Explore and join student clubs, meet like-minded peers, and grow together.' },
  { icon: <Award size={32} />, title: 'Achievements', description: 'Earn badges and recognition for your campus involvement and contributions.' },
];

const Features = () => {
  return (
    <section className="features" id="features">
      <div className="features-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">Everything You Need</h2>
          <p className="section-subtitle">
            One platform for all your campus needs — from buying textbooks to finding internships.
          </p>
        </motion.div>
        <div className="features-grid">
          {featuresData.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
`);

console.log('All component files created!');