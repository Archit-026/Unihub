
import React, { useState } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const email = user.email?.toLowerCase() || '';

      if (!email.endsWith('@mitsgwl.ac.in') || !user.emailVerified) {
        await signOut(auth);
        setError(
          'Please sign in using a verified MITS college account (@mitsgwl.ac.in).'
        );
        return;
      }

      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      console.error('Login error:', err);

      if (err.code === 'auth/popup-closed-by-user') {
        setError('Login cancelled. Please try again.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Your browser blocked the login popup. Allow popups and retry.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This website domain is not authorized in Firebase Authentication.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 440,
        margin: '70px auto',
        padding: 32,
        textAlign: 'center',
        borderRadius: 20,
        background: 'var(--card-bg, #ffffff)',
        color: 'var(--text-primary, #172033)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.10)'
      }}
    >
      <h1>Welcome to UniHub</h1>
      <p>Sign in with your MITS Gwalior college account.</p>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        style={{
          padding: '13px 22px',
          width: '100%',
          borderRadius: 10,
          border: '1px solid #ddd',
          background: '#fff',
          color: '#222',
          fontSize: 16,
          cursor: loading ? 'wait' : 'pointer',
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? 'Signing in...' : 'Continue with Google'}
      </button>

      {error && (
        <p role="alert" style={{ color: '#dc2626', marginTop: 18 }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Login;
