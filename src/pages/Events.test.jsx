import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Events from './Events';

const mocks = vi.hoisted(() => ({
  addDoc: vi.fn(),
  collection: vi.fn(),
  deleteDoc: vi.fn(),
  deleteField: vi.fn(),
  doc: vi.fn(),
  getDocs: vi.fn(),
  limit: vi.fn(),
  onSnapshot: vi.fn(),
  orderBy: vi.fn(),
  query: vi.fn(),
  startAfter: vi.fn(),
  updateDoc: vi.fn(),
  auth: {
    currentUser: {
      uid: 'student123',
      email: 'student@mitsgwl.ac.in',
      emailVerified: true
    }
  }
}));

vi.mock('firebase/firestore', () => ({
  addDoc: mocks.addDoc,
  collection: mocks.collection,
  deleteDoc: mocks.deleteDoc,
  deleteField: mocks.deleteField,
  doc: mocks.doc,
  getDocs: mocks.getDocs,
  limit: mocks.limit,
  onSnapshot: mocks.onSnapshot,
  orderBy: mocks.orderBy,
  query: mocks.query,
  startAfter: mocks.startAfter,
  updateDoc: mocks.updateDoc
}));

vi.mock('../firebase', () => ({
  auth: mocks.auth
}));

vi.mock('../firestore', () => ({
  db: {}
}));

vi.mock('../components/EventCard', () => ({
  default: ({ event }) => (
    <div data-testid="event-card">{event.title}</div>
  )
}));

