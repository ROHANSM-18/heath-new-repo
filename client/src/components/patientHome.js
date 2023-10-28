import React, { useState } from 'react';
import { USER_DATA_KEY } from './config';
import { useQuery } from '@apollo/client';
import { GET_PATIENT_BY_USER_ID } from '../graphql/queries/getpatientsbyuserid';
import {
  AppBar,
  Snackbar,
  Avatar,
  Toolbar,
  Grid,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { Outlet, Link } from 'react-router-dom';
import MuiAlert from '@mui/material/Alert';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff5733',
    },
  },
  typography: {
    fontFamily: 'Forte',
  },
});

function calculateAge(dateOfBirth) {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();

  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
  ) {
    age--;
  }

  return age;
}

const tableCellStyle = {
  width: '50%',
  margin: '0 auto',
};

const PatientHome = () => {
  const userData = JSON.parse(localStorage.getItem(USER_DATA_KEY));
  const [open, setOpen] = React.useState(false);
  const [logoutSnackbarOpen, setLogoutSnackbarOpen] = useState(false);
  const { loading, error, data } = useQuery(GET_PATIENT_BY_USER_ID, {
    variables: { getPatientByUserIdId: userData.id },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const patient = data.getPatientByUserId;
  const name = patient.FirstName[0];
  const age = calculateAge(patient.DateOfBirth);
  const dateOfBirth = new Date(patient.DateOfBirth);
  const formattedDateOfBirth = dateOfBirth.toDateString();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(USER_DATA_KEY);
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  };

  const handleSnackbarClose = () => {
    setLogoutSnackbarOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <AppBar position="static">
          <Toolbar>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
              <Button component={Link} to="/patient-home" variant="text" style={{ textDecoration: 'none' , color:'white' }} >

                <Typography variant="h6" className="logo-style">
                  Health Analytics Platform
                </Typography>
                 </Button>
              </Grid>
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item>
               <Button component={Link} to="/vitals" variant="text" style={{ textDecoration: 'none' , color:'white' }} >
                 Vitals
                 </Button>
                  </Grid>
                  <Grid item>
                  <Button component={Link} to="/medical-history" variant="text" style={{ textDecoration: 'none' , color:'white' }} >
                  Medical History
                 </Button>
                  </Grid>
                  <Grid item>
                  <Button component={Link} to="/appointments" variant="text" style={{ textDecoration: 'none' , color:'white' }} >
                  Appointments
                 </Button>
                  </Grid>

                </Grid>
              </Grid>
              <Grid item>
                <IconButton onClick={handleDrawerOpen}>
                  <Avatar
                    sx={{
                      backgroundColor: 'rgba(250, 235, 215, 0.901)',
                    }}
                  >
                    {name}
                  </Avatar>
                </IconButton>
                <Button color="inherit" onClick={handleLogout} variant="outlined">
                  Log out
                </Button>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <div className="main-content">
          <h2>
            Welcome, <span style={{ color: '#ff5733' }}>{patient.FirstName}</span>
          </h2>
          <TableContainer component={Paper} style={tableCellStyle}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>First Name:</TableCell>
                  <TableCell>{patient.FirstName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Last Name:</TableCell>
                  <TableCell>{patient.LastName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Date of Birth:</TableCell>
                  <TableCell>{formattedDateOfBirth}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Gender:</TableCell>
                  <TableCell>{patient.Gender}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Age:</TableCell>
                  <TableCell>{age} years</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Contact Information:</TableCell>
                  <TableCell>{patient.ContactInformation}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Doctor:</TableCell>
                  <TableCell>{patient.Doctor && patient.Doctor.FirstName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Email:</TableCell>
                  <TableCell>{patient.UserID && patient.UserID.email}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <Snackbar open={logoutSnackbarOpen} autoHideDuration={2000} onClose={handleSnackbarClose}>
          <MuiAlert severity="success" onClose={handleSnackbarClose}>
            Logged out successfully
          </MuiAlert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
};

export default PatientHome;
