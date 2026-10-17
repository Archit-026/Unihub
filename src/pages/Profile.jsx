
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Award, Bookmark, ShoppingBag, Mail, Globe,
  Save, LoaderCircle
} from 'lucide-react';
import {
  doc, getDoc, setDoc, serverTimestamp,
  collection, onSnapshot, query, where
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [listings, setListings] = useState([]);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    branch: '',
    year: '',
    bio: '',
    skills: '',
    socialLinks: ['', '', '']
  });

  useEffect(() => {
    let unsubscribeListings = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (unsubscribeListings) {
        unsubscribeListings();
        unsubscribeListings = null;
      }

      setUser(currentUser);

      if (!currentUser) {
        setProfile({
          name: '', email: '', branch: '', year: '',
          bio: '', skills: '', socialLinks: ['', '', '']
        });
        setListings([]);
        setLoading(false);
        return;
      }

      if (
        !currentUser.email?.toLowerCase().endsWith('@mitsgwl.ac.in') ||
        !currentUser.emailVerified
      ) {
        setNotice('Please sign in with a verified college email.');
        setLoading(false);
        return;
      }

      try {
        const profileRef = doc(db, 'users', currentUser.uid);
        const snapshot = await getDoc(profileRef);
        const saved = snapshot.exists() ? snapshot.data() : {};

        setProfile({
          name: saved.name || currentUser.displayName || '',
          email: currentUser.email || '',
          branch: saved.branch || '',
          year: saved.year || '',
          bio: saved.bio || '',
          skills: Array.isArray(saved.skills)
            ? saved.skills.join(', ')
            : '',
          socialLinks: Array.isArray(saved.socialLinks)
            ? [...saved.socialLinks, '', '', ''].slice(0, 3)
            : ['', '', '']
        });

        const listingsQuery = query(
          collection(db, 'marketplace'),
          where('ownerId', '==', currentUser.uid)
        );

        unsubscribeListings = onSnapshot(
          listingsQuery,
          (result) => setListings(
            result.docs.map(item => ({ id: item.id, ...item.data() }))
          ),
          (error) => {
            console.error('Listings error:', error);
          }
        );
      } catch (error) {
        console.error('Profile loading error:', error);
        setNotice('Could not load profile. Please refresh and try again.');
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeListings) unsubscribeListings();
    };
  }, []);

  const updateField = (field, value) => {
    setProfile(previous => ({ ...previous, [field]: value }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();

    if (!user || !user.emailVerified ||
        !user.email?.toLowerCase().endsWith('@mitsgwl.ac.in')) {
      setNotice('Please sign in with a verified college account.');
      return;
    }

    setSaving(true);
    setNotice('');

    try {
      await setDoc(doc(db, 'users', user.uid), {
        name: profile.name.trim(),
        email: user.email,
        branch: profile.branch.trim(),
        year: profile.year.trim(),
        bio: profile.bio.trim(),
        skills: profile.skills.split(',').map(s => s.trim()).filter(Boolean),
        socialLinks: profile.socialLinks.map(s => s.trim()),
        updatedAt: serverTimestamp()
      }, { merge: true });

      setNotice('Profile saved successfully!');
    } catch (error) {
      console.error('Profile save error:', error);
      setNotice('Unable to save profile. Check Firestore rules and try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="page"><p>Loading profile...</p></div>;
  }

  if (!user) {
    return (
      <div className="page page-profile">
        <h1 className="page-title"><User size={28} /> Profile</h1>
        <p>Please log in to view and edit your profile.</p>
        <a href="/login">Go to Login</a>
      </div>
    );
  }

  const initials = profile.name
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="page page-profile">
      <div className="page-header">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="page-title"><User size={28} /> Profile</h1>
          <p className="page-subtitle">Manage your UniHub student profile</p>
        </motion.div>
      </div>

      {notice && (
        <p role="status" aria-live="polite">{notice}</p>
      )}

      <div className="profile-layout">
        <motion.div
          className="profile-card-main"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="profile-avatar-large">
            {initials || <User size={30} />}
          </div>

          <h2>{profile.name || 'Student Name'}</h2>
          <p className="profile-email">
            <Mail size={14} /> {user.email}
          </p>
          <p className="profile-branch">
            {[profile.branch, profile.year].filter(Boolean).join(' - ') ||
              'Add your branch and year'}
          </p>
          <p className="profile-bio">
            {profile.bio || 'Tell your campus community about yourself.'}
          </p>

          <div className="profile-skills">
            {profile.skills.split(',').map(s => s.trim()).filter(Boolean).map(skill => (
              <span key={skill} className="skill-tag">{skill}</span>
            ))}
          </div>

          <div className="profile-social">
            {profile.socialLinks.filter(Boolean).map((url, index) => (
              <a
                key={`${url}-${index}`}
                href={url.startsWith('http') ? url : `https://${url}`}
                target="_blank"
                rel="noreferrer"
                className="social-link"
                aria-label={`Social link ${index + 1}`}
              >
                <Globe size={20} />
              </a>
            ))}
          </div>
        </motion.div>

        <div className="profile-side">
          <motion.div
            className="profile-section-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3><User size={18} /> Edit Profile</h3>

            <form onSubmit={saveProfile}>
              <label>Name</label>
              <input
                value={profile.name}
                onChange={e => updateField('name', e.target.value)}
                required
                maxLength={80}
              />

              <label>College Email</label>
              <input value={user.email || ''} readOnly />

              <label>Branch / Department</label>
              <input
                value={profile.branch}
                onChange={e => updateField('branch', e.target.value)}
                maxLength={100}
                placeholder="e.g. Mathematics and Computing"
              />

              <label>Year / Semester</label>
              <input
                value={profile.year}
                onChange={e => updateField('year', e.target.value)}
                maxLength={50}
                placeholder="e.g. First Year"
              />

              <label>Bio</label>
              <textarea
                value={profile.bio}
                onChange={e => updateField('bio', e.target.value)}
                maxLength={500}
                rows={3}
                placeholder="Tell us about yourself"
              />

              <label>Skills (comma separated)</label>
              <input
                value={profile.skills}
                onChange={e => updateField('skills', e.target.value)}
                maxLength={300}
                placeholder="C, React, Mathematics"
              />

              {profile.socialLinks.map((url, index) => (
                <React.Fragment key={index}>
                  <label>Social link {index + 1}</label>
                  <input
                    type="url"
                    value={url}
                    onChange={e => updateField(
                      'socialLinks',
                      profile.socialLinks.map((s, i) =>
                        i === index ? e.target.value : s
                      )
                    )}
                    placeholder="https://..."
                  />
                </React.Fragment>
              ))}

              <button type="submit" disabled={saving}>
                {saving
                  ? <><LoaderCircle size={16} /> Saving...</>
                  : <><Save size={16} /> Save Profile</>}
              </button>
            </form>
          </motion.div>

          <motion.div
            className="profile-section-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3><Award size={18} /> Achievements</h3>
            <p>Achievements will appear here as they are implemented.</p>
          </motion.div>

          <motion.div
            className="profile-section-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3><Bookmark size={18} /> Bookmarks</h3>
            <p>Your saved items feature is not connected to the database yet.</p>
          </motion.div>

          <motion.div
            className="profile-section-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3><ShoppingBag size={18} /> My Listings</h3>
            <div className="listings-list">
              {listings.length === 0 ? (
                <p>You have no marketplace listings yet.</p>
              ) : listings.map(item => (
                <div className="listing-item" key={item.id}>
                  <span>{item.title || 'Untitled listing'}{item.price != null ? ` - ₹${item.price}` : ''}</span>
                  <span className="listing-status active">Your listing</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
