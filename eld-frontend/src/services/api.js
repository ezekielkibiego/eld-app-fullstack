import axios from 'axios';

const API_BASE_URL = 'https://eld-backend-r63v.onrender.com';

export const createTrip = async (tripData) => {
  const response = await axios.post(`${API_BASE_URL}/trips/`, tripData);
  return response.data;
};

export const generateLogs = async (tripId) => {
  const response = await axios.post(`${API_BASE_URL}/trips/${tripId}/logs/`, { trip_id: tripId });
  return response.data;
};

export const exportLogs = async (tripId, format) => {
  const response = await axios.get(`${API_BASE_URL}/trips/${tripId}/${format}/`, { responseType: 'blob' });
  return response.data;
};

export const getTripDetails = async (tripId) => {
  const response = await axios.get(`${API_BASE_URL}/trips/${tripId}/`);
  return response.data;
};
