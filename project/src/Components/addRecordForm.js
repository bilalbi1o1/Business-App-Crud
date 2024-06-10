import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Snackbar, Alert } from '@mui/material';
import './addRecordForm.css';
import { Link } from 'react-router-dom';

const AddUserForm = () => {
  const [formData, setFormData] = useState({
    ref: "",
    firstName: "",
    lastName: "",
    date: "",
    product: "",
    issue: "",
    imeiSn: "",
    notes: "",
    price: "",
    email: "",
    phoneCell: "",
    phoneHome: "",
    employeeName: "",
    pickupDate: "",
    remarks: "",
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

  const handleChange = (event) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = { ...formData };

    try {
      await axios.post('http://localhost:8000/api/users', newUser, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setSnackbar({ open: true, message: 'Record added successfully', severity: 'success' });
      // await fetchData(); // Uncomment if you have this function
    } catch (error) {
      setSnackbar({ open: true, message: 'Error adding record', severity: 'error' });
      console.error('Error adding record:', error);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ open: false, message: '', severity: '' });
  };

  return (
    <div>
      <Link to="/" style={{ color: '#fff', backgroundColor: 'midnightBlue', borderRadius: '10px', padding: '10px', textDecoration: 'none', position: 'absolute' ,marginLeft: '2vw' }}>
        View Records
      </Link>
      <h3 className='pageTitle'>Add New Record</h3>
      <form onSubmit={handleSubmit}>
        <div className='container'>
          <TextField name='ref' value={formData.ref} onChange={handleChange} className='inputBox' label="Ref #" margin='normal' variant='outlined' color='secondary' />
          <TextField name='firstName' value={formData.firstName} onChange={handleChange} className='inputBox' label="First Name" margin='normal' variant='outlined' color='secondary' />
          <TextField name='lastName' value={formData.lastName} onChange={handleChange} className='inputBox' label="Last Name" margin='normal' variant='outlined' color='secondary' />
          <TextField name='date' value={formData.date} onChange={handleChange} className='inputBox' label="Date" type="date" variant="outlined" color='secondary' InputLabelProps={{ shrink: true }} />
          <TextField name='product' value={formData.product} onChange={handleChange} className='inputBox' label="Product" margin='normal' variant='outlined' color='secondary' />
          <TextField name='issue' value={formData.issue} onChange={handleChange} className='inputBox' label="Issue" margin='normal' variant='outlined' color='secondary' />
          <TextField name='imeiSn' value={formData.imeiSn} onChange={handleChange} className='inputBox' label="IMEI" margin='normal' variant='outlined' color='secondary' />
          <TextField name='price' value={formData.price} onChange={handleChange} className='inputBox' label="Price" margin='normal' variant='outlined' color='secondary' />
          <TextField name='email' value={formData.email} onChange={handleChange} className='inputBox' label="Email" margin='normal' variant='outlined' color='secondary' />
          <TextField name='phoneCell' value={formData.phoneCell} onChange={handleChange} className='inputBox' label="Cell Number" margin='normal' variant='outlined' color='secondary' />
          <TextField name='phoneHome' value={formData.phoneHome} onChange={handleChange} className='inputBox' label="Phone Number" margin='normal' variant='outlined' color='secondary' />
          <TextField name='employeeName' value={formData.employeeName} onChange={handleChange} className='inputBox' label="Employee Name" margin='normal' variant='outlined' color='secondary' />
          <TextField name='pickupDate' value={formData.pickupDate} onChange={handleChange} className='inputBox' label="PickUp Date" type="date" variant="outlined" color='secondary' InputLabelProps={{ shrink: true }} />
          <TextField name='notes' value={formData.notes} onChange={handleChange} className='inputBox' multiline maxRows={2} minRows={2} label="Notes" margin='normal' variant='outlined' color='secondary' />
          <TextField name='remarks' value={formData.remarks} onChange={handleChange} className='inputBox' multiline maxRows={2} minRows={2} label="Remarks" margin='normal' variant='outlined' color='secondary' />
        </div>
        <div className='buttonContainer'>
          <Button className='button' variant='contained' type='submit' color='primary'>Add</Button>
        </div>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddUserForm;
