import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-logo">
            <GraduationCap size={28} color="var(--primary)" />
            <span className="footer-logo-text">UniHub</span>
          </div>
          <p className="footer-tagline">One Campus. Endless Connections.</p>
          <p className="footer-desc">
            A modern student ecosystem combining marketplace, lost & found, events, internships, clubs and student networking.
          </p>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Quick Links</h3>
          <Link to="/marketplace" className="footer-link">Marketplace</Link>
          <Link to="/lost-found" className="footer-link">Lost & Found</Link>
          <Link to="/events" className="footer-link">Events</Link>
          <Link to="/dashboard" className="footer-link">Dashboard</Link>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Support</h3>
          <Link to="/help" className="footer-link">Help Center</Link>
          <Link to="/help" className="footer-link">FAQ</Link>
          <Link to="/help" className="footer-link">Contact Us</Link>
          <Link to="/" className="footer-link">Privacy Policy</Link>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Contact</h3>
          <div className="footer-contact-item">
            <MapPin size={16} />
            <span>University Campus, Main Building</span>
          </div>
          <div className="footer-contact-item">
            <Mail size={16} />
            <span>support@unihub.edu</span>
          </div>
          <div className="footer-contact-item">
            <Phone size={16} />
            <span>+91 1800-123-4567</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 UniHub. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;