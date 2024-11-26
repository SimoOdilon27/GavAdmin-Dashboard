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
import { Alert, Box, Button, Snackbar, Stack, TextField, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { FormFieldStyles } from "../../../tools/fieldValuestyle";


const AccountTypeForm = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const userData = useSelector((state) => state.users);
    const token = userData.token;
    const spaceId = userData?.selectedSpace?.id

    const [initialValues, setInitialValues] = useState({
        type: "",
        description: "",
        idTag: ""
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
                    serviceReference: 'UPDATE_ACCOUNT_TYPE',
                    requestBody: JSON.stringify(values),
                    spaceId: spaceId,
                }
                console.log("payload", payload);
                // console.log("values", values);

                response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

                // response = await CBS_Services('APE', 'teller/update', 'PUT', values);
                if (response && response.body.meta.statusCode === 200) {
                    showSnackbar('Account Type Updated Successfully.', 'success');
                    setTimeout(() => {
                        navigate(-1);
                    }, 2000);
                } else {
                    showSnackbar(response.body.errors || 'Error Updating Teller', 'error');
                }
            } else {
                // Add new teller

                const payload = {
                    serviceReference: 'CREATE_ACCOUNT_TYPE',
                    requestBody: JSON.stringify(values),
                    spaceId: spaceId,
                }
                console.log("values", values);
                const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
                console.log("response", response);

                // response = await CBS_Services('APE', 'teller/create', 'POST', values);
                if (response && response.body.meta.statusCode === 200) {
                    showSnackbar('Account type Created Successfully.', 'success');
                    setTimeout(() => {
                        navigate(-1);
                    }, 2000);
                } else {
                    showSnackbar(response.body.errors || 'Error Adding Account Type', 'error');
                }
            }
        } catch (error) {
            console.error("Error:", error);
            showSnackbar('Error Try Again Later', 'error');
        }
        setPending(false);
    };

    useEffect(() => {
        if (id && location.state && location.state.tellerData) {
            // Use the data passed from the Tellers component
            setInitialValues(location.state.tellerData);
        }
    }, [id, location.state]);
    return (
        <Box m="20px">
            <Header
                title={id ? "EDIT ACCOUNT TYPE" : "ADD ACCOUNT TYPE"}
                subtitle={id ? "Edit the  Account Type" : "Add a new  Account Type"}
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
                                    padding: "40px", // Optional: padding for the inner container
                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                                }}
                            >

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Tag"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.idTag}
                                    name="idTag"
                                    error={!!touched.idTag && !!errors.idTag}
                                    helperText={touched.idTag && errors.idTag}
                                    sx={FormFieldStyles("span 2")}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Type Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.type}
                                    name="type"
                                    error={!!touched.type && !!errors.type}
                                    helperText={touched.type && errors.type}
                                    sx={FormFieldStyles("span 2")}

                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Description"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.description}
                                    name="description"
                                    error={!!touched.description && !!errors.description}
                                    helperText={touched.description && errors.description}
                                    sx={FormFieldStyles("span 4")}

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
                                        {id ? "Update Account Type" : "Create Account Type"}
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
    type: yup.string().required("required"),
    description: yup.string().required("required"),
    idTag: yup.string().required("required"),

});

export default AccountTypeForm
