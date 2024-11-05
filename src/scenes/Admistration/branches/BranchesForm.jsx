import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Select, Snackbar, Stack, TextField, Switch, FormControlLabel, RadioGroup, Radio, FormLabel } from "@mui/material";
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
import { useTheme } from '@mui/material/styles';

const BranchesForm = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();

    const formFieldStyles = (gridColumn = "span 2") => ({
        gridColumn,
        '& .MuiInputLabel-root': {
            color: theme.palette.mode === "dark"
                ? colors.grey[100] // Light color for dark mode
                : colors.black[700], // Dark color for light mode
        },
        '& .MuiFilledInput-root': {
            color: theme.palette.mode === "dark"
                ? colors.grey[100]
                : colors.black[700],
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: theme.palette.mode === "dark"
                ? colors.grey[100]
                : colors.black[100],
        },
    });

    const colors = tokens(theme.palette.mode);
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const userData = useSelector((state) => state.users);
    const token = userData.token;
    const spaceId = userData?.selectedSpace?.id
    const [bankID, setBankID] = useState('');

    const [initialValues, setInitialValues] = useState({

        bankId: "",
        branchName: "",
        address: "",
        cbsBranchId: "",
        email: "",
        country: ""
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
                bankId: spaceId,
            }
            if (id) {
                const payload = {
                    serviceReference: 'UPDATE_BRANCH',
                    requestBody: JSON.stringify({
                        ...submitData,
                        branchId: id // Ensure the ID is correctly set as branchId
                    }),
                    spaceId: spaceId,
                };
                console.log("values", values);

                response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

                if (response && response.body.meta.statusCode === 200) {
                    showSnackbar('Branch Updated Successfully.', 'success');
                    setTimeout(() => {
                        navigate(-1);
                    }, 2000);
                } else {
                    showSnackbar(response.body.errors || 'Error Updating Branch', 'error');
                }
            } else {
                const payload = {
                    serviceReference: 'ADD_BANK_BRANCH',
                    requestBody: JSON.stringify(submitData),
                    spaceId: spaceId,
                };
                response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

                if (response && response.body.meta.statusCode === 200) {
                    showSnackbar('Branch Created Successfully.', 'success');
                    setTimeout(() => {
                        navigate('/branches');
                    }, 2000);
                } else {
                    showSnackbar(response.body.errors || 'Error Adding Bank', 'error');
                }
            }
        } catch (error) {
            console.error("Error:", error);
            showSnackbar('Error Try Again Later', 'error');
        }
        setPending(false);
    };

    const fetchBankID = async () => {
        try {
            const payload = {
                serviceReference: 'GET_ALL_BANKS',
                requestBody: '',
                spaceId: spaceId,
            }
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

            // const response = await CBS_Services('AP', `api/gav/bank/getAll`, 'GET', null);
            console.log("fetchbankid", response);

            if (response && response.status === 200) {
                setBankID(response.body.data);

            } else if (response && response.body.status === 401) {
                // setErrorMessage(response.body.errors || 'Unauthorized to perform action');
            }
            else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchBankID();
    }, [])

    useEffect(() => {
        if (id && location.state && location.state.branchData) {
            setInitialValues(location.state.branchData);
        }
    }, [id, location.state]);

    return (
        <Box m="20px">
            <Header
                title={id ? "EDIT BRANCH" : "ADD BRANCH"}
                subtitle={id ? "Edit the Branch" : "Add a new Branch"}
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
                    setFieldValue,
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
                                    label="Branch Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.branchName}
                                    name="branchName"
                                    error={!!touched.branchName && !!errors.branchName}
                                    helperText={touched.branchName && errors.branchName}
                                    sx={formFieldStyles("span 2")}

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
                                    label="CBS Branch ID"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.cbsBranchId}
                                    name="cbsBranchId"
                                    error={!!touched.cbsBranchId && !!errors.cbsBranchId}
                                    helperText={touched.cbsBranchId && errors.cbsBranchId}
                                    sx={formFieldStyles("span 2")}

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
                                    label="Email"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.email}
                                    name="email"
                                    error={!!touched.email && !!errors.email}
                                    helperText={touched.email && errors.email}
                                    sx={formFieldStyles("span 2")}
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
                                    label="Country"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.country}
                                    name="country"
                                    error={!!touched.country && !!errors.country}
                                    helperText={touched.country && errors.country}
                                    sx={formFieldStyles("span 1")}

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
                                    sx={formFieldStyles("span 1")}
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
                                        {id ? "Update Branch" : "Create Branch"}
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
    branchName: yup.string().required("required"),
    cbsBranchId: yup.string().required("required"),
    email: yup.string().required("required"),
    address: yup.string().required("required"),
    // accountThreshold: yup.string().required("required"),
});

export default BranchesForm;
