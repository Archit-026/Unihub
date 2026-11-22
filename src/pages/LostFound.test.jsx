
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import LostFound from './LostFound';

const mocks = vi.hoisted(() => ({
  addDoc: vi.fn(),
  collection: vi.fn(),
  deleteDoc: vi.fn(),
  deleteField: vi.fn(),
  doc: vi.fn(),
  onSnapshot: vi.fn(),
  orderBy: vi.fn(),
  query: vi.fn(),
  serverTimestamp: vi.fn(),
  updateDoc: vi.fn(),
  onAuthStateChanged: vi.fn(),
  auth: {
    currentUser: {
      uid: 'student123',
      email: 'student@mitsgwl.ac.in',
      emailVerified: true,
      displayName: 'Priya Sharma',
    },
  },
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: mocks.onAuthStateChanged,
}));

vi.mock('firebase/firestore', () => ({
  addDoc: mocks.addDoc,
  collection: mocks.collection,
  deleteDoc: mocks.deleteDoc,
  deleteField: mocks.deleteField,
  doc: mocks.doc,
  onSnapshot: mocks.onSnapshot,
  orderBy: mocks.orderBy,
  query: mocks.query,
  serverTimestamp: mocks.serverTimestamp,
  updateDoc: mocks.updateDoc,
}));

vi.mock('../firebase', () => ({
  auth: mocks.auth,
  db: {},
}));

vi.mock('../firestore', () => ({
  db: {},
}));

