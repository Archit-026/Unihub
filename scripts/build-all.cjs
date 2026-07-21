const fs = require('fs');
const path = require('path');

function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      fs.rmdirSync(filePath, { recursive: true });
    }
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Created:', filePath);
}

// ============ PAGES ============

// Home.jsx
writeFile('src/pages/Home.jsx', `import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Search, Calendar, Briefcase, ArrowRight, Star, ChevronDown, Users } from 'lucide-react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import StatCard from '../components/StatCard';
import ProductCard from '../components/ProductCard';
import EventCard from '../components/EventCard';
import Footer from '../components/Footer';
import { products, events, internships, testimonials, faqs, lostItems } from '../data/mockData';

const statsData = [
  { number: '500+', label: 'Active Students', icon: <Users size={28} /> },
  { number: '200+', label: 'Products Listed', icon: <ShoppingBag size={28} /> },
  { number: '50+', label: 'Events This Year', icon: <Calendar size={28} /> },
  { number: '30+', label: 'Internships Posted', icon: <Briefcase size={28} /> },
];

const Home = () => {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="page">
      <Hero />

      <section className="stats-section">
        <div className="stats-container">
          <div className="stats-grid">
            {statsData.map((stat, index) => (
              <StatCard key={index} {...stat} index={index} />
            ))}
          </div>
        </div>
      </section>

      <Features />

      <section className="section-preview">
        <div className="preview-container">
          <motion.div className="section-header" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="section-title">Marketplace</h2>
            <p className="section-subtitle">Buy and sell items with fellow students</p>
          </motion.div>
          <div className="preview-grid">
            {products.slice(0, 4).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
          <motion.div className="preview-cta" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Link to="/marketplace" className="btn btn-primary">View All Products <ArrowRight size={18} /></Link>
          </motion.div>
        </div>
      </section>

      <section className="section-preview section-alt">
        <div className="preview-container">
          <motion.div className="section-header" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="section-title">Lost & Found</h2>
            <p className="section-subtitle">Help return lost items to their owners</p>
          </motion.div>
          <div className="lostfound-preview-grid">
            {[lostItems[0], lostItems[3]].map((item, index) => (
              <motion.div key={item.id} className={\`lostfound-card \${item.status}\`} initial={{ opacity: 0, x: index === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.1 }}>
                <div className="lostfound-badge">{item.status === 'lost' ? 'Lost' : 'Found'}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="lostfound-location">{item.location}</span>
              </motion.div>
            ))}
          </div>
          <motion.div className="preview-cta" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Link to="/lost-found" className="btn btn-primary">Go to Lost & Found <ArrowRight size={18} /></Link>
          </motion.div>
        </div>
      </section>

      <section className="section-preview">
        <div className="preview-container">
          <motion.div className="section-header" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="section-title">Upcoming Events</h2>
            <p className="section-subtitle">Don't miss out on campus activities</p>
          </motion.div>
          <div className="preview-grid">
            {events.slice(0, 3).map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
          <motion.div className="preview-cta" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Link to="/events" className="btn btn-primary">View All Events <ArrowRight size={18} /></Link>
          </motion.div>
        </div>
      </section>

      <section className="section-preview section-alt">
        <div className="preview-container">
          <motion.div className="section-header" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="section-title">Internship Opportunities</h2>
            <p className="section-subtitle">Kickstart your career with these opportunities</p>
          </motion.div>
          <div className="internship-grid">
            {internships.map((internship, index) => (
              <motion.div key={internship.id} className="internship-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: index * 0.08 }} whileHover={{ y: -3 }}>
                <div className="internship-header">
                  <h3>{internship.title}</h3>
                  <span className="internship-company">{internship.company}</span>
                </div>
                <div className="internship-details">
                  <span>📍 {internship.location}</span>
                  <span>⏱ {internship.duration}</span>
                  <span>💰 {internship.stipend}</span>
                </div>
                <div className="internship-footer">
                  <span className="internship-type">{internship.type}</span>
                  <span className="internship-deadline">Deadline: {internship.deadline}</span>
                </div>
                <button className="btn btn-primary btn-sm">Apply Now</button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-preview">
        <div className="preview-container">
          <motion.div className="section-header" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="section-title">What Students Say</h2>
            <p className="section-subtitle">Hear from your fellow campus mates</p>
          </motion.div>
          <div className="testimonials-grid">
            {testimonials.map((t, index) => (
              <motion.div key={t.id} className="testimonial-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.1 }}>
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < t.rating ? '#F59E0B' : 'none'} color={i < t.rating ? '#F59E0B' : '#D1D5DB'} />
                  ))}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.name.charAt(0)}</div>
                  <div>
                    <p className="testimonial-name">{t.name}</p>
                    <p className="testimonial-role">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-preview section-alt">
        <div className="preview-container">
          <motion.div className="section-header" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">Everything you need to know about UniHub</p>
          </motion.div>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <motion.div key={index} className={\`faq-item \${openFaq === index ? 'open' : ''}\`} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: index * 0.05 }}>
                <button className="faq-question" onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                  <span>{faq.q}</span>
                  <ChevronDown size={20} className={\`faq-arrow \${openFaq === index ? 'rotated' : ''}\`} />
                </button>
                <motion.div className="faq-answer" initial={false} animate={{ height: openFaq === index ? 'auto' : 0, opacity: openFaq === index ? 1 : 0 }} transition={{ duration: 0.3 }}>
                  <p>{faq.a}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
`);