describe('Events Page', () => {
  const sampleEvent = {
    title: 'Coding Workshop',
    date: '2026-12-10',
    time: '10:00',
    location: 'College Auditorium',
    description: 'Learn programming.',
    ownerId: 'student123'
  };

  const makeDocument = (id, data = sampleEvent) => ({
    id,
    data: () => ({ ...data })
  });

  const firstPageDocs = [makeDocument('event1')];

  beforeEach(() => {
    vi.clearAllMocks();

    mocks.auth.currentUser = {
      uid: 'student123',
      email: 'student@mitsgwl.ac.in',
      emailVerified: true
    };

    mocks.collection.mockReturnValue('events-collection');
    mocks.query.mockReturnValue('events-query');
    mocks.orderBy.mockReturnValue('date-order');
    mocks.limit.mockReturnValue('page-limit');
    mocks.startAfter.mockReturnValue('cursor');
    mocks.doc.mockReturnValue('event-document');
    mocks.deleteField.mockReturnValue('DELETE_FIELD');
    mocks.addDoc.mockResolvedValue({ id: 'new-event' });
    mocks.updateDoc.mockResolvedValue();
    mocks.deleteDoc.mockResolvedValue();
    mocks.getDocs.mockResolvedValue({ docs: [] });

    mocks.onSnapshot.mockImplementation((query, success) => {
      success({ docs: firstPageDocs });
      return vi.fn();
    });

    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  const renderEvents = () =>
    render(
      <MemoryRouter>
        <Events />
      </MemoryRouter>
    );

  it('displays the Events heading and subtitle', () => {
    renderEvents();

    expect(
      screen.getByRole('heading', { name: 'Events' })
    ).toBeInTheDocument();

    expect(
      screen.getByText('Discover and manage campus events')
    ).toBeInTheDocument();
  });

  it('loads the first page of events in date order with a page limit', () => {
    renderEvents();

    expect(screen.getByTestId('event-card')).toHaveTextContent(
      'Coding Workshop'
    );

    expect(mocks.collection).toHaveBeenCalledWith({}, 'events');
    expect(mocks.orderBy).toHaveBeenCalledWith('date', 'asc');
    expect(mocks.limit).toHaveBeenCalledWith(12);

    expect(mocks.onSnapshot).toHaveBeenCalledWith(
      'events-query',
      expect.any(Function),
      expect.any(Function)
    );
  });

  it('shows the empty state when there are no events', () => {
    mocks.onSnapshot.mockImplementation((query, success) => {
      success({ docs: [] });
      return vi.fn();
    });

    renderEvents();

    expect(
      screen.getByText('No events yet. Create your first campus event!')
    ).toBeInTheDocument();
  });

  it('shows an error when events cannot be loaded', () => {
    mocks.onSnapshot.mockImplementation((query, success, error) => {
      error(new Error('Permission denied'));
      return vi.fn();
    });

    renderEvents();

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Could not load events. Check your Firestore rules and connection.'
    );
  });

  it('shows the login link when no user is signed in', () => {
    mocks.auth.currentUser = null;

    renderEvents();

    expect(
      screen.getByRole('link', {
        name: /Sign in with your college account/i
      })
    ).toHaveAttribute('href', '/login');

    expect(
      screen.queryByRole('button', { name: /Create Event/i })
    ).not.toBeInTheDocument();
  });

  it('opens the create event form', () => {
    renderEvents();

    fireEvent.click(
      screen.getByRole('button', { name: /Create Event/i })
    );

    expect(
      screen.getByRole('heading', { name: 'Create Event' })
    ).toBeInTheDocument();

    expect(screen.getByLabelText('Event title')).toBeInTheDocument();
    expect(screen.getByLabelText('Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Time')).toBeInTheDocument();
    expect(screen.getByLabelText('Location')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  it('creates a new event with valid details', async () => {
    renderEvents();

    fireEvent.click(
      screen.getByRole('button', { name: /Create Event/i })
    );

    fireEvent.change(screen.getByLabelText('Event title'), {
      target: { value: 'AI Workshop' }
    });

    fireEvent.change(screen.getByLabelText('Date'), {
      target: { value: '2026-12-15' }
    });

    fireEvent.change(screen.getByLabelText('Time'), {
      target: { value: '11:30' }
    });

    fireEvent.change(screen.getByLabelText('Location'), {
      target: { value: 'Seminar Hall' }
    });

    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Learn about artificial intelligence.' }
    });

    fireEvent.click(
      screen.getByRole('button', { name: 'Publish Event' })
    );

    await waitFor(() => {
      expect(mocks.addDoc).toHaveBeenCalled();
    });

    const savedData = mocks.addDoc.mock.calls[0][1];

    expect(savedData).toMatchObject({
      title: 'AI Workshop',
      date: '2026-12-15',
      time: '11:30',
      location: 'Seminar Hall',
      description: 'Learn about artificial intelligence.',
      ownerId: 'student123'
    });

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Event created successfully.'
    );
  });

  it('rejects event creation for an unverified or non-college account', async () => {
    mocks.auth.currentUser = {
      uid: 'user1',
      email: 'user@gmail.com',
      emailVerified: true
    };

    renderEvents();

    fireEvent.click(
      screen.getByRole('button', { name: /Create Event/i })
    );

    fireEvent.change(screen.getByLabelText('Event title'), {
      target: { value: 'Workshop' }
    });

    fireEvent.change(screen.getByLabelText('Date'), {
      target: { value: '2026-12-15' }
    });

    fireEvent.change(screen.getByLabelText('Location'), {
      target: { value: 'Auditorium' }
    });

    fireEvent.click(
      screen.getByRole('button', { name: 'Publish Event' })
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Please sign in with a verified MITS college account.'
    );

    expect(mocks.addDoc).not.toHaveBeenCalled();
  });

  it('validates required event details', () => {
    renderEvents();

    fireEvent.click(
      screen.getByRole('button', { name: /Create Event/i })
    );

    fireEvent.change(screen.getByLabelText('Event title'), {
      target: { value: '   ' }
    });

    fireEvent.submit(
      screen.getByRole('heading', { name: 'Create Event' }).closest('form')
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Please enter the event title, date and location.'
    );

    expect(mocks.addDoc).not.toHaveBeenCalled();
  });

  it('opens the edit form with existing event details', () => {
    renderEvents();

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

    expect(
      screen.getByRole('heading', { name: 'Edit Event' })
    ).toBeInTheDocument();

    expect(screen.getByLabelText('Event title')).toHaveValue(
      'Coding Workshop'
    );

    expect(screen.getByLabelText('Location')).toHaveValue(
      'College Auditorium'
    );
  });

  it('updates an event owned by the current user', async () => {
    renderEvents();

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

    fireEvent.change(screen.getByLabelText('Event title'), {
      target: { value: 'Updated Workshop' }
    });

    fireEvent.click(
      screen.getByRole('button', { name: 'Save Changes' })
    );

    await waitFor(() => {
      expect(mocks.updateDoc).toHaveBeenCalled();
    });

    expect(mocks.deleteField).toHaveBeenCalled();

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Event updated successfully.'
    );
  });

  it('hides edit and delete controls for events not owned by the current user', () => {
    mocks.onSnapshot.mockImplementation((query, success) => {
      success({
        docs: [
          makeDocument('other-event', {
            ...sampleEvent,
            ownerId: 'another-user'
          })
        ]
      });

      return vi.fn();
    });

    renderEvents();

    expect(screen.getByTestId('event-card')).toHaveTextContent(
      'Coding Workshop'
    );

    expect(
      screen.queryByRole('button', { name: 'Edit' })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: 'Delete' })
    ).not.toBeInTheDocument();

    expect(mocks.updateDoc).not.toHaveBeenCalled();
    expect(mocks.deleteDoc).not.toHaveBeenCalled();
  });

  it('deletes an event after confirmation', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    renderEvents();

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(mocks.deleteDoc).toHaveBeenCalled();
    });

    expect(window.confirm).toHaveBeenCalledWith(
      'Delete "Coding Workshop"?'
    );

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Event deleted successfully.'
    );
  });

  it('does not delete an event when confirmation is cancelled', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    renderEvents();

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(mocks.deleteDoc).not.toHaveBeenCalled();
  });

  it('shows an error when event creation fails', async () => {
    mocks.addDoc.mockRejectedValue(new Error('Network error'));

    renderEvents();

    fireEvent.click(
      screen.getByRole('button', { name: /Create Event/i })
    );

    fireEvent.change(screen.getByLabelText('Event title'), {
      target: { value: 'Workshop' }
    });

    fireEvent.change(screen.getByLabelText('Date'), {
      target: { value: '2026-12-15' }
    });

    fireEvent.change(screen.getByLabelText('Location'), {
      target: { value: 'Auditorium' }
    });

    fireEvent.click(
      screen.getByRole('button', { name: 'Publish Event' })
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Network error'
    );
  });

  it('closes the create form when Cancel is clicked', () => {
    renderEvents();

    fireEvent.click(
      screen.getByRole('button', { name: /Create Event/i })
    );

    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));

    expect(
      screen.queryByRole('heading', { name: 'Create Event' })
    ).not.toBeInTheDocument();
  });

  it('loads the next page only when Load More Events is clicked', async () => {
    const firstPage = Array.from({ length: 12 }, (_, index) =>
      makeDocument(`event-${index + 1}`, {
        ...sampleEvent,
        title: `Event ${index + 1}`
      })
    );

    mocks.onSnapshot.mockImplementation((query, success) => {
      success({ docs: firstPage });
      return vi.fn();
    });

    const nextPage = [
      makeDocument('event-13', {
        ...sampleEvent,
        title: 'Event 13'
      })
    ];

    mocks.getDocs.mockResolvedValue({ docs: nextPage });

    renderEvents();

    expect(screen.getAllByTestId('event-card')).toHaveLength(12);
    expect(mocks.getDocs).not.toHaveBeenCalled();

    fireEvent.click(
      screen.getByRole('button', { name: 'Load More Events' })
    );

    expect(await screen.findByText('Event 13')).toBeInTheDocument();
    expect(screen.getAllByTestId('event-card')).toHaveLength(13);

    expect(mocks.getDocs).toHaveBeenCalledWith('events-query');
    expect(mocks.startAfter).toHaveBeenCalledWith(firstPage[11]);
  });

  it('hides Load More Events when the first page has fewer than 12 events', () => {
    renderEvents();

    expect(
      screen.queryByRole('button', { name: 'Load More Events' })
    ).not.toBeInTheDocument();
  });

  it('shows an error if loading the next page fails', async () => {
    const firstPage = Array.from({ length: 12 }, (_, index) =>
      makeDocument(`event-${index + 1}`)
    );

    mocks.onSnapshot.mockImplementation((query, success) => {
      success({ docs: firstPage });
      return vi.fn();
    });

    mocks.getDocs.mockRejectedValue(new Error('Network error'));

    renderEvents();

    fireEvent.click(
      screen.getByRole('button', { name: 'Load More Events' })
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Could not load more events. Please try again.'
    );
  });
});