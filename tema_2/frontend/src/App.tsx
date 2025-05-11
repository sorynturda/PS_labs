// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Authentication Pages
import Login from './pages/auth/Login';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import DoctorManagement from './pages/admin/DoctorManagement';
import ServiceManagement from './pages/admin/ServiceManagement';
import Reports from './pages/admin/Reports';

// Receptionist Pages
import ReceptionistDashboard from './pages/receptionist/Dashboard';
import Appointments from './pages/receptionist/Appointments';

// Components
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Bootstrap Icons
import 'bootstrap-icons/font/bootstrap-icons.css';
// Custom CSS
import './App.css';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Redirect root to appropriate dashboard or login */}
          <Route 
            path="/" 
            element={
              <Navigate to="/login" replace />
            } 
          />
          
          {/* Admin Routes */}
          <Route element={<PrivateRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/doctors" element={<DoctorManagement />} />
            <Route path="/admin/services" element={<ServiceManagement />} />
            <Route path="/admin/reports" element={<Reports />} />
          </Route>
          
          {/* Receptionist Routes */}
          <Route element={<PrivateRoute allowedRoles={['RECEPTIONIST']} />}>
            <Route path="/receptionist/dashboard" element={<ReceptionistDashboard />} />
            <Route path="/receptionist/appointments" element={<Appointments />} />
          </Route>
          
          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;