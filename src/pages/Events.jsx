
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Pencil, Trash2, X } from 'lucide-react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  
} from 'firebase/firestore';
import { Link } from 'react-router-dom';

import EventCard from '../components/EventCard';
import { auth, db } from '../firebase';

const emptyForm = {
  title: '',
  date: '',
  time: '',
  location: '',
  description: ''
};

const Events = () => {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    

    const eventsQuery = query(collection(db, 'events'));

    const unsubscribe = onSnapshot(
      eventsQuery,
      (snapshot) => {
        setEvents(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data()
          }))
        );
        setLoading(false);
        setError('');
      },
      (err) => {
        console.error('Events load error:', err);
        setError('Could not load events. Check your Firestore rules and connection.');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const openCreateForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError('');
    setNotice('');
  };

  const openEditForm = (event) => {
    setForm({
      title: event.title || '',
      date: event.date || '',
      time: event.time || '',
      location: event.location || '',
      description: event.description || ''
    });
    setEditingId(event.id);
    setShowForm(true);
    setError('');
    setNotice('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    const user = auth.currentUser;
    const email = user?.email?.toLowerCase() || '';

    if (
      !user ||
      !user.emailVerified ||
      !email.endsWith('@mitsgwl.ac.in')
    ) {
      setError('Please sign in with a verified MITS college account.');
      return;
    }

    if (!form.title.trim() || !form.date || !form.location.trim()) {
      setError('Please enter the event title, date and location.');
      return;
    }

    const eventData = {
      title: form.title.trim(),
      date: form.date,
      time: form.time.trim(),
      location: form.location.trim(),
      description: form.description.trim(),
      ownerId: user.uid,
      ownerEmail: user.email,
      updatedAt: new Date().toISOString()
    };

    setSaving(true);

    try {
      if (editingId) {
        const existing = events.find((item) => item.id === editingId);

        if (!existing || existing.ownerId !== user.uid) {
          throw new Error('You can only edit your own events.');
        }

        await updateDoc(doc(db, 'events', editingId), eventData);
        setNotice('Event updated successfully.');
      } else {
        await addDoc(collection(db, 'events'), {
          ...eventData,
          createdAt: new Date().toISOString()
        });
        setNotice('Event created successfully.');
      }

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error('Event save error:', err);
      setError(err.message || 'Could not save event. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (event) => {
    const user = auth.currentUser;

    if (!user || event.ownerId !== user.uid) {
      setError('You can only delete your own events.');
      return;
    }

    if (!window.confirm(`Delete "${event.title}"?`)) return;

    setError('');
    setNotice('');

    try {
      await deleteDoc(doc(db, 'events', event.id));
      setNotice('Event deleted successfully.');
    } catch (err) {
      console.error('Event delete error:', err);
      setError('Could not delete event. Please try again.');
    }
  };

  return (
    <div className="page page-events">
      <div className="page-header">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="page-title">
            <Calendar size={28} /> Events
          </h1>
          <p className="page-subtitle">
            Discover and manage campus events
          </p>
        </motion.div>
      </div>

      <div style={{ margin: '20px 0' }}>
        {auth.currentUser ? (
          <button type="button" onClick={openCreateForm} style={buttonStyle}>
            <Plus size={18} /> Create Event
          </button>
        ) : (
          <p>
            <Link to="/login">Sign in with your college account</Link> to
            create events.
          </p>
        )}
      </div>

      {error && <p role="alert" style={errorStyle}>{error}</p>}
      {notice && <p role="status" style={successStyle}>{notice}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} style={formStyle}>
          <h2>{editingId ? 'Edit Event' : 'Create Event'}</h2>

          <label>
            Event title
            <input
              required
              maxLength={120}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Coding Workshop"
              style={inputStyle}
            />
          </label>

          <label>
            Date
            <input
              required
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              style={inputStyle}
            />
          </label>

          <label>
            Time
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              style={inputStyle}
            />
          </label>

          <label>
            Location
            <input
              required
              maxLength={200}
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. College auditorium"
              style={inputStyle}
            />
          </label>

          <label>
            Description
            <textarea
              maxLength={1500}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Describe the event..."
              style={{ ...inputStyle, minHeight: 90 }}
            />
          </label>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button type="submit" disabled={saving} style={buttonStyle}>
              {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Publish Event'}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setForm(emptyForm);
              }}
              style={secondaryButtonStyle}
            >
              <X size={16} /> Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Loading events...</p>
      ) : events.length === 0 ? (
        <div className="empty-state">
          <p>No events yet. Create your first campus event!</p>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event, index) => (
            <div key={event.id}>
              <EventCard event={event} index={index} />

              {event.ownerId === auth.currentUser?.uid && (
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => openEditForm(event)}
                    style={secondaryButtonStyle}
                  >
                    <Pencil size={15} /> Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(event)}
                    style={deleteButtonStyle}
                  >
                    <Trash2 size={15} /> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const buttonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '11px 18px',
  border: 'none',
  borderRadius: 9,
  background: '#2563eb',
  color: '#fff',
  cursor: 'pointer',
  fontWeight: 600
};

const secondaryButtonStyle = {
  ...buttonStyle,
  background: '#e5e7eb',
  color: '#111827'
};

const deleteButtonStyle = {
  ...buttonStyle,
  background: '#dc2626'
};

const inputStyle = {
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  marginTop: 6,
  padding: 11,
  border: '1px solid #d1d5db',
  borderRadius: 8,
  font: 'inherit'
};

const formStyle = {
  display: 'grid',
  gap: 16,
  maxWidth: 560,
  margin: '20px 0',
  padding: 20,
  border: '1px solid #e5e7eb',
  borderRadius: 12
};

const errorStyle = {
  color: '#b91c1c',
  padding: 12,
  background: '#fee2e2',
  borderRadius: 8
};

const successStyle = {
  color: '#166534',
  padding: 12,
  background: '#dcfce7',
  borderRadius: 8
};

export default Events;
