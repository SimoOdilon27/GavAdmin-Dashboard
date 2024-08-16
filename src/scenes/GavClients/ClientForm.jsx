import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Select, Snackbar, Stack, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import { Save } from "@mui/icons-material";
import CBS_Services from "../../services/api/GAV_Sercives";
import Header from "../../components/Header";

const ClientForm = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const { msisdn } = useParams();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.users);
    const token = userData.token;
    const [initialValues, setInitialValues] = useState({
        msisdn: "",
        branchId: "",
        bankId: "",
        cbsAccountNumber: "",
        maximumAccountLimit: 0,
        minimumAccountLimit: 0,
        internalId: "",
        otherCbs: true
    });
    const [pending, setPending] = useState(false);
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

    const handleFormSubmit = async (values) => {
        setPending(true);
        try {
            let response;
            if (msisdn) {
                // Update existing client account
                response = await CBS_Services('APE', 'client/addOrUpdate', 'POST', values);

                if (response && response.status === 200) {
                    showSnackbar('Client Account Edited Successfully.', 'success');
                } else {
                    showSnackbar(response.body.errors || 'Error Editing Client Account', 'error');
                }
            } else {
                // Add new client account
                response = await CBS_Services('APE', 'client/addOrUpdate', 'POST', values);

                if (response && response.status === 200) {
                    showSnackbar('Client Account Created Successfully.', 'success');
                } else {
                    showSnackbar(response.body.errors || 'Error Adding Client Account', 'error');
                }
            }

            if (response && response.status === 200) {
                navigate("/client-list"); // Navigate back to the client list
            }
        } catch (error) {
            console.error("Error:", error);
            showSnackbar('Error Try Again Later', 'error');
        }
        setPending(false);
    };

    useEffect(() => {
        if (msisdn) {
            // Fetch the existing client account by ID to populate the form for editing
            CBS_Services("APE", `api/gav/client/getClientByMsisdn`, "POST", null)
                .then((response) => {
                    if (response && response.status === 200) {
                        setInitialValues(response.body.data);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching client account:", error);
                });
        }
    }, [msisdn, token]);

    return (
        <Box m="20px">
            <Header
                title={msisdn ? "EDIT CLIENT ACCOUNT" : "ADD CLIENT ACCOUNT"}
                subtitle={msisdn ? "Edit the client account" : "Add a new client account"}
            />

            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                enableReinitialize={true}
                validationSchema={checkoutSchema}
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
                                type="text"
                                label="Branch ID"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.branchId}
                                name="branchId"
                                error={!!touched.branchId && !!errors.branchId}
                                helperText={touched.branchId && errors.branchId}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
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
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="CBS Account Number"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.cbsAccountNumber}
                                name="cbsAccountNumber"
                                error={!!touched.cbsAccountNumber && !!errors.cbsAccountNumber}
                                helperText={touched.cbsAccountNumber && errors.cbsAccountNumber}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="number"
                                label="Maximum Account Limit"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.maximumAccountLimit}
                                name="maximumAccountLimit"
                                error={!!touched.maximumAccountLimit && !!errors.maximumAccountLimit}
                                helperText={touched.maximumAccountLimit && errors.maximumAccountLimit}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="number"
                                label="Minimum Account Limit"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.minimumAccountLimit}
                                name="minimumAccountLimit"
                                error={!!touched.minimumAccountLimit && !!errors.minimumAccountLimit}
                                helperText={touched.minimumAccountLimit && errors.minimumAccountLimit}
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
                            <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 2" }}>
                                <InputLabel>Other CBS</InputLabel>
                                <Select
                                    label="Other CBS"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.otherCbs}
                                    name="otherCbs"
                                    error={!!touched.otherCbs && !!errors.otherCbs}
                                >
                                    <MenuItem value={true}>Yes</MenuItem>
                                    <MenuItem value={false}>No</MenuItem>
                                </Select>
                                {touched.otherCbs && errors.otherCbs && (
                                    <Alert severity="error">{errors.otherCbs}</Alert>
                                )}
                            </FormControl>
                        </Box>
                        <Box display="flex" justifyContent="end" mt="20px">
                            <Stack direction="row" spacing={2}>
                                <LoadingButton type="submit" color="secondary" variant="contained" loading={pending} loadingPosition="start"
                                    startIcon={<Save />}>
                                    {msisdn ? "Update Client Account" : "Create Client Account"}
                                </LoadingButton>
                                <Button color="primary" variant="contained" disabled={pending} onClick={() => navigate(-1)}>
                                    Cancel
                                </Button>
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

const checkoutSchema = yup.object().shape({
    msisdn: yup.string().required("Required"),
    branchId: yup.string().required("Required"),
    bankId: yup.string().required("Required"),
    cbsAccountNumber: yup.string().required("Required"),
});

export default ClientForm;
