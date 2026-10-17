
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, GraduationCap, Home, ShoppingBag, Search,
  Calendar, LayoutDashboard, User, HelpCircle, RefreshCw,
  Sun, Moon, LogOut, LogIn
} from 'lucide-react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { useTheme } from '../context/ThemeContext';

const navLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
  { to: '/lost-found', label: 'Lost & Found', icon: Search },
  { to: '/events', label: 'Events', icon: Calendar },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/learners', label: 'Learners Hub', icon: RefreshCw },
  { to: '/help', label: 'Help', icon: HelpCircle },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setAuthReady(true);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setError('');
  }, [location.pathname]);

  const handleLogout = async () => {
    setLoggingOut(true);
    setError('');

    try {
      await signOut(auth);
      setIsOpen(false);
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Logout failed. Please try again.');
    } finally {
      setLoggingOut(false);
    }
  };

  const ThemeButton = () => (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      title={theme === 'light' ? 'Dark mode' : 'Light mode'}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="theme-toggle-icon"
      >
        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      </motion.div>
    </button>
  );

  if (location.pathname === '/login') return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <GraduationCap size={28} color="var(--primary)" />
          <span className="navbar-logo-text">UniHub</span>
        </Link>

        <div className="navbar-desktop">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;

            return (
              <Link
                key={to}
                to={to}
                className={`navbar-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={16} />
                <span>{label}</span>
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="navbar-indicator"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          <ThemeButton />

          {authReady && (
            user ? (
              <button
                type="button"
                className="navbar-logout"
                onClick={handleLogout}
                disabled={loggingOut}
                title="Logout"
              >
                <LogOut size={17} />
                <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
              </button>
            ) : (
              <Link to="/login" className="navbar-logout">
                <LogIn size={17} />
                <span>Login</span>
              </Link>
            )
          )}
        </div>

        <div className="navbar-actions">
          <ThemeButton />
          <button
            type="button"
            className="navbar-hamburger"
            onClick={() => setIsOpen(previous => !previous)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="navbar-error">{error}</p>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="navbar-mobile"
          >
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`navbar-mobile-link ${
                  location.pathname === to ? 'active' : ''
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}

            {authReady && (
              user ? (
                <button
                  type="button"
                  className="navbar-mobile-link"
                  onClick={handleLogout}
                  disabled={loggingOut}
                >
                  <LogOut size={18} />
                  <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="navbar-mobile-link"
                  onClick={() => setIsOpen(false)}
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </Link>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
