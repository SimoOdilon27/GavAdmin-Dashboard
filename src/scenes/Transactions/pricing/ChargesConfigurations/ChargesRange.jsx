import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, FormControl, InputLabel, MenuItem, Select, Snackbar, Stack, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { tokens } from '../../../../theme';
import CBS_Services from '../../../../services/api/GAV_Sercives';

const ChargesRange = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [pending, setPending] = useState(false);
    const userData = useSelector((state) => state.users);
    const usertoken = userData.token;
    const spaceId = userData?.selectedSpace?.id

    const [pricingData, setPricingData] = useState([]);


    const [initialValues, setInitialValues] = useState({
        chargedFee: 0,
        chargesId: 0,
        minimumAmount: 0,
        maximumAmount: 0
    });

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    const fetchPricingData = async () => {
        setPending(true);
        try {
            const payload = {
                serviceReference: 'GET_ALL_CHARGES',
                requestBody: '',
                spaceId: spaceId,
            }
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, usertoken);

            // const response = await CBS_Services('APE', 'pricing/get/all', 'GET');
            if (response && response.status === 200) {
                setPricingData(response.body.data || []);
            } else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setPending(false);
    };

    useEffect(() => {
        fetchPricingData();
    }, [])

    const handleChargesRange = async (values, { resetForm }) => {
        setPending(true);
        try {
            const payload = {
                serviceReference: 'CHARGES_RANGE',
                requestBody: JSON.stringify(values),
                spaceId: spaceId,
            };

            console.log("Values", values);
            console.log("Payload", payload);

            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, usertoken);

            if (response && response.body.meta.statusCode === 200) {
                showSnackbar("Charges Range Saved Successfully", 'success');
                resetForm(); // Reset form fields to their initial values
            } else if (response && response.body.status === 401) {
                showSnackbar('Unauthorized to perform action', 'error');
            } else {
                showSnackbar(response.body.errors || 'Error', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showSnackbar('Connection Error!!! Try again Later', 'error');
        }
        setPending(false);
    };

    return (
        <Box>
            <Box sx={{ marginLeft: '100px', marginBottom: '10px' }}>

                <Typography variant="h5" color={colors.greenAccent[400]} sx={{ m: "0 10px 15px 5px" }}>
                    Charges Range Configuration
                </Typography>
            </Box>

            <Formik
                onSubmit={handleChargesRange}
                initialValues={initialValues}
                enableReinitialize={true}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                }) => (

                    <Box
                        display="grid"
                        sx={{
                            px: 2, // Optional: horizontal padding for the outer container
                            padding: "10px 100px 20px 100px"

                        }}
                    >
                        <form onSubmit={handleSubmit}>
                            <Box
                                display="grid"
                                gap="30px"
                                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                sx={{
                                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
                                    borderRadius: "10px",
                                    padding: "40px",
                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                                }}
                            >

                                <FormControl fullWidth variant="filled" sx={{
                                    gridColumn: "span 2",
                                    '& .MuiInputLabel-root': {
                                        color: theme.palette.mode === 'light' ? 'black' : 'white', // Dark label for light mode, white for dark mode
                                    },
                                    '& .MuiFilledInput-root': {
                                        color: theme.palette.mode === 'light' ? 'black' : 'white', // Optional: input text color
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: theme.palette.mode === 'light' ? 'black' : 'white', // Same behavior when focused
                                    },
                                }}>
                                    <InputLabel>Charge</InputLabel>
                                    <Select
                                        label="charge"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.chargesId}
                                        name="chargesId"
                                        error={!!touched.chargesId && !!errors.chargesId}
                                    >
                                        <MenuItem value="">Select Charge</MenuItem>
                                        {Array.isArray(pricingData) && pricingData.length > 0 ? (
                                            pricingData.map(option => (
                                                <MenuItem key={option.id} value={option.id}>
                                                    {option.name}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem value="">No Banks available</MenuItem>
                                        )}
                                    </Select>
                                    {touched.chargesId && errors.chargesId && (
                                        <Alert severity="error">{errors.chargesId}</Alert>
                                    )}
                                </FormControl>
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="number"
                                    label="Charged Fee"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.chargedFee}
                                    name="chargedFee"
                                    error={!!touched.chargedFee && !!errors.chargedFee}
                                    helperText={touched.chargedFee && errors.chargedFee}
                                    sx={{
                                        gridColumn: "span 2",
                                        '& .MuiInputLabel-root': {
                                            color: theme.palette.mode === 'light' ? 'black' : 'white', // Dark label for light mode, white for dark mode
                                        },
                                        '& .MuiFilledInput-root': {
                                            color: theme.palette.mode === 'light' ? 'black' : 'white', // Optional: input text color
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: theme.palette.mode === 'light' ? 'black' : 'white', // Same behavior when focused
                                        },
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="number"
                                    label="Minimum Amount"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.minimumAmount}
                                    name="minimumAmount"
                                    error={!!touched.minimumAmount && !!errors.minimumAmount}
                                    helperText={touched.minimumAmount && errors.minimumAmount}
                                    sx={{
                                        gridColumn: "span 2",
                                        '& .MuiInputLabel-root': {
                                            color: theme.palette.mode === 'light' ? 'black' : 'white', // Dark label for light mode, white for dark mode
                                        },
                                        '& .MuiFilledInput-root': {
                                            color: theme.palette.mode === 'light' ? 'black' : 'white', // Optional: input text color
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: theme.palette.mode === 'light' ? 'black' : 'white', // Same behavior when focused
                                        },
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="number"
                                    label="Maximum Amount"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.maximumAmount}
                                    name="maximumAmount"
                                    error={!!touched.maximumAmount && !!errors.maximumAmount}
                                    helperText={touched.maximumAmount && errors.maximumAmount}
                                    sx={{
                                        gridColumn: "span 2",
                                        '& .MuiInputLabel-root': {
                                            color: theme.palette.mode === 'light' ? 'black' : 'white', // Dark label for light mode, white for dark mode
                                        },
                                        '& .MuiFilledInput-root': {
                                            color: theme.palette.mode === 'light' ? 'black' : 'white', // Optional: input text color
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: theme.palette.mode === 'light' ? 'black' : 'white', // Same behavior when focused
                                        },
                                    }}
                                />
                            </Box>
                            <Box display="flex" justifyContent="end" mt="20px">
                                <Stack direction="row" spacing={2}>
                                    <LoadingButton
                                        type="submit"
                                        color="secondary"
                                        variant="contained"
                                        loading={pending}
                                        loadingPosition="start"
                                        startIcon={<Save />}
                                    >
                                        Save
                                    </LoadingButton>
                                </Stack>
                            </Box>
                        </form>
                    </Box>
                )}

            </Formik>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ChargesRange;
