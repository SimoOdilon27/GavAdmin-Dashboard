import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Select, Snackbar, Stack, TextField, Switch, FormControlLabel, Checkbox, RadioGroup, Radio, FormLabel } from "@mui/material";
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


const CorporationForm = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const userData = useSelector((state) => state.users);
    const token = userData.token;
    const spaceId = userData?.selectedSpace?.id
    const [countryData, setCountryData] = useState([]);


    const [initialValues, setInitialValues] = useState({

        name: '',
        email: '',
        contact: '',
        address: '',
        country: '',

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
                // Update existing teller
                const payload = {
                    serviceReference: 'UPDATE_CORPORATION',
                    requestBody: JSON.stringify(values),
                    spaceId: spaceId
                }
                console.log("values=====", values);



                response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

                // response = await CBS_Services('APE', 'teller/update', 'PUT', values);
                if (response && response.body.meta.statusCode === 200) {
                    showSnackbar('Corporation Updated Successfully.', 'success');
                    setTimeout(() => {
                        navigate(-1);
                    }, 2000);
                } else {
                    showSnackbar(response.body.errors || 'Error Updating Corporation', 'error');
                }
            } else {
                // Add new Corporation

                const payload = {
                    serviceReference: 'CREATE_CORPORATION',
                    requestBody: JSON.stringify(values),
                    spaceId: spaceId
                }
                console.log("values", values);
                const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
                console.log("response", response);

                // response = await CBS_Services('APE', 'Corporation/create', 'POST', values);
                if (response && response.body.meta.statusCode === 200) {
                    showSnackbar('Corporation Created Successfully.', 'success');
                    setTimeout(() => {
                        navigate('/corporation');
                    }, 2000);
                } else {
                    showSnackbar(response.body.errors || 'Error Adding Corporation', 'error');
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
        if (id && location.state && location.state.corporationData) {
            // Use the data passed from the corporationData component
            setInitialValues(location.state.corporationData);
        }
        fetchCountryDataWithDefaultId();
    }, [id, location.state]);


    return (
        <Box m="20px">
            <Header
                title={id ? "EDIT CORPORATION" : "ADD CORPORATION"}
                subtitle={id ? "Edit the Corporation" : "Add a new Corporation"}
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
                    setFieldValue
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
                                    label="Corporation Name"
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
                                    label="Email"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.email}
                                    name="email"
                                    error={!!touched.email && !!errors.email}
                                    helperText={touched.email && errors.email}
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
                                                .sort((a, b) => a.country.localeCompare(b.country))
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
                                    sx={FormFieldStyles("span 2")}
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
                                        {id ? "Update Corporation" : "Create Corporation"}
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
    email: yup.string().required("required"),
    name: yup.string().required("required"),
    address: yup.string().required("required"),



});

export default CorporationForm
