import * as React from 'react';
import {
    Container,
    Paper,
    Typography,
    FormControl,
    Select,
    MenuItem,
    Button,
    Box,
    CssBaseline
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

const SpaceSelector = () => {
    const [selectedSpace, setSelectedSpace] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    // Get spaces from location state or Redux store
    const userSpaces = useSelector(state => state.users?.listSpaces) || [];
    console.log("userSpaces", userSpaces);


    const handleSpaceChange = (event) => {
        setSelectedSpace(event.target.value);
    };

    const handleContinue = () => {
        if (selectedSpace) {
            setLoading(true);
            // Dispatch action to store selected space
            dispatch({
                type: "SELECT_SPACE",
                selectedSpace: selectedSpace
            });
            // Navigate to dashboard
            navigate('/dashboard');
        }
    };

    const handleLogout = () => {

        dispatch({
            type: 'LOGOUT',
            users: {},
        })
        console.log('Logout');
        navigate('/')
    }

    // Redirect if no spaces available
    React.useEffect(() => {
        if (!userSpaces || userSpaces.length === 0) {
            navigate('/');
        }
    }, [userSpaces, navigate]);

    return (
        <Container component="main" maxWidth="sm">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Typography component="h1" variant="h5" gutterBottom>
                        Select Your Space
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Choose a space to continue to the dashboard
                    </Typography>

                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <Select
                            value={selectedSpace}
                            onChange={handleSpaceChange}
                            displayEmpty
                            disabled={loading}
                        >
                            <MenuItem value="" disabled>
                                Select a space
                            </MenuItem>
                            {userSpaces.map((space) => (
                                <MenuItem key={space?.id} value={space}>
                                    {space.intitule}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleContinue}
                        disabled={!selectedSpace || loading}
                        sx={{ mt: 2 }}
                    >
                        {loading ? 'Loading...' : 'Continue to Dashboard'}
                    </Button>
                </Paper>
                <Box>
                    <Button
                        fullWidth
                        variant="contained"
                        color='secondary'
                        onClick={handleLogout}
                        sx={{ mt: 2 }}
                    >
                        LogOut
                    </Button>
                </Box>

            </Box>
        </Container>
    );
};

export default SpaceSelector;