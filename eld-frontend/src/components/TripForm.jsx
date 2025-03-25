import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTrip } from '../services/api';

const TripForm = () => {
  const [tripData, setTripData] = useState({
    current_location: '',
    pickup_location: '',
    dropoff_location: '',
    current_cycle_used: 0,
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setTripData({ ...tripData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const trip = await createTrip(tripData);
      setMessage('Trip created successfully!');
      navigate(`/logs/${trip.id}`);
    } catch (error) {
      console.error(error);
      setMessage('Failed to create trip.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="w-3/4 max-w-3xl bg-white shadow-xl rounded-lg p-10">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">Create a New Trip</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {['current_location', 'pickup_location', 'dropoff_location'].map((field) => (
            <div key={field}>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {field.replace('_', ' ').toUpperCase()}
              </label>
              <input
                type="text"
                name={field}
                placeholder={`Enter ${field.replace('_', ' ')}`}
                value={tripData[field]}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          ))}

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Current Cycle Used (Hrs)</label>
            <input
              type="number"
              name="current_cycle_used"
              placeholder="Enter Current Cycle Hours"
              value={tripData.current_cycle_used}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Create Trip
          </button>

          {message && (
            <div className="mt-4 text-center text-lg font-semibold text-gray-700">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default TripForm;