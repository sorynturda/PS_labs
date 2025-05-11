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
    duration: '',
    active: true
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

  const handleClose = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentServiceId(null);
    setFormData({
      name: '',
      price: '',
      duration: '',
      active: true
    });
    setError('');
  };

  const handleShow = (service = null) => {
    if (service) {
      // Format duration for the form (convert from seconds to minutes)
      const durationInMinutes = service.duration.seconds / 60;
      
      setFormData({
        name: service.name,
        price: service.price,
        duration: durationInMinutes.toString(),
        active: service.active
      });
      setEditMode(true);
      setCurrentServiceId(service.id);
    } else {
      setEditMode(false);
    }
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.duration) {
      setError('All fields are required');
      return;
    }
    
    try {
      // Convert duration from minutes to Duration object
      const serviceData = {
        ...formData,
        // Convert price to BigDecimal
        price: parseFloat(formData.price),
        // Convert minutes to PT format for Duration
        duration: parseInt(formData.duration) * 60
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

  // Helper function to format duration from seconds to minutes
  const formatDuration = (durationObj) => {
    if (!durationObj) return 'N/A';
    return `${durationObj.seconds / 60} minutes`;
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
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.length > 0 ? (
              services.map(service => (
                <tr key={service.id}>
                  <td>{service.id}</td>
                  <td>{service.name}</td>
                  <td>${service.price}</td>
                  <td>{formatDuration(service.duration)}</td>
                  <td>
                    <span className={`badge ${service.active ? 'bg-success' : 'bg-danger'}`}>
                      {service.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
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
                <td colSpan="6" className="text-center">No services found</td>
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
              <Form.Label>Price ($)</Form.Label>
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
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Active"
                name="active"
                checked={formData.active}
                onChange={handleChange}
              />
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