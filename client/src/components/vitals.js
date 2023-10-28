import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_VITALS_BY_PATIENT_ID } from '../graphql/queries/getvitalsbypatientid';
import { USER_DATA_KEY } from './config';
import { GET_PATIENT_BY_USER_ID } from '../graphql/queries/getpatientsbyuserid';
import { Link } from 'react-router-dom';
import {
  Grid,
  Paper,
  Button,
  ThemeProvider,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Typography,
  Card,
  CardContent,
  createTheme
} from '@mui/material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

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

const Vitals = () => {
  const userData = JSON.parse(localStorage.getItem(USER_DATA_KEY));
  const { loading, error, data } = useQuery(GET_PATIENT_BY_USER_ID, {
    variables: { getPatientByUserIdId: userData.id },
  });

  const patient = data.getPatientByUserId;
  const patientID = patient.PatientID;
  const [open, setOpen] = React.useState(false);
  const [logoutSnackbarOpen, setLogoutSnackbarOpen] = useState(false);
  const name = patient.FirstName[0];

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
  
  const { loading: vitalLoading, error: vitalError, data: vitalData } = useQuery(GET_VITALS_BY_PATIENT_ID, {
    variables: { patientId: patientID },
  });

  if (loading || vitalLoading) {
    return <p>Loading...</p>;
  }

  if (error || vitalError) {
    return <p>Error: {error ? error.message : vitalError.message}</p>;
  }

  const vitalsData = vitalData?.getVitalsByPatientID || [];
  const numVisits = vitalsData.length;
  const mostRecentVital = vitalsData[vitalsData.length - 1];

  const vitalLimits = {
    BloodPressure: { min: 60, max: 100 },
    HeartRate: { min: 60, max: 100 },
    RespiratoryRate: { min: 60, max: 100 },
    Temperature: { min: 96, max: 100 },
    OxygenSaturation: { min: 60, max: 100 },
  };

  const vitalColors = {
    BloodPressure: 'purple',
    HeartRate: 'blue',
    RespiratoryRate: 'green',
    Temperature: 'red',
    OxygenSaturation: 'orange',
  };

  const pieChartData = Object.keys(vitalLimits).map((vitalName) => ({
    name: vitalName,
    value: mostRecentVital[vitalName],
    message: getVitalMessage(vitalName, mostRecentVital[vitalName]),
    color: vitalColors[vitalName],
  }));

  const charts = [];

  Object.keys(vitalLimits).forEach((vitalName) => {
    if (vitalName !== 'BloodPressure') { 
      const chartData = vitalsData.map((vital) => ({
        name: vital.VisitAppointment.DateAndTime, 
        value: vital[vitalName],
        color: vitalColors[vitalName],
        message: getVitalMessage(vitalName, vital[vitalName]),
      }));

      charts.push(
        <Grid item xs={4} key={vitalName}>
          <Card>
            <CardContent>
              <Typography variant="h6">{vitalName} Chart</Typography>
              <ResponsiveContainer width="80%" height={200}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill={vitalColors[vitalName]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      );
    }
  });

  function getVitalMessage(vitalName, value) {
    const { min, max } = vitalLimits[vitalName];
    if (value < min) {
      if (vitalName === 'RespiratoryRate') {
        return `low`;
      } else {
        return `too low`;
      }
    } else if (value > max) {
      return `too high`;
    }
    return 'Normal';
  }

  return (
    <ThemeProvider theme={theme}>
      <div>
        <AppBar position="static">
          <Toolbar>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Button component={Link} to="/patient-home" variant="text" style={{ textDecoration: 'none', color: 'white' }}>
                  <Typography variant="h6" className="logo-style">
                    Health Analytics Platform
                  </Typography>
                </Button>
              </Grid>
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item>
                    <Button component={Link} to="/vitals" variant="text" style={{ textDecoration: 'none', color: 'white' }}>
                      Vitals
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button component={Link} to="/medical-history" variant="text" style={{ textDecoration: 'none', color: 'white' }}>
                      Medical History
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button component={Link} to="/appointments" variant="text" style={{ textDecoration: 'none', color: 'white' }}>
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
        <div>
          {/* First Row */}
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Paper elevation={3} style={{ padding: '20px' }}>
                <div style={{ backgroundColor: 'orange', padding: '5px' }}>
                  <Typography variant="h6">Number of Visits</Typography>
                  <Typography variant="h4">{numVisits}</Typography>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper elevation={3} style={{ padding: '20px' }}>
                <div style={{ backgroundColor: 'yellow', padding: '10px' }}>
                  <Typography variant="h6">Recent Vital Chart</Typography>
                  <ResponsiveContainer width="105%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={60}
                        fill="#8884d8"
                        label={({ name, message }) => {
                          return `${name} - ${message}`;
                        }}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Paper>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            {charts}
          </Grid>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Vitals;
