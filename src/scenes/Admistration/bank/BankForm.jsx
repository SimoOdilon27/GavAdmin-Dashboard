import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Select, Snackbar, Stack, TextField, Switch, FormControlLabel, RadioGroup, Radio, FormLabel, Checkbox } from "@mui/material";
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
import { tokens } from "../../../theme";
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { FormFieldStyles } from "../../../tools/fieldValuestyle";
import regionsInCameroon from "../../../components/CmrRegions";

const BankForm = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const userData = useSelector((state) => state.users);
    const token = userData.token;
    const spaceId = userData?.selectedSpace?.id
    const [countryData, setCountryData] = useState([]);
    const [CBSData, setCBSData] = useState([]);


    const [formData, setFormData] = useState({
        address: "",
        contact: "",
        bankEmail: "",
        bankName: "",
        corporationId: "",
        cbsBankId: "",
        bankManager: "",
        region: "",
        country: "",
        accountNumber: "",
        hasCbsAccount: false
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

            const submitData = {
                ...values,
                hasCbsAccount: false,
                corporationId: spaceId,

            }
            let response;
            if (id) {
                const payload = {
                    serviceReference: 'UPDATE_BANK',
                    requestBody: JSON.stringify(submitData),
                    spaceId: spaceId,
                };
                response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

                console.log("responseadd", response);
                console.log("submitData", submitData);

                if (response && response.body.meta.statusCode === 200) {
                    showSnackbar('Bank Updated Successfully.', 'success');
                    setTimeout(() => {
                        navigate(-1);
                    }, 2000);
                } else {
                    showSnackbar(response.body.errors || 'Error Updating Bank', 'error');
                }
            } else {
                const payload = {
                    serviceReference: 'ADD_BANK',
                    requestBody: JSON.stringify(submitData),
                    spaceId: spaceId,
                };
                console.log("submitData", submitData);
                console.log("payload", payload);

                response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
                console.log("responseadd", response);

                if (response && response.body.meta.statusCode === 200) {
                    showSnackbar('Bank Created Successfully.', 'success');
                    setTimeout(() => {
                        navigate('/bank');
                    }, 2000);
                }
                else if (response && response.body.meta.statusCode === 401) {
                    showSnackbar(response.body.meta.message || 'Unauthourized', 'error');
                }
                else {
                    showSnackbar(response.body.meta.message || 'Error Adding Bank', 'error');
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
    const fetchCBSdata = async () => {
        try {

            const payload = {
                serviceReference: 'GET_AFFILIATED_CBS',
                requestBody: '',
                spaceId: spaceId,
            }
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

            console.log("fetchresp111111", response);

            if (response && response.body.meta.statusCode === 200) {
                setCBSData(response.body.data);
            } else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };



    useEffect(() => {
        fetchCountryDataWithDefaultId();
        fetchCBSdata();

    }, []);

    useEffect(() => {
        if (id && location.state && location.state.bankData) {
            setFormData(location.state.bankData);
        }
    }, [id, location.state]);

    console.log("formdata", formData);

    return (
        <Box m="20px">
            <Header
                title={id ? "EDIT BANK" : "ADD BANK"}
                subtitle={id ? "Edit the Bank" : "Add a new Bank"}
            />

            <Formik
                onSubmit={handleFormSubmit}
                initialValues={formData}
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
                    setFieldValue
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
                                    label="Bank Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.bankName}
                                    name="bankName"
                                    error={!!touched.bankName && !!errors.bankName}
                                    helperText={touched.bankName && errors.bankName}
                                    sx={FormFieldStyles("span 2")}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Bank Manager"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.bankManager}
                                    name="bankManager"
                                    error={!!touched.bankManager && !!errors.bankManager}
                                    helperText={touched.bankManager && errors.bankManager}
                                    sx={FormFieldStyles("span 2")}


                                />

                                <FormControl fullWidth variant="filled"
                                    sx={FormFieldStyles("span 2")}>
                                    <InputLabel>Bank CBS</InputLabel>
                                    <Select
                                        label="Bank CBS"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.cbsBankId}
                                        name="cbsBankId"
                                        error={!!touched.cbsBankId && !!errors.cbsBankId}
                                    >
                                        <MenuItem value="" selected disabled>Select Bank CBS</MenuItem>
                                        {Array.isArray(CBSData) && CBSData.length > 0 ? (
                                            CBSData.map((option) => (
                                                <MenuItem key={option.bankId} value={option.bankId}>
                                                    {option.bankName}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <option value="">No CBS available</option>
                                        )}
                                    </Select>
                                    {touched.cbsBankId && errors.cbsBankId && (
                                        <Alert severity="error">{errors.cbsBankId}</Alert>
                                    )}

                                </FormControl>

                                {!id &&
                                    (<TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label=" Account Number"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.accountNumber}
                                        name="accountNumber"
                                        error={!!touched.accountNumber && !!errors.accountNumber}
                                        helperText={touched.accountNumber && errors.accountNumber}
                                        sx={FormFieldStyles("span 2")}

                                    />)}





                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Email"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.bankEmail}
                                    name="bankEmail"
                                    error={!!touched.bankEmail && !!errors.bankEmail}
                                    helperText={touched.bankEmail && errors.bankEmail}
                                    sx={FormFieldStyles("span 2")}

                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Phone Number"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.contact}
                                    name="contact"
                                    error={!!touched.contact && !!errors.contact}
                                    helperText={touched.contact && errors.contact}
                                    sx={FormFieldStyles("span 2")}

                                />

                                <FormControl fullWidth variant="filled"
                                    sx={FormFieldStyles("span 2")}>
                                    <InputLabel>Country</InputLabel>
                                    <Select
                                        label="Country"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.country}
                                        name="country"
                                        error={!!touched.country && !!errors.country}
                                    >
                                        <MenuItem value="" selected disabled>Select Wallet Type</MenuItem>
                                        {Array.isArray(countryData) && countryData.length > 0 ? (
                                            countryData
                                                .sort((a, b) => a.country.localeCompare(b.country)) // Correct alphabetical sorting
                                                .map((option) => (
                                                    <MenuItem key={option.country} value={option.country}>
                                                        {option.country}
                                                    </MenuItem>
                                                ))
                                        ) : (
                                            <option value="">No Countries available</option>
                                        )}
                                    </Select>
                                    {touched.country && errors.country && (
                                        <Alert severity="error">{errors.country}</Alert>
                                    )}

                                </FormControl>

                                <FormControl fullWidth variant="filled"
                                    sx={FormFieldStyles("span 1")}
                                    error={!!touched.region && !!errors.region}
                                    helperText={touched.region && errors.region}
                                >
                                    <InputLabel>Region</InputLabel>
                                    <Select
                                        name="region"
                                        value={values.region}
                                        onChange={handleChange}
                                        label="Region"
                                    >
                                        {regionsInCameroon.map((region) => (
                                            <MenuItem key={region} value={region}>
                                                {region}
                                            </MenuItem>
                                        ))}
                                    </Select>

                                </FormControl>

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="City"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.address}
                                    name="address"
                                    error={!!touched.address && !!errors.address}
                                    helperText={touched.address && errors.address}
                                    sx={FormFieldStyles("span 1")}


                                />





                            </Box>

                            <Box display="flex" justifyContent="end" mt="20px">
                                <Stack direction="row" spacing={2}>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        disabled={pending}
                                        onClick={() => navigate(-1)}
                                    >
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
                                        {id ? "Update Bank" : "Create Bank"}
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
    )
}

const checkoutSchema = yup.object().shape({
    bankName: yup.string().required("required"),
    bankEmail: yup.string().email("Invalid email").required("required"),
    contact: yup.string().required("required"),
    region: yup.string(),
    address: yup.string().required("required"),
    bankManager: yup.string(),
    // dailyLimit: yup.number().required("required"),
    contact: yup.string().required("required"),
    cbsBankId: yup.string().required("required"),
    // corporationId: yup.string().required("required"),
    // Add other validation rules here
});

export default BankForm;
