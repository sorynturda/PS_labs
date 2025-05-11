// src/components/Layout.jsx
import React from 'react';
import { Container } from 'react-bootstrap';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1 bg-light">
        <Container fluid className="py-3">
          {children}
        </Container>
      </main>
      <footer className="bg-dark text-white py-3">
        <Container className="text-center">
          <p className="mb-0">© {new Date().getFullYear()} MedCare Clinic. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
};

export default Layout;