
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ThemeProvider } from './context/ThemeContext';
import { auth } from './firebase';

import Login from './pages/Login';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import LostFound from './pages/LostFound';
import Events from './pages/Events';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Help from './pages/Help';
import SkillSwap from './pages/SkillSwap';

const publicPaths = [
  '/',
  '/marketplace',
  '/lost-found',
  '/events',
  '/help'
];

function ProtectedApp() {
  const [user, setUser] = useState(undefined);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      const isCollegeUser =
        currentUser &&
        currentUser.emailVerified &&
        currentUser.email?.toLowerCase().endsWith('@mitsgwl.ac.in');

      if (currentUser && !isCollegeUser) {
        try {
          await signOut(auth);
        } catch (error) {
          console.error('Sign-out failed:', error);
        }
        setUser(null);
        return;
      }

      setUser(isCollegeUser ? currentUser : null);
    });

    return unsubscribe;
  }, []);

  if (user === undefined) {
    return (
      <div className="page">
        <p>Loading UniHub...</p>
      </div>
    );
  }

  const isPublicPath = publicPaths.includes(location.pathname);
  const needsLogin = !isPublicPath && location.pathname !== '/login';

  if (needsLogin && !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (location.pathname === '/login' && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/lost-found" element={<LostFound />} />
          <Route path="/events" element={<Events />} />
          <Route path="/help" element={<Help />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/learners" element={<SkillSwap />} />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <ProtectedApp />
      </Router>
    </ThemeProvider>
  );
}
