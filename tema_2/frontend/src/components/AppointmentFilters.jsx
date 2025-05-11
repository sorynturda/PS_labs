// src/components/AppointmentFilters.jsx
import React, { useState } from 'react';
import { Form, Row, Col, Button, Card } from 'react-bootstrap';

const AppointmentFilters = ({ doctors, services, onFilterChange }) => {
  const [filters, setFilters] = useState({
    patientName: '',
    doctorId: '',
    serviceId: '',
    status: '',
    startDate: '',
    endDate: ''
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFilters(prevFilters => {
      const updatedFilters = {
        ...prevFilters,
        [name]: value
      };
      
      return updatedFilters;
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };
  
  const clearFilters = () => {
    setFilters({
      patientName: '',
      doctorId: '',
      serviceId: '',
      status: '',
      startDate: '',
      endDate: ''
    });
    
    onFilterChange({});
  };
  
  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>Search & Filter</Card.Title>
        
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6} lg={3}>
              <Form.Group className="mb-3">
                <Form.Label>Patient Name</Form.Label>
                <Form.Control
                  type="text"
                  name="patientName"
                  value={filters.patientName}
                  onChange={handleInputChange}
                  placeholder="Search by name"
                />
              </Form.Group>
            </Col>
            
            <Col md={6} lg={3}>
              <Form.Group className="mb-3">
                <Form.Label>Doctor</Form.Label>
                <Form.Select
                  name="doctorId"
                  value={filters.doctorId}
                  onChange={handleInputChange}
                >
                  <option value="">All Doctors</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={6} lg={3}>
              <Form.Group className="mb-3">
                <Form.Label>Service</Form.Label>
                <Form.Select
                  name="serviceId"
                  value={filters.serviceId}
                  onChange={handleInputChange}
                >
                  <option value="">All Services</option>
                  {services.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={6} lg={3}>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={filters.status}
                  onChange={handleInputChange}
                >
                  <option value="">All Statuses</option>
                  <option value="NEW">New</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          
          <Row>
            <Col md={6} lg={3}>
              <Form.Group className="mb-3">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            
            <Col md={6} lg={3}>
              <Form.Group className="mb-3">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            
            <Col md={12} lg={6} className="d-flex align-items-end mb-3">
              <div className="d-flex gap-2">
                <Button variant="primary" type="submit">
                  Apply Filters
                </Button>
                <Button variant="outline-secondary" type="button" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AppointmentFilters;