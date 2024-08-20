import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Select, Snackbar, Stack, TextField, Switch, FormControlLabel } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CBS_Services from "../../../services/api/GAV_Sercives";
import { LoadingButton } from "@mui/lab";
import { Save } from "@mui/icons-material";

const TellerForm = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const { id } = useParams();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.users);
    const token = userData.token;
    const [branchID, setBranchID] = useState('');
    const [bankID, setBankID] = useState('');
    const [formData, setFormData] = useState({
        request: id,
        bankCode: "001",
        internalId: "back-office"
    });
    const [initialValues, setInitialValues] = useState({
        msisdn: "",
        branchId: "",
        language: "",
        cbsAccountId: "",
        tellerName: "",
        internalId: "",
        dailyLimit: 0,
        minimumAccountLimit: 0,
        maximumAccountLimit: 0,
        otherCbs: false,
        bankId: '',
        accountId: '',
        corporationId: '',
        balance: 0,
        virtualBalance: 0,
        active: false
    });

    console.log("initialValues", initialValues);

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
            if (id) {
                // Update existing teller
                const payload = {
                    serviceReference: 'UPDATE_TELLER',
                    requestBody: JSON.stringify(values),
                }
                console.log("values", values);

                response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

                // response = await CBS_Services('APE', 'teller/update', 'PUT', values);
                if (response && response.status === 200) {
                    showSnackbar('Teller Updated Successfully.', 'success');
                    setTimeout(() => {
                        navigate(-1);
                    }, 2000);
                } else {
                    showSnackbar(response.body.errors || 'Error Updating Teller', 'error');
                }
            } else {
                // Add new teller

                const payload = {
                    serviceReference: 'CREATE_TELLER',
                    requestBody: JSON.stringify(values),
                }
                console.log("values", values);
                const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

                // response = await CBS_Services('APE', 'teller/create', 'POST', values);
                if (response && response.status === 200) {
                    showSnackbar('Teller Created Successfully.', 'success');
                    setTimeout(() => {
                        navigate('/teller-list');
                    }, 2000);
                } else {
                    showSnackbar(response.body.errors || 'Error Adding Teller', 'error');
                }
            }
        } catch (error) {
            console.error("Error:", error);
            showSnackbar('Error Try Again Later', 'error');
        }
        setPending(false);
    };

    const fetchBranchID = async () => {
        try {

            const payload = {
                serviceReference: 'GET_ALL_BRANCHES',
                requestBody: ''
            }
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

            // const response = await CBS_Services('AP', `api/gav/bankBranch/getAll`, 'GET', null);

            if (response && response.body.meta.statusCode === 200) {
                setBranchID(response.body.data);

            } else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const fetchBankID = async () => {
        try {
            const payload = {
                serviceReference: 'GET_ALL_BANKS',
                requestBody: ''
            }
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

            // const response = await CBS_Services('AP', `api/gav/bank/getAll`, 'GET', null);
            console.log("fetchbankid", response);

            if (response && response.status === 200) {
                setBankID(response.body.data);

            } else if (response && response.body.status === 401) {
                showSnackbar(response.body.errors || 'Error Adding Teller', 'error');

            }
            else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchBranchID();
        fetchBankID()
    }, [])

    useEffect(() => {
        const fetchTellerById = async () => {
            if (id) {
                try {
                    const payload = {
                        serviceReference: 'GET_TELLER_BY_ID',
                        requestBody: JSON.stringify(formData)
                    };

                    const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
                    // const response = await CBS_Services('CLIENT', 'api/gav/teller/get', 'POST', formData);
                    console.log("fetched teller", response);

                    if (response && response.body.meta.statusCode === 200) {
                        setInitialValues(response.body.data);
                        showSnackbar('Fetched Teller Information Successfully', 'success');
                    } else {
                        console.error('Error fetching data');
                        showSnackbar(response.body.errors || 'Error Finding Teller Information', 'error');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    showSnackbar('An error occurred while fetching the teller information', 'error');
                }
            }
        };

        fetchTellerById();
    }, [id, token]);

    return (
        <Box m="20px">
            <Header
                title={id ? "EDIT TELLER" : "ADD TELLER"}
                subtitle={id ? "Edit the teller" : "Add a new teller"}
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
                                label="Teller Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.tellerName}
                                name="tellerName"
                                error={!!touched.tellerName && !!errors.tellerName}
                                helperText={touched.tellerName && errors.tellerName}
                                sx={{ gridColumn: "span 4" }}
                            />
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

                            <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 2" }}>
                                <InputLabel>Branch</InputLabel>
                                <Select
                                    label="Branch"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.branchId}
                                    name="branchId"
                                    error={!!touched.branchId && !!errors.branchId}
                                >
                                    <MenuItem value="">Select Branch</MenuItem>
                                    {Array.isArray(branchID) && branchID.length > 0 ? (
                                        branchID.map(option => (
                                            <MenuItem key={option.id} value={option.id}>
                                                {option.branchName}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem value="">No Branch available</MenuItem>
                                    )}
                                </Select>
                                {touched.branchId && errors.branchId && (
                                    <Alert severity="error">{errors.branchId}</Alert>
                                )}
                            </FormControl>


                            <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 1" }}>
                                <InputLabel>Language</InputLabel>
                                <Select
                                    label="Language"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.language}
                                    name="language"
                                    error={!!touched.language && !!errors.language}
                                >
                                    <MenuItem value="" selected>Select Language</MenuItem>
                                    <MenuItem value="FRENCH">FRENCH</MenuItem>
                                    <MenuItem value="ENGLISH">ENGLISH</MenuItem>

                                </Select>
                                {touched.language && errors.language && (
                                    <Alert severity="error">{errors.language}</Alert>
                                )}
                            </FormControl>
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="CBS Account ID"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.cbsAccountId}
                                name="cbsAccountId"
                                error={!!touched.cbsAccountId && !!errors.cbsAccountId}
                                helperText={touched.cbsAccountId && errors.cbsAccountId}
                                sx={{ gridColumn: "span 3" }}
                            />



                            {id ? (

                                <>
                                    {/* <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Bank"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.bankId}
                                        name="bankId"
                                        error={!!touched.bankId && !!errors.bankId}
                                        helperText={touched.bankId && errors.bankId}
                                        sx={{ gridColumn: "span 2" }}
                                    /> */}

                                    <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 2" }}>
                                        <InputLabel>Bank</InputLabel>
                                        <Select
                                            label="Bank"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.bankId}
                                            name="bankId"
                                            error={!!touched.bankId && !!errors.bankId}
                                        >
                                            <MenuItem value="">Select Bank</MenuItem>
                                            {Array.isArray(bankID) && bankID.length > 0 ? (
                                                bankID.map(option => (
                                                    <MenuItem key={option.bankId} value={option.bankId}>
                                                        {option.bankName}
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
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="accountId"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.accountId}
                                        name="accountId"
                                        error={!!touched.accountId && !!errors.accountId}
                                        helperText={touched.accountId && errors.accountId}
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Corporation"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.corporationId}
                                        name="corporationId"
                                        error={!!touched.corporationId && !!errors.corporationId}
                                        helperText={touched.corporationId && errors.corporationId}
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="balance"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.balance}
                                        name="balance"
                                        error={!!touched.balance && !!errors.balance}
                                        helperText={touched.balance && errors.balance}
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="virtualBalance"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.virtualBalance}
                                        name="virtualBalance"
                                        error={!!touched.virtualBalance && !!errors.virtualBalance}
                                        helperText={touched.virtualBalance && errors.virtualBalance}
                                        sx={{ gridColumn: "span 2" }}
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
                                        label="Other CBS"
                                        sx={{ gridColumn: "span 2" }}
                                    />

                                </>) : (

                                <>

                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="number"
                                        label="Daily Limit"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.dailyLimit}
                                        name="dailyLimit"
                                        error={!!touched.dailyLimit && !!errors.dailyLimit}
                                        helperText={touched.dailyLimit && errors.dailyLimit}
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
                                        sx={{ gridColumn: "span 1" }}
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
                                        sx={{ gridColumn: "span 1" }}
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
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={values.otherCbs}
                                                onChange={handleChange}
                                                name="otherCbs"
                                                color="secondary"
                                            />
                                        }
                                        label="Other CBS"
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                </>
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
                                    startIcon={<Save />}
                                >
                                    {id ? "Update Teller" : "Create Teller"}
                                </LoadingButton>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    disabled={pending}
                                    onClick={() => navigate(-1)}
                                >
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
    msisdn: yup.string().required("required"),
    branchId: yup.string().required("required"),
    language: yup.string().required("required"),
    cbsAccountId: yup.string().required("required"),
    tellerName: yup.string().required("required"),
    internalId: yup.string(),
    dailyLimit: yup.number().required("required"),
    minimumAccountLimit: yup.number().required("required"),
    maximumAccountLimit: yup.number().required("required"),
    otherCbs: yup.boolean(),
});

export default TellerForm;