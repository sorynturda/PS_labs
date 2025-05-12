// src/components/AppointmentCalendar.jsx
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import StatusBadge from './StatusBadge';

const AppointmentCalendar = ({ appointments, onViewDetails }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDates, setCalendarDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dailyAppointments, setDailyAppointments] = useState([]);

  // Generate calendar dates for the current month
  useEffect(() => {
    const generateCalendarDates = () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      // First day of the month
      const firstDayOfMonth = new Date(year, month, 1);
      // Last day of the month
      const lastDayOfMonth = new Date(year, month + 1, 0);
      
      // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
      const firstDayOfWeek = firstDayOfMonth.getDay();
      
      // Generate an array of date objects for the calendar
      const dates = [];
      
      // Add empty slots for days before the first day of the month
      for (let i = 0; i < firstDayOfWeek; i++) {
        dates.push(null);
      }
      
      // Add days of the month
      for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
        dates.push(new Date(year, month, day));
      }
      
      setCalendarDates(dates);
      
      // Select today if it's in the current month, otherwise select the 1st
      const today = new Date();
      if (today.getMonth() === month && today.getFullYear() === year) {
        setSelectedDate(new Date(year, month, today.getDate()));
      } else {
        setSelectedDate(new Date(year, month, 1));
      }
    };
    
    generateCalendarDates();
  }, [currentDate]);

  // Filter appointments for the selected date
  useEffect(() => {
    if (!selectedDate || !appointments) {
      setDailyAppointments([]);
      return;
    }
    
    const filteredAppointments = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentTime);
      return (
        appointmentDate.getFullYear() === selectedDate.getFullYear() &&
        appointmentDate.getMonth() === selectedDate.getMonth() &&
        appointmentDate.getDate() === selectedDate.getDate()
      );
    });
    
    // Sort by time
    filteredAppointments.sort((a, b) => {
      return new Date(a.appointmentTime) - new Date(b.appointmentTime);
    });
    
    setDailyAppointments(filteredAppointments);
  }, [selectedDate, appointments]);

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Format time from datetime string in 24-hour format
  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Check if a date has appointments
  const hasAppointments = (date) => {
    if (!date || !appointments) return false;
    
    return appointments.some(appointment => {
      const appointmentDate = new Date(appointment.appointmentTime);
      return (
        appointmentDate.getFullYear() === date.getFullYear() &&
        appointmentDate.getMonth() === date.getMonth() &&
        appointmentDate.getDate() === date.getDate()
      );
    });
  };

  // Get appointment count for a date
  const getAppointmentCount = (date) => {
    if (!date || !appointments) return 0;
    
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentTime);
      return (
        appointmentDate.getFullYear() === date.getFullYear() &&
        appointmentDate.getMonth() === date.getMonth() &&
        appointmentDate.getDate() === date.getDate()
      );
    }).length;
  };

  // Days of the week header
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card>
      <Card.Body>
        <Row className="align-items-center mb-3">
          <Col>
            <h5 className="mb-0">Appointment Calendar</h5>
          </Col>
          <Col xs="auto">
            <div className="d-flex align-items-center">
              <Button variant="outline-secondary" size="sm" onClick={goToPreviousMonth}>
                <i className="bi bi-chevron-left"></i>
              </Button>
              <h6 className="mb-0 mx-3">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h6>
              <Button variant="outline-secondary" size="sm" onClick={goToNextMonth}>
                <i className="bi bi-chevron-right"></i>
              </Button>
            </div>
          </Col>
        </Row>
        
        {/* Calendar Grid */}
        <Row className="mb-3">
          {/* Days of week header */}
          {daysOfWeek.map((day, index) => (
            <Col key={index} className="p-1 text-center">
              <div className="py-2 font-weight-bold">{day}</div>
            </Col>
          ))}
          
          {/* Calendar dates */}
          {calendarDates.map((date, index) => (
            <Col key={index} className="p-1">
              {date ? (
                <div
                  className={`border rounded p-2 text-center cursor-pointer ${
                    selectedDate && date.getDate() === selectedDate.getDate() && 
                    date.getMonth() === selectedDate.getMonth() ? 'bg-primary text-white' : ''
                  } ${hasAppointments(date) ? 'border-primary' : ''}`}
                  style={{ cursor: 'pointer', minHeight: '60px' }}
                  onClick={() => setSelectedDate(date)}
                >
                  <div>{date.getDate()}</div>
                  {hasAppointments(date) && (
                    <div className="mt-1">
                      <small className="badge bg-light text-dark">
                        {getAppointmentCount(date)} appt{getAppointmentCount(date) !== 1 ? 's' : ''}
                      </small>
                    </div>
                  )}
                </div>
              ) : (
                <div className="border rounded p-2 text-center bg-light" style={{ minHeight: '60px' }}></div>
              )}
            </Col>
          ))}
        </Row>
        
        {/* Daily Appointments */}
        {selectedDate && (
          <div>
            <h6 className="border-bottom pb-2">
              Appointments for {selectedDate.toLocaleDateString()}
            </h6>
            
            {dailyAppointments.length > 0 ? (
              <div className="mt-3">
                {dailyAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border-left border-3 border-primary rounded p-3 mb-2 shadow-sm"
                    style={{ borderLeft: '3px solid #007bff', cursor: 'pointer' }}
                    onClick={() => onViewDetails(appointment.id)}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{formatTime(appointment.appointmentTime)}</strong> - {appointment.patientName}
                      </div>
                      <StatusBadge status={appointment.status} />
                    </div>
                    <div className="text-muted small mt-1">
                      {appointment.doctor.name} | {appointment.service.name}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted">
                No appointments scheduled for this day
              </div>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default AppointmentCalendar;