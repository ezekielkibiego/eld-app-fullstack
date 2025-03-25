import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { exportLogs } from '../services/api';
import { saveAs } from 'file-saver';
import { getTripDetails } from '../services/api';

const ExportLogs = () => {
  const { tripId } = useParams();
  const [message, setMessage] = useState('');
  const [tripDetails, setTripDetails] = useState(null);

  // Fetch the trip details
  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const data = await getTripDetails(tripId);
        setTripDetails(data);
      } catch (error) {
        console.error('Failed to fetch trip details:', error);
      }
    };
    fetchTripDetails();
  }, [tripId]);

  const handleExport = async (format) => {
    setMessage(''); 
    try {
      const data = await exportLogs(tripId, format);
      let blob;
      if (format === 'json') {
        blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      } else if (format === 'pdf') {
        blob = new Blob([data], { type: 'application/pdf' });
      } else if (format === 'csv') {
        blob = new Blob([data], { type: 'text/csv' });
      }
      saveAs(blob, `Trip_${tripDetails?.current_location || tripId}_Logs.${format}`);
      setMessage(`Logs exported successfully as ${format.toUpperCase()}!`);
    } catch (error) {
      console.error(`Failed to export logs as ${format}:`, error);
      setMessage('Failed to export logs.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Export Logs for Trip: {tripDetails ? `${tripDetails.current_location} → ${tripDetails.dropoff_location}` : 'Loading...'}
        </h1>
        <div className="flex justify-around mb-6">
          <button
            onClick={() => handleExport('csv')}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-200"
          >
            Export as CSV
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-200"
          >
            Export as PDF
          </button>
          <button
            onClick={() => handleExport('json')}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
          >
            Export as JSON
          </button>
        </div>
        {message && (
          <div className="text-center text-lg font-semibold text-gray-700 p-3 border border-gray-200 rounded shadow">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportLogs;
