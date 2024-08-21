import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, Snackbar, Stack, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Formik } from 'formik';
import React, { useState } from 'react';
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

    const handleChargesRange = async (values, { resetForm }) => {
        setPending(true);
        try {
            const payload = {
                serviceReference: 'CHARGES_RANGE',
                requestBody: JSON.stringify(values)
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
            <Typography variant="h5" color={colors.greenAccent[400]} sx={{ m: "0 10px 15px 5px" }}>
                Charges Range Configuration
            </Typography>

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
                    <form onSubmit={handleSubmit}>
                        <Box
                            display="grid"
                            gap="30px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            sx={{
                                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                            }}
                        >

                            <TextField
                                fullWidth
                                variant="filled"
                                type="number"
                                label="Charges ID"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.chargesId}
                                name="chargesId"
                                error={!!touched.chargesId && !!errors.chargesId}
                                helperText={touched.chargesId && errors.chargesId}
                                sx={{ gridColumn: "span 2" }}
                            />
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
                                sx={{ gridColumn: "span 2" }}
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
                                sx={{ gridColumn: "span 2" }}
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
                                sx={{ gridColumn: "span 2" }}
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
