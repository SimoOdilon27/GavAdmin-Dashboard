import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Snackbar, Alert, IconButton } from '@mui/material';
import { RemoveRedEye, VisibilityOff } from '@mui/icons-material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CBS_Services from '../../services/api/GAV_Sercives';
import { Images } from "../../constants/index"


const backgroundimg = Images
const USER_TIMEOUT = 90 * 60 * 1000; // 90 minutes

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="/">
                CredixCam
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors({ isError: false, description: '' });

        if (!userCredential.userNameOrEmail) {
            setErrors({ isError: true, description: 'Username is required' });
            return;
        }
        if (!userCredential.password) {
            setErrors({ isError: true, description: 'Password is required' });
            return;
        }

        setUserCredential({ ...userCredential, isSubmit: true });

        try {
            const data = await CBS_Services("GATEWAY", "authentification/login", "POST",
                {
                    userNameOrEmail: userCredential.userNameOrEmail,
                    password: userCredential.password
                },
                ""
            );

            if (data.status === 200) {
                setUserCredential({ userNameOrEmail: '', password: '', isSubmit: false });
                dispatch({ type: "LOGIN", users: data.body.data });

                const loginCount = data.body.data.loginCount || "0";
                const userSpaces = data.body.data.listSpaces || [];

                if (loginCount === "0") {
                    navigate('/updatepassword');
                } else if (userSpaces.length === 1) {
                    dispatch({
                        type: "SELECT_SPACE",
                        selectedSpace: userSpaces[0]
                    });
                    navigate('/dashboard');
                } else if (userSpaces.length === 0) {
                    setErrors({ isError: true, description: "No Spaces Found for this User" });
                }
                else {
                    navigate('/select-space');
                }
            } else {
                setErrors({
                    isError: true,
                    description: data.status === 400
                        ? "Username or password is incorrect"
                        : "An error has occurred please try again later"
                });
                setUserCredential(prev => ({ ...prev, password: '', isSubmit: false }));
            }
        } catch (error) {
            setErrors({
                isError: true,
                description: "An error has occurred please try again later"
            });
            setUserCredential(prev => ({ ...prev, isSubmit: false }));
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserCredential({ ...userCredential, [name]: value });
        setErrors({ isError: false, description: '' });
    };

    React.useEffect(() => {
        const timer = setTimeout(() => {
            dispatch({ type: 'LOGOUT' });
            setSnackbar({
                open: true,
                message: 'Your Session has expired. Login again!',
                severity: 'info'
            });
            navigate('/');
        }, USER_TIMEOUT);

        return () => clearTimeout(timer);
    }, [dispatch, navigate]);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        position: 'relative',
                        backgroundImage: `url(${Images.gav})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)', // dark overlay
                            backdropFilter: 'blur(1px)', // blur effect
                            zIndex: 1,
                        },
                        color: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 4,
                        zIndex: 0, // content above overlay
                    }}
                >
                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2, zIndex: 2 }}>
                        <AdminPanelSettingsIcon sx={{ fontSize: 60 }} />
                        <Typography
                            component="h1"
                            variant="h3"
                            sx={{
                                fontWeight: 700,
                                textShadow: '2px 2px 4px rgba(0,0,0,0.7)', // add shadow to text for more visibility
                                zIndex: 2,
                            }}
                        >
                            GAV ADMIN
                        </Typography>
                    </Box>
                    <Typography
                        variant="h6"
                        align="center"
                        sx={{
                            maxWidth: '600px',
                            mt: 2,
                            textShadow: '1px 1px 3px rgba(0,0,0,0.5)', // add shadow to text for more visibility
                            zIndex: 2,
                        }}
                    >
                        "Streamline your operations and enhance security across all spaces with our comprehensive admin portal."
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',

                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 56, height: 56 }}>
                            <LockOutlinedIcon sx={{ fontSize: 32 }} />
                        </Avatar>
                        <Typography component="h2" variant="h5" sx={{ mb: 3 }}>
                            Sign in
                        </Typography>
                        {errors.isError && (
                            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                                {errors.description}
                            </Alert>
                        )}
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="userNameOrEmail"
                                label="Email Address"
                                name="userNameOrEmail"
                                autoComplete="email"
                                autoFocus
                                value={userCredential.userNameOrEmail}
                                onChange={handleChange}
                                error={errors.isError && !userCredential.userNameOrEmail}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
                                value={userCredential.password}
                                onChange={handleChange}
                                error={errors.isError && !userCredential.password}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <RemoveRedEye /> : <VisibilityOff />}
                                        </IconButton>
                                    ),
                                }}
                            />
                            {/* <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                                sx={{ mt: 1 }}
                            /> */}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, py: 1.5 }}
                                disabled={userCredential.isSubmit}
                            >
                                {userCredential.isSubmit ? 'Signing in...' : 'Sign In'}
                            </Button>
                            {/* <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Link href="#" variant="body2">
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item xs={12} sm={6} sx={{ textAlign: { sm: 'right' } }}>
                                    <Link href="#" variant="body2">
                                        Contact Admin
                                    </Link>
                                </Grid>
                            </Grid> */}
                            <Copyright sx={{ mt: 5 }} />
                        </Box>
                    </Box>
                </Grid>
            </Grid>

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