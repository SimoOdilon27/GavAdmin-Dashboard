import { Alert, Box, Button, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, Snackbar, Stack, TextField, Typography, useTheme } from "@mui/material";
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
import { tokens } from "../../theme";
import regionsInCameroon from "../../components/CmrRegions";
import { FormFieldStyles } from "../../tools/fieldValuestyle";

const ClientForm = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const { msisdn } = useParams();
    const [formData, setFormData] = useState({
        request: msisdn,
        bankCode: "",
        internalId: "back-office"
    });
    const schema = msisdn ? "" : checkoutSchema; //if msisdn is present then we are in edit mode else we are in create mode
    const navigate = useNavigate();
    const userData = useSelector((state) => state.users);
    const token = userData.token;
    const spaceId = userData?.selectedSpace?.id
    const [initialValues, setInitialValues] = useState({
        id: "",
        msisdn: "",
        dateOfBirth: null,
        language: "",
        cniNumber: "",
        cniCreationDate: null,
        cniCreatedAt: "",
        cniExpirationDate: "",
        name: "",
        surname: "",
        sex: "",
        occupation: "",
        address: "",
        region: "",
        fatherName: "",
        initialBalance: 0,
        motherName: "",
        moralPerson: "",
        pin: "",
        email: "",
        activationCode: "",
        placeOfBirth: "",
        accountId: "",
        creationDate: "",
        activationCodeExpirationTime: "",
        active: false,
        branchId: "",
        bankId: "",
        cbsAccountNumber: "",
        maximumAccountLimit: 0,
        minimumAccountLimit: 0,
        internalId: "back-office",
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

            const submitData = {
                ...values,
                internalId: spaceId,
                branchId: spaceId
            }
            if (msisdn) {
                // Update existing client account
                const payload = {
                    serviceReference: 'UPDATE_CLIENT',
                    requestBody: JSON.stringify(values),
                    spaceId: spaceId,
                }
                const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
                // response = await CBS_Services('CLIENT', 'client/addOrUpdate', 'POST', values);
                console.log("editresp", response);
                if (response && response.body.meta.statusCode === 200) {
                    showSnackbar('Client Account Edited Successfully.', 'success');
                    setTimeout(() => {
                        navigate('/client');
                    }, 2000);
                } else {
                    showSnackbar(response.body.errors || 'Error Editing Client Account', 'error');
                }
            } else {
                // Add new client account
                const payload = {
                    serviceReference: 'ADD_CLIENT_ACCOUNT',
                    requestBody: JSON.stringify(submitData),
                    spaceId: spaceId,
                }
                const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
                console.log("addresp", response);

                // response = await CBS_Services('CLIENT', 'client/addOrUpdate', 'POST', values);

                if (response && response.body.meta.statusCode === 200) {
                    showSnackbar('Client Account Created Successfully.', 'success');
                    setTimeout(() => {
                        navigate('/client');
                    }, 2000);
                } else {
                    showSnackbar(response.body.errors || 'Error Adding Client Account', 'error');
                }
            }

            if (response && response.body.meta.statusCode === 200) {
                navigate("/client"); // Navigate back to the client list
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
            CBS_Services("CLIENT", `api/gav/client/getClientByMsisdn`, "POST", formData)
                .then((response) => {
                    console.log("fetch", response);

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
                title={msisdn ? "EDIT CLIENT " : "ONBOARD CLIENT"}
                subtitle={msisdn ? "Edit the client" : "Onboard a new client"}
            />

            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                enableReinitialize={true}
                validationSchema={schema}
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
                            padding: "10px 100px 20px 100px",

                        }}
                    >
                        <form onSubmit={handleSubmit}>
                            <Box
                                // display="grid"
                                gap="30px"
                                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                sx={{
                                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
                                    borderRadius: "10px",
                                    padding: "40px",
                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                                }}
                            >
                                {msisdn ? (
                                    <Grid container spacing={2}>
                                        {/* Personal Information */}
                                        <Grid item xs={12}>
                                            <Typography variant="h4">Personal Information</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                sx={FormFieldStyles("")}
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="Name"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.name}
                                                name="name"

                                            />
                                        </Grid>
                                        <Grid item xs={6} >
                                            <TextField
                                                sx={FormFieldStyles("")}
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="Surname"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.surname}
                                                name="surname"

                                            />
                                        </Grid>


                                        <Grid item xs={6}>
                                            <TextField
                                                sx={FormFieldStyles("")}
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="MSISDN"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.msisdn}
                                                name="msisdn"
                                                inputProps={{ readOnly: true }}


                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                sx={FormFieldStyles("")}
                                                fullWidth
                                                variant="filled"
                                                type="email"
                                                label="Email"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.email}
                                                name="email"
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextField
                                                sx={FormFieldStyles("")}
                                                fullWidth
                                                variant="filled"
                                                type="date"
                                                label="Date of Birth"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.dateOfBirth}
                                                name="dateOfBirth"

                                            />
                                        </Grid>

                                        <Grid item xs={4}>
                                            <TextField
                                                sx={FormFieldStyles("")}
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="Place of Birth"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.placeOfBirth}
                                                name="placeOfBirth"

                                            />
                                        </Grid>

                                        <Grid item xs={4}>

                                            <FormControl fullWidth variant="filled" sx={FormFieldStyles("")}>
                                                <InputLabel>Gender</InputLabel>
                                                <Select
                                                    label="Request Type"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.sex}
                                                    name="sex"
                                                >
                                                    <MenuItem value="MALE">MALE</MenuItem>
                                                    <MenuItem value="FEMALE">FEMALE</MenuItem>

                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={6} >
                                            <TextField
                                                sx={FormFieldStyles("")}
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="Address"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.address}
                                                name="address"

                                            />
                                        </Grid>
                                        <Grid item xs={6}>

                                            <FormControl fullWidth variant="filled" sx={FormFieldStyles("")}>
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
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TextField
                                                sx={FormFieldStyles("")}
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="Occupation"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.occupation}
                                                name="occupation"

                                            />
                                        </Grid>
                                        {/* Identification Information */}
                                        <Grid item xs={12}>
                                            <Typography variant="h4">Identification Information</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <TextField
                                                sx={FormFieldStyles("")}
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="CNI Number"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.cniNumber}
                                                name="cniNumber"

                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <TextField
                                                sx={FormFieldStyles("")}
                                                fullWidth
                                                variant="filled"
                                                type="date"
                                                label="CNI Creation Date"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.cniCreationDate}
                                                name="cniCreationDate"

                                            />
                                        </Grid>

                                        {/* Family Information */}
                                        <Grid item xs={12}>
                                            <Typography variant="h4">Family Information</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <TextField
                                                sx={FormFieldStyles("")}
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="Father's Name"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.fatherName}
                                                name="fatherName"

                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <TextField
                                                sx={FormFieldStyles("")}
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="Mother's Name"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.motherName}
                                                name="motherName"

                                            />
                                        </Grid>


                                        {/* Other Information */}
                                        <Grid item xs={12}>
                                            <Typography variant="h4">Other Information</Typography>
                                        </Grid>
                                        <Grid item xs={12}>


                                            <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 4" }}>
                                                <InputLabel>Language</InputLabel>
                                                <Select
                                                    label="Language"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.language}
                                                    name="language"
                                                    error={!!touched.language && !!errors.language}
                                                >
                                                    <MenuItem value="ENGLISH">English</MenuItem>
                                                    <MenuItem value="FRENCH">French</MenuItem>
                                                </Select>
                                                {touched.language && errors.language && (
                                                    <Alert severity="error">{errors.language}</Alert>
                                                )}
                                            </FormControl>
                                        </Grid>
                                        {/* <Grid item xs={12} sm={6} md={6}>
                                            <TextField
                                                sx={FormFieldStyles("")}
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="Moral Person"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.moralPerson}
                                                name="moralPerson"
                                                error={!!touched.moralPerson && !!errors.moralPerson}
                                                helperText={touched.moralPerson && errors.moralPerson}
                                            />
                                        </Grid> */}
                                    </Grid>


                                ) :
                                    <Box
                                        display="grid"
                                        gap="30px"
                                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                        sx={{
                                            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                                        }}
                                    >
                                        <TextField
                                            sx={FormFieldStyles("span 4")}
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

                                        />


                                        <TextField
                                            sx={FormFieldStyles("span 4")}
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

                                        />




                                    </Box>
                                }

                            </Box>
                            <Box display="flex" justifyContent="end" mt="20px">
                                <Stack direction="row" spacing={2}>
                                    <Button color="primary" variant="contained" disabled={pending} onClick={() => navigate(-1)}>
                                        Cancel
                                    </Button>
                                    <LoadingButton type="submit" color="secondary" variant="contained" loading={pending} loadingPosition="start"
                                        startIcon={<Save />}>
                                        {msisdn ? "Update Client" : "Onboard Client"}
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


const checkoutSchema = yup.object().shape({
    msisdn: yup.string().required("Required"),
    cbsAccountNumber: yup.string().required("Required"),


});


export default ClientForm;
