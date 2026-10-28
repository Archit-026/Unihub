
import React, { useEffect, useMemo, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';

const COLLECTION_NAME = 'lostFoundReports';

const initialForm = {
  title: '',
  description: '',
  location: '',
  status: 'lost',
  latitude: '',
  longitude: '',
};

function distanceInKm(lat1, lon1, lat2, lon2) {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const earthRadiusKm = 6371;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDate(value) {
  if (!value) return 'Date unavailable';

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value.toDate === 'function') {
    return value.toDate().toLocaleDateString('en-IN');
  }

  return 'Date unavailable';
}

export default function LostFound() {
  const [user, setUser] = useState(auth.currentUser);
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [nearbyOnly, setNearbyOnly] = useState(false);
  const [radiusKm, setRadiusKm] = useState(5);
  const [myLocation, setMyLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, setUser);
    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    const reportsQuery = query(
      collection(db, COLLECTION_NAME),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      reportsQuery,
      (snapshot) => {
        setReports(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          }))
        );
        setLoading(false);
        setError('');
      },
      (err) => {
        console.error('Lost & Found listener error:', err);
        setError(
          'Could not load reports. Check your Firestore rules and internet connection.'
        );
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const filteredReports = useMemo(() => {
    const term = search.trim().toLowerCase();

    return reports.filter((report) => {
      const matchesTab =
        activeTab === 'all' || report.status === activeTab;

      const searchableText = [
        report.title,
        report.description,
        report.location,
        report.status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch = !term || searchableText.includes(term);

      let matchesDistance = true;

      if (nearbyOnly) {
        const reportLat = Number(report.latitude);
        const reportLng = Number(report.longitude);

        if (
          !myLocation ||
          !Number.isFinite(reportLat) ||
          !Number.isFinite(reportLng) ||
          report.latitude === '' ||
          report.longitude === '' ||
          report.latitude == null ||
          report.longitude == null
        ) {
          matchesDistance = false;
        } else {
          matchesDistance =
            distanceInKm(
              myLocation.latitude,
              myLocation.longitude,
              reportLat,
              reportLng
            ) <= radiusKm;
        }
      }

      return matchesTab && matchesSearch && matchesDistance;
    });
  }, [reports, activeTab, search, nearbyOnly, myLocation, radiusKm]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const getMyLocation = () => {
    setError('');
    setNotice('');

    if (!navigator.geolocation) {
      setError('Your browser does not support geolocation.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setMyLocation({ latitude, longitude });
        setForm((previous) => ({
          ...previous,
          latitude: String(latitude),
          longitude: String(longitude),
        }));
        setNotice('Location captured successfully.');
      },
      (geoError) => {
        console.error('Geolocation error:', geoError);
        setError(
          'Location access failed. Allow location permission in your browser and try again.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');

    if (!user) {
      setError('Please log in with your verified college account to report an item.');
      return;
    }

    const title = form.title.trim();
    const description = form.description.trim();
    const location = form.location.trim();

    if (!title || !description || !location) {
      setError('Please complete the title, description, and location fields.');
      return;
    }

    const latitude =
      form.latitude.trim() === '' ? null : Number(form.latitude);
    const longitude =
      form.longitude.trim() === '' ? null : Number(form.longitude);

    if (
      (latitude !== null && !Number.isFinite(latitude)) ||
      (longitude !== null && !Number.isFinite(longitude))
    ) {
      setError('Latitude and longitude must be valid numbers.');
      return;
    }

    if ((latitude === null) !== (longitude === null)) {
      setError('Enter both latitude and longitude, or leave both empty.');
      return;
    }

    if (
      latitude !== null &&
      (latitude < -90 || latitude > 90 ||
        longitude < -180 || longitude > 180)
    ) {
      setError('Latitude must be between -90 and 90, and longitude between -180 and 180.');
      return;
    }

    const payload = {
      title,
      description,
      location,
      status: form.status,
      latitude,
      longitude,
      updatedAt: serverTimestamp(),
    };

    setSubmitting(true);

    try {
      if (editingId) {
        const existing = reports.find((item) => item.id === editingId);

        if (!existing || existing.ownerId !== user.uid) {
          throw new Error('You can only edit reports you created.');
        }

        await updateDoc(doc(db, COLLECTION_NAME, editingId), payload);
        setNotice('Your report was updated.');
      } else {
        await addDoc(collection(db, COLLECTION_NAME), {
          ...payload,
          ownerId: user.uid,
          reporter: user.displayName || user.email || 'College student',
          reporterEmail: user.email || '',
          createdAt: serverTimestamp(),
        });

        setNotice('Your report was published.');
      }

      resetForm();
    } catch (err) {
      console.error('Saving Lost & Found report failed:', err);
      setError(
        err.code === 'permission-denied'
          ? 'Firestore denied this action. Check the Lost & Found security rules.'
          : err.message || 'Could not save your report. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (report) => {
    if (!user || report.ownerId !== user.uid) return;

    setForm({
      title: report.title || '',
      description: report.description || '',
      location: report.location || '',
      status: report.status || 'lost',
      latitude:
        report.latitude == null ? '' : String(report.latitude),
      longitude:
        report.longitude == null ? '' : String(report.longitude),
    });

    setEditingId(report.id);
    setShowForm(true);
    setError('');
    setNotice('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (report) => {
    if (!user || report.ownerId !== user.uid) return;

    const confirmed = window.confirm(
      `Delete the report "${report.title}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setError('');
    setNotice('');

    try {
      await deleteDoc(doc(db, COLLECTION_NAME, report.id));
      setNotice('Report deleted.');
    } catch (err) {
      console.error('Deleting Lost & Found report failed:', err);
      setError(
        err.code === 'permission-denied'
          ? 'Firestore denied deletion. Check the Lost & Found security rules.'
          : 'Could not delete the report. Please try again.'
      );
    }
  };

  return (
    <div className="page lost-found-page">
      <section className="lost-found-header">
        <div>
          <p className="lost-found-eyebrow">CAMPUS COMMUNITY</p>
          <h1>Lost &amp; Found</h1>
          <p>
            Help your fellow students reunite with their missing belongings.
          </p>
        </div>

        <button
          type="button"
          className="lost-found-primary-btn"
          onClick={() => {
            if (!user) {
              setError('Please log in with your verified college account to report an item.');
              return;
            }

            if (showForm && !editingId) {
              resetForm();
            } else {
              setError('');
              setNotice('');
              setShowForm(true);
            }
          }}
        >
          {showForm && !editingId ? 'Cancel report' : '+ Report an item'}
        </button>
      </section>

      {error && (
        <div className="lost-found-message lost-found-error" role="alert">
          {error}
        </div>
      )}

      {notice && (
        <div className="lost-found-message lost-found-success" role="status">
          {notice}
        </div>
      )}

      {showForm && (
        <form className="lost-found-form" onSubmit={handleSubmit}>
          <h2>{editingId ? 'Edit your report' : 'Report an item'}</h2>

          <label>
            Report type
            <select name="status" value={form.status} onChange={updateField}>
              <option value="lost">I lost something</option>
              <option value="found">I found something</option>
            </select>
          </label>

          <label>
            Item name
            <input
              name="title"
              value={form.title}
              onChange={updateField}
              placeholder="e.g. Blue water bottle"
              maxLength={100}
              required
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={updateField}
              placeholder="Describe the item, colour, identifying details..."
              maxLength={1000}
              rows={4}
              required
            />
          </label>

          <label>
            Where was it lost or found?
            <input
              name="location"
              value={form.location}
              onChange={updateField}
              placeholder="e.g. Library, second floor"
              maxLength={200}
              required
            />
          </label>

          <div className="lost-found-location-row">
            <label>
              Latitude (optional)
              <input
                name="latitude"
                type="number"
                step="any"
                value={form.latitude}
                onChange={updateField}
                placeholder="e.g. 26.2183"
              />
            </label>

            <label>
              Longitude (optional)
              <input
                name="longitude"
                type="number"
                step="any"
                value={form.longitude}
                onChange={updateField}
                placeholder="e.g. 78.1828"
              />
            </label>
          </div>

          <button
            type="button"
            className="lost-found-secondary-btn"
            onClick={getMyLocation}
          >
            Use my current location
          </button>

          <p className="lost-found-hint">
            Location access is optional. Only use coordinates you are comfortable sharing.
          </p>

          <div className="lost-found-form-actions">
            <button
              type="button"
              className="lost-found-secondary-btn"
              onClick={resetForm}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="lost-found-primary-btn"
              disabled={submitting}
            >
              {submitting
                ? 'Saving...'
                : editingId
                  ? 'Save changes'
                  : 'Publish report'}
            </button>
          </div>
        </form>
      )}

      <section className="lost-found-tools">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search items, descriptions or locations..."
          aria-label="Search Lost and Found reports"
        />

        <div className="lost-found-tabs" role="group" aria-label="Filter by report type">
          {[
            { value: 'all', label: 'All reports' },
            { value: 'lost', label: 'Lost' },
            { value: 'found', label: 'Found' },
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              className={activeTab === tab.value ? 'active' : ''}
              onClick={() => setActiveTab(tab.value)}
              aria-pressed={activeTab === tab.value}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="lost-found-nearby">
          <label className="lost-found-nearby-toggle">
            <input
              type="checkbox"
              checked={nearbyOnly}
              onChange={(event) => setNearbyOnly(event.target.checked)}
            />
            Show nearby reports
          </label>

          <button
            type="button"
            className="lost-found-secondary-btn"
            onClick={() => {
              if (myLocation) {
                setNotice('Your current location is ready for distance filtering.');
                return;
              }
              getMyLocation();
            }}
          >
            {myLocation ? 'Location ready ✓' : 'Set my location'}
          </button>

          {nearbyOnly && (
            <label className="lost-found-radius">
              Within {radiusKm} km
              <input
                type="range"
                min="1"
                max="25"
                value={radiusKm}
                onChange={(event) => setRadiusKm(Number(event.target.value))}
              />
            </label>
          )}

          {nearbyOnly && !myLocation && (
            <p className="lost-found-hint">
              Set your location to calculate distances. Reports without coordinates
              won't appear in this filter.
            </p>
          )}
        </div>
      </section>

      <section className="lost-found-results">
        <div className="lost-found-results-heading">
          <h2>Campus reports</h2>
          <span>{filteredReports.length} reports</span>
        </div>

        {loading ? (
          <p className="lost-found-empty">Loading campus reports...</p>
        ) : filteredReports.length === 0 ? (
          <div className="lost-found-empty">
            <h3>No matching reports</h3>
            <p>Try another search or filter, or report an item to help the campus.</p>
          </div>
        ) : (
          <div className="lost-found-grid">
            {filteredReports.map((report) => {
              const isOwner = Boolean(user && report.ownerId === user.uid);
              const hasCoordinates =
                report.latitude != null && report.longitude != null;

              const distance =
                myLocation && hasCoordinates
                  ? distanceInKm(
                      myLocation.latitude,
                      myLocation.longitude,
                      Number(report.latitude),
                      Number(report.longitude)
                    )
                  : null;

              return (
                <article className="lost-found-card" key={report.id}>
                  <div className="lost-found-card-top">
                    <span
                      className={`lost-found-status ${
                        report.status === 'found' ? 'status-found' : 'status-lost'
                      }`}
                    >
                      {report.status === 'found' ? 'Found item' : 'Lost item'}
                    </span>
                    <span className="lost-found-date">
                      {formatDate(report.createdAt || report.date)}
                    </span>
                  </div>

                  <h3>{report.title || 'Untitled item'}</h3>
                  <p className="lost-found-description">
                    {report.description || 'No description provided.'}
                  </p>

                  <div className="lost-found-card-meta">
                    <p>
                      <span aria-hidden="true">📍</span> {report.location || 'Location not provided'}
                    </p>
                    <p>
                      <span aria-hidden="true">👤</span>{' '}
                      {report.reporter || 'College student'}
                    </p>
                    {distance !== null && Number.isFinite(distance) && (
                      <p>
                        <span aria-hidden="true">↔</span>{' '}
                        {distance < 1
                          ? `${Math.round(distance * 1000)} m away`
                          : `${distance.toFixed(1)} km away`}
                      </p>
                    )}
                  </div>

                  {isOwner && (
                    <div className="lost-found-card-actions">
                      <button
                        type="button"
                        className="lost-found-secondary-btn"
                        onClick={() => startEdit(report)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="lost-found-delete-btn"
                        onClick={() => handleDelete(report)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
