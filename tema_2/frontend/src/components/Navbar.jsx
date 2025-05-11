// src/components/Navbar.jsx
import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Render admin navigation items
  const renderAdminNav = () => (
    <>
      <Nav.Link as={Link} to="/admin/dashboard">Dashboard</Nav.Link>
      <Nav.Link as={Link} to="/admin/users">Users</Nav.Link>
      <Nav.Link as={Link} to="/admin/doctors">Doctors</Nav.Link>
      <Nav.Link as={Link} to="/admin/services">Services</Nav.Link>
      <Nav.Link as={Link} to="/admin/reports">Reports</Nav.Link>
    </>
  );

  // Render receptionist navigation items
  const renderReceptionistNav = () => (
    <>
      <Nav.Link as={Link} to="/receptionist/dashboard">Dashboard</Nav.Link>
      <Nav.Link as={Link} to="/receptionist/appointments">Appointments</Nav.Link>
    </>
  );

  return (
    <BootstrapNavbar bg="primary" variant="dark" expand="lg" className="mb-3">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          MedCare Clinic
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          {user && (
            <Nav className="me-auto">
              {user.role === 'ADMIN' ? renderAdminNav() : renderReceptionistNav()}
            </Nav>
          )}
          
          <Nav>
            {user ? (
              <NavDropdown title={user.fullName || user.username} id="user-dropdown">
                <NavDropdown.Item disabled>
                  Role: {user.role === 'ADMIN' ? 'Administrator' : 'Receptionist'}
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;