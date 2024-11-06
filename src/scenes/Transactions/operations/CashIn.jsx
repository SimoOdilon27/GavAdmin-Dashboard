import React, { useEffect, useRef, useState } from 'react';
import { AttachMoney, CheckCircleOutline } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
    Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, FormControl, InputLabel, MenuItem, Select, Snackbar, Stack, TextField, Typography, useMediaQuery, useTheme
} from '@mui/material';
import { Formik } from 'formik';
import { useSelector } from 'react-redux';
import CBS_Services from '../../../services/api/GAV_Sercives';
import { tokens } from '../../../theme';

const CashIn = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const formFieldStyles = (gridColumn = "span 2") => ({
        gridColumn,
        '& .MuiInputLabel-root': {
            color: theme.palette.mode === "dark"
                ? colors.grey[100]
                : colors.black[700],
        },
        '& .MuiFilledInput-root': {
            color: theme.palette.mode === "dark"
                ? colors.grey[100]
                : colors.black[700],
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: theme.palette.mode === "dark"
                ? colors.grey[100]
                : colors.black[100],
        },
    });

    const [pending, setPending] = useState(false);
    const userData = useSelector((state) => state.users);
    const usertoken = userData.token;
    const spaceId = userData?.selectedSpace?.id;

    const [successDialog, setSuccessDialog] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [formValues, setFormValues] = useState(null);
    const [availableBanks, setAvailableBanks] = useState([]);
    const [loadingBanks, setLoadingBanks] = useState(false);
    const [transactionDetails, setTransactionDetails] = useState({
        amount: 0
    });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
    const formikRef = useRef();
    const [initialValues, setInitialValues] = useState({
        amount: 0,
        msisdn: "",
        fee: 0,
        teller: userData?.refId,
        clientBankCode: '',
        tellerBankCode: userData?.bankCode,
    });
    console.log("availableBanks,", availableBanks);

    const generateProcessingId = (msisdn) => {
        const msisdnSuffix = msisdn.slice(-3);
        const date = new Date();
        const formattedDate = date.toISOString().slice(2, 8).replace(/-/g, '');
        const randomNumbers = Math.floor(100 + Math.random() * 900);
        return `${msisdnSuffix}T${formattedDate}${randomNumbers}`;
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    const fetchAvailableBanks = async (msisdn) => {
        setLoadingBanks(true);
        try {
            const clientAccountForm = {
                request: msisdn,
                internalId: "Cash-In"
            };

            const payload = {
                serviceReference: 'GET_CLIENT_ACCOUNT_BY_MSISDN',
                requestBody: JSON.stringify(clientAccountForm),
                spaceId: spaceId,
            };

            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, usertoken);

            if (response?.body?.meta?.statusCode === 200) {
                // Assuming the response contains an array of available banks
                if (Array.isArray(response.body.data)) {
                    setAvailableBanks(response.body.data);
                    showSnackbar("Available banks fetched successfully", 'success');

                    // Reset bank selection when new MSISDN is entered
                    if (formikRef.current) {
                        formikRef.current.setFieldValue('clientBankCode', '');
                    }
                } else {
                    showSnackbar("No banks available for this MSISDN", 'warning');
                    setAvailableBanks([]);
                }
            } else if (response?.body?.status === 401) {
                showSnackbar("Unauthorized to perform action", 'error');
                setAvailableBanks([]);
            } else {
                showSnackbar("Error fetching available banks", 'error');
                setAvailableBanks([]);
            }
        } catch (error) {
            console.error('Error:', error);
            showSnackbar('Error fetching available banks', 'error');
            setAvailableBanks([]);
        } finally {
            setLoadingBanks(false);
        }
    };

    const handleCashin = async (values) => {
        setPending(true);
        try {
            const processingId = generateProcessingId(values.msisdn);
            const payload = {
                serviceReference: 'CASH_IN',
                requestBody: JSON.stringify({
                    ...values,
                    processingId,
                }),
                spaceId: spaceId,
            };
            console.log("payload000", payload);


            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, usertoken);

            if (response?.body?.meta?.statusCode === 200) {
                showSnackbar("Cash In Successful", 'success');
                setTransactionDetails({
                    processingId,
                    amount: values.amount
                });
                setSuccessDialog(true);
                if (formikRef.current) {
                    formikRef.current.resetForm();
                }
                setAvailableBanks([]); // Reset available banks after successful transaction
            } else if (response?.body?.status === 401) {
                showSnackbar('Unauthorized to perform action', 'error');
            } else {
                showSnackbar(response.body.errors || 'Error', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showSnackbar('Error processing cash-in', 'error');
        }
        setPending(false);
    };

    return (
        <Box>
            <Box sx={{ marginLeft: '100px', marginBottom: '10px' }}>
                <Typography variant="h5" color={colors.greenAccent[400]}>
                    Cash In Transaction (Teller Id: {userData?.refId})
                </Typography>
            </Box>

            <Formik
                innerRef={formikRef}
                onSubmit={(values) => {
                    setFormValues(values);
                    setConfirmDialog(true);
                }}
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
                            px: 2,
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
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="MSISDN"
                                    onBlur={handleBlur}
                                    onChange={(e) => {
                                        handleChange(e);
                                        if (e.target.value.length >= 9) {
                                            fetchAvailableBanks(e.target.value);
                                        }
                                    }}
                                    value={values.msisdn}
                                    name="msisdn"
                                    error={!!touched.msisdn && !!errors.msisdn}
                                    helperText={touched.msisdn && errors.msisdn}
                                    sx={formFieldStyles("span 2")}
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
                                    sx={formFieldStyles("span 2")}
                                />

                                <FormControl
                                    fullWidth
                                    variant="filled"
                                    sx={formFieldStyles("span 4")}
                                    disabled={loadingBanks || availableBanks.length === 0}
                                >
                                    <InputLabel>Select Bank</InputLabel>
                                    <Select
                                        label="Select Bank"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.clientBankCode}
                                        name="clientBankCode"
                                        error={!!touched.clientBankCode && !!errors.clientBankCode}
                                    >
                                        <MenuItem value="">
                                            {loadingBanks ? 'Loading banks...' : 'Select a bank'}
                                        </MenuItem>
                                        {availableBanks.map((bank) => (
                                            <MenuItem key={bank.bankCode} value={bank.bankCode}>
                                                {bank.bankCode}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {touched.clientBankCode && errors.clientBankCode && (
                                        <Alert severity="error">{errors.clientBankCode}</Alert>
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
                                    startIcon={<AttachMoney />}
                                    disabled={!values.clientBankCode || loadingBanks}
                                >
                                    Proceed
                                </LoadingButton>
                            </Box>
                        </form>
                    </Box>
                )}
            </Formik>

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmDialog}
                onClose={() => setConfirmDialog(false)}
                PaperProps={{
                    style: {
                        borderRadius: 15,
                        padding: 20,
                        minWidth: 300,
                        maxWidth: 400,
                    },
                }}
            >
                <DialogTitle style={{ textAlign: 'center', color: colors.greenAccent[500] }}>
                    Confirm Cash In
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to proceed with this cash-in transaction?
                    </DialogContentText>
                    {formValues && (
                        <Box mt={2}>
                            <Typography variant="body1" color="textSecondary">
                                Amount: <strong>FCFA {formValues.amount}</strong>
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                MSISDN: <strong>{formValues.msisdn}</strong>
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                Bank: <strong>
                                    {availableBanks.find(bank => bank.bankCode === formValues.clientBankCode)?.bankName}
                                </strong>
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center' }}>
                    <Button
                        onClick={() => setConfirmDialog(false)}
                        variant="outlined"
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            setConfirmDialog(false);
                            if (formValues) {
                                handleCashin(formValues);
                            }
                        }}
                        variant="contained"
                        color="secondary"
                        startIcon={<AttachMoney />}
                    >
                        Confirm Cash In
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success Dialog */}
            <Dialog
                open={successDialog}
                onClose={() => setSuccessDialog(false)}
                PaperProps={{
                    style: {
                        borderRadius: 15,
                        padding: 20,
                        minWidth: 300,
                        maxWidth: 400,
                    },
                }}
            >
                <DialogTitle style={{ textAlign: 'center' }}>
                    <CheckCircleOutline style={{ fontSize: 60, color: colors.greenAccent[500] }} />
                </DialogTitle>
                <DialogContent>
                    <Typography variant="h5" align="center" gutterBottom>
                        Transaction Successful!
                    </Typography>
                    <Typography variant="body1" align="center">
                        Your cash-in transaction has been processed successfully.
                    </Typography>
                    <Box mt={2}>
                        <Typography variant="body2" align="center" color="textSecondary">
                            Transaction ID: {transactionDetails.processingId}
                        </Typography>
                        <Typography variant="body2" align="center" color="textSecondary">
                            Amount: FCFA {transactionDetails.amount}
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center' }}>
                    <Button
                        onClick={() => setSuccessDialog(false)}
                        variant="contained"
                        style={{
                            backgroundColor: colors.greenAccent[500],
                            color: colors.primary[100],
                            borderRadius: 20,
                            padding: '10px 30px',
                        }}
                    >
                        Close
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

export default CashIn