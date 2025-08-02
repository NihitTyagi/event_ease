import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { MapPin, Calendar, Tag, Users } from 'lucide-react';

// A utility function to format dates consistently
const formatDate = (isoDate) => {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Date(isoDate).toLocaleDateString('en-GB', options).replace(/ /g, '-');
};

const EventCard = ({ event }) => {
  const { name, description, category, location, date, capacity, attendees, status } = event;

  const getStatusColor = () => {
    switch (status) {
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'Ongoing':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-2xl font-bold text-gray-800">{name}</h3>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor()}`}>
                {status}
            </span>
        </div>
        <p className="text-gray-600 mb-4">{description.substring(0, 100)}...</p>

        <div className="space-y-3 text-gray-700">
            <div className="flex items-center">
                <Tag className="w-5 h-5 mr-3 text-blue-500" />
                <span>{category}</span>
            </div>
            <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-blue-500" />
                <span>{location}</span>
            </div>
            <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                <span>{formatDate(date)}</span>
            </div>
            <div className="flex items-center">
                <Users className="w-5 h-5 mr-3 text-blue-500" />
                <span>{attendees.length} / {capacity} Booked</span>
            </div>
        </div>

        <div className="mt-6">
            {/* Update this button to a Link */}
            <Link to={`/event/${event._id}`} className="w-full block text-center bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                View Details
            </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
