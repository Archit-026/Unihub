import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

const EventCard = ({ event, index }) => {
  const eventDate = new Date(event.date);
  const today = new Date();
  const diffTime = eventDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const countdown = diffDays > 0 ? `${diffDays} days left` : 'Ongoing';

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