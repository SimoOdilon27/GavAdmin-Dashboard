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

const GimacCountriesForm = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const { id } = useParams();
    const theme = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.users);
    const token = userData.token;
    const spaceId = userData?.selectedSpace?.id

    console.log("id", id);

    const [initialValues, setInitialValues] = useState({
        countryCode: "",
        country: "",
        serviceProvider: "",
        internationalDialingCode: "",
        internalId: "000"
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
                // Update existing country
                const payload = {
                    serviceReference: 'ADD_UPDATE_GIMAC_COUNTRY',
                    requestBody: JSON.stringify(values),
                    spaceId: spaceId
                }
                response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

                console.log("addresponse", response);

                if (response && response.body.meta.statusCode === 200) {
                    showSnackbar('Country Updated Successfully.', 'success');
                    setTimeout(() => {
                        navigate('/gimac-countries');
                    }, 2000);
                } else {
                    showSnackbar(response.body.errors || 'Error Updating Country', 'error');
                }
            } else {
                // Add new country
                const payload = {
                    serviceReference: 'ADD_UPDATE_GIMAC_COUNTRY',
                    requestBody: JSON.stringify(values),
                    spaceId: spaceId
                }
                console.log("values", values);

                response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
                console.log("response==", response);
                if (response && response.body.meta.statusCode === 200) {
                    showSnackbar('Country Created Successfully.', 'success');
                    setTimeout(() => {
                        navigate('/gimac-countries');
                    }, 2000);
                } else {
                    showSnackbar(response.body.errors || 'Error Creating Country', 'error');
                }
            }
        } catch (error) {
            console.error("Error:", error);
            showSnackbar('Error Try Again Later', 'error');
        }
        setPending(false);
    };


    useEffect(() => {
        if (id && location.state && location.state.countryData) {
            // Use the data passed from the countrys component
            setInitialValues(location.state.countryData);
        }
    }, [id, location.state]);

    return (
        <Box m="20px">
            <Header
                title={id ? "EDIT COUNTRY" : "ADD COUNTRY"}
                subtitle={id ? "Edit the country" : "Add a new country"}
            />

            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                enableReinitialize={true}
                validationSchema={countrySchema}
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
                                    label="Country Code"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.countryCode}
                                    name="countryCode"
                                    error={!!touched.countryCode && !!errors.countryCode}
                                    helperText={touched.countryCode && errors.countryCode}
                                    sx={FormFieldStyles("span 2")}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Country Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.country}
                                    name="country"
                                    error={!!touched.country && !!errors.country}
                                    helperText={touched.country && errors.country}
                                    sx={FormFieldStyles("span 2")}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Service Provider"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.serviceProvider}
                                    name="serviceProvider"
                                    error={!!touched.serviceProvider && !!errors.serviceProvider}
                                    helperText={touched.serviceProvider && errors.serviceProvider}
                                    sx={FormFieldStyles("span 2")}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="International Dialing Code"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.internationalDialingCode}
                                    name="internationalDialingCode"
                                    error={!!touched.internationalDialingCode && !!errors.internationalDialingCode}
                                    helperText={touched.internationalDialingCode && errors.internationalDialingCode}
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
                                        {id ? "Update Country" : "Create Country"}
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

const countrySchema = yup.object().shape({
    countryCode: yup.string().required("required"),
    country: yup.string().required("required"),
    serviceProvider: yup.string().required("required"),
    internalId: yup.string(),
    internationalDialingCode: yup.string().required("required"),
});

export default GimacCountriesForm;
