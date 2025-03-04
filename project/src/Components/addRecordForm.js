import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Button, TextField, Typography, Paper, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { printUser } from './printUser';
import './addRecordForm.css';
import { DateTime } from 'luxon';

const Backend = process.env.REACT_APP_BACKEND;

const AddUserForm = () => {
  const navigate = useNavigate();
  const [generatedRef, setGeneratedRef] = useState('');
  const employees = ["Omer", "Chand", "Nadeem", "Jason", "Ali"];

  useEffect(() => {
    const storedData = localStorage.getItem("login");
    const parsedData = storedData ? JSON.parse(storedData) : null;
    const token = parsedData ? parsedData.token : null;

    if (!token) {
      navigate("/error");
    }

    // Fetch employee names from logindetailsTable
    // const fetchEmployees = async () => {
    //   try {
    //     const response = await axios.get(`${Backend}/api/signUp`, {
    //       headers: { 'Authorization': `Bearer ${token}` }
    //     });
    //     console.log(response.data);
    //     setEmployees(response.data);  // Assuming response.data is an array of objects with { firstName }
    //   } catch (error) {
    //     console.error("Error fetching employees:", error);
    //   }
    // };

    // fetchEmployees();

    const now = DateTime.now().setZone("America/Toronto"); // Get Toronto time
    const formattedDateTime = now.toFormat("yyyy-MM-dd'T'HH:mm"); // Convert to datetime-local format

    formik.setFieldValue("dateTime", formattedDateTime);

  }, []);

  const formik = useFormik({
    initialValues: {
      firstName: "", lastName: "", date: new Date().toISOString().split('T')[0],
      dateTime: new Date().toISOString().slice(0, 16),
      product: "", issue: "",
      imei: "", notes: "", price: "", email: "", cellNumber: "",
      phoneNumber: "", employeeName: "",
      pickupTime: "", remarks: ""
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      product: Yup.string().required("Product name is required"),
      issue: Yup.string().required("Issue description is required"),
      imei: Yup.string().matches(/^\d{15}$/, "IMEI must be exactly 15 digits"),
      price: Yup.number().positive("Price must be a positive number").required("Price is required"),
      email: Yup.string().email("Invalid email format").required("Email is required"),
      cellNumber: Yup.string().matches(/^\d{10,15}$/, "Invalid phone number"),
      phoneNumber: Yup.string().matches(/^\d{10,15}$/, "Invalid phone number"),
      employeeName: Yup.string().required("Employee name is required"),
      date: Yup.date().required("Date is required"),
      dateTime: Yup.date().required("Date & Time is required"),
      pickupTime: Yup.string(),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      const storedData = JSON.parse(localStorage.getItem('login') || '{}');
      const token = storedData.token || null;
      let formattedRef = "000000";
      let updatedValues = { ...values, ref: formattedRef };

      try {
        const response = await axios.post(`${Backend}/api/users`, values, {
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });

        if (response.data && response.data.ref) {
          formattedRef = String(response.data.ref).padStart(6, '0');
          setGeneratedRef(formattedRef);
        }
        // Add the formatted reference ID to the object
        updatedValues = { ...values, ref: formattedRef };
        alert('Record added successfully');
        resetForm();
      } catch (error) {
        alert('Error adding record');
        console.error('Error adding record:', error);
      } finally {
        setSubmitting(false);
        printUser(updatedValues);
        navigate('/Records');
      }
    }
  });

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

        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ display: 'grid', gap: 2 }}>
            {[
              { name: 'firstName', label: 'First Name' },
              { name: 'lastName', label: 'Last Name' }, { name: 'product', label: 'Product' },
              { name: 'issue', label: 'Issue' }, { name: 'imei', label: 'IMEI' },
              { name: 'price', label: 'Price' }, { name: 'email', label: 'Email' },
              { name: 'cellNumber', label: 'Cell Number' }, { name: 'phoneNumber', label: 'Phone Number' },
              { name: 'remarks', label: 'Customer Remarks', multiline: true },
            ].map(field => (
              <TextField key={field.name} name={field.name} label={field.label}
                value={formik.values[field.name]} onChange={formik.handleChange}
                onBlur={formik.handleBlur} error={formik.touched[field.name] && Boolean(formik.errors[field.name])}
                helperText={formik.touched[field.name] && formik.errors[field.name]}
                variant="outlined" fullWidth multiline={field.multiline || false} color='secondary' />
            ))}

            {/* Employee Name Dropdown */}
            <FormControl fullWidth>
              <InputLabel color='secondary'>Employee Name</InputLabel>
              <Select
                name="employeeName"
                value={formik.values.employeeName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                color="secondary"
                variant="outlined"
                error={formik.touched.employeeName && Boolean(formik.errors.employeeName)}
                style={{textAlign: "left"}}
              >
                {employees.map((name, index) => (
                  <MenuItem key={index} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField name='date' label="Date" type="date"
              value={formik.values.date} onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.touched.date && Boolean(formik.errors.date)}
              helperText={formik.touched.date && formik.errors.date}
              variant="outlined" fullWidth color='secondary' InputLabelProps={{ shrink: true }} />

            <TextField name='dateTime' label="Date & Time" type="datetime-local"
              value={formik.values.dateTime} onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.touched.dateTime && Boolean(formik.errors.dateTime)}
              helperText={formik.touched.dateTime && formik.errors.dateTime}
              variant="outlined" fullWidth color='secondary' InputLabelProps={{ shrink: true }} />

            <TextField name='pickupTime' label="Pickup Time" type="time"
              value={formik.values.pickupTime} onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.touched.pickupTime && Boolean(formik.errors.pickupTime)}
              helperText={formik.touched.pickupTime && formik.errors.pickupTime}
              variant="outlined" fullWidth color='secondary' InputLabelProps={{ shrink: true }} />

            <TextField name='notes' label="Technician Notes" multiline minRows={2}
              value={formik.values.notes} onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.touched.notes && Boolean(formik.errors.notes)}
              helperText={formik.touched.notes && formik.errors.notes}
              variant="outlined" fullWidth color='secondary' />
          </Box>

          <Button variant='contained' type='submit' color='primary' sx={{ mt: 3, px: 4 }} disabled={formik.isSubmitting || !formik.isValid}>
            {formik.isSubmitting ? "Submitting..." : "Add"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default AddUserForm;
