// src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AdminService from '../../services/admin.service';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    receptionistsCount: 0,
    doctorsCount: 0,
    servicesCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [receptionists, doctors, services] = await Promise.all([
          AdminService.getAllReceptionists(),
          AdminService.getAllDoctors(),
          AdminService.getAllServices()
        ]);

        setStats({
          receptionistsCount: receptionists.length,
          doctorsCount: doctors.length,
          servicesCount: services.length
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">Admin Dashboard</h1>
      
      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <Card className="h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>User Management</Card.Title>
              <Card.Text>
                Manage receptionist accounts in the system.
              </Card.Text>
              <div className="mt-auto">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Total Receptionists:</span>
                  <span className="badge bg-primary">{stats.receptionistsCount}</span>
                </div>
                <Link to="/admin/users" className="btn btn-primary mt-3 w-100">
                  Manage Users
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-3">
          <Card className="h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Doctor Management</Card.Title>
              <Card.Text>
                Add, edit, or remove doctors from the system.
              </Card.Text>
              <div className="mt-auto">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Total Doctors:</span>
                  <span className="badge bg-primary">{stats.doctorsCount}</span>
                </div>
                <Link to="/admin/doctors" className="btn btn-primary mt-3 w-100">
                  Manage Doctors
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-3">
          <Card className="h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Service Management</Card.Title>
              <Card.Text>
                Add, edit, or remove medical services.
              </Card.Text>
              <div className="mt-auto">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Total Services:</span>
                  <span className="badge bg-primary">{stats.servicesCount}</span>
                </div>
                <Link to="/admin/services" className="btn btn-primary mt-3 w-100">
                  Manage Services
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={12}>
          <Card>
            <Card.Body>
              <Card.Title>Reports</Card.Title>
              <Card.Text>
                View and export system reports for appointments, doctors, and services.
              </Card.Text>
              <Link to="/admin/reports" className="btn btn-primary">
                View Reports
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;