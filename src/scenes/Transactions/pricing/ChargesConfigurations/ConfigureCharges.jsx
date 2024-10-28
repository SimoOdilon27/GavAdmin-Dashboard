import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Formik, Form, Field, FieldArray } from 'formik';
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
    IconButton,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Add, Remove, RemoveCircle, Save } from '@mui/icons-material';
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
    const spaceId = userData?.selectedSpace?.id

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
        chargedFee: 0,
        chargesId: '',
        ranges: [
            { minimumAmount: 0, maximumAmount: 0, chargedFee: 0, chargesId: '', }
        ],
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string(),
        description: Yup.string().required('Description is required'),
        percentage: Yup.number().min(0, 'Percentage must be non-negative'),
        bankId: Yup.string(),
        minimumAmount: Yup.number().min(0, 'Minimum amount must be non-negative'),
        maximumAmount: Yup.number().min(0, 'Maximum amount must be non-negative'),
        chargedFee: Yup.number().min(0, 'Charged fee must be non-negative'),

    });

    useEffect(() => {
        fetchBanks();
        fetchPricingData();
    }, []);

    const fetchBanks = async () => {
        try {
            const payload = {
                serviceReference: 'GET_ALL_BANKS',
                requestBody: '',
                spaceId: spaceId,
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
                requestBody: '',
                spaceId: spaceId,
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


    const createCharge = async (values) => {
        const payload = {
            serviceReference: 'OTHER_CHARGES',
            requestBody: JSON.stringify({
                description: values.description,
                name: values.name,
                percentage: values.percentage,
                active: values.active,
                chargesAppliesByPercentage: values.chargesAppliesByPercentage
            })
        };

        console.log("payload", payload);


        const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, usertoken);
        console.log("response==", response);

        if (response && response.body.meta.statusCode !== 200) {
            showSnackbar("Error creating charge", 'error');

            throw new Error(response.body.errors || 'Error creating charge');
        }
        return response.body.data.id; // Return the ID directly from the response
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setPending(true);

        try {
            if (values.bankId) {
                // Handle BANK_CHARGES case
                const payload = {
                    serviceReference: 'BANK_CHARGES',
                    requestBody: JSON.stringify({
                        bankId: values.bankId,
                        description: values.description,
                        name: values.name,
                        percentage: values.percentage,
                        active: values.active,
                        chargesAppliesByPercentage: !values.chargesAppliesByPercentage
                    })
                };

                console.log("payload===", payload);
                console.log("values===", values);

                const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, usertoken);
                console.log("response===", response);

                if (response && response.body.meta.statusCode !== 200) {
                    showSnackbar("Error saving bank charge", 'error');
                    // throw new Error(response.body.errors || 'Error saving bank charge');

                }

                showSnackbar("Bank charge saved successfully", 'success');

            } else if (values.chargesAppliesByPercentage) {
                // Create the charge first and get the ID
                const chargeId = await createCharge(values);

                // Now save each range using the obtained chargeId
                for (const range of values.ranges) {
                    const payload = {
                        serviceReference: 'CHARGES_RANGE',
                        requestBody: JSON.stringify({
                            minimumAmount: range.minimumAmount,
                            maximumAmount: range.maximumAmount,
                            chargedFee: range.chargedFee,
                            chargesId: chargeId // Use the ID from createCharge
                        })
                    };
                    console.log("payload===", payload);
                    console.log("values===", values);


                    const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, usertoken);
                    if (response && response.body.meta.statusCode !== 200) {
                        showSnackbar("Error saving range", 'error');
                        // throw new Error(response.body.errors || 'Error saving range');
                    }
                }

                showSnackbar("Charge and all ranges saved successfully", 'success');
            } else {
                // Handle OTHER_CHARGES case
                await createCharge(values);
                showSnackbar("Charge saved successfully", 'success');
            }

            resetForm();
        } catch (error) {
            console.error('Error:', error);
            showSnackbar(`Error: ${error.message}`, 'error');
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

                                <>

                                    <Typography variant="h6" sx={{ gridColumn: "span 4" }}>
                                        For a Specific Bank
                                    </Typography>

                                    <Typography variant="body2" color="textSecondary" sx={{ gridColumn: "span 4", mt: -2, mb: 0 }}>
                                        Select a bank if you want to apply the charge to a specific bank. Otherwise, leave it blank if you do not want to specify.
                                    </Typography>


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

                                <Typography variant="body2" color="textSecondary" sx={{ gridColumn: "span 4" }}>
                                    Check this box if you want to apply charges as a Range. Otherwise, you'll be able to set as a percentage.
                                </Typography>

                                <FormControlLabel
                                    control={
                                        <Field
                                            as={Checkbox}
                                            name="chargesAppliesByPercentage"
                                            color="secondary"
                                        />
                                    }
                                    label="Charges Applies by Range"
                                    sx={{ gridColumn: "span 4" }}
                                />


                                <Divider sx={{ gridColumn: "span 4", my: 2 }} />

                                {values.chargesAppliesByPercentage && (
                                    <FieldArray name="ranges">
                                        {({ push, remove }) => (
                                            <Box sx={{ gridColumn: "span 4" }}>
                                                {values.ranges.map((range, index) => (
                                                    <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                                        <TextField
                                                            fullWidth
                                                            variant="filled"
                                                            type="number"
                                                            label="Minimum Amount"
                                                            name={`ranges.${index}.minimumAmount`}
                                                            value={range.minimumAmount}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={touched.ranges?.[index]?.minimumAmount && errors.ranges?.[index]?.minimumAmount}
                                                            helperText={touched.ranges?.[index]?.minimumAmount && errors.ranges?.[index]?.minimumAmount}
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
                                                        />
                                                        <TextField
                                                            fullWidth
                                                            variant="filled"
                                                            type="number"
                                                            label="Maximum Amount"
                                                            name={`ranges.${index}.maximumAmount`}
                                                            value={range.maximumAmount}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={touched.ranges?.[index]?.maximumAmount && errors.ranges?.[index]?.maximumAmount}
                                                            helperText={touched.ranges?.[index]?.maximumAmount && errors.ranges?.[index]?.maximumAmount}
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
                                                        />
                                                        <TextField
                                                            fullWidth
                                                            variant="filled"
                                                            type="number"
                                                            label="Charged Fee"
                                                            name={`ranges.${index}.chargedFee`}
                                                            value={range.chargedFee}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={touched.ranges?.[index]?.chargedFee && errors.ranges?.[index]?.chargedFee}
                                                            helperText={touched.ranges?.[index]?.chargedFee && errors.ranges?.[index]?.chargedFee}
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
                                                        />
                                                        <IconButton
                                                            color="red"
                                                            variant="contained"
                                                            sx={{ color: colors.redAccent[500], mr: 2 }}
                                                            onClick={() => remove(index)}>
                                                            <RemoveCircle />
                                                        </IconButton>
                                                    </Box>
                                                ))}
                                                <Button
                                                    color="secondary"
                                                    variant="outlined"
                                                    startIcon={<Add />}
                                                    onClick={() => push({ minimumAmount: 0, maximumAmount: 0, chargedFee: 0 })}
                                                    sx={{ mt: 1 }}

                                                >
                                                    Add Range
                                                </Button>
                                            </Box>
                                        )}
                                    </FieldArray>
                                )}





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