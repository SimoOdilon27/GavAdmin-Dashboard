import { CheckCircleOutline, MoneyOff, Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Checkbox, Snackbar, Stack, TextField, Typography, useMediaQuery, useTheme, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CBS_Services from '../../../services/api/GAV_Sercives';
import { useSelector } from 'react-redux';
import { tokens } from '../../../theme';

const CashOut = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [pending, setPending] = useState(false);
    const [withdrawWithCni, setWithdrawWithCni] = useState(false); // State to track checkbox
    const userData = useSelector((state) => state.users);
    const usertoken = userData.token;
    const spaceId = userData?.selectedSpace?.id

    const [bankCode, setBankCode] = useState('');
    const [successDialog, setSuccessDialog] = useState(false);
    const [transactionDetails, setTransactionDetails] = useState({
        amount: 0
    });
    const [initialValues, setInitialValues] = useState({
        amount: 0,
        msisdn: "",
        teller: userData?.refId,
        internalId: "1111",
        cniNumber: "", // Add cniNumber to initialValues
        clientBankCode: "",
        tellerBankCode: userData?.bankCode,
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
    const handleCloseSuccessDialog = () => {
        setSuccessDialog(false);
    };

    const handleCashOut = async (values, { resetForm }) => {
        setPending(true);
        try {
            const payload = {
                serviceReference: withdrawWithCni ? 'CASH_OUT_WITH_CNI' : 'CASH_OUT',
                requestBody: JSON.stringify(values),
                spaceId: spaceId,
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
                    // showSnackbar('Cash Out with CNI successful', 'success');
                    setTransactionDetails({
                        amount: values.amount
                    });
                    setSuccessDialog(true); // Open the success dialog
                }
                resetForm()
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
                requestBody: JSON.stringify(ConfirmcashOutFormData),
                spaceId: spaceId,
            };

            console.log("payload", payload);


            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, usertoken);
            handleToggleModal();
            console.log("cashOutFormData", ConfirmcashOutFormData);
            console.log("addrespcashOut", response);

            if (response && response.body.meta.statusCode === 200) {
                showSnackbar('Cash Out successful', 'success');

                setSuccessDialog(true); // Open the success dialog
                setConfirmCashOutFormData({
                    msisdn: '',
                    token: ''
                })
            } else {
                showSnackbar(response.body.errors || 'Unauthorized to perform action', 'error');

            }
        } catch (error) {
            console.error('Error:', error);
            showSnackbar('Error occurred while confirming cash out. Please try again later.', 'error');
            setSuccessDialog(true); // Open the success dialog

        }
        setPending(false);
    };

    const handleToggleModal = () => {
        setShowModal(!showModal);

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

                <Typography variant="h5" color={colors.greenAccent[400]} sx={{ m: "0 10px 15px 5px" }}>
                    Cash Out Transaction (Teller Id: {userData?.refId})
                </Typography>
            </Box>
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
                    </Box>
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
                        Your cash-out transaction has been processed successfully.
                    </Typography>
                    {/* <Box mt={2}>

                        <Typography variant="body2" align="center" color="textSecondary">
                            Amount: FCFA{transactionDetails.amount}
                        </Typography>
                    </Box> */}
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
        </Box>
    );
};

export default CashOut;
