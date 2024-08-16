import React from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Paper,
    Grid
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';

const ErrorFallback = ({ error }) => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/dashboard');
        handleRefresh();
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#f5f5f5',
            }}
        >
            <Container maxWidth="md">
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <ErrorOutlineIcon sx={{ fontSize: 120, color: 'error.main' }} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h4" gutterBottom>
                                Oops! Something went wrong.
                            </Typography>
                            <Typography variant="body1" paragraph>
                                We apologize for the inconvenience. An unexpected error has occurred.
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                Error details: {error?.message || 'Unknown error'}
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleGoHome}
                                    sx={{ mr: 2 }}
                                >
                                    Go to Homepage
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={handleRefresh}
                                >
                                    Refresh Page
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
};

export default ErrorFallback;