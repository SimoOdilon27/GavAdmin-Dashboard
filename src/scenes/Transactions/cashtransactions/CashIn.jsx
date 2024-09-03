

import React, { useRef, useState } from 'react';
import { AttachMoney, CheckCircleOutline } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
    Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Snackbar, Stack, TextField, Typography, useMediaQuery, useTheme
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
    const [successDialog, setSuccessDialog] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [formValues, setFormValues] = useState(null);
    const [transactionDetails, setTransactionDetails] = useState({
        processingId: '',
        amount: 0
    });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
    const formikRef = useRef();
    const [initialValues, setInitialValues] = useState({
        amount: 0,
        msisdn: "",
        processingId: '',
        fee: 0,
        teller: userData?.refId,
        internalId: "",
        bankCode: ""
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
                requestBody: JSON.stringify(values)
            };

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

    return (
        <Box>
            <Typography variant="h5" color={colors.greenAccent[400]} sx={{ m: "0 10px 15px 5px" }}>
                Cash In Transaction (Teller Id: {userData?.refId})
            </Typography>

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



// import { AttachMoney, CheckCircleOutline, Save } from '@mui/icons-material'
// import { LoadingButton } from '@mui/lab'
// import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Stack, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
// import { Formik } from 'formik'
// import React, { useState } from 'react'
// import { useSelector } from 'react-redux'
// import CBS_Services from '../../../services/api/GAV_Sercives'
// import { tokens } from '../../../theme'

// const CashIn = () => {
//     const theme = useTheme();
//     const colors = tokens(theme.palette.mode);
//     const isNonMobile = useMediaQuery("(min-width:600px)");
//     const [pending, setPending] = useState(false);
//     const userData = useSelector((state) => state.users);
//     const usertoken = userData.token;
//     const [successDialog, setSuccessDialog] = useState(false);
//     const [transactionDetails, setTransactionDetails] = useState({
//         processingId: '',
//         amount: 0
//     });
//     const generateProcessingId = (msisdn) => {
//         const msisdnSuffix = msisdn.slice(-3); // Last 3 digits of the MSISDN
//         const date = new Date();
//         const formattedDate = date.toISOString().slice(2, 8).replace(/-/g, ''); // yyMMdd
//         const randomNumbers = Math.floor(100 + Math.random() * 900); // Generate 3 random digits
//         const processingId = `${msisdnSuffix}T${formattedDate}${randomNumbers}`;
//         console.log(`Processing ID is: ${processingId}`);
//         return processingId;
//     };


//     const [initialValues, setInitialValues] = useState({
//         amount: 0,
//         msisdn: "",
//         processingId: '',
//         fee: 0,
//         teller: userData?.refId,
//         internalId: "",
//         bankCode: ""
//     });

//     const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });


//     // console.log("userdata", userData);

//     const showSnackbar = (message, severity) => {
//         setSnackbar({ open: true, message, severity });
//     };

//     const handleSnackbarClose = (event, reason) => {
//         if (reason === 'clickaway') {
//             return;
//         }
//         setSnackbar({ ...snackbar, open: false });
//     };

//     const handleCloseSuccessDialog = () => {
//         setSuccessDialog(false);
//     };

//     const handleCashin = async (values, { resetForm }) => {

//         setPending(true);
//         try {

//             const processingId = generateProcessingId(values.msisdn);
//             values.processingId = processingId;

//             const payload = {
//                 serviceReference: 'CASH_IN',
//                 requestBody: JSON.stringify(values)
//             }
//             console.log("Values", values);

//             console.log("payload", payload);
//             const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, usertoken);

//             // const response = await CBS_Services('AP', 'api/gav/account/transfer/cash-out', 'POST', updatedCashOutFormData);
//             console.log("initialValues", initialValues);
//             console.log("addresp", response);

//             if (response && response.body.meta.statusCode === 200) {
//                 showSnackbar("Cash In Successfull ", 'success');
//                 setTransactionDetails({
//                     processingId: values.processingId,
//                     amount: values.amount
//                 });
//                 setSuccessDialog(true); // Open the success dialog

//                 resetForm()
//             } else if (response && response.body.status === 401) {
//                 // setErrorMessage(response.body.errors || 'Unauthorized to perform action');
//                 showSnackbar('Unauthorized to perform action', 'error');

//             }
//             else {
//                 // setErrorMessage(response.body.errors || 'Error performing Cash Out');
//                 showSnackbar(response.body.errors || 'Error', 'error');

//             }
//         } catch (error) {
//             console.error('Error:', error);
//             showSnackbar('Error', 'error');
//         }
//         setPending(false);
//     };

//     return (
//         <Box>
//             <Typography variant="h5" color={colors.greenAccent[400]} sx={{ m: "0 10px 15px 5px" }}>
//                 Cash In Transaction (Teller Id: {userData?.refId})
//             </Typography>

//             <Formik
//                 onSubmit={handleCashin}
//                 initialValues={initialValues}
//                 enableReinitialize={true}
//             // validationSchema={checkoutSchema}
//             >
//                 {({
//                     values,
//                     errors,
//                     touched,
//                     handleBlur,
//                     handleChange,
//                     handleSubmit,
//                 }) => (
//                     <form onSubmit={handleSubmit}>
//                         <Box
//                             display="grid"
//                             gap="30px"
//                             gridTemplateColumns="repeat(4, minmax(0, 1fr))"
//                             sx={{
//                                 "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
//                             }}
//                         >

//                             <TextField
//                                 fullWidth
//                                 variant="filled"
//                                 type="text"
//                                 label="MSISDN"
//                                 onBlur={handleBlur}
//                                 onChange={handleChange}
//                                 value={values.msisdn}
//                                 name="msisdn"
//                                 error={!!touched.msisdn && !!errors.msisdn}
//                                 helperText={touched.msisdn && errors.msisdn}
//                                 sx={{ gridColumn: "span 2" }}
//                             />
//                             <TextField
//                                 fullWidth
//                                 variant="filled"
//                                 type="number"
//                                 label="Amount"
//                                 onBlur={handleBlur}
//                                 onChange={handleChange}
//                                 value={values.amount}
//                                 name="amount"
//                                 error={!!touched.amount && !!errors.amount}
//                                 helperText={touched.amount && errors.amount}
//                                 sx={{ gridColumn: "span 2" }}
//                             />


//                             <TextField
//                                 fullWidth
//                                 variant="filled"
//                                 type="text"
//                                 label="Bank Code"
//                                 onBlur={handleBlur}
//                                 onChange={handleChange}
//                                 value={values.bankCode}
//                                 name="bankCode"
//                                 error={!!touched.bankCode && !!errors.bankCode}
//                                 helperText={touched.bankCode && errors.bankCode}
//                                 sx={{ gridColumn: "span 4" }}
//                             />
//                             <TextField
//                                 fullWidth
//                                 variant="filled"
//                                 type="text"
//                                 label="Internal ID"
//                                 onBlur={handleBlur}
//                                 onChange={handleChange}
//                                 value={values.internalId}
//                                 name="internalId"
//                                 error={!!touched.internalId && !!errors.internalId}
//                                 helperText={touched.internalId && errors.internalId}
//                                 sx={{ gridColumn: "span 4" }}
//                             />
//                         </Box>
//                         <Box display="flex" justifyContent="end" mt="20px">
//                             <Stack direction="row" spacing={2}>
//                                 <LoadingButton
//                                     type="submit"
//                                     color="secondary"
//                                     variant="contained"
//                                     loading={pending}
//                                     loadingPosition="start"
//                                     startIcon={<AttachMoney />}
//                                 >
//                                     Confirm
//                                 </LoadingButton>
//                                 {/* <Button
//                                     color="primary"
//                                     variant="contained"
//                                     disabled={pending}
//                                     onClick={() => navigate(-1)}
//                                 >
//                                     Cancel
//                                 </Button> */}
//                             </Stack>
//                         </Box>
//                     </form>
//                 )}
//             </Formik>
//             <Snackbar
//                 open={snackbar.open}
//                 autoHideDuration={6000}
//                 onClose={handleSnackbarClose}
//                 anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
//             >
//                 <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
//                     {snackbar.message}
//                 </Alert>
//             </Snackbar>

//             <Dialog
//                 open={successDialog}
//                 onClose={handleCloseSuccessDialog}
//                 aria-labelledby="success-dialog-title"
//                 PaperProps={{
//                     style: {
//                         borderRadius: 15,
//                         padding: 20,
//                         minWidth: 300,
//                         maxWidth: 400,
//                     },
//                 }}
//             >
//                 <DialogTitle id="success-dialog-title" style={{ textAlign: 'center' }}>
//                     <CheckCircleOutline style={{ fontSize: 60, color: colors.greenAccent[500] }} />
//                 </DialogTitle>
//                 <DialogContent>
//                     <Typography variant="h5" align="center" gutterBottom>
//                         Transaction Successful!
//                     </Typography>
//                     <Typography variant="body1" align="center">
//                         Your cash-in transaction has been processed successfully.
//                     </Typography>
//                     <Box mt={2}>
//                         <Typography variant="body2" align="center" color="textSecondary">
//                             Transaction ID: {transactionDetails.processingId}
//                         </Typography>
//                         <Typography variant="body2" align="center" color="textSecondary">
//                             Amount: FCFA{transactionDetails.amount}
//                         </Typography>
//                     </Box>
//                 </DialogContent>
//                 <DialogActions style={{ justifyContent: 'center' }}>
//                     <Button
//                         onClick={handleCloseSuccessDialog}
//                         variant="contained"
//                         style={{
//                             backgroundColor: colors.greenAccent[500],
//                             color: colors.primary[100],
//                             borderRadius: 20,
//                             padding: '10px 30px',
//                         }}
//                     >
//                         Close
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//         </Box>
//     )
// }

// export default CashIn

