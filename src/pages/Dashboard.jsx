import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, ShoppingBag, Calendar, Search, Award, Users, Plus, Bell, Activity } from 'lucide-react';
import { dashboardStats, recentActivity, notifications, quickActions } from '../data/mockData';

const statIcons = {
  totalListings: <ShoppingBag size={24} />,
  activeListings: <ShoppingBag size={24} />,
  eventsAttended: <Calendar size={24} />,
  lostReports: <Search size={24} />,
  achievements: <Award size={24} />,
  connections: <Users size={24} />,
};

const Dashboard = () => {
  return (
    <div className="page page-dashboard">
      <div className="page-header">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="page-title"><LayoutDashboard size={28} /> Dashboard</h1>
          <p className="page-subtitle">Welcome back, Arjun! Here's your campus overview.</p>
        </motion.div>
      </div>

      <div className="dashboard-stats-grid">
        {Object.entries(dashboardStats).map(([key, value], index) => (
          <motion.div key={key} className="dashboard-stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
            <div className="dash-stat-icon">{statIcons[key] || <Activity size={24} />}</div>
            <div className="dash-stat-info">
              <h3>{value}</h3>
              <p>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h2><Activity size={20} /> Recent Activity</h2>
          <div className="activity-list">
            {recentActivity.map((a) => (
              <div key={a.id} className="activity-item">
                <div className={`activity-dot ${a.type}`}></div>
                <div className="activity-content">
                  <p>{a.action}</p>
                  <span>{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <h2><Bell size={20} /> Notifications</h2>
          <div className="notifications-list">
            {notifications.map((n) => (
              <div key={n.id} className={`notification-item ${n.read ? 'read' : 'unread'}`}>
                <div className="notification-content">
                  <p className="notification-title">{n.title}</p>
                  <p className="notification-message">{n.message}</p>
                  <span>{n.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2><Plus size={20} /> Quick Actions</h2>
        <div className="quick-actions-grid">
          {quickActions.map((action) => (
            <motion.button key={action.id} className="quick-action-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ borderColor: action.color }}>
              <div className="quick-action-icon" style={{ backgroundColor: action.color }}>+</div>
              <span>{action.title}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
