import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import CBS_Services from '../../services/api/GAV_Sercives';
import { RemoveRedEye, RemoveRedEyeRounded } from '@mui/icons-material';

const USER_TIMEOUT = 90 * 60 * 1000; // 90 minutes

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const defaultTheme = createTheme();

export default function Login() {
    const [userCredential, setUserCredential] = React.useState({
        userNameOrEmail: '',
        password: '',
        isSubmit: false
    });
    const [errors, setErrors] = React.useState({
        isError: false,
        description: ''
    });
    const [showPassword, setShowPassword] = React.useState(false);
    const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: '' });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const connectedUsers = useSelector((state) => state);

    console.log("connectedUsers", connectedUsers);

    const togglePasswordVisibility = (event) => {
        event.preventDefault();
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Clear any existing errors when the form is submitted
        setErrors({ isError: false, description: '' });

        if (userCredential.userNameOrEmail.length === 0) {
            setErrors({ isError: true, description: 'Username is required' });
            return;
        } else if (userCredential.password.length === 0) {
            setErrors({ isError: true, description: 'Password is required' });
            return;
        }

        const formData = {
            userNameOrEmail: userCredential.userNameOrEmail,
            password: userCredential.password
        };

        setUserCredential({ ...userCredential, isSubmit: true });

        try {
            let data = await CBS_Services("GATEWAY", "authentification/login", "POST", formData, "");

            if (data.status === 200) {
                setUserCredential({ userNameOrEmail: '', password: '', isSubmit: false });

                const users = data.body.data;

                const action = {
                    type: "LOGIN",
                    users: users
                };
                dispatch(action);

                const loginCount = data.body.data.loginCount || "0";

                if (loginCount === "1") {
                    // User is logging in for the first time, redirect to "/updatepassword"
                    navigate('/updatepassword');
                }
                else {
                    // Continue with the login process
                    // User can navigate freely to the dashboard after authentication
                    navigate('/dashboard');

                }
                // navigate('/dashboard');
            } else if (data.status === 401) {
                setErrors({ isError: true, description: ("Username or password is incorrect" || data.body.message) });
                setUserCredential({ ...userCredential, password: '', isSubmit: false });
            } else {
                setErrors({ isError: true, description: "An error has occurred please try again later" });
                setUserCredential({ ...userCredential, isSubmit: false });
            }
        } catch (error) {
            setErrors({ isError: true, description: "An error has occurred please try again later" });
            setUserCredential({ ...userCredential, isSubmit: false });
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserCredential({ ...userCredential, [name]: value });
        setErrors({ isError: false, description: '' }); // Clear errors on input change
    };

    React.useEffect(() => {
        const timer = setTimeout(() => {
            dispatch({ type: 'LOGOUT' });
            setSnackbar({ open: true, message: 'Your Session has expired.Login again!!!.', severity: 'info' });
            navigate('/');
        }, USER_TIMEOUT);

        return () => {
            clearTimeout(timer);
        };
    }, [dispatch, navigate]);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    {errors.isError && (
                        <Typography variant="body2" color="error">
                            {errors.description}
                        </Typography>
                    )}
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="userNameOrEmail"
                            label="Email Address"
                            name="userNameOrEmail"
                            autoComplete="email"
                            autoFocus
                            onChange={handleChange}
                            value={userCredential.userNameOrEmail}
                        />
                        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
                                onChange={handleChange}
                                value={userCredential.password}
                            />
                            <Button
                                onClick={togglePasswordVisibility}
                                sx={{
                                    position: 'absolute',
                                    right: 5,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                {showPassword ? <RemoveRedEye /> : <RemoveRedEyeRounded />}
                            </Button>
                        </Box>

                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={userCredential.isSubmit}
                        >
                            {userCredential.isSubmit ? 'Loading...' : 'Sign In'}
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
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
}
