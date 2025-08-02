import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getEventById, reset as resetEvent } from '../features/events/eventSlice';
import { createBooking, reset as resetBooking } from '../features/bookings/bookingSlice';
import Spinner from '../components/Spinner';
import { MapPin, Calendar, Tag, Users, ArrowLeft, Ticket } from 'lucide-react';

const formatDate = (isoDate) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(isoDate).toLocaleDateString('en-GB', options).replace(/,/, ' at');
};

function EventPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [seats, setSeats] = useState(1);

    const { event, isLoading: eventIsLoading, isError: eventIsError, message: eventMessage } = useSelector((state) => state.events);
    const { user } = useSelector((state) => state.auth);
    const { isLoading: bookingIsLoading, isError: bookingIsError, isSuccess: bookingIsSuccess, message: bookingMessage } = useSelector((state) => state.bookings);

    useEffect(() => {
        if (bookingIsError) {
            alert(bookingMessage); // In a real app, use a toast notification
        }

        if (bookingIsSuccess) {
            alert('Booking successful!');
            navigate('/my-bookings');
        }

        dispatch(resetBooking());

    }, [bookingIsError, bookingIsSuccess, bookingMessage, navigate, dispatch]);

    useEffect(() => {
        dispatch(getEventById(id));
        return () => {
            dispatch(resetEvent());
        };
    }, [dispatch, id]);

    const handleBookingSubmit = (e) => {
        e.preventDefault();
        const bookingData = {
            eventId: event._id,
            seats: Number(seats),
        };
        dispatch(createBooking(bookingData));
    };

    if (eventIsLoading || !event) {
        return <Spinner />;
    }

    if (eventIsError) {
        return <div className="bg-red-100 text-red-700 p-3 rounded-md">{eventMessage}</div>;
    }

    const isEventFull = event.attendees.length >= event.capacity;
    const isEventPassed = new Date(event.date) < new Date();

    return (
        <div>
            <Link to="/" className="flex items-center text-blue-600 hover:underline mb-6"><ArrowLeft className="w-4 h-4 mr-2" />Back to All Events</Link>
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                        <h1 className="text-4xl font-bold text-gray-800">{event.name}</h1>
                        <span className={`px-4 py-2 text-sm font-semibold rounded-full ${event.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : event.status === 'Ongoing' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{event.status}</span>
                    </div>
                    <p className="text-gray-600 text-lg mb-6">{event.description}</p>
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-4 text-gray-700">
                            <div className="flex items-center"><Tag className="w-5 h-5 mr-3 text-blue-500" /><span>Category: <strong>{event.category}</strong></span></div>
                            <div className="flex items-center"><MapPin className="w-5 h-5 mr-3 text-blue-500" /><span>Location: <strong>{event.location}</strong></span></div>
                        </div>
                        <div className="space-y-4 text-gray-700">
                            <div className="flex items-center"><Calendar className="w-5 h-5 mr-3 text-blue-500" /><span>Date: <strong>{formatDate(event.date)}</strong></span></div>
                            <div className="flex items-center"><Users className="w-5 h-5 mr-3 text-blue-500" /><span>Capacity: <strong>{event.attendees.length} / {event.capacity}</strong></span></div>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl font-bold mb-4 flex items-center"><Ticket className="mr-2"/>Book Your Spot</h3>
                        {user ? (
                            isEventPassed ? <p className="text-center font-semibold text-red-600">This event has already passed.</p>
                            : isEventFull ? <p className="text-center font-semibold text-red-600">This event is fully booked.</p>
                            : (
                                <form onSubmit={handleBookingSubmit} className="flex flex-col items-center">
                                    <div className="mb-4">
                                        <label htmlFor="seats" className="mr-4 font-semibold">Seats:</label>
                                        <select id="seats" value={seats} onChange={(e) => setSeats(e.target.value)} className="p-2 border rounded-md">
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400" disabled={bookingIsLoading}>
                                        {bookingIsLoading ? 'Processing...' : 'Confirm Booking'}
                                    </button>
                                </form>
                            )
                        ) : (
                            <p className="text-center"><Link to="/login" className="text-blue-600 font-semibold hover:underline">Login</Link> or <Link to="/register" className="text-blue-600 font-semibold hover:underline">Register</Link> to book this event.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventPage;
