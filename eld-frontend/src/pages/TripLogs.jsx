import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateLogs } from '../services/api';
import LogsChart from '../components/LogsChart';
import LogsList from '../components/LogsList';

const TripLogs = () => {
  const { tripId } = useParams();
  const [logs, setLogs] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); 
  const navigate = useNavigate();

  const handleGenerateLogs = async () => {
    try {
      const response = await generateLogs(tripId);
      setLogs(response);
      setShowChart(true);
      showMessage("Logs generated successfully!", "success");
    } catch (error) {
      console.error(error);
      showMessage("Failed to generate logs.", "error");
    }
  };

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Trip Logs</h1>
      
      {message && (
        <div className={`mb-4 p-3 rounded text-lg font-semibold text-center ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
      
      <button onClick={handleGenerateLogs} className="btn mb-4">Generate Logs</button>

      {showChart && logs.length > 0 && (
        <div className="mt-6">
          <LogsChart logs={logs} />
        </div>
      )}

      <LogsList logs={logs} />

      <button onClick={() => navigate(`/export/${tripId}`)} className="btn mt-4">Export Logs</button>
    </div>
  );
};

export default TripLogs;
