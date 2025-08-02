import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getEvents, reset } from '../features/events/eventSlice';
import Spinner from '../components/Spinner';
import EventCard from '../components/EventCard';
import { SlidersHorizontal } from 'lucide-react';

function HomePage() {
  const dispatch = useDispatch();
  const { events, isLoading, isError, message } = useSelector(
    (state) => state.events
  );

  // State for filter controls
  const [filters, setFilters] = useState({
    category: 'All',
    location: 'Any',
    date: '',
  });

  // State for the events that match the filters
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    // Fetch all events when the component mounts
    dispatch(getEvents());

    // The cleanup function will run when the component unmounts
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  // This effect runs whenever the main events list or filters change
  useEffect(() => {
    let results = events;

    if (filters.category !== 'All') {
      results = results.filter(
        (event) => event.category === filters.category
      );
    }

    if (filters.location !== 'Any') {
      results = results.filter(
        (event) => event.location === filters.location
      );
    }

    if (filters.date) {
      results = results.filter((event) => {
        const eventDate = new Date(event.date);
        const filterDate = new Date(filters.date);
        // Compare dates without time
        return eventDate.toDateString() === filterDate.toDateString();
      });
    }

    setFilteredEvents(results);
  }, [events, filters]);


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevState => ({
        ...prevState,
        [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
        category: 'All',
        location: 'Any',
        date: '',
    });
  }

  if (isLoading) {
    return <Spinner />;
  }

  // Get unique categories for the dropdown
  const categories = ['All', ...new Set(events.map(event => event.category))];

  return (
    <div>
      {/* Page Header */}
      <div className="text-center py-10">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Discover Your Next Event</h1>
        <p className="text-lg text-gray-600">
          Browse through a curated list of concerts, workshops, and more.
        </p>
      </div>

      {/* Filtering Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8 sticky top-20 z-40">
        <div className="flex flex-wrap items-center gap-4">
          <SlidersHorizontal className="text-gray-600" />
          <h3 className="text-lg font-semibold">Filter Events:</h3>
          <select name="category" value={filters.category} onChange={handleFilterChange} className="p-2 border rounded-md bg-white">
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select name="location" value={filters.location} onChange={handleFilterChange} className="p-2 border rounded-md bg-white">
            <option value="Any">Any Location</option>
            <option value="Online">Online</option>
            {/* We can add more locations dynamically if needed */}
          </select>
          <input type="date" name="date" value={filters.date} onChange={handleFilterChange} className="p-2 border rounded-md" />
          <button onClick={clearFilters} className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">Clear Filters</button>
        </div>
      </div>

      {/* Event Listing Section */}
      {isError && <div className="bg-red-100 text-red-700 p-3 rounded-md">{message}</div>}

      {filteredEvents.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        !isLoading && <p className="text-center text-gray-500 py-10">No events match the current filters.</p>
      )}
    </div>
  );
}

export default HomePage;
