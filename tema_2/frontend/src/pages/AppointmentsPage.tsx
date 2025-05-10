import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { api } from '../services/api';

interface Doctor {
  id: number;
  name: string;
  specialization: string;
}

interface Service {
  id: number;
  name: string;
  duration: number;
  price: number;
}

interface Appointment {
  id: number;
  patientName: string;
  doctor: Doctor;
  service: Service;
  dateTime: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [open, setOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState({
    patientName: '',
    doctorId: '',
    serviceId: '',
    dateTime: new Date(),
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [appointmentsRes, doctorsRes, servicesRes] = await Promise.all([
        api.get('/api/appointments'),
        api.get('/api/doctors'),
        api.get('/api/services'),
      ]);
      setAppointments(appointmentsRes.data);
      setDoctors(doctorsRes.data);
      setServices(servicesRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleOpen = (appointment?: Appointment) => {
    if (appointment) {
      setEditingAppointment(appointment);
      setFormData({
        patientName: appointment.patientName,
        doctorId: appointment.doctor.id.toString(),
        serviceId: appointment.service.id.toString(),
        dateTime: new Date(appointment.dateTime),
      });
    } else {
      setEditingAppointment(null);
      setFormData({
        patientName: '',
        doctorId: '',
        serviceId: '',
        dateTime: new Date(),
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingAppointment(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const appointmentData = {
        ...formData,
        doctorId: parseInt(formData.doctorId),
        serviceId: parseInt(formData.serviceId),
      };

      if (editingAppointment) {
        await api.put(`/api/appointments/${editingAppointment.id}`, appointmentData);
      } else {
        await api.post('/api/appointments', appointmentData);
      }
      handleClose();
      loadData();
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await api.delete(`/api/appointments/${id}`);
        loadData();
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };

  const handleStatusChange = async (id: number, newStatus: Appointment['status']) => {
    try {
      await api.patch(`/api/appointments/${id}/status`, { status: newStatus });
      loadData();
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Appointments Management</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          New Appointment
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient Name</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{appointment.patientName}</TableCell>
                <TableCell>{appointment.doctor.name}</TableCell>
                <TableCell>{appointment.service.name}</TableCell>
                <TableCell>
                  {new Date(appointment.dateTime).toLocaleString()}
                </TableCell>
                <TableCell>
                  <FormControl size="small">
                    <Select
                      value={appointment.status}
                      onChange={(e) => handleStatusChange(appointment.id, e.target.value as Appointment['status'])}
                    >
                      <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                      <MenuItem value="COMPLETED">Completed</MenuItem>
                      <MenuItem value="CANCELLED">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(appointment)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(appointment.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingAppointment ? 'Edit Appointment' : 'New Appointment'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Patient Name"
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Doctor</InputLabel>
              <Select
                value={formData.doctorId}
                label="Doctor"
                onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
              >
                {doctors.map((doctor) => (
                  <MenuItem key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialization}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Service</InputLabel>
              <Select
                value={formData.serviceId}
                label="Service"
                onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
              >
                {services.map((service) => (
                  <MenuItem key={service.id} value={service.id}>
                    {service.name} (${service.price.toFixed(2)})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Date & Time"
                value={formData.dateTime}
                onChange={(newValue) => setFormData({ ...formData, dateTime: newValue || new Date() })}
                sx={{ width: '100%', mt: 2 }}
              />
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingAppointment ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
} 