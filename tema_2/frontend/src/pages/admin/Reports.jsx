// src/pages/admin/Reports.jsx
import React, { useState } from 'react';
import { Container, Card, Row, Col, Form, Button, Tab, Tabs, Table, Alert } from 'react-bootstrap';
import AdminService from '../../services/admin.service';
import { formatDateTime } from '../../utils/dateUtils';

const Reports = () => {
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [reportType, setReportType] = useState('appointments');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const fetchReport = async () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      setError('Please select both start and end dates');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      let data;
      
      switch (reportType) {
        case 'appointments':
          data = await AdminService.getAppointmentsReport(dateRange.startDate, dateRange.endDate);
          break;
        case 'doctors':
          data = await AdminService.getDoctorsReport(dateRange.startDate, dateRange.endDate);
          break;
        case 'services':
          data = await AdminService.getServicesReport(dateRange.startDate, dateRange.endDate);
          break;
        default:
          throw new Error('Invalid report type');
      }
      
      setReportData(data);
    } catch (err) {
      console.error('Error fetching report:', err);
      setError('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format date and time for appointment display
  const formatAppointmentDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    return formatDateTime(dateTimeString);
  };

  const exportToCsv = () => {
    if (!reportData || reportData.length === 0) return;
    
    // Determine CSV headers based on report type
    let headers = [];
    switch (reportType) {
      case 'appointments':
        headers = ['ID', 'Patient Name', 'Doctor', 'Service', 'Date', 'Status'];
        break;
      case 'doctors':
        headers = ['Doctor', 'Appointment Count'];
        break;
      case 'services':
        headers = ['Service', 'Appointment Count'];
        break;
      default:
        headers = Object.keys(reportData[0]);
    }
    
    // Extract proper fields from data based on report type
    const csvRows = [
      headers.join(','),
      ...reportData.map(row => {
        let values;
        
        switch (reportType) {
          case 'appointments':
            values = [
              row.id,
              row.patientName,
              row.doctor ? row.doctor.name : '',
              row.service ? row.service.name : '',
              formatDate(row.appointmentTime),
              row.status
            ];
            break;
          case 'doctors':
            values = [
              row.doctor ? row.doctor.name : '',
              row.appointmentCount
            ];
            break;
          case 'services':
            values = [
              row.service ? row.service.name : '',
              row.appointmentCount
            ];
            break;
          default:
            values = headers.map(header => row[header.toLowerCase().replace(/\s+/g, '')] || '');
        }
        
        // Ensure string values with commas are quoted
        return values.map(value => 
          typeof value === 'string' && value.includes(',') ? `"${value}"` : value
        ).join(',');
      })
    ];
    
    // Create and download the CSV file
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${reportType}_report_${dateRange.startDate}_to_${dateRange.endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderReportTable = () => {
    if (!reportData || reportData.length === 0) return <p className="text-center">No data found for the selected date range.</p>;
    
    switch (reportType) {
      case 'appointments':
        return (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient Name</th>
                <th>Doctor</th>
                <th>Service</th>
                <th>Date & Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((appointment, index) => (
                <tr key={index}>
                  <td>{appointment.id}</td>
                  <td>{appointment.patientName}</td>
                  <td>{appointment.doctor ? appointment.doctor.name : ''}</td>
                  <td>{appointment.service ? appointment.service.name : ''}</td>
                  <td>{formatAppointmentDateTime(appointment.appointmentTime)}</td>
                  <td>{appointment.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        );
        
      case 'doctors':
        return (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Appointments Count</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((stat, index) => (
                <tr key={index}>
                  <td>{stat.doctor ? stat.doctor.name : ''}</td>
                  <td>{stat.appointmentCount}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        );
        
      case 'services':
        return (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Service</th>
                <th>Usage Count</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((stat, index) => (
                <tr key={index}>
                  <td>{stat.service ? stat.service.name : ''}</td>
                  <td>{stat.appointmentCount}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        );
        
      default:
        return <p>Select a report type</p>;
    }
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">Reports</h1>
      
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>Generate Report</Card.Title>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Row className="align-items-end">
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateChange}
                  max={dateRange.endDate || undefined}
                />
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateChange}
                  min={dateRange.startDate || undefined}
                />
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Report Type</Form.Label>
                <Form.Select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <option value="appointments">Appointments Report</option>
                  <option value="doctors">Doctors Report</option>
                  <option value="services">Services Report</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={3} className="d-flex">
              <Button 
                variant="primary" 
                onClick={fetchReport}
                disabled={loading}
                className="me-2"
              >
                {loading ? 'Generating...' : 'Generate Report'}
              </Button>
              
              {reportData && reportData.length > 0 && (
                <Button 
                  variant="success" 
                  onClick={exportToCsv}
                >
                  <i className="bi bi-download me-2"></i>
                  Export CSV
                </Button>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {reportData && (
        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title>{reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</Card.Title>
            <Card.Subtitle className="mb-3 text-muted">
              {formatDate(dateRange.startDate)} to {formatDate(dateRange.endDate)}
            </Card.Subtitle>
            
            {renderReportTable()}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Reports;