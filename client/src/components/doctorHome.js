import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { USER_DATA_KEY } from './config';
import {
  AppBar,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  Snackbar
} from '@mui/material';
import { Link } from 'react-router-dom';
import MuiAlert from '@mui/material/Alert';
import MenuIcon from '@mui/icons-material/Menu';
import { GET_DOCTOR_BY_USER_ID } from '../graphql/queries/getdoctorsbyuserid';


const DoctorHome = () => {
  const userData = JSON.parse(localStorage.getItem(USER_DATA_KEY));
  const [open, setOpen] = React.useState(false);
  const [logoutSnackbarOpen, setLogoutSnackbarOpen] = useState(false);
  const { loading, error, data } = useQuery(GET_DOCTOR_BY_USER_ID, {
    variables: { getDoctorByUserIdId: userData.id },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return<p> Error: {error.message}</p>;

  
  const doctor = data.getDoctorByUserId;

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    setLogoutSnackbarOpen(true);
    setTimeout(() => {
      window.location.href = '/login'; 
    }, 2000);
  };

  const handleSnackbarClose = () => {
    setLogoutSnackbarOpen(false);
  };

  return (
    <div>
      <h2>Welcome, {doctor.FirstName}</h2>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerOpen}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Health Analytics Platform
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            variant="outlined"
            sx={{ marginRight: 2 }}
          >
            Logout
          </Button>
          <Button
            color="inherit"
            variant="contained"
            sx={{
              backgroundColor: 'white',
              color: 'black',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
            }}
            onClick={handleDrawerOpen}
          >
            PD
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={open} onClose={handleDrawerClose}>
        <List>
          <ListItem button component={Link} to="/vitals">
            <ListItemText primary="Vitals" />
          </ListItem>
          <ListItem button component={Link} to="/medical-history">
            <ListItemText primary="Medical History" />
          </ListItem>
          <ListItem button component={Link} to="/appointments">
            <ListItemText primary="Appointments" />
          </ListItem>
          <ListItem button component={Link} to="/lab-results">
            <ListItemText primary="Lab Results" />
          </ListItem>
        </List>
      </Drawer>

      <div style={{ marginLeft: '260px' }}>
      </div>

      <Snackbar
        open={logoutSnackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert severity="success" onClose={handleSnackbarClose}>
          Logged out successfully
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default DoctorHome;
