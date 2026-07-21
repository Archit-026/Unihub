import React from 'react';
import { motion } from 'framer-motion';
import { Star, RefreshCw, UserPlus, Check, BookOpen, GraduationCap } from 'lucide-react';

const LearnerCard = ({ learner, index }) => {
  const initials = learner.name.split(' ').map((n) => n[0]).join('');

  return (
    <motion.div
      className="learner-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <div className="learner-card-header">
        <div className="learner-avatar">{initials}</div>
        <div className="learner-info">
          <h3 className="learner-name">{learner.name}</h3>
          <p className="learner-branch">
            <GraduationCap size={13} />
            <span>{learner.branch}</span>
          </p>
        </div>
        <div className="learner-rating">
          <Star size={14} fill="#F59E0B" color="#F59E0B" />
          <span>{learner.rating}</span>
        </div>
      </div>

      <p className="learner-bio">{learner.bio}</p>

      <div className="learner-skills-section">
        <div className="skill-group">
          <div className="skill-group-label teach">
            <BookOpen size={14} />
            <span>I can teach</span>
          </div>
          <div className="learner-skills">
            {learner.canTeach.map((skill) => (
              <span key={skill} className="skill-tag teach">{skill}</span>
            ))}
          </div>
        </div>

        <div className="skill-group">
          <div className="skill-group-label learn">
            <RefreshCw size={14} />
            <span>I want to learn</span>
          </div>
          <div className="learner-skills">
            {learner.wantToLearn.map((skill) => (
              <span key={skill} className="skill-tag learn">{skill}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="learner-stats">
        <div className="learner-stat">
          <RefreshCw size={14} />
          <span>{learner.exchanges} exchanges</span>
        </div>
      </div>

      <div className="learner-card-actions">
        <button className="btn btn-primary learner-btn-connect">
          <UserPlus size={16} />
          <span>Connect & Swap</span>
        </button>
        <button className="btn btn-outline learner-btn-request">
          <RefreshCw size={16} />
          <span>Request Skill</span>
        </button>
      </div>
    </motion.div>
  );
};

export default LearnerCard;