// Marketplace.jsx
writeFile('src/pages/Marketplace.jsx', `import React, { useState } from 'react';
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
`);

// LostFound.jsx
writeFile('src/pages/LostFound.jsx', `import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Eye } from 'lucide-react';
import { lostItems } from '../data/mockData';

const LostFound = () => {
  const [tab, setTab] = useState('all');
  const [showForm, setShowForm] = useState(null);

  const filtered = tab === 'all' ? lostItems : lostItems.filter((i) => i.status === tab);

  return (
    <div className="page page-lostfound">
      <div className="page-header">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="page-title"><Search size={28} /> Lost & Found</h1>
          <p className="page-subtitle">Report lost items or return found belongings</p>
        </motion.div>
      </div>

      <div className="lostfound-tabs">
        <button className={\`tab-btn \${tab === 'all' ? 'active' : ''}\`} onClick={() => setTab('all')}>All Items</button>
        <button className={\`tab-btn \${tab === 'lost' ? 'active' : ''}\`} onClick={() => setTab('lost')}>Lost Items</button>
        <button className={\`tab-btn \${tab === 'found' ? 'active' : ''}\`} onClick={() => setTab('found')}>Found Items</button>
      </div>

      <div className="lostfound-actions">
        <button className="btn btn-primary" onClick={() => setShowForm('lost')}><Plus size={18} /> Report Lost Item</button>
        <button className="btn btn-outline" onClick={() => setShowForm('found')}><Plus size={18} /> Report Found Item</button>
      </div>

      {showForm && (
        <motion.div className="report-form" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h3>Report {showForm === 'lost' ? 'Lost' : 'Found'} Item</h3>
          <div className="form-group">
            <input type="text" placeholder="Item title" className="form-input" />
          </div>
          <div className="form-group">
            <textarea placeholder="Description" className="form-input" rows="3"></textarea>
          </div>
          <div className="form-group">
            <input type="text" placeholder="Location" className="form-input" />
          </div>
          <div className="form-actions">
            <button className="btn btn-primary">Submit Report</button>
            <button className="btn btn-outline" onClick={() => setShowForm(null)}>Cancel</button>
          </div>
        </motion.div>
      )}

      <div className="lostfound-grid">
        {filtered.map((item, index) => (
          <motion.div key={item.id} className={\`lostfound-card-full \${item.status}\`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
            <div className="lostfound-card-header">
              <span className={\`status-badge \${item.status}\`}>{item.status === 'lost' ? 'Lost' : 'Found'}</span>
              <span className="item-date">{item.date}</span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <div className="item-meta">
              <span>📍 {item.location}</span>
              <span>👤 {item.reporter}</span>
            </div>
            <button className="btn btn-outline btn-sm"><Eye size={14} /> View Details</button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LostFound;
`);

