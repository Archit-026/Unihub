import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Search, ArrowRightLeft, Users, TrendingUp, BookOpen, Star } from 'lucide-react';
import LearnerCard from '../components/LearnerCard';
import SkillExchangeCard from '../components/SkillExchangeCard';
import { learners, skillExchanges, popularSkillCategories } from '../data/skillSwapData';

const SkillSwap = () => {
  const [activeTab, setActiveTab] = useState('learners');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  const filteredLearners = learners.filter((learner) => {
    const allSkills = [...learner.canTeach, ...learner.wantToLearn];
    const matchesSearch = learner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      learner.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allSkills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSkill = !selectedSkill || allSkills.includes(selectedSkill);
    return matchesSearch && matchesSkill;
  });

  return (
    <div className="page page-skillswap">
      <div className="page-header">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="page-title"><RefreshCw size={28} /> Learners Hub</h1>
          <p className="page-subtitle">Swap skills with fellow learners and grow together</p>
        </motion.div>
      </div>

      {/* Stats Banner */}
      <motion.div
        className="swap-stats"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="swap-stat-item">
          <div className="swap-stat-icon learners">
            <Users size={22} />
          </div>
          <div className="swap-stat-info">
            <h3>{learners.length}</h3>
            <p>Active Learners</p>
          </div>
        </div>
        <div className="swap-stat-item">
          <div className="swap-stat-icon exchanges">
            <ArrowRightLeft size={22} />
          </div>
          <div className="swap-stat-info">
            <h3>{skillExchanges.filter((e) => e.status === 'active').length}</h3>
            <p>Active Exchanges</p>
          </div>
        </div>
        <div className="swap-stat-item">
          <div className="swap-stat-icon skills">
            <BookOpen size={22} />
          </div>
          <div className="swap-stat-info">
            <h3>{popularSkillCategories.length}</h3>
            <p>Skills Available</p>
          </div>
        </div>
        <div className="swap-stat-item">
          <div className="swap-stat-icon rating">
            <Star size={22} />
          </div>
          <div className="swap-stat-info">
            <h3>4.7</h3>
            <p>Avg. Rating</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="swap-tabs">
        <button
          className={`swap-tab ${activeTab === 'learners' ? 'active' : ''}`}
          onClick={() => setActiveTab('learners')}
        >
          <Users size={18} />
          <span>Find Learners</span>
        </button>
        <button
          className={`swap-tab ${activeTab === 'exchanges' ? 'active' : ''}`}
          onClick={() => setActiveTab('exchanges')}
        >
          <ArrowRightLeft size={18} />
          <span>Live Exchanges</span>
        </button>
      </div>

      {/* Search & Filters */}
      {activeTab === 'learners' && (
        <motion.div
          className="swap-filters"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="swap-search">
            <Search size={18} className="swap-search-icon" />
            <input
              type="text"
              placeholder="Search learners or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="swap-search-input"
            />
          </div>
          <div className="swap-skill-filters">
            {popularSkillCategories.slice(0, 8).map((skill) => (
              <button
                key={skill}
                className={`swap-skill-chip ${selectedSkill === skill ? 'active' : ''}`}
                onClick={() => setSelectedSkill(selectedSkill === skill ? '' : skill)}
              >
                {skill}
              </button>
            ))}
            {selectedSkill && (
              <button
                className="swap-skill-chip clear"
                onClick={() => setSelectedSkill('')}
              >
                Clear All
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'learners' ? (
          <motion.div
            key="learners"
            className="learners-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {filteredLearners.length > 0 ? (
              filteredLearners.map((learner, index) => (
                <LearnerCard key={learner.id} learner={learner} index={index} />
              ))
            ) : (
              <div className="empty-state">
                <TrendingUp size={48} />
                <h3>No learners found</h3>
                <p>Try adjusting your search or skill filter</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="exchanges"
            className="exchanges-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {skillExchanges.length > 0 ? (
              skillExchanges.map((exchange, index) => (
                <SkillExchangeCard key={exchange.id} exchange={exchange} index={index} />
              ))
            ) : (
              <div className="empty-state">
                <ArrowRightLeft size={48} />
                <h3>No exchanges yet</h3>
                <p>Be the first to start a skill exchange!</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillSwap;