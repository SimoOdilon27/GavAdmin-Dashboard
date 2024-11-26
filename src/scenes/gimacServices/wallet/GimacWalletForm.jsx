import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Select, Snackbar, Stack, TextField, useTheme } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CBS_Services from "../../../services/api/GAV_Sercives";
import { LoadingButton } from "@mui/lab";
import { Save } from "@mui/icons-material";
import { FormFieldStyles } from "../../../tools/fieldValuestyle";

const GimacWalletForm = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.users);
    const token = userData.token;
    const spaceId = userData?.selectedSpace?.id
    const [countryData, setCountryData] = useState([]);

    const [initialValues, setInitialValues] = useState({
        id: "",
        name: "",
        gimacMemberCode: "",
        walletType: "",
        countryId: "",
        internalId: "000",
        serviceDescription: "",
        serviceRef: "",
        queryRef: "",
        queryName: "",
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
            if (id) {
                // Update existing wallet

                const payload = {
                    serviceReference: 'ADD_UPDATE_GIMAC_WALLET',
                    requestBody: JSON.stringify(values),
                }
                response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

                // response = await CBS_Services('GIMAC', 'wallets/update', 'POST', values);
                if (response && response.body.meta.statusCode === 200) {
                    showSnackbar('Wallet Updated Successfully.', 'success');
                    setTimeout(() => {
                        navigate('/gimac-wallets');
                    }, 2000);
                } else {
                    showSnackbar(response.body.errors || 'Error Updating Wallet', 'error');
                }
            } else {
                // Add new wallet

                const payload = {
                    serviceReference: 'ADD_UPDATE_GIMAC_WALLET',
                    requestBody: JSON.stringify(values),
                }

                console.log("values", values);

                response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
                // response = await CBS_Services('GIMAC', 'wallets/create', 'POST', values);
                if (response && response.body.meta.statusCode === 200) {
                    showSnackbar('Wallet Created Successfully.', 'success');
                    setTimeout(() => {
                        navigate('/gimac-wallets');
                    }, 2000);
                } else {
                    showSnackbar(response.body.errors || 'Error Creating Wallet', 'error');
                }
            }
        } catch (error) {
            console.error("Error:", error);
            showSnackbar('Error Try Again Later', 'error');
        }
        setPending(false);
    };




    const fetchCountryDataWithDefaultId = async () => {
        try {
            const defaultInternalId = 'default'; // Set the default internalId here
            const response = await CBS_Services('APE', 'wallet/mapper/gimacCountries/list/all', 'POST', { internalId: defaultInternalId });

            console.log("fetchresp", response);

            if (response && response.status === 200) {
                setCountryData(response.body.data);
            } else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchCountryDataWithDefaultId();
    }, [])

    useEffect(() => {
        if (id && location.state && location.state.walletData) {
            // Use the data passed from the wallets component
            setInitialValues(location.state.walletData);
        }
    }, [id, location.state]);

    console.log("initial values:", initialValues);


    return (
        <Box m="20px">
            <Header
                title={id ? "EDIT WALLET" : "ADD WALLET"}
                subtitle={id ? "Edit the wallet" : "Add a new wallet"}
            />

            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                enableReinitialize={true}
                validationSchema={walletSchema}
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
                                    label="Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.name}
                                    name="name"
                                    error={!!touched.name && !!errors.name}
                                    helperText={touched.name && errors.name}

                                    sx={FormFieldStyles("span 4")}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Service Description"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.serviceDescription}
                                    name="serviceDescription"
                                    error={!!touched.serviceDescription && !!errors.serviceDescription}
                                    helperText={touched.serviceDescription && errors.serviceDescription}

                                    sx={FormFieldStyles("span 4")}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="GIMAC Member Code"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.gimacMemberCode}
                                    name="gimacMemberCode"
                                    error={!!touched.gimacMemberCode && !!errors.gimacMemberCode}
                                    helperText={touched.gimacMemberCode && errors.gimacMemberCode}

                                    sx={FormFieldStyles("span 1")}
                                />


                                <FormControl fullWidth variant="filled"
                                    sx={FormFieldStyles("span 1")}>
                                    <InputLabel>Wallet Type</InputLabel>
                                    <Select
                                        label="Wallet Type"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.walletType}
                                        name="walletType"
                                        error={!!touched.walletType && !!errors.walletType}
                                    >
                                        <MenuItem value="" selected disabled>Select Wallet Type</MenuItem>
                                        <MenuItem value="Bank">Bank</MenuItem>
                                        <MenuItem value="Mobile">Mobile</MenuItem>
                                        <MenuItem value="ServicePayment">Service Payment</MenuItem>
                                        <MenuItem value="Top-up">Top-up</MenuItem>
                                    </Select>
                                    {touched.walletType && errors.walletType && (
                                        <Alert severity="error">{errors.walletType}</Alert>
                                    )}

                                </FormControl>


                                <FormControl fullWidth variant="filled"
                                    sx={FormFieldStyles("span 2")}>
                                    <InputLabel>Country</InputLabel>
                                    <Select
                                        label="Country"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.countryId}
                                        name="countryId"
                                        error={!!touched.countryId && !!errors.countryId}
                                    >
                                        <MenuItem value="" selected disabled>Select Wallet Type</MenuItem>
                                        {Array.isArray(countryData) && countryData.length > 0 ? (
                                            countryData
                                                .sort((a, b) => a.country.localeCompare(b.country)) // Correct alphabetical sorting
                                                .map((option) => (
                                                    <MenuItem key={option.countryId} value={option.countryId}>
                                                        {option.country}
                                                    </MenuItem>
                                                ))
                                        ) : (
                                            <option value="">No Countries available</option>
                                        )}
                                    </Select>
                                    {touched.countryId && errors.countryId && (
                                        <Alert severity="error">{errors.countryId}</Alert>
                                    )}

                                </FormControl>


                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Service Ref"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.serviceRef}
                                    name="serviceRef"
                                    error={!!touched.serviceRef && !!errors.serviceRef}
                                    helperText={touched.serviceRef && errors.serviceRef}

                                    sx={FormFieldStyles("span 1")}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Query Ref"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.queryRef}
                                    name="queryRef"
                                    error={!!touched.queryRef && !!errors.queryRef}
                                    helperText={touched.queryRef && errors.queryRef}

                                    sx={FormFieldStyles("span 1")}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Query Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.queryName}
                                    name="queryName"
                                    error={!!touched.queryName && !!errors.queryName}
                                    helperText={touched.queryName && errors.queryName}

                                    sx={FormFieldStyles("span 2")}
                                />


                            </Box>
                            <Box display="flex" justifyContent="end" mt="20px">
                                <Stack direction="row" spacing={2}>
                                    <Button color="primary" variant="contained" disabled={pending} onClick={() => navigate(-1)}>
                                        Cancel
                                    </Button>
                                    <LoadingButton
                                        type="submit"
                                        color="secondary"
                                        variant="contained"
                                        loading={pending}
                                        loadingPosition="start"
                                        startIcon={<Save />}
                                    >
                                        {id ? "Update Wallet" : "Create Wallet"}
                                    </LoadingButton>

                                </Stack>
                            </Box>
                        </form>
                    </Box>
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

const walletSchema = yup.object().shape({
    name: yup.string().required("required"),
    gimacMemberCode: yup.string().required("required"),
    walletType: yup.string().required("required"),
    countryId: yup.string().required("required"),
    internalId: yup.string().required("required"),
    serviceDescription: yup.string().required("required"),
    serviceRef: yup.string().required("required"),
    queryRef: yup.string().required("required"),
    queryName: yup.string().required("required"),
});

export default GimacWalletForm;
