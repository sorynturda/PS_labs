// src/pages/receptionist/Appointments.jsx
import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert, Badge, Row, Col, Card, Tab, Tabs } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import ReceptionistService from '../../services/receptionist.service';

const Appointments = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const statusFilter = queryParams.get('status');

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState(statusFilter || 'all');
  const [formData, setFormData] = useState({
    patientName: '',
    doctorId: '',
    serviceId: '',
    appointmentTime: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch all data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [appointmentsData, doctorsData, servicesData] = await Promise.all([
          ReceptionistService.getAllAppointments(),
          ReceptionistService.getAllDoctors(),
          ReceptionistService.getAllServices()
        ]);
        
        setAppointments(appointmentsData);
        setDoctors(doctorsData);
        setServices(servicesData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Update URL when tab changes
  useEffect(() => {
    if (activeTab === 'all') {
      navigate('/receptionist/appointments');
    } else {
      navigate(`/receptionist/appointments?status=${activeTab}`);
    }
  }, [activeTab, navigate]);

  const handleClose = () => {
    setShowModal(false);
    setFormData({
      patientName: '',
      doctorId: '',
      serviceId: '',
      appointmentTime: ''
    });
    setError('');
  };

  const handleShow = () => setShowModal(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.patientName || !formData.doctorId || !formData.serviceId || !formData.appointmentTime) {
      setError('All fields are required');
      return;
    }
    
    try {
      await ReceptionistService.createAppointment(formData);
      handleClose();
      setSuccess('Appointment created successfully');
      
      // Refresh appointments
      const updatedAppointments = await ReceptionistService.getAllAppointments();
      setAppointments(updatedAppointments);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Error creating appointment:', err);
      setError(err.response?.data?.message || 'Failed to create appointment');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await ReceptionistService.updateAppointmentStatus(id, status);
      setSuccess(`Appointment status updated to ${status}`);
      
      // Refresh appointments
      const updatedAppointments = await ReceptionistService.getAllAppointments();
      setAppointments(updatedAppointments);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Error updating appointment status:', err);
      setError(err.response?.data?.message || 'Failed to update appointment status');
    }
  };

  // Filter appointments based on selected tab
  const filteredAppointments = activeTab === 'all' 
    ? appointments 
    : appointments.filter(app => app.status === activeTab);

  // Function to format date and time
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  };

  // Helper function to render status badge
  const getStatusBadge = (status) => {
    switch(status) {
      case 'NEW':
        return <Badge bg="info">New</Badge>;
      case 'IN_PROGRESS':
        return <Badge bg="warning">In Progress</Badge>;
      case 'COMPLETED':
        return <Badge bg="success">Completed</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  // Helper function to get available next statuses
  const getNextStatuses = (currentStatus) => {
    switch(currentStatus) {
      case 'NEW':
        return [{ value: 'IN_PROGRESS', label: 'Mark In Progress' }];
      case 'IN_PROGRESS':
        return [{ value: 'COMPLETED', label: 'Mark Completed' }];
      default:
        return [];
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Appointments</h1>
        <Button variant="primary" onClick={handleShow}>
          New Appointment
        </Button>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Card className="mb-4">
        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            <Tab eventKey="all" title="All Appointments" />
            <Tab eventKey="NEW" title="New" />
            <Tab eventKey="IN_PROGRESS" title="In Progress" />
            <Tab eventKey="COMPLETED" title="Completed" />
          </Tabs>
          
          {loading ? (
            <div className="text-center py-4">Loading appointments...</div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Service</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map(appointment => (
                    <tr key={appointment.id}>
                      <td>{appointment.id}</td>
                      <td>{appointment.patientName}</td>
                      <td>{appointment.doctor.name}</td>
                      <td>{appointment.service.name}</td>
                      <td>{formatDateTime(appointment.appointmentTime)}</td>
                      <td>{getStatusBadge(appointment.status)}</td>
                      <td>
                        {getNextStatuses(appointment.status).map(status => (
                          <Button
                            key={status.value}
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleUpdateStatus(appointment.id, status.value)}
                          >
                            {status.label}
                          </Button>
                        ))}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">No appointments found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
      
      {/* New Appointment Modal */}
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>New Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Patient Name</Form.Label>
              <Form.Control
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Select Doctor</Form.Label>
                  <Form.Select
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Doctor --</option>
                    {doctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialization}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Select Service</Form.Label>
                  <Form.Select
                    name="serviceId"
                    value={formData.serviceId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Service --</option>
                    {services.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name} - ${service.price}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Appointment Date & Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Create Appointment
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Appointments;