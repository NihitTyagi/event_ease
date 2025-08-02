import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMyBookings, cancelBooking, reset } from '../features/bookings/bookingSlice';
import Spinner from '../components/Spinner';
import { Calendar, MapPin, Hash, XCircle } from 'lucide-react';

// A utility function to format dates consistently
const formatDate = (isoDate) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(isoDate).toLocaleDateString('en-GB', options).replace(/ /g, '-');
};

function MyBookingsPage() {
    const dispatch = useDispatch();
    const { bookings, isLoading, isError, message } = useSelector((state) => state.bookings);

    useEffect(() => {
        dispatch(getMyBookings());
        return () => {
            dispatch(reset());
        };
    }, [dispatch]);

    const handleCancel = (bookingId) => {
        // In a real app, you would show a confirmation modal here.
        dispatch(cancelBooking(bookingId));
    };

    if (isLoading && bookings.length === 0) {
        return <Spinner />;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">My Bookings</h1>
            {isError && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{message}</div>}
            
            {bookings.length > 0 ? (
                <div className="space-y-6">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-blue-600">{booking.event.name}</h2>
                                <div className="flex items-center text-gray-600 mt-2">
                                    <Calendar className="w-5 h-5 mr-2" />
                                    <span>{formatDate(booking.event.date)}</span>
                                </div>
                                <div className="flex items-center text-gray-600 mt-1">
                                    <MapPin className="w-5 h-5 mr-2" />
                                    <span>{booking.event.location}</span>
                                </div>
                                <div className="flex items-center text-gray-600 mt-1">
                                    <Hash className="w-5 h-5 mr-2" />
                                    <span>Seats Booked: {booking.seats}</span>
                                </div>
                            </div>
                            <div>
                                <button
                                    onClick={() => handleCancel(booking._id)}
                                    className="flex items-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors disabled:bg-gray-400"
                                    disabled={isLoading}
                                >
                                    <XCircle className="w-5 h-5 mr-2" />
                                    Cancel Booking
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-white rounded-lg shadow-md">
                    <p className="text-gray-500">You haven't booked any events yet.</p>
                </div>
            )}
        </div>
    );
}

export default MyBookingsPage;
