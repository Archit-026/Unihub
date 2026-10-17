
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, ShoppingBag, Calendar, Search, Award,
  Users, Plus, Bell, Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection, onSnapshot, query, where
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import {
  recentActivity, notifications, quickActions
} from '../data/mockData';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState('');

  useEffect(() => {
    let unsubscribeListings;
    let unsubscribeEvents;

    const unsubscribeAuth = onAuthStateChanged(auth, currentUser => {
      if (unsubscribeListings) unsubscribeListings();
      if (unsubscribeEvents) unsubscribeEvents();

      setUser(currentUser);

      if (
        !currentUser ||
        !currentUser.emailVerified ||
        !currentUser.email?.toLowerCase().endsWith('@mitsgwl.ac.in')
      ) {
        setListings([]);
        setEvents([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setDataError('');

      const listingsQuery = query(
        collection(db, 'marketplace'),
        where('ownerId', '==', currentUser.uid)
      );

      const eventsQuery = query(
        collection(db, 'events'),
        where('ownerId', '==', currentUser.uid)
      );

      let listingsLoaded = false;
      let eventsLoaded = false;

      const finishLoading = () => {
        if (listingsLoaded && eventsLoaded) setLoading(false);
      };

      unsubscribeListings = onSnapshot(
        listingsQuery,
        snapshot => {
          setListings(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
          listingsLoaded = true;
          finishLoading();
        },
        error => {
          console.error('Marketplace dashboard error:', error);
          setDataError('Could not load marketplace statistics. Check Firestore permissions.');
          listingsLoaded = true;
          finishLoading();
        }
      );

      unsubscribeEvents = onSnapshot(
        eventsQuery,
        snapshot => {
          setEvents(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
          eventsLoaded = true;
          finishLoading();
        },
        error => {
          console.error('Events dashboard error:', error);
          setDataError('Could not load event statistics. Check Firestore permissions.');
          eventsLoaded = true;
          finishLoading();
        }
      );
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeListings) unsubscribeListings();
      if (unsubscribeEvents) unsubscribeEvents();
    };
  }, []);

  const stats = [
    {
      label: 'My Listings',
      value: listings.length,
      icon: <ShoppingBag size={24} />
    },
    {
      label: 'My Events',
      value: events.length,
      icon: <Calendar size={24} />
    },
    {
      label: 'Lost Reports',
      value: '—',
      icon: <Search size={24} />
    },
    {
      label: 'Achievements',
      value: '—',
      icon: <Award size={24} />
    },
    {
      label: 'Connections',
      value: '—',
      icon: <Users size={24} />
    }
  ];

  if (loading) {
    return <div className="page"><p>Loading dashboard...</p></div>;
  }

  if (!user) {
    return (
      <div className="page page-dashboard">
        <h1 className="page-title"><LayoutDashboard size={28} /> Dashboard</h1>
        <p>Please sign in with your verified MITS college account to view your dashboard.</p>
        <Link to="/login">Login with Google</Link>
      </div>
    );
  }

  return (
    <div className="page page-dashboard">
      <div className="page-header">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="page-title">
            <LayoutDashboard size={28} /> Dashboard
          </h1>
          <p className="page-subtitle">
            Welcome back, {user.displayName || user.email}! Here's your campus overview.
          </p>
        </motion.div>
      </div>

      {dataError && <p role="alert">{dataError}</p>}

      <div className="dashboard-stats-grid">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="dashboard-stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className="dash-stat-icon">{stat.icon}</div>
            <div className="dash-stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h2><Activity size={20} /> Recent Activity</h2>
          <div className="activity-list">
            {recentActivity.map(a => (
              <div key={a.id} className="activity-item">
                <div className={`activity-dot ${a.type}`} />
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
            {notifications.map(n => (
              <div
                key={n.id}
                className={`notification-item ${n.read ? 'read' : 'unread'}`}
              >
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
          {quickActions.map(action => {
            const destination =
              action.title.toLowerCase().includes('event')
                ? '/events'
                : action.title.toLowerCase().includes('lost')
                  ? '/lost-found'
                  : action.title.toLowerCase().includes('skill')
                    ? '/learners'
                    : '/marketplace';

            return (
              <Link
                to={destination}
                key={action.id}
                className="quick-action-btn"
                style={{
                  borderColor: action.color,
                  textDecoration: 'none'
                }}
              >
                <div
                  className="quick-action-icon"
                  style={{ backgroundColor: action.color }}
                >
                  +
                </div>
                <span>{action.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
