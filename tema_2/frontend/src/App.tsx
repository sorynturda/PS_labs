import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import DashboardPage from './pages/admin/DashboardPage';
import ReceptionistsPage from './pages/admin/ReceptionistsPage';
import DoctorsPage from './pages/admin/DoctorsPage';
import ServicesPage from './pages/admin/ServicesPage';
import ReportsPage from './pages/admin/ReportsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import ViewDoctorsPage from './pages/ViewDoctorsPage';
import ViewServicesPage from './pages/ViewServicesPage';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={isAuthenticated && user?.role === 'ADMIN' ? <Layout /> : <Navigate to="/login" />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="receptionists" element={<ReceptionistsPage />} />
            <Route path="doctors" element={<DoctorsPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Receptionist Routes */}
          <Route path="/receptionist" element={isAuthenticated && user?.role === 'RECEPTIONIST' ? <Layout /> : <Navigate to="/login" />}>
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="doctors" element={<ViewDoctorsPage />} />
            <Route path="services" element={<ViewServicesPage />} />
            <Route index element={<Navigate to="appointments" replace />} />
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/receptionist/appointments'} replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
