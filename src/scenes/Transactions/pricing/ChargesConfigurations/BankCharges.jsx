import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Snackbar, Stack, Switch, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { tokens } from '../../../../theme';
import CBS_Services from '../../../../services/api/GAV_Sercives';

const BankCharges = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [pending, setPending] = useState(false);
    const userData = useSelector((state) => state.users);
    const usertoken = userData.token;
    const spaceId = userData?.selectedSpace?.id

    const [bankID, setBankID] = useState([]);

    const [initialValues, setInitialValues] = useState({
        bankId: "",
        description: "",
        name: "",
        percentage: 0,
        active: true,
        chargesAppliesByPercentage: true
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

    const handleBankCharges = async (values, { resetForm }) => {
        setPending(true);
        try {
            const payload = {
                serviceReference: 'BANK_CHARGES',
                requestBody: JSON.stringify(values),
                spaceId: spaceId,
            };

            console.log("Values", values);
            console.log("Payload", payload);

            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, usertoken);

            if (response && response.body.meta.statusCode === 200) {
                showSnackbar("Bank Charges Saved Successfully", 'success');
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

    const fetchBankID = async () => {
        try {
            const payload = {
                serviceReference: 'GET_ALL_BANKS',
                requestBody: '',
                spaceId: spaceId,
            };
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, usertoken);
            console.log("fetchbankid", response);

            if (response && response.body.meta.statusCode === 200) {
                setBankID(response.body.data);
            } else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchBankID();
    }, [])

    return (
        <Box>
            <Box sx={{ marginLeft: '100px', marginBottom: '10px' }}>

                <Typography variant="h5" color={colors.greenAccent[400]} sx={{ m: "0 10px 15px 5px" }}>
                    Bank Charges Configuration
                </Typography>
            </Box>

            <Formik
                onSubmit={handleBankCharges}
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
                                {/* <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Bank ID"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.bankId}
                                name="bankId"
                                error={!!touched.bankId && !!errors.bankId}
                                helperText={touched.bankId && errors.bankId}
                                sx={{ gridColumn: "span 4" }}
                            /> */}

                                <FormControl fullWidth variant="filled" sx={{
                                    gridColumn: "span 4",
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
                                    <InputLabel>Bank</InputLabel>
                                    <Select
                                        label="Bank"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.bankId}
                                        name="bankId"
                                        error={!!touched.bankId && !!errors.bankId}
                                    >
                                        <MenuItem value="">Select Bank</MenuItem>
                                        {Array.isArray(bankID) && bankID.length > 0 ? (
                                            bankID.map(option => (
                                                <MenuItem key={option.bankId} value={option.bankId}>
                                                    {option.bankName}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem value="">No Banks available</MenuItem>
                                        )}
                                    </Select>
                                    {touched.bankId && errors.bankId && (
                                        <Alert severity="error">{errors.bankId}</Alert>
                                    )}
                                </FormControl>
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.name}
                                    name="name"
                                    error={!!touched.name && !!errors.name}
                                    helperText={touched.name && errors.name}
                                    sx={{
                                        gridColumn: "span 4",
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
                                    type="text"
                                    label="Description"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.description}
                                    name="description"
                                    error={!!touched.description && !!errors.description}
                                    helperText={touched.description && errors.description}
                                    sx={{
                                        gridColumn: "span 4",
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
                                    label="Percentage"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.percentage}
                                    name="percentage"
                                    error={!!touched.percentage && !!errors.percentage}
                                    helperText={touched.percentage && errors.percentage}
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
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={values.chargesAppliesByPercentage}
                                            onChange={handleChange}
                                            name="chargesAppliesByPercentage"
                                            color="secondary"
                                        />
                                    }
                                    label="Charges Applies By Percentage"
                                    sx={{
                                        gridColumn: "span 1",
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
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={values.active}
                                            onChange={handleChange}
                                            name="active"
                                            color="secondary"
                                        />
                                    }
                                    label="Active"
                                    sx={{
                                        gridColumn: "span 1",
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

export default BankCharges;
