import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { generateLogs } from '../services/api';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LogsList = () => {
  const { tripId } = useParams();
  const [logs, setLogs] = useState([]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [startLocation, setStartLocation] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await generateLogs(tripId);
        setLogs(data);
        setMessage('Logs generated successfully!');
      } catch (error) {
        console.error('Failed to fetch logs:', error);
        setMessage('Failed to fetch logs.');
      }
    };
    fetchLogs();
  }, [tripId]);

  useEffect(() => {
    if (logs.length === 0) return;

    const coordinates = logs
      .filter(log => log.location && log.location.includes(','))
      .map(log => {
        const parts = log.location.split(',');
        return parts.length === 2 ? [parseFloat(parts[1]), parseFloat(parts[0])] : null;
      })
      .filter(coord => coord !== null);

    setRouteCoordinates(coordinates);

    if (coordinates.length >= 3) {
      setStartLocation(coordinates[0]); 
      setPickupLocation(coordinates[1]); 
      setDropoffLocation(coordinates[coordinates.length - 1]); 
    }
  }, [logs]);

  const MapBounds = () => {
    const map = useMap();
    useEffect(() => {
      if (routeCoordinates.length > 1) {
        const bounds = L.latLngBounds(routeCoordinates);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [map, routeCoordinates]);
    return null;
  };

  return (
    <div className="grid grid-cols-1 gap-8 p-6 bg-gray-100">
      
      {/* Table Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Trip Logs</h1>

        {message && (
          <div className="mb-4 text-center text-lg font-semibold text-green-600">
            {message}
          </div>
        )}

        {logs.length > 0 ? (
          <table className="w-full border-collapse bg-gray-50 rounded-lg shadow-md">
            <thead>
              <tr className="bg-blue-500 text-white text-sm">
                <th className="border p-3">Day</th>
                <th className="border p-3">Activity</th>
                <th className="border p-3">Location</th>
                <th className="border p-3">Start Time</th>
                <th className="border p-3">End Time</th>
                <th className="border p-3">Hours</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="text-center text-sm bg-white hover:bg-gray-100">
                  <td className="border p-3">{log.day}</td>
                  <td className={`border p-3 font-semibold ${log.activity_type === 'Driving' ? 'text-blue-600' : 'text-green-600'}`}>
                    {log.activity_type}
                  </td>
                  <td className="border p-3">{log.location || 'Unknown'}</td>
                  <td className="border p-3">{new Date(log.start_time).toLocaleString()}</td>
                  <td className="border p-3">{new Date(log.end_time).toLocaleString()}</td>
                  <td className="border p-3">{log.hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-gray-700">No logs available.</div>
        )}
      </div>

      {/* Map Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-center mb-2">Route Visualization</h2>
        <MapContainer
          center={routeCoordinates.length > 0 ? routeCoordinates[0] : [0, 0]}
          zoom={6}
          className="h-[600px] w-full rounded-lg shadow"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          <MapBounds />

          {/* Draw route path */}
          {routeCoordinates.length > 1 && (
            <Polyline positions={routeCoordinates} color="blue" weight={5} opacity={0.7} />
          )}

          {/* Start Location Marker */}
          {startLocation && (
            <Marker position={startLocation}>
              <Popup>Start: {logs[0]?.location || 'Unknown'}</Popup>
            </Marker>
          )}

          {/* Pickup Location Marker */}
          {pickupLocation && (
            <Marker position={pickupLocation} icon={L.icon({ iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' })}>
              <Popup>Pickup: {logs[1]?.location || 'Unknown'}</Popup>
            </Marker>
          )}

          {/* Dropoff Location Marker */}
          {dropoffLocation && (
            <Marker position={dropoffLocation} icon={L.icon({ iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' })}>
              <Popup>Dropoff: {logs[logs.length - 1]?.location || 'Unknown'}</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default LogsList;
