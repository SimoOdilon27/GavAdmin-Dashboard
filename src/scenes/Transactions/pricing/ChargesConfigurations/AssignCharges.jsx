import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, FormControl, InputLabel, MenuItem, Select, Snackbar, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { tokens } from '../../../../theme';
import CBS_Services from '../../../../services/api/GAV_Sercives';

const AssignCharges = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [pending, setPending] = useState(false);
    const userData = useSelector((state) => state.users);
    const usertoken = userData.token;
    const [servicesID, setServicesID] = useState([]);
    const [pricingData, setPricingData] = useState([]);

    const [initialValues, setInitialValues] = useState({
        serviceId: "",
        chargesId: 0
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

    const handleAssignCharges = async (values, { resetForm }) => {
        setPending(true);
        try {
            const payload = {
                serviceReference: 'ASSIGN_CHARGES1',
                requestBody: JSON.stringify(values)
            };

            console.log("Values", values);
            console.log("Payload", payload);

            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, usertoken);

            if (response && response.body.meta.statusCode === 200) {
                showSnackbar("Charges Assigned Successfully", 'success');
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

    const fetchServices = async () => {
        try {
            const payload = {
                serviceReference: 'GET_ALL_CONFIGURED_SERVICES',
                requestBody: ''
            };
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, usertoken);
            console.log("fetchbankid", response);

            if (response && response.body.meta.statusCode === 200) {
                setServicesID(response.body.data);
            } else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchPricingData = async () => {
        setPending(true);
        try {
            const payload = {
                serviceReference: 'GET_ALL_CHARGES',
                requestBody: ''
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
        fetchServices();
        fetchPricingData();
    }, [])

    return (
        <Box>
            <Typography variant="h5" color={colors.greenAccent[400]} sx={{ m: "0 10px 15px 5px" }}>
                Assign Charges
            </Typography>

            <Formik
                onSubmit={handleAssignCharges}
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
                    <form onSubmit={handleSubmit}>
                        <Box
                            display="grid"
                            gap="30px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            sx={{
                                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                            }}
                        >

                            <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 2" }}>
                                <InputLabel>Service</InputLabel>
                                <Select
                                    label="Service"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.serviceId}
                                    name="serviceId"
                                    error={!!touched.serviceId && !!errors.serviceId}
                                >
                                    <MenuItem value="">Select Service</MenuItem>
                                    {Array.isArray(servicesID) && servicesID.length > 0 ? (
                                        servicesID.map(option => (
                                            <MenuItem key={option} value={option}>
                                                {option}
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


                            <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 2" }}>
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
                                {touched.bankId && errors.bankId && (
                                    <Alert severity="error">{errors.bankId}</Alert>
                                )}
                            </FormControl>

                        </Box>
                        <Box display="flex" justifyContent="end" mt="20px">
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
                        </Box>
                    </form>
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
    )
}

export default AssignCharges;
