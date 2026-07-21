import React, { useState } from 'react';
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
          <Mail size={32} color="var(--primary)" />
          <h3>Email Support</h3>
          <p>support@unihub.edu</p>
          <span>Response within 24 hours</span>
        </motion.div>
        <motion.div className="help-contact-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
          <MessageCircle size={32} color="var(--primary)" />
          <h3>Live Chat</h3>
          <p>Chat with our team</p>
          <span>Available 9 AM - 6 PM</span>
        </motion.div>
        <motion.div className="help-contact-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
          <Phone size={32} color="var(--primary)" />
          <h3>Phone Support</h3>
          <p>+91 1800-123-4567</p>
          <span>Toll-free</span>
        </motion.div>
        <motion.div className="help-contact-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }}>
          <FileText size={32} color="var(--primary)" />
          <h3>Documentation</h3>
          <p>Guides & tutorials</p>
          <span>Read the docs</span>
        </motion.div>
      </div>

      <div className="help-faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <motion.div key={index} className={`faq-item ${openFaq === index ? 'open' : ''}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
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
    </div>
  );
};

export default Help;
