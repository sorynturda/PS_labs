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
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { api } from '../../api';

interface Receptionist {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export default function ReceptionistsPage() {
  const [receptionists, setReceptionists] = useState<Receptionist[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingReceptionist, setEditingReceptionist] = useState<Receptionist | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    password: '',
  });

  useEffect(() => {
    loadReceptionists();
  }, []);

  const loadReceptionists = async () => {
    try {
      const response = await api.get('/api/admin/users/receptionists');
      setReceptionists(response.data);
    } catch (error) {
      console.error('Error loading receptionists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (receptionist?: Receptionist) => {
    if (receptionist) {
      setEditingReceptionist(receptionist);
      setFormData({
        username: receptionist.username,
        email: receptionist.email,
        firstName: receptionist.firstName,
        lastName: receptionist.lastName,
        phoneNumber: receptionist.phoneNumber,
        password: '',
      });
    } else {
      setEditingReceptionist(null);
      setFormData({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        password: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingReceptionist(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingReceptionist) {
        await api.put(`/api/admin/users/${editingReceptionist.id}`, formData);
      } else {
        await api.post('/api/admin/users/receptionists', formData);
      }
      handleClose();
      loadReceptionists();
    } catch (error) {
      console.error('Error saving receptionist:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this receptionist?')) {
      try {
        await api.delete(`/api/admin/users/${id}`);
        loadReceptionists();
      } catch (error) {
        console.error('Error deleting receptionist:', error);
      }
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Receptionists</Typography>
        <Button variant="contained" onClick={() => handleOpen()}>
          Add Receptionist
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {receptionists.map((receptionist) => (
              <TableRow key={receptionist.id}>
                <TableCell>{receptionist.username}</TableCell>
                <TableCell>{receptionist.email}</TableCell>
                <TableCell>{receptionist.firstName}</TableCell>
                <TableCell>{receptionist.lastName}</TableCell>
                <TableCell>{receptionist.phoneNumber}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(receptionist)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(receptionist.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingReceptionist ? 'Edit Receptionist' : 'Add Receptionist'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              margin="normal"
              required
            />
            {!editingReceptionist && (
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                margin="normal"
                required
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingReceptionist ? 'Save' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
} 