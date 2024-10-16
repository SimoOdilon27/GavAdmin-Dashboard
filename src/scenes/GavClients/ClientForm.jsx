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

const ClientForm = () => {
    const theme = useTheme();
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
        internalId: "",
        otherCbs: true
    });
    const [pending, setPending] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
    const [bankID, setBankID] = useState([]);
    const [branchID, setBranchID] = useState([]);
    const [banks, setBanks] = useState([]);
    const [branches, setBranches] = useState([]);

    const [filteredBranches, setFilteredBranches] = useState([]);

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

    const handleBankChange = (event, setFieldValue) => {
        const bankId = event.target.value;
        setFieldValue('bankId', bankId);
        setFieldValue('branchId', ''); // Reset branch selection

        // Filter branches based on selected bank
        const relatedBranches = branches.filter(branch => branch.bankId === bankId);
        setFilteredBranches(relatedBranches);

    };

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
            if (msisdn) {
                // Update existing client account
                const payload = {
                    serviceReference: 'UPDATE_CLIENT',
                    requestBody: JSON.stringify(values),
                }
                const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
                // response = await CBS_Services('CLIENT', 'client/addOrUpdate', 'POST', values);

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
                    requestBody: JSON.stringify(values),
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

    const fetchBankID = async () => {
        try {
            const payload = {
                serviceReference: 'GET_ALL_BANKS',
                requestBody: ''
            };
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            console.log("fetchbankid", response);

            if (response && response.body.meta.statusCode === 200) {
                setBanks(response.body.data);
            } else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchBranchID = async () => {
        try {
            const payload = {
                serviceReference: 'GET_ALL_BRANCHES',
                requestBody: ''
            };
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            console.log("fetchbranchid", response);

            if (response && response.body.meta.statusCode === 200) {
                setBranches(response.body.data);
            } else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchBankID();
        fetchBranchID();
    }, []);

    return (
        <Box m="20px">
            <Header
                title={msisdn ? "EDIT CLIENT ACCOUNT" : "ADD CLIENT ACCOUNT"}
                subtitle={msisdn ? "Edit the client account" : "Add a new client account"}
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
                            padding: "10px 100px 20px 100px"

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
                                        <Grid item xs={12} sm={6} md={4}>
                                            <TextField
                                                sx={{

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
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="Name"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.name}
                                                name="name"
                                            // error={!!touched.name && !!errors.name}
                                            // helperText={touched.name && errors.name}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <TextField
                                                sx={{

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
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="Surname"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.surname}
                                                name="surname"
                                            // error={!!touched.surname && !!errors.surname}
                                            // helperText={touched.surname && errors.surname}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <TextField
                                                sx={{

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
                                                fullWidth
                                                variant="filled"
                                                type="date"
                                                label="Date of Birth"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.dateOfBirth}
                                                name="dateOfBirth"
                                            // error={!!touched.dateOfBirth && !!errors.dateOfBirth}
                                            // helperText={touched.dateOfBirth && errors.dateOfBirth}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <TextField
                                                sx={{

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
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="Place of Birth"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.placeOfBirth}
                                                name="placeOfBirth"
                                            // error={!!touched.placeOfBirth && !!errors.placeOfBirth}
                                            // helperText={touched.placeOfBirth && errors.placeOfBirth}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>

                                            <FormControl fullWidth variant="filled">
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
                                        <Grid item xs={12} sm={6} md={4}>
                                            <TextField
                                                sx={{

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
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="Address"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.address}
                                                name="address"
                                            // error={!!touched.address && !!errors.address}
                                            // helperText={touched.address && errors.address}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <TextField
                                                sx={{

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
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="Region"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.region}
                                                name="region"
                                            // error={!!touched.region && !!errors.region}
                                            // helperText={touched.region && errors.region}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <TextField
                                                sx={{

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
                                                fullWidth
                                                variant="filled"
                                                type="email"
                                                label="Email"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.email}
                                                name="email"
                                            // error={!!touched.email && !!errors.email}
                                            // helperText={touched.email && errors.email}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <TextField
                                                sx={{

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
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="Occupation"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.occupation}
                                                name="occupation"
                                            // error={!!touched.occupation && !!errors.occupation}
                                            // helperText={touched.occupation && errors.occupation}
                                            />
                                        </Grid>

                                        {/* Family Information */}
                                        <Grid item xs={12}>
                                            <Typography variant="h4">Family Information</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <TextField
                                                sx={{

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
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="Father's Name"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.fatherName}
                                                name="fatherName"
                                            // error={!!touched.fatherName && !!errors.fatherName}
                                            // helperText={touched.fatherName && errors.fatherName}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <TextField
                                                sx={{

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
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="Mother's Name"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.motherName}
                                                name="motherName"
                                            // error={!!touched.motherName && !!errors.motherName}
                                            // helperText={touched.motherName && errors.motherName}
                                            />
                                        </Grid>

                                        {/* Identification Information */}
                                        <Grid item xs={12}>
                                            <Typography variant="h4">Identification Information</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <TextField
                                                sx={{

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
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="CNI Number"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.cniNumber}
                                                name="cniNumber"
                                            // error={!!touched.cniNumber && !!errors.cniNumber}
                                            // helperText={touched.cniNumber && errors.cniNumber}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <TextField
                                                sx={{

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
                                                fullWidth
                                                variant="filled"
                                                type="date"
                                                label="CNI Creation Date"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.cniCreationDate}
                                                name="cniCreationDate"
                                            // error={!!touched.cniCreationDate && !!errors.cniCreationDate}
                                            // helperText={touched.cniCreationDate && errors.cniCreationDate}
                                            />
                                        </Grid>

                                        {/* Account Details */}
                                        <Grid item xs={12}>
                                            <Typography variant="h4">Account Details</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <TextField
                                                sx={{

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
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="MSISDN"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.msisdn}
                                                name="msisdn"
                                            // error={!!touched.msisdn && !!errors.msisdn}
                                            // helperText={touched.msisdn && errors.msisdn}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <TextField
                                                sx={{

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
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="Account Id"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.accountId}
                                                name="accountId"
                                                inputProps={{ readOnly: true }}
                                            // error={!!touched.accountId && !!errors.accountId}
                                            // helperText={touched.accountId && errors.accountId}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <TextField
                                                sx={{

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
                                                fullWidth
                                                variant="filled"
                                                type="number"
                                                label="Initial Balance"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.initialBalance}
                                                name="initialBalance"
                                                inputProps={{ readOnly: true }}

                                            // error={!!touched.initialBalance && !!errors.initialBalance}
                                            // helperText={touched.initialBalance && errors.initialBalance}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={values.active}
                                                        onChange={handleChange}
                                                        name="active"
                                                        color="secondary"
                                                        disabled={true}
                                                    />
                                                }
                                                label="Active"
                                            />


                                        </Grid>

                                        {/* Other Information */}
                                        <Grid item xs={12}>
                                            <Typography variant="h4">Other Information</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6}>
                                            {/* <TextField
                                            sx={{
                                    
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
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            label="Language"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.language}
                                            name="language"
                                            error={!!touched.language && !!errors.language}
                                            helperText={touched.language && errors.language}
                                        /> */}

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
                                        <Grid item xs={12} sm={6} md={6}>
                                            <TextField
                                                sx={{

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
                                        </Grid>
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

                                        <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 2" }}>
                                            <InputLabel>Bank</InputLabel>
                                            <Select
                                                label="Bank"
                                                onBlur={handleBlur}
                                                onChange={(e) => handleBankChange(e, setFieldValue)}
                                                value={values.bankId}
                                                name="bankId"
                                                error={!!touched.bankId && !!errors.bankId}
                                            >
                                                <MenuItem value="">Select Bank</MenuItem>
                                                {banks.map((bank) => (
                                                    <MenuItem key={bank.bankId} value={bank.bankId}>
                                                        {bank.bankName}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {touched.bankId && errors.bankId && (
                                                <Alert severity="error">{errors.bankId}</Alert>
                                            )}
                                        </FormControl>

                                        <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 2" }}>
                                            <InputLabel>Branch</InputLabel>
                                            <Select
                                                label="Branch"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.branchId}
                                                name="branchId"
                                                error={!!touched.branchId && !!errors.branchId}
                                                disabled={!values.bankId}
                                            >
                                                <MenuItem value="">Select Branch</MenuItem>
                                                {filteredBranches.map((branch) => (
                                                    <MenuItem key={branch.id} value={branch.id}>
                                                        {branch.branchName}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {touched.branchId && errors.branchId && (
                                                <Alert severity="error">{errors.branchId}</Alert>
                                            )}
                                        </FormControl>



                                        <TextField
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
                                        <TextField
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

                                        />
                                        <TextField
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

                                        />
                                        <TextField
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
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            label="Internal ID"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.internalId}
                                            name="internalId"
                                        // error={!!touched.internalId && !!errors.internalId}
                                        // helperText={touched.internalId && errors.internalId}

                                        />
                                        <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 2" }}>
                                            <InputLabel>Other CBS</InputLabel>
                                            <Select
                                                label="Other CBS"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.otherCbs}
                                                name="otherCbs"
                                                error={!!touched.otherCbs && !!errors.otherCbs}
                                            >
                                                <MenuItem value={true}>Yes</MenuItem>
                                                <MenuItem value={false}>No</MenuItem>
                                            </Select>
                                            {touched.otherCbs && errors.otherCbs && (
                                                <Alert severity="error">{errors.otherCbs}</Alert>
                                            )}
                                        </FormControl>
                                    </Box>
                                }

                            </Box>
                            <Box display="flex" justifyContent="end" mt="20px">
                                <Stack direction="row" spacing={2}>
                                    <LoadingButton type="submit" color="secondary" variant="contained" loading={pending} loadingPosition="start"
                                        startIcon={<Save />}>
                                        {msisdn ? "Update Client Account" : "Create Client Account"}
                                    </LoadingButton>
                                    <Button color="primary" variant="contained" disabled={pending} onClick={() => navigate(-1)}>
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
    );
};


const checkoutSchema = yup.object().shape({
    msisdn: yup.string().required("Required"),
    branchId: yup.string().required("Required"),
    bankId: yup.string().required("Required"),
    cbsAccountNumber: yup.string().required("Required"),
    maximumAccountLimit: yup.string().required("Required"),
    minimumAccountLimit: yup.string().required("Required"),

});


export default ClientForm;
