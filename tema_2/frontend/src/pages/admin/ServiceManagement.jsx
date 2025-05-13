// src/pages/admin/ServiceManagement.jsx
import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import AdminService from '../../services/admin.service';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentServiceId, setCurrentServiceId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await AdminService.getAllServices();
      setServices(data);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Convert ISO-8601 duration format to minutes
  const parseDuration = (duration) => {
    if (!duration) return '';
    
    // For PT1H30M format
    if (typeof duration === 'string' && duration.startsWith('PT')) {
      let minutes = 0;
      
      // Extract hours
      const hoursMatch = duration.match(/(\d+)H/);
      if (hoursMatch) {
        minutes += parseInt(hoursMatch[1]) * 60;
      }
      
      // Extract minutes
      const minutesMatch = duration.match(/(\d+)M/);
      if (minutesMatch) {
        minutes += parseInt(minutesMatch[1]);
      }
      
      return minutes.toString();
    }
    
    // For object format
    if (typeof duration === 'object' && duration.seconds !== undefined) {
      return Math.floor(duration.seconds / 60).toString();
    }
    
    // For numeric format
    if (!isNaN(Number(duration))) {
      return Math.floor(Number(duration) / 60).toString();
    }
    
    return '';
  };
  
  // Convert minutes to ISO-8601 duration format
  const formatToISODuration = (minutes) => {
    if (!minutes) return '';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    let duration = 'PT';
    if (hours > 0) {
      duration += `${hours}H`;
    }
    if (mins > 0) {
      duration += `${mins}M`;
    }
    
    return duration;
  };

  const handleClose = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentServiceId(null);
    setFormData({
      name: '',
      price: '',
      duration: ''
    });
    setError('');
  };

  const handleShow = (service = null) => {
    if (service) {
      console.log("Service data:", service);
      
      // Convert duration to minutes
      const durationMinutes = parseDuration(service.duration);
      
      setFormData({
        name: service.name || '',
        price: service.price || '',
        duration: durationMinutes
      });
      setEditMode(true);
      setCurrentServiceId(service.id);
    } else {
      setEditMode(false);
      setFormData({
        name: '',
        price: '',
        duration: ''
      });
    }
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.duration) {
      setError('All fields are required');
      return;
    }
    
    try {
      // Convert minutes to ISO-8601 duration format
      const isoDuration = formatToISODuration(parseInt(formData.duration));
      
      // Create service data for API
      const serviceData = {
        name: formData.name,
        price: parseFloat(formData.price),
        duration: isoDuration
      };
      
      if (editMode) {
        await AdminService.updateService(currentServiceId, serviceData);
        setSuccess('Service updated successfully');
      } else {
        await AdminService.createService(serviceData);
        setSuccess('Service added successfully');
      }
      
      handleClose();
      fetchServices();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Error saving service:', err);
      setError(err.response?.data?.message || 'Failed to save service');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await AdminService.deleteService(id);
        setSuccess('Service deleted successfully');
        fetchServices();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } catch (err) {
        console.error('Error deleting service:', err);
        setError(err.response?.data?.message || 'Failed to delete service');
      }
    }
  };

  // Format duration for display
  const formatDuration = (duration) => {
    if (!duration) return 'Not set';
    
    // Convert to minutes
    const minutes = parseDuration(duration);
    if (!minutes) return 'Not set';
    
    // Format for display
    const hours = Math.floor(parseInt(minutes) / 60);
    const mins = parseInt(minutes) % 60;
    
    if (hours > 0 && mins > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ${mins} minute${mins > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return `${mins} minute${mins > 1 ? 's' : ''}`;
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Service Management</h1>
        <Button variant="primary" onClick={() => handleShow()}>
          Add New Service
        </Button>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      {loading ? (
        <div className="text-center">Loading services...</div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.length > 0 ? (
              services.map(service => (
                <tr key={service.id}>
                  <td>{service.id}</td>
                  <td>{service.name}</td>
                  <td>{service.price} LEI</td>
                  <td>{formatDuration(service.duration)}</td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="me-2"
                      onClick={() => handleShow(service)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDelete(service.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No services found</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
      
      {/* Add/Edit Service Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Service' : 'Add New Service'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Service Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Price (LEI)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Duration (minutes)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
              />
              <Form.Text className="text-muted">
                Enter the duration in minutes (e.g., 90 for 1 hour and 30 minutes)
              </Form.Text>
            </Form.Group>
            
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editMode ? 'Save Changes' : 'Add Service'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ServiceManagement;