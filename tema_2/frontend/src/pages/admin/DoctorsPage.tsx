import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { api } from '../../api';

interface Doctor {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  specialization: string;
  phoneNumber: string;
  workingSchedule: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
}

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    specialization: '',
    phoneNumber: '',
    password: '',
    workingSchedule: [] as { dayOfWeek: number; startTime: string; endTime: string }[],
  });

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const response = await api.get('/api/admin/users/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error loading doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (doctor?: Doctor) => {
    if (doctor) {
      setEditingDoctor(doctor);
      setFormData({
        username: doctor.username,
        email: doctor.email,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        specialization: doctor.specialization,
        phoneNumber: doctor.phoneNumber,
        password: '',
        workingSchedule: doctor.workingSchedule,
      });
    } else {
      setEditingDoctor(null);
      setFormData({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        specialization: '',
        phoneNumber: '',
        password: '',
        workingSchedule: [],
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingDoctor(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDoctor) {
        await api.put(`/api/admin/users/doctors/${editingDoctor.id}`, formData);
      } else {
        await api.post('/api/admin/users/doctors', formData);
      }
      handleClose();
      loadDoctors();
    } catch (error) {
      console.error('Error saving doctor:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await api.delete(`/api/admin/users/doctors/${id}`);
        loadDoctors();
      } catch (error) {
        console.error('Error deleting doctor:', error);
      }
    }
  };

  const handleScheduleChange = (dayOfWeek: number, field: 'startTime' | 'endTime', value: string) => {
    setFormData((prev) => {
      const schedule = [...prev.workingSchedule];
      const existingDay = schedule.find((s) => s.dayOfWeek === dayOfWeek);
      
      if (existingDay) {
        existingDay[field] = value;
      } else {
        schedule.push({
          dayOfWeek,
          startTime: field === 'startTime' ? value : '',
          endTime: field === 'endTime' ? value : '',
        });
      }
      
      return { ...prev, workingSchedule: schedule };
    });
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Doctors</Typography>
        <Button variant="contained" onClick={() => handleOpen()}>
          Add Doctor
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Working Schedule</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell>{`${doctor.firstName} ${doctor.lastName}`}</TableCell>
                <TableCell>{doctor.specialization}</TableCell>
                <TableCell>{doctor.email}</TableCell>
                <TableCell>{doctor.phoneNumber}</TableCell>
                <TableCell>
                  {doctor.workingSchedule.map((schedule) => (
                    <Chip
                      key={schedule.dayOfWeek}
                      label={`${DAYS_OF_WEEK[schedule.dayOfWeek - 1]}: ${schedule.startTime}-${schedule.endTime}`}
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(doctor)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(doctor.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingDoctor ? 'Edit Doctor' : 'Add Doctor'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {/* @ts-ignore */}
              <Grid item xs={12} sm={6} component="div">
                <TextField
                  fullWidth
                  label="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </Grid>
              {/* @ts-ignore */}
              <Grid item xs={12} sm={6} component="div">
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </Grid>
              {/* @ts-ignore */}
              <Grid item xs={12} sm={6} component="div">
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </Grid>
              {/* @ts-ignore */}
              <Grid item xs={12} sm={6} component="div">
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </Grid>
              {/* @ts-ignore */}
              <Grid item xs={12} sm={6} component="div">
                <TextField
                  fullWidth
                  label="Specialization"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  required
                />
              </Grid>
              {/* @ts-ignore */}
              <Grid item xs={12} sm={6} component="div">
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  required
                />
              </Grid>
              {!editingDoctor && (
                /* @ts-ignore */
                <Grid item xs={12} component="div">
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </Grid>
              )}
              {/* @ts-ignore */}
              <Grid item xs={12} component="div">
                <Typography variant="h6" gutterBottom>
                  Working Schedule
                </Typography>
                <Grid container spacing={2}>
                  {DAYS_OF_WEEK.map((day, index) => {
                    const daySchedule = formData.workingSchedule.find(
                      (s) => s.dayOfWeek === index + 1
                    );
                    return (
                      /* @ts-ignore */
                      <Grid item xs={12} sm={6} key={day} component="div">
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            {day}
                          </Typography>
                          <Grid container spacing={2}>
                            {/* @ts-ignore */}
                            <Grid item xs={6} component="div">
                              <TextField
                                fullWidth
                                label="Start Time"
                                type="time"
                                value={daySchedule?.startTime || ''}
                                onChange={(e) =>
                                  handleScheduleChange(index + 1, 'startTime', e.target.value)
                                }
                                InputLabelProps={{ shrink: true }}
                              />
                            </Grid>
                            {/* @ts-ignore */}
                            <Grid item xs={6} component="div">
                              <TextField
                                fullWidth
                                label="End Time"
                                type="time"
                                value={daySchedule?.endTime || ''}
                                onChange={(e) =>
                                  handleScheduleChange(index + 1, 'endTime', e.target.value)
                                }
                                InputLabelProps={{ shrink: true }}
                              />
                            </Grid>
                          </Grid>
                        </Paper>
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingDoctor ? 'Save Changes' : 'Add Doctor'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 