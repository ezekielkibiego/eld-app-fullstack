import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TripLogs from './pages/TripLogs';
import ExportLogs from './pages/ExportLogs';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/logs/:tripId" element={<TripLogs />} />
        <Route path="/export/:tripId" element={<ExportLogs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
