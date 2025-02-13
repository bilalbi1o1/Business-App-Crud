import './login.css';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Button, TextField, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogTitle, Container, Typography, Box, Paper } from '@mui/material';
import axios from 'axios';

const Backend = process.env.REACT_APP_BACKEND;

export default function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
    const [signupOpen, setSignupOpen] = useState(false);
    const [signupData, setSignupData] = useState({ name: "", email: "", password: "" });

    const handleChange = (event) => {
        setFormData(prevFormData => ({ ...prevFormData, [event.target.name]: event.target.value }));
    };

    const handleSignupChange = (event) => {
        setSignupData(prevSignupData => ({ ...prevSignupData, [event.target.name]: event.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response = await axios.post(`${Backend}/api/signUp/login`, formData, {
                headers: { 'Content-Type': 'application/json' }
            });
            response = response.data;
            if (response.token) {
                localStorage.setItem('login', JSON.stringify({ login: true, token: response.token }));
                setSnackbar({ open: true, message: 'Logged in successfully', severity: 'success' });
                navigate('/Records');
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Error logging in', severity: 'error' });
        }
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${Backend}/api/signUp`, signupData, {
                headers: { 'Content-Type': 'application/json' }
            });
            setSnackbar({ open: true, message: 'User added successfully', severity: 'success' });
            setSignupOpen(false);
        } catch (error) {
            setSnackbar({ open: true, message: 'Error: Unable to sign up', severity: 'error' });
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ open: false, message: '', severity: '' });

    return (
        <Container maxWidth="xs">
            <Paper elevation={4} sx={{ padding: 4, mt: 8, textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="bold" mb={3}>
                    Login
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField 
                        fullWidth
                        name="email" 
                        label="Email" 
                        variant="outlined" 
                        color="secondary" 
                        margin="normal" 
                        value={formData.email} 
                        onChange={handleChange} 
                    />
                    <TextField 
                        fullWidth
                        name="password" 
                        label="Password" 
                        type="password" 
                        variant="outlined" 
                        color="secondary" 
                        margin="normal" 
                        value={formData.password} 
                        onChange={handleChange} 
                    />
                    <Box mt={3} display="flex" justifyContent="space-between">
                        <Button type="submit" variant="contained" color="primary" sx={{ flexGrow: 1, mr: 1 }}>
                            Login
                        </Button>
                        <Button variant="outlined" color="secondary" sx={{ flexGrow: 1 }} onClick={() => setSignupOpen(true)}>
                            Sign Up
                        </Button>
                    </Box>
                </form>
            </Paper>

            {/* Signup Dialog */}
            <Dialog open={signupOpen} onClose={() => setSignupOpen(false)}>
                <DialogTitle>Sign Up</DialogTitle>
                <form onSubmit={handleSignupSubmit}>
                    <DialogContent>
                        <TextField 
                            fullWidth 
                            margin="dense" 
                            name="name" 
                            label="Name" 
                            variant="outlined" 
                            value={signupData.name} 
                            onChange={handleSignupChange} 
                        />
                        <TextField 
                            fullWidth 
                            margin="dense" 
                            name="email" 
                            label="Email Address" 
                            type="email" 
                            variant="outlined" 
                            value={signupData.email} 
                            onChange={handleSignupChange} 
                        />
                        <TextField 
                            fullWidth 
                            margin="dense" 
                            name="password" 
                            label="Password" 
                            type="password" 
                            variant="outlined" 
                            value={signupData.password} 
                            onChange={handleSignupChange} 
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setSignupOpen(false)} color="secondary">
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="secondary">
                            Sign Up
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Snackbar Notification */}
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}
