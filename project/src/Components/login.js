import './login.css';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import {
    Button, TextField, Snackbar, Alert, Dialog, DialogActions,
    DialogContent, DialogTitle, Container, Typography, Box, Paper,
    IconButton, InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';

const Backend = process.env.REACT_APP_BACKEND;

export default function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
    const [signupOpen, setSignupOpen] = useState(false);
    const [otpOpen, setOtpOpen] = useState(false);
    const [signupData, setSignupData] = useState({ email: "", password: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [otp, setOtp] = useState("");
    const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
    const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
    const [newPassword, setNewPassword] = useState("");


    const handleChange = (event) => {
        setFormData(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSignupChange = (event) => {
        setSignupData(prev => ({ ...prev, [event.target.name]: event.target.value }));
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

    const handleSendOTP = async (e) => {
        e.preventDefault();

        // ✅ Frontend Validation: Check if passwords match
        if (signupData.password !== signupData.confirmPassword) {
            setSnackbar({ open: true, message: 'Passwords do not match', severity: 'error' });
            return;
        }

        try {
            await axios.post(`${Backend}/api/signUp/send-otp`, { email: signupData.email }, {
                headers: { 'Content-Type': 'application/json' }
            });
            setSnackbar({ open: true, message: 'OTP sent to your email', severity: 'success' });
            setSignupOpen(false);
            setOtpOpen(true);  // Open OTP dialog
        } catch (error) {
            setSnackbar({ open: true, message: 'Error sending OTP', severity: 'error' });
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${Backend}/api/signUp/verify-otp`, { ...signupData, otp }, {
                headers: { 'Content-Type': 'application/json' }
            });
            setSnackbar({ open: true, message: 'User registered successfully', severity: 'success' });
            setOtpOpen(false);
        } catch (error) {
            setSnackbar({ open: true, message: 'Invalid OTP', severity: 'error' });
        }
    };

    const handleForgotPassword = async () => {
        try {
            await axios.post(`${Backend}/api/signUp/forgot-password`, { email: signupData.email });
            setSnackbar({ open: true, message: 'OTP sent to email', severity: 'success' });
            setForgotPasswordOpen(false);
            setResetPasswordOpen(true);
        } catch (error) {
            setSnackbar({ open: true, message: 'Error sending OTP', severity: 'error' });
        }
    };

    const handleResetPassword = async () => {
        try {
            await axios.post(`${Backend}/api/signUp/reset-password`, { email: signupData.email, otp, newPassword });
            setSnackbar({ open: true, message: 'Password reset successfully', severity: 'success' });
            setResetPasswordOpen(false);
        } catch (error) {
            setSnackbar({ open: true, message: 'Invalid OTP or error resetting password', severity: 'error' });
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
                    <Box mt={2} textAlign="center" >
                            <Button onClick={() => setForgotPasswordOpen(true)} color="primary">Forgot Password?</Button>
                        </Box>
                </form>
            </Paper>

             {/* Forgot Password Dialog */}
             <Dialog open={forgotPasswordOpen} onClose={() => setForgotPasswordOpen(false)}>
                <DialogTitle>Forgot Password</DialogTitle>
                <DialogContent>
                    <TextField 
                        fullWidth 
                        margin="dense" 
                        label="Enter Email" 
                        type="email" 
                        value={signupData.email} 
                        onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))} 
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setForgotPasswordOpen(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleForgotPassword} variant="contained" color="primary">Send OTP</Button>
                </DialogActions>
            </Dialog>

            {/* Reset Password Dialog */}
            <Dialog open={resetPasswordOpen} onClose={() => setResetPasswordOpen(false)}>
                <DialogTitle>Reset Password</DialogTitle>
                <DialogContent>
                    <TextField 
                        fullWidth 
                        margin="dense" 
                        label="Enter OTP" 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                    />
                    <TextField 
                        fullWidth 
                        margin="dense" 
                        label="New Password" 
                        type="password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setResetPasswordOpen(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleResetPassword} variant="contained" color="primary">Reset Password</Button>
                </DialogActions>
            </Dialog>

            {/* Signup Dialog */}
            <Dialog open={signupOpen} onClose={() => setSignupOpen(false)}>
                <DialogTitle>Sign Up</DialogTitle>
                <form onSubmit={handleSendOTP}>
                    <DialogContent>
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
                            type={showPassword ? "text" : "password"}
                            variant="outlined"
                            value={signupData.password}
                            onChange={handleSignupChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            name="confirmPassword"
                            label="Confirm Password"
                            type={showConfirmPassword ? "text" : "password"}
                            variant="outlined"
                            value={signupData.confirmPassword}
                            onChange={handleSignupChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setSignupOpen(false)} color="secondary">
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="secondary">
                            Send OTP
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* OTP Verification Dialog */}
            <Dialog open={otpOpen} onClose={() => setOtpOpen(false)}>
                <DialogTitle>Verify OTP</DialogTitle>
                <form onSubmit={handleVerifyOTP}>
                    <DialogContent>
                        <TextField
                            fullWidth
                            margin="dense"
                            name="otp"
                            label="Enter OTP"
                            variant="outlined"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOtpOpen(false)} color="secondary">
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="secondary">
                            Verify OTP
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
