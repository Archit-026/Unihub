
import { useEffect, useState, lazy, Suspense } from 'react';
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

import Navbar from './components/Navbar';

// Lazy-loaded pages
const Login = lazy(() => import('./pages/Login'));
const Home = lazy(() => import('./pages/Home'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const LostFound = lazy(() => import('./pages/LostFound'));
const Events = lazy(() => import('./pages/Events'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Help = lazy(() => import('./pages/Help'));
const SkillSwap = lazy(() => import('./pages/SkillSwap'));

const publicPaths = [
  '/',
  '/marketplace',
  '/lost-found',
  '/events',
  '/help'
];

function PageLoader() {
  return (
    <div className="page">
      <p>Loading UniHub...</p>
    </div>
  );
}

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
    return <PageLoader />;
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
        <Suspense fallback={<PageLoader />}>
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
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
