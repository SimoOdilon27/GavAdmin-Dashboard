import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, FormControlLabel, Snackbar, Stack, Switch, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { tokens } from '../../../../theme';
import CBS_Services from '../../../../services/api/GAV_Sercives';

const OtherCharges = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [pending, setPending] = useState(false);
    const userData = useSelector((state) => state.users);
    const usertoken = userData.token;

    const [initialValues, setInitialValues] = useState({
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

    const handleOtherCharges = async (values, { resetForm }) => {
        setPending(true);
        try {
            const payload = {
                serviceReference: 'OTHER_CHARGES1',
                requestBody: JSON.stringify(values)
            };

            console.log("Values", values);
            console.log("Payload", payload);

            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, usertoken);

            if (response && response.body.meta.statusCode === 200) {
                showSnackbar("Other Charges Saved Successfully", 'success');
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
                Other Charges Configuration
            </Typography>

            <Formik
                onSubmit={handleOtherCharges}
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
                                type="text"
                                label="Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.name}
                                name="name"
                                error={!!touched.name && !!errors.name}
                                helperText={touched.name && errors.name}
                                sx={{ gridColumn: "span 4" }}
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
                                sx={{ gridColumn: "span 4" }}
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
                                sx={{ gridColumn: "span 2" }}
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
                                sx={{ gridColumn: "span 1" }}
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
                                sx={{ gridColumn: "span 1" }}
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
    )
}

export default OtherCharges;
