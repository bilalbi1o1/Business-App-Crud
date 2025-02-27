import React, { useState } from "react";
import {
    Button, TextField, Dialog, DialogActions,
    DialogContent, DialogTitle, IconButton, InputAdornment, Snackbar, Alert
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";

const Backend = process.env.REACT_APP_BACKEND;

export default function Signup({ open, onClose }) {
    const [signupData, setSignupData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "" });
    const [otpOpen, setOtpOpen] = useState(false);
    const [otp, setOtp] = useState("");

    const handleSignupChange = (event) => {
        setSignupData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();

        if (signupData.password !== signupData.confirmPassword) {
            setSnackbar({ open: true, message: "Passwords do not match", severity: "error" });
            return;
        }

        if (!signupData.name) {
            setSnackbar({ open: true, message: "Name Field is empty", severity: "error" });
            return;
        }

        try {
            await axios.post(`${Backend}/api/signUp/send-otp`, { email: signupData.email });
            setSnackbar({ open: true, message: "OTP sent to your email", severity: "success" });
            setOtpOpen(true);
        } catch (error) {
            setSnackbar({ open: true, message: "Error sending OTP", severity: "error" });
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${Backend}/api/signUp/verify-otp`, { ...signupData, otp });
            setSnackbar({ open: true, message: "User registered successfully", severity: "success" });
            setOtpOpen(false);
            onClose(); // Close Signup Dialog after successful registration
        } catch (error) {
            setSnackbar({ open: true, message: "Invalid OTP", severity: "error" });
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ open: false, message: "", severity: "" });

    return (
        <>
            {/* Signup Dialog */}
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Sign Up</DialogTitle>
                <form onSubmit={handleSendOTP}>
                    <DialogContent>
                        <TextField fullWidth margin="dense" name="name" label="Name" type="text" variant="outlined" value={signupData.name} onChange={handleSignupChange} />
                        <TextField fullWidth margin="dense" name="email" label="Email Address" type="email" variant="outlined" value={signupData.email} onChange={handleSignupChange} />
                        <TextField fullWidth margin="dense" name="password" label="Password" type={showPassword ? "text" : "password"} variant="outlined" value={signupData.password} onChange={handleSignupChange}
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
                        <TextField fullWidth margin="dense" name="confirmPassword" label="Confirm Password" type={showConfirmPassword ? "text" : "password"} variant="outlined" value={signupData.confirmPassword} onChange={handleSignupChange}
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
                        <Button onClick={onClose} color="secondary">Cancel</Button>
                        <Button type="submit" variant="contained" color="secondary">Send OTP</Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* OTP Verification Dialog */}
            <Dialog open={otpOpen} onClose={() => setOtpOpen(false)}>
                <DialogTitle>Verify OTP</DialogTitle>
                <form onSubmit={handleVerifyOTP}>
                    <DialogContent>
                        <TextField fullWidth margin="dense" name="otp" label="Enter OTP" variant="outlined" value={otp} onChange={(e) => setOtp(e.target.value)} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOtpOpen(false)} color="secondary">Cancel</Button>
                        <Button type="submit" variant="contained" color="secondary">Verify OTP</Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Snackbar Notification */}
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>{snackbar.message}</Alert>
            </Snackbar>
        </>
    );
}
