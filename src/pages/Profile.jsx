import React from 'react';
import { motion } from 'framer-motion';
import { User, Award, Bookmark, ShoppingBag, Mail, Globe } from 'lucide-react';
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
            <a href="#" className="social-link"><Globe size={20} /></a>
            <a href="#" className="social-link"><Globe size={20} /></a>
            <a href="#" className="social-link"><Globe size={20} /></a>
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
