import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Search, Calendar, Briefcase, ArrowRight, Star, ChevronDown, Users, RefreshCw, BookOpen, ArrowRightLeft } from 'lucide-react';
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

      <section className="section-preview section-learners-preview">
        <div className="preview-container">
          <motion.div className="section-header" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="section-title"><RefreshCw size={28} /> Learners Hub</h2>
            <p className="section-subtitle">Teach one skill, learn another. Swap skills with fellow students and grow together.</p>
          </motion.div>
          <div className="learners-preview-content">
            <motion.div className="learners-preview-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
              <div className="learners-preview-icon teach-icon">
                <BookOpen size={32} />
              </div>
              <h3>Teach What You Know</h3>
              <p>Share your expertise in subjects you excel at — from Python to public speaking. Every student has something valuable to teach.</p>
            </motion.div>
            <motion.div className="learners-preview-connector" initial={{ opacity: 0, scaleX: 0 }} whileInView={{ opacity: 1, scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
              <ArrowRightLeft size={28} />
            </motion.div>
            <motion.div className="learners-preview-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
              <div className="learners-preview-icon learn-icon">
                <Users size={32} />
              </div>
              <h3>Learn What You Need</h3>
              <p>Pick up new skills from peers who've mastered them. Whether it's React, AutoCAD, or data science — find your teacher.</p>
            </motion.div>
          </div>
          <motion.div className="preview-cta" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Link to="/learners" className="btn btn-primary">Explore Learners Hub <ArrowRight size={18} /></Link>
          </motion.div>
        </div>
      </section>

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
              <motion.div key={item.id} className={`lostfound-card ${item.status}`} initial={{ opacity: 0, x: index === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.1 }}>
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
                    <Star key={i} size={16} fill={i < t.rating ? '#F59E0B' : 'none'} color={i < t.rating ? '#F59E0B' : 'var(--text-muted)'} />
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
              <motion.div key={index} className={`faq-item ${openFaq === index ? 'open' : ''}`} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: index * 0.05 }}>
                <button className="faq-question" onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                  <span>{faq.q}</span>
                  <ChevronDown size={20} className={`faq-arrow ${openFaq === index ? 'rotated' : ''}`} />
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
