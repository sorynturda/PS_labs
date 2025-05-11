// src/pages/admin/Reports.jsx
import React, { useState } from 'react';
import { Container, Card, Row, Col, Form, Button, Tab, Tabs, Table, Alert } from 'react-bootstrap';
import AdminService from '../../services/admin.service';

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

  const exportToCsv = () => {
    if (!reportData || reportData.length === 0) return;
    
    // Determine CSV headers based on report type
    let headers = [];
    switch (reportType) {
      case 'appointments':
        headers = ['ID', 'Patient Name', 'Doctor', 'Service', 'Date', 'Status'];
        break;
      case 'doctors':
        headers = ['Doctor ID', 'Doctor Name', 'Specialization', 'Appointments Count', 'Total Hours'];
        break;
      case 'services':
        headers = ['Service ID', 'Service Name', 'Usage Count', 'Total Revenue'];
        break;
      default:
        headers = Object.keys(reportData[0]);
    }
    
    // Map the data to CSV rows
    const csvRows = [
      headers.join(','),
      ...reportData.map(row => {
        const values = headers.map(header => {
          const value = row[header.toLowerCase().replace(/\s+/g, '')] || '';
          // Ensure string values with commas are quoted
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        });
        return values.join(',');
      })
    ];
    
    // Create and download the CSV file
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${reportType}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderReportTable = () => {
    if (!reportData) return null;
    
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
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reportData.length > 0 ? (
                reportData.map((appointment, index) => (
                  <tr key={index}>
                    <td>{appointment.id}</td>
                    <td>{appointment.patientName}</td>
                    <td>{appointment.doctor}</td>
                    <td>{appointment.service}</td>
                    <td>{appointment.date}</td>
                    <td>{appointment.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">No appointments found</td>
                </tr>
              )}
            </tbody>
          </Table>
        );
        
      case 'doctors':
        return (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Doctor ID</th>
                <th>Doctor Name</th>
                <th>Specialization</th>
                <th>Appointments Count</th>
                <th>Total Hours</th>
              </tr>
            </thead>
            <tbody>
              {reportData.length > 0 ? (
                reportData.map((doctor, index) => (
                  <tr key={index}>
                    <td>{doctor.id}</td>
                    <td>{doctor.name}</td>
                    <td>{doctor.specialization}</td>
                    <td>{doctor.appointmentsCount}</td>
                    <td>{doctor.totalHours}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No doctor data found</td>
                </tr>
              )}
            </tbody>
          </Table>
        );
        
      case 'services':
        return (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Service ID</th>
                <th>Service Name</th>
                <th>Usage Count</th>
                <th>Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {reportData.length > 0 ? (
                reportData.map((service, index) => (
                  <tr key={index}>
                    <td>{service.id}</td>
                    <td>{service.name}</td>
                    <td>{service.usageCount}</td>
                    <td>${service.totalRevenue}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">No service data found</td>
                </tr>
              )}
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
      
      <Card className="mb-4">
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
              
              {reportData && (
                <Button 
                  variant="success" 
                  onClick={exportToCsv}
                >
                  Export CSV
                </Button>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {reportData && (
        <Card>
          <Card.Body>
            <Card.Title>{reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</Card.Title>
            <Card.Subtitle className="mb-3 text-muted">
              {dateRange.startDate} to {dateRange.endDate}
            </Card.Subtitle>
            
            {renderReportTable()}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Reports;