// Events.jsx
writeFile('src/pages/Events.jsx', `import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import EventCard from '../components/EventCard';
import { events } from '../data/mockData';

const Events = () => {
  return (
    <div className="page page-events">
      <div className="page-header">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="page-title"><Calendar size={28} /> Events</h1>
          <p className="page-subtitle">Discover and register for campus events</p>
        </motion.div>
      </div>
      <div className="events-grid">
        {events.map((event, index) => (
          <EventCard key={event.id} event={event} index={index} />
        ))}
      </div>
    </div>
  );
};

export default Events;
`);

// Dashboard.jsx
writeFile('src/pages/Dashboard.jsx', `import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, ShoppingBag, Calendar, Search, Award, Users, Plus, Bell, Activity } from 'lucide-react';
import { dashboardStats, recentActivity, notifications, quickActions } from '../data/mockData';

const statIcons = {
  totalListings: <ShoppingBag size={24} />,
  activeListings: <ShoppingBag size={24} />,
  eventsAttended: <Calendar size={24} />,
  lostReports: <Search size={24} />,
  achievements: <Award size={24} />,
  connections: <Users size={24} />,
};

const Dashboard = () => {
  return (
    <div className="page page-dashboard">
      <div className="page-header">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="page-title"><LayoutDashboard size={28} /> Dashboard</h1>
          <p className="page-subtitle">Welcome back, Arjun! Here's your campus overview.</p>
        </motion.div>
      </div>

      <div className="dashboard-stats-grid">
        {Object.entries(dashboardStats).map(([key, value], index) => (
          <motion.div key={key} className="dashboard-stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
            <div className="dash-stat-icon">{statIcons[key] || <Activity size={24} />}</div>
            <div className="dash-stat-info">
              <h3>{value}</h3>
              <p>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h2><Activity size={20} /> Recent Activity</h2>
          <div className="activity-list">
            {recentActivity.map((a) => (
              <div key={a.id} className="activity-item">
                <div className={\`activity-dot \${a.type}\`}></div>
                <div className="activity-content">
                  <p>{a.action}</p>
                  <span>{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <h2><Bell size={20} /> Notifications</h2>
          <div className="notifications-list">
            {notifications.map((n) => (
              <div key={n.id} className={\`notification-item \${n.read ? 'read' : 'unread'}\`}>
                <div className="notification-content">
                  <p className="notification-title">{n.title}</p>
                  <p className="notification-message">{n.message}</p>
                  <span>{n.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2><Plus size={20} /> Quick Actions</h2>
        <div className="quick-actions-grid">
          {quickActions.map((action) => (
            <motion.button key={action.id} className="quick-action-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ borderColor: action.color }}>
              <div className="quick-action-icon" style={{ backgroundColor: action.color }}>+</div>
              <span>{action.title}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
`);

