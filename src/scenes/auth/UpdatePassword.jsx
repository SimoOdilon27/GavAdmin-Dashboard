import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Avatar,
    CssBaseline,
    Snackbar,
    Alert,
    Grid,
    Link,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CBS_Services from '../../services/api/GAV_Sercives';

const theme = createTheme();

const UpdatePassword = () => {
    const userData = useSelector((state) => state.users)

    const token = userData.token
    const [passwords, setPasswords] = useState({
        usernameOrEmail: userData.userName,
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });


    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

    const navigate = useNavigate();



    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords({ ...passwords, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!passwords.oldPassword) newErrors.oldPassword = 'Old password is required';
        if (!passwords.newPassword) newErrors.newPassword = 'New password is required';
        if (!passwords.confirmNewPassword) newErrors.confirmNewPassword = 'Confirm new password is required';
        if (passwords.newPassword !== passwords.confirmNewPassword) {
            newErrors.confirmNewPassword = 'Passwords do not match';
        }
        // if (passwords.newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters long';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setIsSubmitting(true);
            try {
                const response = await CBS_Services('GATEWAY', 'authentification/changePassword', 'POST', passwords, token);

                console.log("reponse=====", response);
                console.log("passwords=====", passwords);


                if (response.status === 200) {
                    setSnackbar({
                        open: true,
                        message: 'Password updated successfully!',
                        severity: 'success',
                    });
                    setTimeout(() => {
                        navigate('/');
                    }, 2000);
                } else {
                    setSnackbar({
                        open: true,
                        message: response.body.message || 'An error occurred. Please try again.',
                        severity: 'error',
                    });
                }
            } catch (error) {
                setSnackbar({
                    open: true,
                    message: 'A Connection error occurred. Please try again.',
                    severity: 'error',
                });
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Paper
                    elevation={6}
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: 5,
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Update Your Password
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="oldPassword"
                            label="Old Password"
                            type="password"
                            id="oldPassword"
                            autoComplete="current-password"
                            value={passwords.oldPassword}
                            onChange={handleChange}
                            error={!!errors.oldPassword}
                            helperText={errors.oldPassword}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="newPassword"
                            label="New Password"
                            type="password"
                            id="newPassword"
                            value={passwords.newPassword}
                            onChange={handleChange}
                            error={!!errors.newPassword}
                            helperText={errors.newPassword}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmNewPassword"
                            label="Confirm New Password"
                            type="password"
                            id="confirmNewPassword"
                            value={passwords.confirmNewPassword}
                            onChange={handleChange}
                            error={!!errors.confirmNewPassword}
                            helperText={errors.confirmNewPassword}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Updating...' : 'Update Password'}
                        </Button>

                        <Grid container>
                            <Grid item xs>
                                <Link href="/" variant="body2" >
                                    Login
                                </Link>
                            </Grid>
                            {/* <Grid item>
                                <Link href="#" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid> */}
                        </Grid>
                    </Box>
                </Paper>
            </Container>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </ThemeProvider>
    );
};

export default UpdatePassword;