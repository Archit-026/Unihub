import React, { useState } from 'react';
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
        <button className={`tab-btn ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>All Items</button>
        <button className={`tab-btn ${tab === 'lost' ? 'active' : ''}`} onClick={() => setTab('lost')}>Lost Items</button>
        <button className={`tab-btn ${tab === 'found' ? 'active' : ''}`} onClick={() => setTab('found')}>Found Items</button>
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
          <motion.div key={item.id} className={`lostfound-card-full ${item.status}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
            <div className="lostfound-card-header">
              <span className={`status-badge ${item.status}`}>{item.status === 'lost' ? 'Lost' : 'Found'}</span>
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
