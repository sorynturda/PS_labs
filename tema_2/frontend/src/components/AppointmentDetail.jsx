// src/components/AppointmentDetail.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Badge } from 'react-bootstrap';
import ReceptionistService from '../services/receptionist.service';
import { formatDateTime } from '../utils/dateUtils';
import StatusBadge from './StatusBadge';

const AppointmentDetail = ({ show, onHide, appointmentId, onStatusUpdate }) => {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!appointmentId) return;
      
      try {
        setLoading(true);
        const data = await ReceptionistService.getAppointment(appointmentId);
        setAppointment(data);
      } catch (err) {
        console.error('Error fetching appointment details:', err);
        setError('Failed to load appointment details');
      } finally {
        setLoading(false);
      }
    };

    if (show && appointmentId) {
      fetchAppointment();
    }
  }, [show, appointmentId]);

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

  const handleStatusUpdate = async (newStatus) => {
    try {
      await ReceptionistService.updateAppointmentStatus(appointmentId, newStatus);
      
      // Update local state
      setAppointment(prev => ({
        ...prev,
        status: newStatus
      }));
      
      // Notify parent component
      if (onStatusUpdate) {
        onStatusUpdate(appointmentId, newStatus);
      }
    } catch (err) {
      console.error('Error updating appointment status:', err);
      setError('Failed to update appointment status');
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Appointment Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center py-4">Loading appointment details...</div>
        ) : error ? (
          <div className="text-danger">{error}</div>
        ) : appointment ? (
          <>
            <Row className="mb-3">
              <Col md={6}>
                <h5>Patient Information</h5>
                <p className="mb-1"><strong>Name:</strong> {appointment.patientName}</p>
                <p><strong>Appointment ID:</strong> {appointment.id}</p>
              </Col>
              <Col md={6}>
                <h5>Appointment Status</h5>
                <div className="d-flex align-items-center mb-2">
                  <span className="me-2">Current Status:</span>
                  <StatusBadge status={appointment.status} />
                </div>
                
                {appointment.status === 'NEW' && (
                  <Button 
                    variant="outline-warning" 
                    size="sm"
                    onClick={() => handleStatusUpdate('IN_PROGRESS')}
                  >
                    Mark as In Progress
                  </Button>
                )}
                
                {appointment.status === 'IN_PROGRESS' && (
                  <Button 
                    variant="outline-success" 
                    size="sm"
                    onClick={() => handleStatusUpdate('COMPLETED')}
                  >
                    Mark as Completed
                  </Button>
                )}
              </Col>
            </Row>
            
            <hr />
            
            <Row className="mb-3">
              <Col md={6}>
                <h5>Doctor Information</h5>
                <p className="mb-1"><strong>Doctor:</strong> {appointment.doctor.name}</p>
                <p><strong>Specialization:</strong> {appointment.doctor.specialization}</p>
              </Col>
              <Col md={6}>
                <h5>Service Information</h5>
                <p className="mb-1"><strong>Service:</strong> {appointment.service.name}</p>
                <p><strong>Price:</strong> {appointment.service.price} LEI</p>
                <p><strong>Duration:</strong> {formatDuration(appointment.service.duration)}</p>
              </Col>
            </Row>
            
            <hr />
            
            <Row>
              <Col>
                <h5>Appointment Schedule</h5>
                <p><strong>Date & Time:</strong> {formatDateTime(appointment.appointmentTime)}</p>
              </Col>
            </Row>
          </>
        ) : (
          <div className="text-center py-4">No appointment found</div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AppointmentDetail;