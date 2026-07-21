import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, CheckCircle, Clock, Users } from 'lucide-react';

const SkillExchangeCard = ({ exchange, index }) => {
  const isActive = exchange.status === 'active';

  return (
    <motion.div
      className="exchange-card"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="exchange-card-header">
        <div className={`exchange-badge ${isActive ? 'active-badge' : 'completed-badge'}`}>
          {isActive ? (
            <>
              <Clock size={12} />
              <span>Active</span>
            </>
          ) : (
            <>
              <CheckCircle size={12} />
              <span>Completed</span>
            </>
          )}
        </div>
        <ArrowRightLeft size={18} className="exchange-icon" />
      </div>

      <div className="exchange-participants">
        <div className="exchange-person">
          <div className="exchange-person-avatar">
            {exchange.from.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div className="exchange-person-info">
            <p className="exchange-person-name">{exchange.from.name}</p>
            <span className="exchange-skill-tag">{exchange.from.skill}</span>
          </div>
        </div>

        <div className="exchange-arrow">
          <ArrowRightLeft size={20} />
        </div>

        <div className="exchange-person">
          <div className="exchange-person-avatar">
            {exchange.to.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div className="exchange-person-info">
            <p className="exchange-person-name">{exchange.to.name}</p>
            <span className="exchange-skill-tag">{exchange.to.skill}</span>
          </div>
        </div>
      </div>

      <p className="exchange-description">{exchange.description}</p>

      <button className="btn btn-primary exchange-btn">
        <Users size={16} />
        <span>{isActive ? 'Join Exchange' : 'View Details'}</span>
      </button>
    </motion.div>
  );
};

export default SkillExchangeCard;