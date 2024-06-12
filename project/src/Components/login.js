import './login.css';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Button, TextField, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';

export default function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
    const [signupOpen, setSignupOpen] = useState(false);
    const [signupData, setSignupData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleChange = (event) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [event.target.name]: event.target.value
        }));
    };

    const handleSignupChange = (event) => {
        setSignupData(prevSignupData => ({
            ...prevSignupData,
            [event.target.name]: event.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = { ...formData };
        console.log(newUser);
        try {
            await axios.post('http://localhost:8000/api/signUp/login', newUser, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setSnackbar({ open: true, message: 'Logged in successfully', severity: 'success' });
            navigate('/'); // Redirect to the root route
        } catch (error) {
            setSnackbar({ open: true, message: 'Error logging in', severity: 'error' });
            console.error('Error logging in:', error);
        }
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        const newUser = { ...signupData };

        try {
            await axios.post('http://localhost:8000/api/signUp', newUser, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setSnackbar({ open: true, message: 'User added successfully', severity: 'success' });
            setSignupOpen(false);
        } catch (error) {
            setSnackbar({ open: true, message: 'Error : unable to signUP', severity: 'error' });
            console.error('Error Signing Up:', error);
        }

         //Reset Form Fields
         setSignupData({
            name: null,
            email: null,
            password: null
        });
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ open: false, message: '', severity: '' });
    };

    const handleOpenSignup = () => {
        setSignupOpen(true);
    };

    const handleCloseSignup = () => {

        //Reset Form Fields
        setSignupData({
            name: null,
            email: null,
            password: null
        });

        setSignupOpen(false);

    };

    return (
        <div>
            <h3 className='pageTitle'>Login Page</h3>
            <form onSubmit={handleSubmit}>
                <div className='container'>
                    <TextField name='email' value={formData.email} onChange={handleChange} className='inputBox' label="Email" margin='normal' variant='outlined' color='secondary' />
                    <TextField name='password' value={formData.password} onChange={handleChange} className='inputBox' label="Password" margin='normal' variant='outlined' color='secondary' />
                </div>
                <div className='buttonContainer'>
                    <Button className='button' variant='outlined' type='submit' color='secondary'>Login</Button>
                    <Button className='button' variant='outlined' color='secondary' onClick={handleOpenSignup}>Sign Up</Button>
                </div>
            </form>

            <Dialog open={signupOpen} onClose={handleCloseSignup}>
                <DialogTitle>Sign Up</DialogTitle>
                <form onSubmit={handleSignupSubmit}>
                    <DialogContent>
                        <div className='signUpDialog'>
                            <TextField autoFocus margin="dense" name="name" label="Name" type="text" variant="outlined" value={signupData.name} onChange={handleSignupChange} />
                            <TextField margin="dense" name="email" label="Email Address" type="email" variant="outlined" value={signupData.email} onChange={handleSignupChange} />
                            <TextField margin="dense" name="password" label="Password" type="password" variant="outlined" value={signupData.password} onChange={handleSignupChange} />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseSignup} color="secondary">Cancel</Button>
                        <Button type="submit" color="secondary" variant='contained'>Sign Up</Button>
                    </DialogActions>
                </form>
            </Dialog>

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
    )
}