describe('LostFound Page', () => {
  const sampleReports = [
    {
      id: 'r1',
      title: 'Blue Water Bottle',
      description: 'Lost my blue bottle in the library.',
      location: 'Library',
      status: 'lost',
      ownerId: 'student123',
      reporter: 'Priya Sharma',
      latitude: 26.2183,
      longitude: 78.1828,
      createdAt: '2026-11-10',
    },
    {
      id: 'r2',
      title: 'Found Calculator',
      description: 'A scientific calculator was found.',
      location: 'Classroom 201',
      status: 'found',
      ownerId: 'another-user',
      reporter: 'Another Student',
      createdAt: '2026-11-11',
    },
  ];

  const collegeUser = {
    uid: 'student123',
    email: 'student@mitsgwl.ac.in',
    emailVerified: true,
    displayName: 'Priya Sharma',
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mocks.auth.currentUser = collegeUser;

    mocks.collection.mockReturnValue({});
    mocks.query.mockReturnValue({});
    mocks.orderBy.mockReturnValue({});
    mocks.doc.mockReturnValue({});
    mocks.serverTimestamp.mockReturnValue('mock-timestamp');
    mocks.deleteField.mockReturnValue('DELETE_FIELD');

    mocks.addDoc.mockResolvedValue({});
    mocks.updateDoc.mockResolvedValue();
    mocks.deleteDoc.mockResolvedValue();

    mocks.onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(collegeUser);
      return vi.fn();
    });

    mocks.onSnapshot.mockImplementation((query, success) => {
      success({
        docs: sampleReports.map(report => ({
          id: report.id,
          data: () => ({ ...report }),
        })),
      });
      return vi.fn();
    });

    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders the Lost & Found page heading', () => {
    render(<LostFound />);

    expect(screen.getByRole('heading', { name: 'Lost & Found' }))
      .toBeInTheDocument();

    expect(
      screen.getByText('Help your fellow students reunite with their missing belongings.')
    ).toBeInTheDocument();
  });

  it('loads and displays reports from Firestore', () => {
    render(<LostFound />);

    expect(screen.getByText('Blue Water Bottle')).toBeInTheDocument();
    expect(screen.getByText('Found Calculator')).toBeInTheDocument();
    expect(mocks.collection).toHaveBeenCalledWith({}, 'lostFoundReports');
  });

  it('displays the correct number of reports', () => {
    render(<LostFound />);

    expect(screen.getByText('2 reports')).toBeInTheDocument();
  });

  it('shows an error when reports cannot be loaded', () => {
    mocks.onSnapshot.mockImplementation((query, success, error) => {
      error(new Error('Permission denied'));
      return vi.fn();
    });

    render(<LostFound />);

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Unable to connect to Lost & Found. Please check your internet connection and try again.'
    );
  });

  it('filters reports using the search field', () => {
    render(<LostFound />);

    fireEvent.change(
      screen.getByRole('searchbox', {
        name: 'Search Lost and Found reports',
      }),
      { target: { value: 'calculator' } }
    );

    expect(screen.getByText('Found Calculator')).toBeInTheDocument();
    expect(screen.queryByText('Blue Water Bottle')).not.toBeInTheDocument();
    expect(screen.getByText('1 reports')).toBeInTheDocument();
  });

  it('filters reports by Lost status', () => {
    render(<LostFound />);

    fireEvent.click(screen.getByRole('button', { name: 'Lost', exact: true }));

    expect(screen.getByText('Blue Water Bottle')).toBeInTheDocument();
    expect(screen.queryByText('Found Calculator')).not.toBeInTheDocument();
  });

  it('filters reports by Found status', () => {
    render(<LostFound />);

    fireEvent.click(screen.getByRole('button', { name: 'Found', exact: true }));

    expect(screen.getByText('Found Calculator')).toBeInTheDocument();
    expect(screen.queryByText('Blue Water Bottle')).not.toBeInTheDocument();
  });

  it('shows an empty state when no reports match', () => {
    render(<LostFound />);

    fireEvent.change(
      screen.getByRole('searchbox', {
        name: 'Search Lost and Found reports',
      }),
      { target: { value: 'nonexistent item' } }
    );

    expect(screen.getByText('No matching reports')).toBeInTheDocument();
  });

  it('opens the report creation form', () => {
    render(<LostFound />);

    fireEvent.click(screen.getByRole('button', { name: '+ Report an item' }));

    expect(screen.getByRole('heading', { name: 'Report an item' }))
      .toBeInTheDocument();

    expect(screen.getByLabelText('Item name')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Where was it lost or found?'))
      .toBeInTheDocument();
  });

  it('creates a report with valid details', async () => {
    render(<LostFound />);

    fireEvent.click(screen.getByRole('button', { name: '+ Report an item' }));

    fireEvent.change(screen.getByLabelText('Item name'), {
      target: { value: 'Black Backpack' },
    });

    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Black backpack with notebooks.' },
    });

    fireEvent.change(screen.getByLabelText('Where was it lost or found?'), {
      target: { value: 'Library' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Publish report' }));

    await waitFor(() => {
      expect(mocks.addDoc).toHaveBeenCalled();
    });

    const payload = mocks.addDoc.mock.calls[0][1];

    expect(payload).toMatchObject({
      title: 'Black Backpack',
      description: 'Black backpack with notebooks.',
      location: 'Library',
      status: 'lost',
      ownerId: 'student123',
      reporter: 'Priya Sharma',
    });

    expect(await screen.findByRole('status'))
      .toHaveTextContent('Your report was published.');
  });

  it('rejects report creation for an unverified or non-college account', async () => {
    mocks.onAuthStateChanged.mockImplementation((auth, callback) => {
      callback({
        uid: 'user1',
        email: 'user@gmail.com',
        emailVerified: true,
      });
      return vi.fn();
    });

    render(<LostFound />);

    fireEvent.click(screen.getByRole('button', { name: '+ Report an item' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Please log in with your verified college account to report an item.'
    );

    expect(mocks.addDoc).not.toHaveBeenCalled();
  });

  it('rejects incomplete report details', () => {
    render(<LostFound />);

    fireEvent.click(screen.getByRole('button', { name: '+ Report an item' }));

    fireEvent.change(screen.getByLabelText('Item name'), {
      target: { value: 'Bottle' },
    });

    fireEvent.submit(
      screen.getByRole('heading', { name: 'Report an item' }).closest('form')
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Please complete the title, description, and location fields.'
    );

    expect(mocks.addDoc).not.toHaveBeenCalled();
  });

  it('rejects invalid latitude and longitude values', () => {
    render(<LostFound />);

    fireEvent.click(screen.getByRole('button', { name: '+ Report an item' }));

    fireEvent.change(screen.getByLabelText('Item name'), {
      target: { value: 'Bottle' },
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Blue bottle' },
    });
    fireEvent.change(screen.getByLabelText('Where was it lost or found?'), {
      target: { value: 'Library' },
    });
    fireEvent.change(screen.getByLabelText('Latitude (optional)'), {
      target: { value: '91' },
    });
    fireEvent.change(screen.getByLabelText('Longitude (optional)'), {
      target: { value: '78.18' },
    });

    fireEvent.submit(
      screen.getByRole('heading', { name: 'Report an item' }).closest('form')
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Latitude must be between -90 and 90, and longitude between -180 and 180.'
    );
  });

  it('requires both coordinates when one is provided', () => {
    render(<LostFound />);

    fireEvent.click(screen.getByRole('button', { name: '+ Report an item' }));

    fireEvent.change(screen.getByLabelText('Item name'), {
      target: { value: 'Bottle' },
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Blue bottle' },
    });
    fireEvent.change(screen.getByLabelText('Where was it lost or found?'), {
      target: { value: 'Library' },
    });
    fireEvent.change(screen.getByLabelText('Latitude (optional)'), {
      target: { value: '26.2' },
    });

    fireEvent.submit(
      screen.getByRole('heading', { name: 'Report an item' }).closest('form')
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Enter both latitude and longitude, or leave both empty.'
    );
  });

  it('opens the edit form for the current user report', () => {
    render(<LostFound />);

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

    expect(screen.getByRole('heading', { name: 'Edit your report' }))
      .toBeInTheDocument();

    expect(screen.getByLabelText('Item name')).toHaveValue('Blue Water Bottle');
  });

  it('updates an existing report owned by the current user', async () => {
    render(<LostFound />);

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

    fireEvent.change(screen.getByLabelText('Item name'), {
      target: { value: 'Updated Bottle' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() => {
      expect(mocks.updateDoc).toHaveBeenCalled();
    });

    expect(mocks.deleteField).toHaveBeenCalled();

    expect(await screen.findByRole('status'))
      .toHaveTextContent('Your report was updated.');
  });

  it('deletes a report after confirmation', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<LostFound />);

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(mocks.deleteDoc).toHaveBeenCalled();
    });

    expect(window.confirm).toHaveBeenCalledWith(
      'Delete the report "Blue Water Bottle"? This cannot be undone.'
    );

    expect(await screen.findByRole('status')).toHaveTextContent('Report deleted.');
  });

  it('does not delete a report when confirmation is cancelled', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    render(<LostFound />);

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(mocks.deleteDoc).not.toHaveBeenCalled();
  });

  it('opens the nearby filter and displays its location guidance', () => {
    render(<LostFound />);

    fireEvent.click(screen.getByLabelText('Show nearby reports'));

    expect(
     screen.getByText(/Set your location to calculate distances/)
    ).toBeInTheDocument();

    expect(screen.getByText('Within 5 km')).toBeInTheDocument();
  });

  it('closes the report form when Cancel report is clicked', () => {
    render(<LostFound />);

    fireEvent.click(screen.getByRole('button', { name: '+ Report an item' }));

    fireEvent.click(screen.getByRole('button', { name: 'Cancel report' }));

    expect(screen.queryByRole('heading', { name: 'Report an item' }))
      .not.toBeInTheDocument();
  });
});
