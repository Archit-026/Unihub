import React from 'react';
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
