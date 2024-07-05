import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Assuming you are using React Router for navigation

function Error() {
    const navigate = useNavigate();

    const goToLogin = () => {
        navigate('/login'); // Navigate to '/login' route
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh', // Full viewport height
            }}
        >
            <Typography variant="h5" color="error" gutterBottom>
                Error: Not Logged In
            </Typography>
            <Button variant="contained" onClick={goToLogin}>
                Go to Login
            </Button>
        </Box>
    );
}

export default Error;

