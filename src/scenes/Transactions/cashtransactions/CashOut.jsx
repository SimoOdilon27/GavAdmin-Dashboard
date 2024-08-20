import { MoneyOff, Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Checkbox, Snackbar, Stack, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CBS_Services from '../../../services/api/GAV_Sercives';
import { useSelector } from 'react-redux';
import { tokens } from '../../../theme';

const CashOut = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [pending, setPending] = useState(false);
    const navigate = useNavigate();
    const [withdrawWithCni, setWithdrawWithCni] = useState(false); // State to track checkbox
    const userData = useSelector((state) => state.users);
    const usertoken = userData.token;

    const [initialValues, setInitialValues] = useState({
        amount: 0,
        msisdn: "",
        teller: userData?.refId,
        internalId: "",
        bankCode: "",
        cniNumber: "" // Add cniNumber to initialValues
    });
    const [ConfirmcashOutFormData, setConfirmCashOutFormData] = useState({
        msisdn: '',
        token: ''
    });
    const [showModal, setShowModal] = useState(false);
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

    const handleConfirmChange = (e) => {
        const { name, value } = e.target;
        setConfirmCashOutFormData({
            ...ConfirmcashOutFormData,
            [name]: value
        });
    };

    const handleCheckboxChange = (e) => {
        setWithdrawWithCni(e.target.checked);
    };

    const handleCashOut = async (values) => {
        setPending(true);
        try {
            const payload = {
                serviceReference: withdrawWithCni ? 'CASH_OUT_WITH_CNI' : 'CASH_OUT',
                requestBody: JSON.stringify(values)
            };

            console.log("payload", payload);
            console.log("initialValues", values);

            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, usertoken);
            console.log("addresp", response);

            if (response && response.body.meta.statusCode === 200) {
                if (!withdrawWithCni) {
                    setConfirmCashOutFormData({
                        ...ConfirmcashOutFormData,
                        msisdn: values.msisdn // Set the MSISDN from the initial form
                    });
                    console.log("confirmCashOutFormData", ConfirmcashOutFormData);

                    handleToggleModal(); // Show modal only for CASH_OUT
                } else {
                    showSnackbar('Cash Out with CNI successful', 'success');
                }
            } else {
                showSnackbar(response.body.errors || 'Error performing Cash Out', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showSnackbar('Error During CashOut', 'error');
        }
        setPending(false);
    };

    const handleConfirmCashOut = async () => {
        setPending(true);
        try {
            const payload = {
                serviceReference: 'CONFIRM_CASHOUT',
                requestBody: JSON.stringify(ConfirmcashOutFormData)
            };

            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, usertoken);
            handleToggleModal();
            console.log("cashOutFormData", ConfirmcashOutFormData);
            console.log("addresp", response);

            if (response && response.body.meta.statusCode === 200) {
                showSnackbar('Cash Out successful', 'success');
            } else {
                showSnackbar(response.body.errors || 'Unauthorized to perform action', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showSnackbar('Error occurred while confirming cash out. Please try again later.', 'error');
        }
        setPending(false);
    };

    const handleToggleModal = () => {
        setShowModal(!showModal);
    };

    return (
        <Box>
            <Typography variant="h5" color={colors.greenAccent[400]} sx={{ m: "0 10px 15px 5px" }}>
                Cash Out Transaction (Teller Id: {userData?.refId})
            </Typography>
            <Formik
                onSubmit={handleCashOut}
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

                            {/* <TextField
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
                                disabled
                            /> */}


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
                                sx={{ gridColumn: "span 4" }}
                            />


                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={withdrawWithCni}
                                        onChange={handleCheckboxChange}
                                        name="withdrawWithCni"
                                        color="secondary"
                                    />
                                }
                                label="Withdraw with CNI"
                                sx={{ gridColumn: "span 4" }}
                            />

                            {withdrawWithCni && (
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="CNI Number"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.cniNumber}
                                    name="cniNumber"
                                    error={!!touched.cniNumber && !!errors.cniNumber}
                                    helperText={touched.cniNumber && errors.cniNumber}
                                    sx={{ gridColumn: "span 4" }}
                                />
                            )}
                        </Box>

                        <Box display="flex" justifyContent="end" mt="20px">
                            <Stack direction="row" spacing={2}>
                                <LoadingButton
                                    type="submit"
                                    color="secondary"
                                    variant="contained"
                                    loading={pending}
                                    loadingPosition="start"
                                    startIcon={<MoneyOff />}
                                >
                                    Confirm
                                </LoadingButton>
                            </Stack>
                        </Box>
                    </form>
                )}
            </Formik>

            <Dialog open={showModal} onClose={handleToggleModal} fullWidth>
                <DialogTitle>Enter Token</DialogTitle>
                <DialogContent>
                    <form noValidate autoComplete="off">

                        {/* <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="MSISDN"
                            value={ConfirmcashOutFormData.msisdn}
                            disabled
                            sx={{ gridColumn: "span 4", marginBottom: 2 }}
                        /> */}
                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Enter Token"
                            onChange={handleConfirmChange}
                            name="token"
                            value={ConfirmcashOutFormData.token}
                            sx={{ gridColumn: "span 4" }}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmCashOut} variant="contained" color="primary">
                        {pending ? <CircularProgress size={24} /> : <Save />} Confirm Cash Out
                    </Button>
                    <Button onClick={handleToggleModal} variant="outlined" color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

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

export default CashOut;
