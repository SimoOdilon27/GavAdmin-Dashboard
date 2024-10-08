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


const CorporationForm = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const userData = useSelector((state) => state.users);
    const token = userData.token;

    const [initialValues, setInitialValues] = useState({
        corporationId: '',
        name: '',
        email: '',
        contact: '',
        address: '',
        cbsCorporationId: '',
        country: '',
        corporationAccountThreshold: 0,
        corporationName: '',

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
                    requestBody: JSON.stringify(values)
                }
                console.log("values", values);

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
                    requestBody: JSON.stringify(values)
                }
                console.log("values", values);
                const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

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

    useEffect(() => {
        if (id && location.state && location.state.corporationData) {
            // Use the data passed from the corporationData component
            setInitialValues(location.state.corporationData);
        }
    }, [id, location.state]);

    console.log("initialValues", initialValues);

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
                                    value={values.corporationName}
                                    name="corporationName"
                                    error={!!touched.corporationName && !!errors.corporationName}
                                    helperText={touched.corporationName && errors.corporationName}
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

                                    InputLabelProps={{
                                        sx: {
                                            color: 'white', // Default label color
                                        }
                                    }}

                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="CBS Corporation Account"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.cbsCorporationId}
                                    name="cbsCorporationId"
                                    error={!!touched.cbsCorporationId && !!errors.cbsCorporationId}
                                    helperText={touched.cbsCorporationId && errors.cbsCorporationId}
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

                                    InputLabelProps={{
                                        sx: {
                                            color: 'white', // Default label color
                                        }
                                    }}

                                />

                                <FormControl
                                    sx={{
                                        gridColumn: "span 2",
                                        '& .MuiFormLabel-root': {
                                            color: 'white', // Ensure label remains white
                                        },
                                        '& .MuiFilledInput-root': {
                                            color: 'white', // Optional: input text color
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: 'white', // Keep the label white when focused
                                        },
                                    }}
                                    InputLabelProps={{
                                        sx: {
                                            color: 'white', // Default label color
                                        }
                                    }}
                                >
                                    <FormLabel
                                    >CBS Account Type</FormLabel>
                                    <RadioGroup
                                        name="cbsAccountType"
                                        value={values.hasCbsAccount ? "hasCbsAccount" : values.otherCbs ? "otherCbs" : ""}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setFieldValue("hasCbsAccount", value === "hasCbsAccount");
                                            setFieldValue("otherCbs", value === "otherCbs");
                                        }}
                                        row
                                    >
                                        <FormControlLabel value="hasCbsAccount" control={<Radio color="secondary" />} label="Trust Soft Account" />
                                        <FormControlLabel value="otherCbs" control={<Radio color="secondary" />} label="Alpha CBS Account" />
                                    </RadioGroup>
                                </FormControl>

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
                                    sx={{
                                        gridColumn: "span 3",
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

                                    InputLabelProps={{
                                        sx: {
                                            color: 'white', // Default label color
                                        }
                                    }}
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
                                    sx={{
                                        gridColumn: "span 1",
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

                                    InputLabelProps={{
                                        sx: {
                                            color: 'white', // Default label color
                                        }
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Address"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.address}
                                    name="address"
                                    error={!!touched.address && !!errors.address}
                                    helperText={touched.address && errors.address}
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

                                    InputLabelProps={{
                                        sx: {
                                            color: 'white', // Default label color
                                        }
                                    }}

                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Corporation Account Threshold"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.corporationAccountThreshold}
                                    name="corporationAccountThreshold"
                                    // error={!!touched.corporationAccountThreshold && !!errors.corporationAccountThreshold}
                                    // helperText={touched.corporationAccountThreshold && errors.corporationAccountThreshold}
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

                                    InputLabelProps={{
                                        sx: {
                                            color: 'white', // Default label color
                                        }
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
                                        {id ? "Update Corporation" : "Create Corporation"}
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
    email: yup.string().required("required"),
    // corporationAccountThreshold: yup.number().required("required"),
    cbsCorporationId: yup.string().required("required"),
    corporationName: yup.string().required("required"),
    address: yup.string().required("required"),
    cbsCorporationId: yup.string().required("required"),


});

export default CorporationForm
