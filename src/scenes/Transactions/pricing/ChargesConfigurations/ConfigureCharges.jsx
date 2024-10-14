import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
    Box,
    TextField,
    FormControlLabel,
    Switch,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Typography,
    Snackbar,
    Alert,
    useTheme,
    useMediaQuery,
    Checkbox,
    Divider,
    Button,
    Stack,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Save } from '@mui/icons-material';
import CBS_Services from '../../../../services/api/GAV_Sercives';
import { tokens } from '../../../../theme';
import Header from '../../../../components/Header';
import { useNavigate } from 'react-router-dom';

const ConfigureCharges = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [pending, setPending] = useState(false);
    const userData = useSelector((state) => state.users);
    const usertoken = userData.token;
    const [banks, setBanks] = useState([]);
    const [pricingData, setPricingData] = useState([]);
    const navigate = useNavigate();

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

    const initialValues = {
        name: '',
        description: '',
        percentage: 0,
        active: true,
        chargesAppliesByPercentage: false,
        bankId: '',
        minimumAmount: 0,
        maximumAmount: 0,
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string(),
        description: Yup.string().required('Description is required'),
        percentage: Yup.number().min(0, 'Percentage must be non-negative'),
        bankId: Yup.string(),
        minimumAmount: Yup.number().min(0, 'Minimum amount must be non-negative'),
        maximumAmount: Yup.number().min(0, 'Maximum amount must be non-negative')

    });

    useEffect(() => {
        fetchBanks();
        fetchPricingData();
    }, []);

    const fetchBanks = async () => {
        try {
            const payload = {
                serviceReference: 'GET_ALL_BANKS',
                requestBody: ''
            };
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, usertoken);
            if (response && response.body.meta.statusCode === 200) {
                setBanks(response.body.data);
            } else {
                console.error('Error fetching banks');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchPricingData = async () => {
        setPending(true);
        try {
            const payload = {
                serviceReference: 'GET_ALL_CHARGES',
                requestBody: ''
            }
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, usertoken);

            // const response = await CBS_Services('APE', 'pricing/get/all', 'GET');
            if (response && response.status === 200) {
                setPricingData(response.body.data || []);
            } else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setPending(false);
    };


    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setPending(true);
        let serviceReference;
        let requestBody;

        if (values.bankId) {
            serviceReference = 'BANK_CHARGES';
            requestBody = {
                bankId: values.bankId,
                description: values.description,
                name: values.name,
                percentage: values.percentage,
                active: values.active,
                chargesAppliesByPercentage: values.chargesAppliesByPercentage
            };
        } else if (!values.chargesAppliesByPercentage) {
            serviceReference = 'CHARGES_RANGE';
            requestBody = {
                chargedFee: values.chargedFee,
                chargesId: values.chargesId,
                minimumAmount: values.minimumAmount,
                maximumAmount: values.maximumAmount
            };
        } else {
            serviceReference = 'OTHER_CHARGES';
            requestBody = {
                description: values.description,
                name: values.name,
                percentage: values.percentage,
                active: values.active,
                chargesAppliesByPercentage: values.chargesAppliesByPercentage
            };
        }

        try {
            const payload = {
                serviceReference,
                requestBody: JSON.stringify(requestBody)
            };

            console.log("payload===", payload);
            console.log("values===", values);

            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, usertoken);
            console.log("response===", response);

            if (response && response.body.meta.statusCode === 200) {
                showSnackbar("Charges saved successfully", 'success');
                resetForm();
            } else if (response && response.body.status === 401) {
                showSnackbar('Unauthorized to perform action', 'error');
            } else {
                showSnackbar(response.body.errors || 'Error', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showSnackbar('Connection Error! Try again later', 'error');
        } finally {
            setPending(false);
            setSubmitting(false);
        }
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

    return (
        <Box m="20px">
            <Header
                title={"Configure Charges"}
                subtitle={"Configure charges for your Services"}
            />
            <Box
                display="grid"
                sx={{
                    px: 2, // Optional: horizontal padding for the outer container
                    padding: "10px 100px 20px 100px"

                }}
            >

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (

                        <Form>
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
                                <Typography variant="h4" sx={{ gridColumn: "span 4", mb: 1 }}>
                                    Charge Configuration
                                </Typography>

                                <FormControlLabel
                                    control={
                                        <Field
                                            as={Checkbox}
                                            name="chargesAppliesByPercentage"
                                            color="secondary"
                                        />
                                    }
                                    label="Charges Applied by Percentage"
                                    sx={{ gridColumn: "span 4" }}
                                />

                                <Typography variant="body2" color="textSecondary" sx={{ gridColumn: "span 4", mt: -2, mb: 2 }}>
                                    Check this box if you want to apply charges as a percentage. Otherwise, you'll be able to set fixed charges.
                                </Typography>

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

                                {values.chargesAppliesByPercentage && (
                                    <>
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
                                            type="number"
                                            label="Percentage"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.percentage}
                                            name="percentage"
                                            error={!!touched.percentage && !!errors.percentage}
                                            helperText={touched.percentage && errors.percentage}
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
                                    </>
                                )}

                                {!values.chargesAppliesByPercentage && (
                                    <>
                                        <FormControl fullWidth variant="filled" sx={{
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

                                        }}>
                                            <InputLabel>Charge</InputLabel>
                                            <Select
                                                label="charge"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.chargesId}
                                                name="chargesId"
                                                error={!!touched.chargesId && !!errors.chargesId}
                                            >
                                                <MenuItem value="">Select Charge</MenuItem>
                                                {Array.isArray(pricingData) && pricingData.length > 0 ? (
                                                    pricingData.map(option => (
                                                        <MenuItem key={option.id} value={option.id}>
                                                            {option.name}
                                                        </MenuItem>
                                                    ))
                                                ) : (
                                                    <MenuItem value="">No Charges available</MenuItem>
                                                )}
                                            </Select>
                                            {touched.chargesId && errors.chargesId && (
                                                <Alert severity="error">{errors.chargesId}</Alert>
                                            )}
                                        </FormControl>

                                        <TextField
                                            fullWidth
                                            variant="filled"
                                            type="number"
                                            label="Minimum Amount"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.minimumAmount}
                                            name="minimumAmount"
                                            error={!!touched.minimumAmount && !!errors.minimumAmount}
                                            helperText={touched.minimumAmount && errors.minimumAmount}
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
                                            type="number"
                                            label="Maximum Amount"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.maximumAmount}
                                            name="maximumAmount"
                                            error={!!touched.maximumAmount && !!errors.maximumAmount}
                                            helperText={touched.maximumAmount && errors.maximumAmount}
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
                                    </>
                                )}

                                {values.chargesAppliesByPercentage && (
                                    <>
                                        <Divider sx={{ gridColumn: "span 4", my: 2 }} />

                                        <Typography variant="h6" sx={{ gridColumn: "span 4", mb: 1 }}>
                                            For a Specific Bank
                                        </Typography>

                                        <Typography variant="body2" color="textSecondary" sx={{ gridColumn: "span 4", mt: -2, mb: 1 }}>
                                            Select a bank if you want to apply the charge to a specific bank. Otherwise, leave it blank if you do not want to specify.
                                        </Typography>


                                        <FormControl fullWidth variant="filled" sx={{
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
                                        }}>
                                            <InputLabel>Bank</InputLabel>
                                            <Field
                                                as={Select}
                                                name="bankId"
                                                label="Bank"
                                                error={!!touched.bankId && !!errors.bankId}
                                            >
                                                <MenuItem value="">Select Bank</MenuItem>
                                                {banks.map((bank) => (
                                                    <MenuItem key={bank.bankId} value={bank.bankId}>
                                                        {bank.bankName}
                                                    </MenuItem>
                                                ))}
                                            </Field>
                                            {touched.bankId && errors.bankId && (
                                                <Typography color="error">{errors.bankId}</Typography>
                                            )}
                                        </FormControl>
                                    </>
                                )}

                                {/* <FormControlLabel
                                    control={
                                        <Field
                                            as={Checkbox}
                                            name="active"
                                            color="secondary"
                                            disabled={true}
                                            
                                        />
                                    }
                                    label="Active"
                                    sx={{ gridColumn: "span 2", justifyContent: "flex-start" }}
                                /> */}
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
                                        disabled={isSubmitting}
                                    >
                                        Save Charges
                                    </LoadingButton>
                                </Stack>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Box>
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

export default ConfigureCharges;