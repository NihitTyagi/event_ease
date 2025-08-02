import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createEvent, getEvents, deleteEvent, updateEvent, getEventAttendees, reset, resetAttendees } from '../features/events/eventSlice';
import Spinner from '../components/Spinner';
import { PlusCircle, Trash2, Edit, X, Users } from 'lucide-react';

// Modal for Editing an Event
const EditEventModal = ({ event, onClose, onUpdate }) => {
    const [editData, setEditData] = useState({
        name: event.name, description: event.description, category: event.category,
        location: event.location, date: new Date(event.date).toISOString().slice(0, 16), capacity: event.capacity,
    });
    const onChange = (e) => setEditData(p => ({ ...p, [e.target.name]: e.target.value }));
    const handleUpdate = (e) => { e.preventDefault(); onUpdate(event._id, editData); };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
                <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-bold">Edit Event</h2><button onClick={onClose}><X /></button></div>
                <form onSubmit={handleUpdate} className="space-y-4">
                    <input type="text" name="name" value={editData.name} onChange={onChange} placeholder="Event Name" required className="w-full p-2 border rounded-md" />
                    <textarea name="description" value={editData.description} onChange={onChange} placeholder="Event Description" required className="w-full p-2 border rounded-md"></textarea>
                    <select name="category" value={editData.category} onChange={onChange} className="w-full p-2 border rounded-md bg-white"><option>Tech</option><option>Music</option><option>Business</option><option>Art</option><option>Workshop</option></select>
                    <select name="location" value={editData.location} onChange={onChange} className="w-full p-2 border rounded-md bg-white"><option>Online</option><option>In-Person</option></select>
                    <input type="datetime-local" name="date" value={editData.date} onChange={onChange} required className="w-full p-2 border rounded-md" />
                    <input type="number" name="capacity" value={editData.capacity} onChange={onChange} placeholder="Capacity" required className="w-full p-2 border rounded-md" />
                    <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700">Save Changes</button>
                </form>
            </div>
        </div>
    );
};

// Modal for Viewing Attendees
const AttendeesModal = ({ eventName, attendees, isLoading, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg">
                <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-bold">Attendees for {eventName}</h2><button onClick={onClose}><X /></button></div>
                {isLoading ? <Spinner /> : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {attendees.length > 0 ? attendees.map(attendee => (
                            <div key={attendee._id} className="bg-gray-100 p-3 rounded-md">
                                <p className="font-semibold">{attendee.username}</p>
                                <p className="text-sm text-gray-600">{attendee.email}</p>
                            </div>
                        )) : <p>No attendees have booked this event yet.</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

function AdminDashboardPage() {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAttendeesModalOpen, setIsAttendeesModalOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', category: 'Tech', location: 'Online', date: '', capacity: '' });

    const dispatch = useDispatch();
    const { events, isLoading, isError, message, currentEventAttendees } = useSelector((state) => state.events);

    useEffect(() => {
        dispatch(getEvents());
        return () => { dispatch(reset()); };
    }, [dispatch]);

    const onChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    const onSubmit = (e) => { e.preventDefault(); dispatch(createEvent(formData)); setFormData({ name: '', description: '', category: 'Tech', location: 'Online', date: '', capacity: '' }); };
    
    const handleEditClick = (event) => { setCurrentEvent(event); setIsEditModalOpen(true); };
    const handleUpdate = (eventId, eventData) => { dispatch(updateEvent({ eventId, eventData })); setIsEditModalOpen(false); };
    const handleDelete = (eventId) => dispatch(deleteEvent(eventId));

    const handleViewAttendees = (event) => {
        setCurrentEvent(event);
        dispatch(getEventAttendees(event._id));
        setIsAttendeesModalOpen(true);
    };

    const closeAttendeesModal = () => {
        setIsAttendeesModalOpen(false);
        dispatch(resetAttendees());
    };

    return (
        <>
            {isEditModalOpen && <EditEventModal event={currentEvent} onClose={() => setIsEditModalOpen(false)} onUpdate={handleUpdate} />}
            {isAttendeesModalOpen && <AttendeesModal eventName={currentEvent?.name} attendees={currentEventAttendees} isLoading={isLoading} onClose={closeAttendeesModal} />}
            
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1"><div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4 flex items-center"><PlusCircle className="mr-2"/>Create New Event</h2>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <input type="text" name="name" value={formData.name} onChange={onChange} placeholder="Event Name" required className="w-full p-2 border rounded-md" />
                        <textarea name="description" value={formData.description} onChange={onChange} placeholder="Event Description" required className="w-full p-2 border rounded-md"></textarea>
                        <select name="category" value={formData.category} onChange={onChange} className="w-full p-2 border rounded-md bg-white"><option>Tech</option><option>Music</option><option>Business</option><option>Art</option><option>Workshop</option></select>
                        <select name="location" value={formData.location} onChange={onChange} className="w-full p-2 border rounded-md bg-white"><option>Online</option><option>In-Person</option></select>
                        <input type="datetime-local" name="date" value={formData.date} onChange={onChange} required className="w-full p-2 border rounded-md" />
                        <input type="number" name="capacity" value={formData.capacity} onChange={onChange} placeholder="Capacity" required className="w-full p-2 border rounded-md" />
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700" disabled={isLoading}>{isLoading ? 'Creating...' : 'Create Event'}</button>
                    </form>
                </div></div>
                <div className="lg:col-span-2"><div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Manage Events</h2>
                    {isLoading && events.length === 0 && <Spinner />}
                    {isError && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{message}</div>}
                    <div className="space-y-4">
                        {events.map(event => (
                            <div key={event._id} className="border p-4 rounded-md flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold">{event.name}</h3>
                                    <p className="text-sm text-gray-500">{event.category} | {new Date(event.date).toLocaleDateString()} | Attendees: {event.attendees.length}</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button onClick={() => handleViewAttendees(event)} className="text-indigo-500 hover:text-indigo-700" disabled={isLoading}><Users /></button>
                                    <button onClick={() => handleEditClick(event)} className="text-blue-500 hover:text-blue-700" disabled={isLoading}><Edit /></button>
                                    <button onClick={() => handleDelete(event._id)} className="text-red-500 hover:text-red-700" disabled={isLoading}><Trash2 /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div></div>
            </div>
        </>
    );
}

export default AdminDashboardPage;
