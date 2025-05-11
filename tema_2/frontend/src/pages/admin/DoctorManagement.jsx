// src/pages/admin/DoctorManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Container, Table, Button, Modal, Form, Alert, Card, Badge, Row, Col, InputGroup } from 'react-bootstrap';
import { FormField, StatusBadge, LoadingSpinner, AlertMessage } from '../../components';
import AdminService from '../../services/admin.service';
import { formatTime } from '../../utils/dateUtils';

const DoctorManagement = () => {
  // State management
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentDoctorId, setCurrentDoctorId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    startTime: '',
    endTime: '',
    active: true
  });
  const [formErrors, setFormErrors] = useState({});
  const [alert, setAlert] = useState({ message: '', type: '' });

  // Fetch doctors from API
  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const data = await AdminService.getAllDoctors();
      setDoctors(data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setAlert({ 
        message: 'Failed to load doctors. Please try again.', 
        type: 'danger' 
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Load doctors on component mount
  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Handle modal close
  const handleClose = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentDoctorId(null);
    setFormData({
      name: '',
      specialization: '',
      startTime: '',
      endTime: '',
      active: true
    });
    setFormErrors({});
  };

  // Handle modal open for creating or editing
  const handleShow = (doctor = null) => {
    if (doctor) {
      // Edit mode: populate form with doctor data
      setFormData({
        name: doctor.name,
        specialization: doctor.specialization,
        startTime: doctor.startTime ? doctor.startTime.substring(0, 5) : '',
        endTime: doctor.endTime ? doctor.endTime.substring(0, 5) : '',
        active: doctor.active
      });
      setEditMode(true);
      setCurrentDoctorId(doctor.id);
    } else {
      // Create mode: reset form
      setEditMode(false);
      setFormData({
        name: '',
        specialization: '',
        startTime: '09:00',
        endTime: '17:00',
        active: true
      });
    }
    setShowModal(true);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  // Validate form input
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Doctor name is required';
    }
    
    if (!formData.specialization.trim()) {
      errors.specialization = 'Specialization is required';
    }
    
    if (!formData.startTime) {
      errors.startTime = 'Start time is required';
    }
    
    if (!formData.endTime) {
      errors.endTime = 'End time is required';
    } else if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      errors.endTime = 'End time must be after start time';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (editMode) {
        await AdminService.updateDoctor(currentDoctorId, formData);
        setAlert({
          message: 'Doctor updated successfully',
          type: 'success'
        });
      } else {
        await AdminService.createDoctor(formData);
        setAlert({
          message: 'Doctor added successfully',
          type: 'success'
        });
      }
      
      handleClose();
      fetchDoctors();
      
      // Clear alert after 3 seconds
      setTimeout(() => {
        setAlert({ message: '', type: '' });
      }, 3000);
    } catch (err) {
      console.error('Error saving doctor:', err);
      
      // Handle specific API errors if returned
      if (err.response?.data?.message) {
        setAlert({
          message: err.response.data.message,
          type: 'danger'
        });
      } else {
        setAlert({
          message: 'Failed to save doctor. Please try again.',
          type: 'danger'
        });
      }
    }
  };

  // Handle doctor deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor? This action cannot be undone.')) {
      try {
        await AdminService.deleteDoctor(id);
        setAlert({
          message: 'Doctor deleted successfully',
          type: 'success'
        });
        fetchDoctors();
        
        // Clear alert after 3 seconds
        setTimeout(() => {
          setAlert({ message: '', type: '' });
        }, 3000);
      } catch (err) {
        console.error('Error deleting doctor:', err);
        setAlert({
          message: err.response?.data?.message || 'Failed to delete doctor',
          type: 'danger'
        });
      }
    }
  };

  // Toggle doctor active status
  const toggleActive = async (doctor) => {
    try {
      const updatedDoctor = { ...doctor, active: !doctor.active };
      await AdminService.updateDoctor(doctor.id, updatedDoctor);
      fetchDoctors();
      setAlert({
        message: `Doctor ${doctor.active ? 'deactivated' : 'activated'} successfully`,
        type: 'success'
      });
      
      // Clear alert after 3 seconds
      setTimeout(() => {
        setAlert({ message: '', type: '' });
      }, 3000);
    } catch (err) {
      console.error('Error updating doctor status:', err);
      setAlert({
        message: 'Failed to update doctor status',
        type: 'danger'
      });
    }
  };

  // Filter doctors based on search query
  const filteredDoctors = doctors.filter(doctor => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      doctor.name.toLowerCase().includes(lowerCaseQuery) ||
      doctor.specialization.toLowerCase().includes(lowerCaseQuery)
    );
  });
  
  // Sort doctors by name
  const sortedDoctors = [...filteredDoctors].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Doctor Management</h2>
            <Button variant="primary" onClick={() => handleShow()}>
              <i className="bi bi-plus-circle me-2"></i>
              Add New Doctor
            </Button>
          </div>
          
          {alert.message && (
            <AlertMessage 
              variant={alert.type} 
              message={alert.message} 
              dismissible={true}
            />
          )}
          
          <Row className="mb-4">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search by name or specialization"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button 
                    variant="outline-secondary"
                    onClick={() => setSearchQuery('')}
                  >
                    <i className="bi bi-x"></i>
                  </Button>
                )}
              </InputGroup>
            </Col>
            <Col md={6} className="text-md-end mt-3 mt-md-0">
              <span className="text-muted">
                Total doctors: <Badge bg="primary">{doctors.length}</Badge>
              </span>
            </Col>
          </Row>
          
          {loading ? (
            <LoadingSpinner text="Loading doctors..." />
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead className="bg-light">
                  <tr>
                    <th>Name</th>
                    <th>Specialization</th>
                    <th>Working Hours</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedDoctors.length > 0 ? (
                    sortedDoctors.map(doctor => (
                      <tr key={doctor.id}>
                        <td>{doctor.name}</td>
                        <td>{doctor.specialization}</td>
                        <td>
                          {doctor.startTime && doctor.endTime ? (
                            <span>
                              {formatTime(doctor.startTime)} - {formatTime(doctor.endTime)}
                            </span>
                          ) : (
                            <span className="text-muted">Not set</span>
                          )}
                        </td>
                        <td>
                          <StatusBadge 
                            status={doctor.active ? 'ACTIVE' : 'INACTIVE'} 
                          />
                        </td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleShow(doctor)}
                              title="Edit doctor"
                            >
                              <i className="bi bi-pencil"></i>
                            </Button>
                            <Button 
                              variant={doctor.active ? "outline-warning" : "outline-success"}
                              size="sm"
                              onClick={() => toggleActive(doctor)}
                              title={doctor.active ? "Deactivate doctor" : "Activate doctor"}
                            >
                              <i className={`bi ${doctor.active ? "bi-toggle-on" : "bi-toggle-off"}`}></i>
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleDelete(doctor.id)}
                              title="Delete doctor"
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        {searchQuery ? (
                          <>
                            <i className="bi bi-search me-2"></i>
                            No doctors found matching "{searchQuery}"
                          </>
                        ) : (
                          <>
                            <i className="bi bi-person-x me-2"></i>
                            No doctors found. Add a new doctor to get started.
                          </>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {/* Add/Edit Doctor Modal */}
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editMode ? (
              <><i className="bi bi-pencil me-2"></i>Edit Doctor</>
            ) : (
              <><i className="bi bi-plus-circle me-2"></i>Add New Doctor</>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <FormField
                  label="Doctor Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={formErrors.name}
                  required
                />
              </Col>
              
              <Col md={6}>
                <FormField
                  label="Specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  error={formErrors.specialization}
                  required
                />
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <FormField
                  label="Start Time"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleChange}
                  error={formErrors.startTime}
                  required
                />
              </Col>
              
              <Col md={6}>
                <FormField
                  label="End Time"
                  name="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={handleChange}
                  error={formErrors.endTime}
                  required
                />
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="active-switch"
                label={`Doctor is ${formData.active ? 'active' : 'inactive'}`}
                name="active"
                checked={formData.active}
                onChange={handleChange}
              />
              <Form.Text className="text-muted">
                Inactive doctors won't be available for new appointments
              </Form.Text>
            </Form.Group>
            
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editMode ? 'Save Changes' : 'Add Doctor'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default DoctorManagement;