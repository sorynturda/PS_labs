// src/pages/receptionist/Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Container, Button, Badge, Table, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { LoadingSpinner, AppointmentCalendar, StatusBadge, AppointmentDetail } from '../../components';
import ReceptionistService from '../../services/receptionist.service';
import { formatDateTime } from '../../utils/dateUtils';
import { useAuth } from '../../context/AuthContext';

const ReceptionistDashboard = () => {
  // State hooks
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    newAppointments: 0,
    inProgressAppointments: 0,
    completedAppointments: 0
  });
  const [appointments, setAppointments] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Navigation and auth
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch appointments data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get all appointments
      const appointmentsData = await ReceptionistService.getAllAppointments();
      setAppointments(appointmentsData);
      
      // Get today's date in the format YYYY-MM-DD
      const today = new Date().toISOString().split('T')[0];
      const now = new Date();
      
      // Calculate statistics
      const totalAppointments = appointmentsData.length;
      const todayAppointments = appointmentsData.filter(app => 
        app.appointmentTime.split('T')[0] === today
      ).length;
      const newAppointments = appointmentsData.filter(app => app.status === 'NEW').length;
      const inProgressAppointments = appointmentsData.filter(app => app.status === 'IN_PROGRESS').length;
      const completedAppointments = appointmentsData.filter(app => app.status === 'COMPLETED').length;
      
      setStats({
        totalAppointments,
        todayAppointments,
        newAppointments,
        inProgressAppointments,
        completedAppointments
      });
      
      // Get recent appointments (last 5)
      const sorted = [...appointmentsData].sort((a, b) => 
        new Date(b.appointmentTime) - new Date(a.appointmentTime)
      );
      setRecentAppointments(sorted.slice(0, 5));
      
      // Get upcoming appointments (next 24 hours)
      const nextDay = new Date(now);
      nextDay.setHours(now.getHours() + 24);
      
      const upcoming = appointmentsData.filter(app => {
        const appTime = new Date(app.appointmentTime);
        return appTime >= now && appTime <= nextDay && app.status !== 'COMPLETED';
      }).sort((a, b) => 
        new Date(a.appointmentTime) - new Date(b.appointmentTime)
      );
      
      setUpcomingAppointments(upcoming.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on component mount and when refresh is triggered
  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  // Handle appointment status update
  const handleStatusUpdate = async (id, status) => {
    try {
      await ReceptionistService.updateAppointmentStatus(id, status);
      setRefreshTrigger(prev => prev + 1);
      setShowAppointmentModal(false);
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  // View appointment details
  const viewAppointmentDetails = (id) => {
    setSelectedAppointmentId(id);
    setShowAppointmentModal(true);
  };

  // Create calendar event from appointment
  const createCalendarEvent = (appointment) => {
    const title = `${appointment.patientName} - ${appointment.service.name}`;
    const start = new Date(appointment.appointmentTime);
    const end = new Date(start);
    
    // Calculate end time by adding service duration
    end.setMinutes(end.getMinutes() + (appointment.service.duration.seconds / 60));
    
    // Format dates for calendar URL
    const formatDate = (date) => {
      return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
    };
    
    // Create Google Calendar URL
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatDate(start)}/${formatDate(end)}&details=${encodeURIComponent(`Doctor: ${appointment.doctor.name}\nPatient: ${appointment.patientName}\nService: ${appointment.service.name}`)}&location=MedCare%20Clinic`;
    
    window.open(url, '_blank');
  };

  // Render status counts with icons
  const renderStatusCount = (title, count, icon, color) => (
    <Col md={4} className="mb-3">
      <Card className={`border-0 bg-${color} bg-opacity-10 h-100`}>
        <Card.Body className="d-flex align-items-center">
          <div className={`rounded-circle p-3 bg-${color} bg-opacity-25 me-3`}>
            <i className={`bi ${icon} text-${color} fs-4`}></i>
          </div>
          <div>
            <h6 className="mb-0">{title}</h6>
            <h2 className="mt-2 mb-0">{count}</h2>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );

  return (
    <Container className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1 className="mb-0">Welcome, {user?.fullName || 'Receptionist'}</h1>
          <p className="text-muted mb-0">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </Col>
        <Col xs="auto">
          <Button 
            variant="primary" 
            onClick={() => navigate('/receptionist/appointments')}
          >
            <i className="bi bi-plus-circle me-2"></i>
            New Appointment
          </Button>
        </Col>
      </Row>
      
      {loading ? (
        <LoadingSpinner text="Loading dashboard data..." />
      ) : (
        <>
          <Row className="mb-4">
            <Col lg={8}>
              <Card className="shadow-sm mb-4">
                <Card.Body>
                  <h5 className="card-title mb-4">Appointment Statistics</h5>
                  <Row>
                    <Col md={6} className="mb-3">
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle p-3 bg-primary bg-opacity-10 me-3">
                          <i className="bi bi-calendar-check text-primary fs-4"></i>
                        </div>
                        <div>
                          <h6 className="mb-0">Total Appointments</h6>
                          <h3 className="mt-1 mb-0">{stats.totalAppointments}</h3>
                        </div>
                      </div>
                    </Col>
                    
                    <Col md={6} className="mb-3">
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle p-3 bg-info bg-opacity-10 me-3">
                          <i className="bi bi-calendar-day text-info fs-4"></i>
                        </div>
                        <div>
                          <h6 className="mb-0">Today's Appointments</h6>
                          <h3 className="mt-1 mb-0">{stats.todayAppointments}</h3>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  
                  <h5 className="card-title mt-4 mb-3">Appointment Status</h5>
                  <Row>
                    {renderStatusCount(
                      'New', 
                      stats.newAppointments, 
                      'bi-file-earmark-plus', 
                      'info'
                    )}
                    
                    {renderStatusCount(
                      'In Progress', 
                      stats.inProgressAppointments, 
                      'bi-hourglass-split', 
                      'warning'
                    )}
                    
                    {renderStatusCount(
                      'Completed', 
                      stats.completedAppointments, 
                      'bi-check-circle', 
                      'success'
                    )}
                  </Row>
                </Card.Body>
              </Card>
              
              <Row>
                <Col md={6} className="mb-4">
                  <Card className="shadow-sm h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="card-title mb-0">
                          <i className="bi bi-clock-history me-2 text-primary"></i>
                          Recent Appointments
                        </h5>
                        <Link to="/receptionist/appointments" className="btn btn-sm btn-link">
                          View All
                        </Link>
                      </div>
                      
                      {recentAppointments.length > 0 ? (
                        <div className="list-group">
                          {recentAppointments.map(appointment => (
                            <Button
                              key={appointment.id}
                              variant="light"
                              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center mb-2 text-start"
                              onClick={() => viewAppointmentDetails(appointment.id)}
                            >
                              <div>
                                <div className="fw-bold">{appointment.patientName}</div>
                                <div className="text-muted small">
                                  <i className="bi bi-calendar me-1"></i>
                                  {formatDateTime(appointment.appointmentTime)}
                                </div>
                              </div>
                              <StatusBadge status={appointment.status} />
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted">
                          <i className="bi bi-calendar-x mb-2 fs-2"></i>
                          <p>No recent appointments</p>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={6} className="mb-4">
                  <Card className="shadow-sm h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="card-title mb-0">
                          <i className="bi bi-calendar-check me-2 text-success"></i>
                          Upcoming Appointments
                        </h5>
                        <Badge bg="primary" pill>Next 24hrs</Badge>
                      </div>
                      
                      {upcomingAppointments.length > 0 ? (
                        <div className="list-group">
                          {upcomingAppointments.map(appointment => (
                            <div 
                              key={appointment.id}
                              className="list-group-item d-flex justify-content-between mb-2"
                            >
                              <div>
                                <div className="fw-bold">{appointment.patientName}</div>
                                <div className="text-muted small">
                                  <i className="bi bi-person-badge me-1"></i>
                                  {appointment.doctor.name} | {appointment.service.name}
                                </div>
                                <div className="text-muted small">
                                  <i className="bi bi-clock me-1"></i>
                                  {formatDateTime(appointment.appointmentTime)}
                                </div>
                              </div>
                              <div>
                                <Button 
                                  variant="outline-primary" 
                                  size="sm"
                                  className="me-1"
                                  onClick={() => viewAppointmentDetails(appointment.id)}
                                >
                                  <i className="bi bi-eye"></i>
                                </Button>
                                <Button 
                                  variant="outline-success" 
                                  size="sm"
                                  onClick={() => createCalendarEvent(appointment)}
                                >
                                  <i className="bi bi-calendar-plus"></i>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted">
                          <i className="bi bi-calendar-check mb-2 fs-2"></i>
                          <p>No upcoming appointments in the next 24 hours</p>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
            
            <Col lg={4}>
              <Card className="shadow-sm mb-4">
                <Card.Body>
                  <h5 className="card-title mb-3">
                    <i className="bi bi-lightning-charge me-2 text-warning"></i>
                    Quick Actions
                  </h5>
                  <div className="d-grid gap-3">
                    <Button 
                      variant="primary"
                      onClick={() => navigate('/receptionist/appointments')}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Create New Appointment
                    </Button>
                    
                    <Button 
                      variant="outline-primary"
                      as={Link} 
                      to="/receptionist/appointments"
                    >
                      <i className="bi bi-calendar-week me-2"></i>
                      Manage All Appointments
                    </Button>
                    
                    <Button 
                      variant="outline-info"
                      as={Link} 
                      to="/receptionist/appointments?status=NEW"
                    >
                      <i className="bi bi-clipboard me-2"></i>
                      View New Appointments
                      {stats.newAppointments > 0 && (
                        <Badge bg="info" className="ms-2">{stats.newAppointments}</Badge>
                      )}
                    </Button>
                    
                    <Button 
                      variant="outline-warning"
                      as={Link}
                      to="/receptionist/appointments?status=IN_PROGRESS"
                    >
                      <i className="bi bi-hourglass-split me-2"></i>
                      View In-Progress
                      {stats.inProgressAppointments > 0 && (
                        <Badge bg="warning" className="ms-2">{stats.inProgressAppointments}</Badge>
                      )}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
              
              <Card className="shadow-sm">
                <Card.Body>
                  <h5 className="card-title mb-3">
                    <i className="bi bi-calendar-month me-2 text-primary"></i>
                    Today's Schedule
                  </h5>
                  
                  {stats.todayAppointments > 0 ? (
                    <div className="appointment-timeline">
                      {appointments
                        .filter(app => app.appointmentTime.split('T')[0] === new Date().toISOString().split('T')[0])
                        .sort((a, b) => new Date(a.appointmentTime) - new Date(b.appointmentTime))
                        .map(appointment => (
                          <div 
                            key={appointment.id} 
                            className="position-relative mb-3 ps-4 pt-2 pb-2"
                            style={{ 
                              borderLeft: '2px solid #dee2e6', 
                              cursor: 'pointer' 
                            }}
                            onClick={() => viewAppointmentDetails(appointment.id)}
                          >
                            <div 
                              className="position-absolute bg-white"
                              style={{ 
                                width: '12px', 
                                height: '12px', 
                                borderRadius: '50%', 
                                border: '2px solid #0d6efd',
                                left: '-7px',
                                top: '10px'
                              }}
                            ></div>
                            <div className="text-muted small">
                              {new Date(appointment.appointmentTime).toLocaleTimeString([], {
                                hour: '2-digit', 
                                minute: '2-digit'
                              })}
                            </div>
                            <div className="fw-bold">{appointment.patientName}</div>
                            <div className="small">
                              <span className="text-primary">{appointment.doctor.name}</span> | {appointment.service.name}
                            </div>
                            <div className="mt-1">
                              <StatusBadge status={appointment.status} />
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted">
                      <i className="bi bi-calendar me-2"></i>
                      No appointments scheduled for today
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <Row>
            <Col>
              <Card className="shadow-sm">
                <Card.Body>
                  <h5 className="card-title mb-4">
                    <i className="bi bi-calendar-month me-2 text-primary"></i>
                    Monthly Calendar View
                  </h5>
                  <AppointmentCalendar 
                    appointments={appointments} 
                    onViewDetails={viewAppointmentDetails}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          {/* Appointment Detail Modal */}
          <AppointmentDetail
            show={showAppointmentModal}
            onHide={() => setShowAppointmentModal(false)}
            appointmentId={selectedAppointmentId}
            onStatusUpdate={handleStatusUpdate}
          />
        </>
      )}
    </Container>
  );
};

export default ReceptionistDashboard;