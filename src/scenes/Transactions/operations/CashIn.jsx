

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
    const [pending, setPending] = useState(false);
    const userData = useSelector((state) => state.users);
    const usertoken = userData.token;
    const spaceId = userData?.selectedSpace?.id

    const [successDialog, setSuccessDialog] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [formValues, setFormValues] = useState(null);
    const [bankCode, setBankCode] = useState('');
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
        clientBankCode: "",
        tellerBankCode: userData?.bankCode,
    });

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

    const handleCloseSuccessDialog = () => {
        setSuccessDialog(false);
    };

    const handleConfirmDialogClose = () => {
        setConfirmDialog(false);
    };

    const handleCashin = async (values) => {
        setPending(true);
        try {
            const processingId = generateProcessingId(values.msisdn);
            values.processingId = processingId;

            const payload = {
                serviceReference: 'CASH_IN',
                requestBody: JSON.stringify(values),
                spaceId: spaceId,
            };
            console.log("payload", payload);


            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, usertoken);

            if (response && response.body.meta.statusCode === 200) {
                showSnackbar("Cash In Successful", 'success');
                setTransactionDetails({
                    processingId: values.processingId,
                    amount: values.amount
                });
                setSuccessDialog(true);
                if (formikRef.current) {
                    formikRef.current.resetForm();
                }
            } else if (response && response.body.status === 401) {
                showSnackbar('Unauthorized to perform action', 'error');
            } else {
                showSnackbar(response.body.errors || 'Error', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showSnackbar('Error', 'error');
        }
        setPending(false);
    };

    useEffect(() => {
        fetchBankID();
    }, [])

    const fetchBankID = async () => {
        try {
            const payload = {
                serviceReference: 'GET_ALL_BANKS',
                requestBody: '',
                spaceId: spaceId,
            }
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, usertoken);

            // const response = await CBS_Services('AP', `api/gav/bank/getAll`, 'GET', null);
            console.log("fetchbankid", response);

            if (response && response.status === 200) {
                setBankCode(response.body.data);

            } else if (response && response.body.status === 401) {
                showSnackbar("Unauthorized to perform action", 'success');

            }
            else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Box>
            <Box sx={{ marginLeft: '100px', marginBottom: '10px' }}>
                <Typography variant="h5" color={colors.greenAccent[400]} >
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
                                    label="Amount"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.amount}
                                    name="amount"
                                    error={!!touched.amount && !!errors.amount}
                                    helperText={touched.amount && errors.amount}
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
                                        value={values.clientBankCode}
                                        name="clientBankCode"
                                        error={!!touched.clientBankCode && !!errors.clientBankCode}
                                    >
                                        <MenuItem value="">Select Bank</MenuItem>
                                        {Array.isArray(bankCode) && bankCode.length > 0 ? (
                                            bankCode.map(option => (
                                                <MenuItem key={option.bankCode} value={option.bankCode}>
                                                    {option.bankName}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem value="">No Banks available</MenuItem>
                                        )}
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
                onClose={handleConfirmDialogClose}
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
                        </Box>
                    )}
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center' }}>
                    <Button
                        onClick={handleConfirmDialogClose}
                        variant="outlined"
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            handleConfirmDialogClose();
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
                onClose={handleCloseSuccessDialog}
                aria-labelledby="success-dialog-title"
                PaperProps={{
                    style: {
                        borderRadius: 15,
                        padding: 20,
                        minWidth: 300,
                        maxWidth: 400,
                    },
                }}
            >
                <DialogTitle id="success-dialog-title" style={{ textAlign: 'center' }}>
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
                        onClick={handleCloseSuccessDialog}
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

export default CashIn;




