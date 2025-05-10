import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CardActions,
  Button,
} from '@mui/material';
import {
  People as PeopleIcon,
  LocalHospital as LocalHospitalIcon,
  MedicalServices as MedicalServicesIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const menuItems = [
  {
    title: 'Receptionists',
    description: 'Manage receptionists',
    icon: <PeopleIcon sx={{ fontSize: 40 }} />,
    path: '/admin/receptionists',
  },
  {
    title: 'Doctors',
    description: 'Manage doctors',
    icon: <LocalHospitalIcon sx={{ fontSize: 40 }} />,
    path: '/admin/doctors',
  },
  {
    title: 'Services',
    description: 'Manage medical services',
    icon: <MedicalServicesIcon sx={{ fontSize: 40 }} />,
    path: '/admin/services',
  },
  {
    title: 'Reports',
    description: 'View reports and statistics',
    icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
    path: '/admin/reports',
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        {menuItems.map((item) => (
          /* @ts-ignore */
          <Grid item xs={12} sm={6} md={3} key={item.title} component="div">
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                },
                transition: 'all 0.3s ease-in-out',
              }}
              onClick={() => navigate(item.path)}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  {item.icon}
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 