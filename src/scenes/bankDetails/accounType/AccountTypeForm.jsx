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


const AccountTypeForm = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const userData = useSelector((state) => state.users);
    const token = userData.token;

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
                }
                console.log("values", values);

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
                }
                console.log("values", values);
                const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

                // response = await CBS_Services('APE', 'teller/create', 'POST', values);
                if (response && response.body.meta.statusCode === 200) {
                    showSnackbar('Teller Created Successfully.', 'success');
                    setTimeout(() => {
                        navigate('/accountype');
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
                                    type="text"
                                    label="Type Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.type}
                                    name="type"
                                    error={!!touched.type && !!errors.type}
                                    helperText={touched.type && errors.type}
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
                                    type="text"
                                    label="Description"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.description}
                                    name="description"
                                    error={!!touched.description && !!errors.description}
                                    helperText={touched.description && errors.description}
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
