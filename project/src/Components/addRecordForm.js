import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Button, TextField, Snackbar, Alert, Typography, Paper, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import './addRecordForm.css';

const AddUserForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ref: "", firstName: "", lastName: "", date: "", product: "",
    issue: "", imei: "", notes: "", price: "", email: "",
    cellNumber: "", phoneNumber: "", employeeName: "", pickupDate: "", remarks: ""
  });

  useEffect(() => {
    const storedData = localStorage.getItem("login");
    const parsedData = storedData ? JSON.parse(storedData) : null;
    const token = parsedData ? parsedData.token : null;

    if (!token) {
      navigate("/error"); // Redirect if not logged in
    }
  }, []);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

  const handleChange = (event) => {
    setFormData(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedData = JSON.parse(localStorage.getItem('login') || '{}');
    const token = storedData.token || null;

    try {
      await axios.post(`${Backend}/api/users`, formData, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      console.log("Backend Route",Backend);
      setSnackbar({ open: true, message: 'Record added successfully', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error adding record', severity: 'error' });
      console.error('Error adding record:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 4, width: '90%', maxWidth: 600, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Add New Record
        </Typography>
        <Link to="/Records" style={{
          color: '#fff', backgroundColor: '#191970', padding: '8px 16px',
          borderRadius: '8px', textDecoration: 'none', display: 'inline-block', marginBottom: '16px'
        }}>
          View Records
        </Link>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'grid', gap: 2 }}>
            {[
              { name: 'ref', label: 'Ref #' }, { name: 'firstName', label: 'First Name' },
              { name: 'lastName', label: 'Last Name' }, { name: 'product', label: 'Product' },
              { name: 'issue', label: 'Issue' }, { name: 'imei', label: 'IMEI' },
              { name: 'price', label: 'Price' }, { name: 'email', label: 'Email' },
              { name: 'cellNumber', label: 'Cell Number' }, { name: 'phoneNumber', label: 'Phone Number' },
              { name: 'employeeName', label: 'Employee Name' }, { name: 'remarks', label: 'Remarks', multiline: true },
            ].map(field => (
              <TextField key={field.name} name={field.name} value={formData[field.name]}
                onChange={handleChange} label={field.label} variant="outlined" fullWidth
                multiline={field.multiline || false} color='secondary' />
            ))}

            <TextField name='date' value={formData.date} onChange={handleChange}
              label="Date" type="date" variant="outlined" fullWidth color='secondary' InputLabelProps={{ shrink: true }} />
            <TextField name='pickupDate' value={formData.pickupDate} onChange={handleChange}
              label="PickUp Date" type="date" variant="outlined" fullWidth color='secondary' InputLabelProps={{ shrink: true }} />
            <TextField name='notes' value={formData.notes} onChange={handleChange}
              label="Notes" multiline minRows={2} variant="outlined" fullWidth color='secondary' />
          </Box>

          <Button variant='contained' type='submit' color='primary' sx={{ mt: 3, px: 4 }}>
            Add
          </Button>
        </form>
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={4000}
        onClose={() => setSnackbar({ open: false, message: '', severity: '' })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddUserForm;
