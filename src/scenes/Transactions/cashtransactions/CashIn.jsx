import { AttachMoney, Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Alert, Box, Button, Snackbar, Stack, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import { Formik } from 'formik'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import CBS_Services from '../../../services/api/GAV_Sercives'
import { tokens } from '../../../theme'

const CashIn = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [pending, setPending] = useState(false);
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState({
        amount: 0,
        msisdn: "",
        teller: "",
        internalId: "",
        bankCode: ""
    });

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

    const userData = useSelector((state) => state.users);
    const usertoken = userData.token;

    // console.log("userdata", userData);

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    const handleCashin = async () => {

        setPending(true);
        try {

            const payload = {
                serviceReference: 'CASH_IN',
                requestBody: JSON.stringify(initialValues)
            }

            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, usertoken);

            // const response = await CBS_Services('AP', 'api/gav/account/transfer/cash-out', 'POST', updatedCashOutFormData);
            console.log("initialValues", initialValues);
            console.log("addresp", response);

            if (response && response.body.meta.statusCode === 200) {
                showSnackbar("Cash In Successfull ", 'success');

            } else if (response && response.status === 401) {
                // setErrorMessage(response.body.errors || 'Unauthorized to perform action');
                showSnackbar(response.body.errors || 'Unauthorized to perform action', 'error');

            }
            else {
                // setErrorMessage(response.body.errors || 'Error performing Cash Out');
                showSnackbar(response.body.errors || 'Error', 'error');

            }
        } catch (error) {
            console.error('Error:', error);
            // setErrorMessage('Error adding teller');
        }
        setPending(false);
    };

    return (
        <Box>
            <Typography variant="h5" color={colors.greenAccent[400]} sx={{ m: "0 10px 15px 5px" }}>
                Cash In Transaction
            </Typography>

            <Formik
                onSubmit={handleCashin}
                initialValues={initialValues}
                enableReinitialize={true}
            // validationSchema={checkoutSchema}
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
                                label="MSISDN"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.msisdn}
                                name="msisdn"
                                error={!!touched.msisdn && !!errors.msisdn}
                                helperText={touched.msisdn && errors.msisdn}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="number"
                                label="Amount"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.amount}
                                name="amount"
                                error={!!touched.amount && !!errors.amount}
                                helperText={touched.amount && errors.amount}
                                sx={{ gridColumn: "span 2" }}
                            />

                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Teller"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.teller}
                                name="teller"
                                error={!!touched.teller && !!errors.teller}
                                helperText={touched.teller && errors.teller}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Internal ID"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.internalId}
                                name="internalId"
                                error={!!touched.internalId && !!errors.internalId}
                                helperText={touched.internalId && errors.internalId}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Bank Code"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.bankCode}
                                name="bankCode"
                                error={!!touched.bankCode && !!errors.bankCode}
                                helperText={touched.bankCode && errors.bankCode}
                                sx={{ gridColumn: "span 4" }}
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
                                    startIcon={<AttachMoney />}
                                >
                                    Confirm
                                </LoadingButton>
                                {/* <Button
                                    color="primary"
                                    variant="contained"
                                    disabled={pending}
                                    onClick={() => navigate(-1)}
                                >
                                    Cancel
                                </Button> */}
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

export default CashIn
