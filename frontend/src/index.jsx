import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  const token = localStorage.getItem('token');
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={token ? <Dashboard /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
