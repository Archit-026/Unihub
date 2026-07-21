import React from 'react';
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