// Profile.jsx
writeFile('src/pages/Profile.jsx', `import React from 'react';
import { motion } from 'framer-motion';
import { User, Award, Bookmark, ShoppingBag, Mail, Github, Linkedin, Twitter } from 'lucide-react';
import { studentProfile } from '../data/mockData';

const Profile = () => {
  const { name, email, branch, year, bio, achievements, skills, socialLinks } = studentProfile;

  return (
    <div className="page page-profile">
      <div className="page-header">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="page-title"><User size={28} /> Profile</h1>
        </motion.div>
      </div>

      <div className="profile-layout">
        <motion.div className="profile-card-main" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div className="profile-avatar-large">{name.split(' ').map((n) => n[0]).join('')}</div>
          <h2>{name}</h2>
          <p className="profile-email"><Mail size={14} /> {email}</p>
          <p className="profile-branch">{branch} - {year}</p>
          <p className="profile-bio">{bio}</p>
          <div className="profile-skills">
            {skills.map((skill) => (
              <span key={skill} className="skill-tag">{skill}</span>
            ))}
          </div>
          <div className="profile-social">
            <a href="#" className="social-link"><Github size={20} /></a>
            <a href="#" className="social-link"><Linkedin size={20} /></a>
            <a href="#" className="social-link"><Twitter size={20} /></a>
          </div>
        </motion.div>

        <div className="profile-side">
          <motion.div className="profile-section-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <h3><Award size={18} /> Achievements</h3>
            <div className="achievements-list">
              {achievements.map((a) => (
                <div key={a.id} className="achievement-item">
                  <div className="achievement-icon"><Award size={20} /></div>
                  <div>
                    <p className="achievement-title">{a.title}</p>
                    <p className="achievement-desc">{a.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className="profile-section-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <h3><Bookmark size={18} /> Bookmarks</h3>
            <div className="bookmarks-list">
              <div className="bookmark-item">
                <span>Data Analyst Intern - DataViz</span>
              </div>
              <div className="bookmark-item">
                <span>Tech Fest 2026</span>
              </div>
              <div className="bookmark-item">
                <span>Python Crash Course Book</span>
              </div>
            </div>
          </motion.div>

          <motion.div className="profile-section-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <h3><ShoppingBag size={18} /> My Listings</h3>
            <div className="listings-list">
              <div className="listing-item">
                <span>Calculus Book - ₹299</span>
                <span className="listing-status active">Active</span>
              </div>
              <div className="listing-item">
                <span>Desk Lamp - ₹600</span>
                <span className="listing-status active">Active</span>
              </div>
              <div className="listing-item">
                <span>Notebook Bundle - ₹150</span>
                <span className="listing-status sold">Sold</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
`);

// Help.jsx
writeFile('src/pages/Help.jsx', `import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown, Mail, MessageCircle, Phone, FileText } from 'lucide-react';
import { faqs } from '../data/mockData';

const Help = () => {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="page page-help">
      <div className="page-header">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="page-title"><HelpCircle size={28} /> Help Center</h1>
          <p className="page-subtitle">Find answers and get support</p>
        </motion.div>
      </div>

      <div className="help-contact-grid">
        <motion.div className="help-contact-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
          <Mail size={32} color="#2563EB" />
          <h3>Email Support</h3>
          <p>support@unihub.edu</p>
          <span>Response within 24 hours</span>
        </motion.div>
        <motion.div className="help-contact-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
          <MessageCircle size={32} color="#2563EB" />
          <h3>Live Chat</h3>
          <p>Chat with our team</p>
          <span>Available 9 AM - 6 PM</span>
        </motion.div>
        <motion.div className="help-contact-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
          <Phone size={32} color="#2563EB" />
          <h3>Phone Support</h3>
          <p>+91 1800-123-4567</p>
          <span>Toll-free</span>
        </motion.div>
        <motion.div className="help-contact-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }}>
          <FileText size={32} color="#2563EB" />
          <h3>Documentation</h3>
          <p>Guides & tutorials</p>
          <span>Read the docs</span>
        </motion.div>
      </div>

      <div className="help-faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <motion.div key={index} className={\`faq-item \${openFaq === index ? 'open' : ''}\`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
              <button className="faq-question" onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                <span>{faq.q}</span>
                <ChevronDown size={20} className={\`faq-arrow \${openFaq === index ? 'rotated' : ''}\`} />
              </button>
              <motion.div className="faq-answer" initial={false} animate={{ height: openFaq === index ? 'auto' : 0, opacity: openFaq === index ? 1 : 0 }} transition={{ duration: 0.3 }}>
                <p>{faq.a}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Help;
`);

console.log('All page files created!');