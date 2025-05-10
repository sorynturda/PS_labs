import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Download as DownloadIcon } from '@mui/icons-material';
import { api } from '../../api';

interface ReportData {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalRevenue: number;
  doctorStats: {
    doctorId: number;
    doctorName: string;
    appointmentCount: number;
    revenue: number;
  }[];
  serviceStats: {
    serviceId: number;
    serviceName: string;
    appointmentCount: number;
    revenue: number;
  }[];
}

export default function ReportsPage() {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [reportType, setReportType] = useState('daily');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    if (!startDate || !endDate) return;

    setLoading(true);
    try {
      const response = await api.get('/api/admin/reports', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          type: reportType,
        },
      });
      setReportData(response.data);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = async () => {
    if (!startDate || !endDate) return;

    try {
      const response = await api.get('/api/admin/reports/export', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          type: reportType,
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          {/* @ts-ignore */}
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Grid>
          {/* @ts-ignore */}
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Grid>
          {/* @ts-ignore */}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                label="Report Type"
                onChange={(e) => setReportType(e.target.value)}
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {/* @ts-ignore */}
          <Grid item xs={12} md={3}>
            <Button
              variant="contained"
              onClick={generateReport}
              disabled={loading}
              fullWidth
              sx={{ height: '56px' }}
            >
              Generate Report
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {reportData && (
        <>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={exportToCSV}
            >
              Export to CSV
            </Button>
          </Box>

          <Grid container spacing={3}>
            {/* @ts-ignore */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Appointment Overview
                </Typography>
                <Grid container spacing={2}>
                  {/* @ts-ignore */}
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Total</Typography>
                    <Typography variant="h4">{reportData.totalAppointments}</Typography>
                  </Grid>
                  {/* @ts-ignore */}
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Completed</Typography>
                    <Typography variant="h4">{reportData.completedAppointments}</Typography>
                  </Grid>
                  {/* @ts-ignore */}
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Cancelled</Typography>
                    <Typography variant="h4">{reportData.cancelledAppointments}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* @ts-ignore */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Revenue Overview
                </Typography>
                <Typography variant="h4">${reportData.totalRevenue.toFixed(2)}</Typography>
              </Paper>
            </Grid>

            {/* @ts-ignore */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Doctor Performance
                </Typography>
                <Grid container spacing={2}>
                  {reportData.doctorStats.map((stat) => (
                    /* @ts-ignore */
                    <Grid item xs={12} md={4} key={stat.doctorId}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1">{stat.doctorName}</Typography>
                        <Typography variant="body2">
                          Appointments: {stat.appointmentCount}
                        </Typography>
                        <Typography variant="body2">
                          Revenue: ${stat.revenue.toFixed(2)}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>

            {/* @ts-ignore */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Service Performance
                </Typography>
                <Grid container spacing={2}>
                  {reportData.serviceStats.map((stat) => (
                    /* @ts-ignore */
                    <Grid item xs={12} md={4} key={stat.serviceId}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1">{stat.serviceName}</Typography>
                        <Typography variant="body2">
                          Appointments: {stat.appointmentCount}
                        </Typography>
                        <Typography variant="body2">
                          Revenue: ${stat.revenue.toFixed(2)}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
} 