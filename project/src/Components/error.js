import React from 'react';
import { Typography, Button, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Error() {
    const navigate = useNavigate();

    return (
        <Box 
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                backgroundColor: '#f8f9fa',
            }}
        >
            <Paper elevation={4} sx={{ padding: 4, textAlign: 'center', maxWidth: 400 }}>
                <Typography variant="h4" color="error" fontWeight="bold" gutterBottom>
                    Access Denied
                </Typography>
                <Typography variant="body1" color="textSecondary" mb={2}>
                    You are not logged in. Please log in to continue.
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => navigate('/')}
                >
                    Go to Login
                </Button>
            </Paper>
        </Box>
    );
}

export default Error;
