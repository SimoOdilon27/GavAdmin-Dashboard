import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Select, Snackbar, Stack, TextField, Switch, FormControlLabel, useTheme } from "@mui/material";
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

const TellerForm = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const { id } = useParams();
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
    const navigate = useNavigate();
    const location = useLocation();
    const userData = useSelector((state) => state.users);
    const token = userData.token;
    const [corporations, setCorporations] = useState([]);
    const [banks, setBanks] = useState([]);
    const [branches, setBranches] = useState([]);

    // Filtered lists
    const [filteredBanks, setFilteredBanks] = useState([]);
    const [filteredBranches, setFilteredBranches] = useState([]);

    const handleCorporationChange = (event, setFieldValue) => {
        const corporationId = event.target.value;
        setFieldValue('corporationId', corporationId);
        setFieldValue('bankId', ''); // Reset bank selection
        setFieldValue('branchId', ''); // Reset branch selection

        // Filter banks based on selected corporation
        const relatedBanks = banks.filter(bank => bank.corporationId === corporationId);
        setFilteredBanks(relatedBanks);
        setFilteredBranches([]); // Reset filtered branches
    };

    const handleBankChange = (event, setFieldValue) => {
        const bankId = event.target.value;
        setFieldValue('bankId', bankId);
        setFieldValue('branchId', ''); // Reset branch selection

        // Filter branches based on selected bank
        const relatedBranches = branches.filter(branch => branch.bankId === bankId);
        setFilteredBranches(relatedBranches);
    };

    const [formData] = useState({
        request: id,
        bankCode: '001',
        internalId: "back-office"
    });
    const [initialValues, setInitialValues] = useState({
        msisdn: "",
        branchId: "",
        language: "",
        cbsAccountId: "",
        tellerName: "",
        internalId: "",
        dailyLimit: 0,
        minimumAccountLimit: 0,
        maximumAccountLimit: 0,
        otherCbs: false,
        bankId: '',
        accountId: '',
        corporationId: '',
        balance: 0,
        virtualBalance: 0,
        active: false
    });

    console.log("initialValues", initialValues);

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
                    serviceReference: 'UPDATE_TELLER',
                    requestBody: JSON.stringify(values),
                }
                console.log("values", values);

                response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

                // response = await CBS_Services('APE', 'teller/update', 'PUT', values);
                if (response && response.body.meta.statusCode === 200) {
                    showSnackbar('Teller Updated Successfully.', 'success');
                    setTimeout(() => {
                        navigate(-1);
                    }, 2000);
                } else {
                    showSnackbar(response.body.errors || 'Error Updating Teller', 'error');
                }
            } else {
                // Add new teller

                const payload = {
                    serviceReference: 'CREATE_TELLER',
                    requestBody: JSON.stringify(values),
                }
                console.log("values", values);
                const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

                // response = await CBS_Services('APE', 'teller/create', 'POST', values);
                if (response && response.body.meta.statusCode === 200) {
                    showSnackbar('Teller Created Successfully.', 'success');
                    setTimeout(() => {
                        navigate('/tellers');
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

    const fetchBranchID = async () => {
        try {

            const payload = {
                serviceReference: 'GET_ALL_BRANCHES',
                requestBody: ''
            }
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            console.log("response Branch", response);

            // const response = await CBS_Services('AP', `api/gav/bankBranch/getAll`, 'GET', null);

            if (response && response.body.meta.statusCode === 200) {
                setBranches(response.body.data);

            } else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const fetchBankID = async () => {
        try {
            const payload = {
                serviceReference: 'GET_ALL_BANKS',
                requestBody: ''
            }
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            console.log("response Bank", response);

            // const response = await CBS_Services('AP', `api/gav/bank/getAll`, 'GET', null);
            console.log("fetchbankid", response);

            if (response && response.status === 200) {
                setBanks(response.body.data);

            } else if (response && response.body.status === 401) {
                showSnackbar(response.body.errors || 'Error fetching Teller', 'error');

            }
            else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchCorpID = async () => {
        try {

            const payload = {
                serviceReference: 'GET_ALL_CORPORATIONS',
                requestBody: ''
            }
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            console.log("response Corporation", response);

            if (response && response.status === 200) {
                setCorporations(response.body.data);

            } else if (response && response.body.status === 401) {
                showSnackbar(response.body.errors || 'Error fetching Corporation', 'error');
            }
            else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchBranchID();
        fetchBankID();
        fetchCorpID()
    }, [])



    useEffect(() => {
        if (id && location.state && location.state.tellerData) {
            // Use the data passed from the Tellers component
            setInitialValues(location.state.tellerData);
        }
    }, [id, location.state]);

    return (
        <Box m="20px">
            <Header
                title={id ? "EDIT TELLER" : "ADD TELLER"}
                subtitle={id ? `Edit teller ${initialValues?.msisdn}` : "Add a new teller"}
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
                                    label="Teller Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.tellerName}
                                    name="tellerName"
                                    error={!!touched.tellerName && !!errors.tellerName}
                                    helperText={touched.tellerName && errors.tellerName}
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
                                />
                                <TextField
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
                                />

                                <FormControl fullWidth variant="filled" sx={{
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
                                }}>
                                    <InputLabel>Corporation</InputLabel>
                                    <Select
                                        label="Corporation"
                                        onBlur={handleBlur}
                                        onChange={(e) => handleCorporationChange(e, setFieldValue)}
                                        value={values.corporationId}
                                        name="corporationId"
                                        error={!!touched.corporationId && !!errors.corporationId}
                                    >
                                        <MenuItem value="">Select Corporation</MenuItem>
                                        {corporations.map((corp) => (
                                            <MenuItem key={corp.corporationId} value={corp.corporationId}>
                                                {corp.corporationName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {touched.language && errors.language && (
                                        <Alert severity="error">{errors.language}</Alert>
                                    )}
                                </FormControl>

                                <FormControl fullWidth variant="filled" sx={{
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
                                }}>
                                    <InputLabel>Bank</InputLabel>
                                    <Select
                                        label="Bank"
                                        onBlur={handleBlur}
                                        onChange={(e) => handleBankChange(e, setFieldValue)}
                                        value={values.bankId}
                                        name="bankId"
                                        error={!!touched.bankId && !!errors.bankId}
                                        disabled={!values.corporationId}
                                    >
                                        <MenuItem value="">Select Bank</MenuItem>
                                        {filteredBanks.map((bank) => (
                                            <MenuItem key={bank.bankId} value={bank.bankId}>
                                                {bank.bankName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {touched.bankId && errors.bankId && (
                                        <Alert severity="error">{errors.bankId}</Alert>
                                    )}
                                </FormControl>

                                <FormControl fullWidth variant="filled" sx={{
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
                                }}>
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




                                <FormControl fullWidth variant="filled" sx={{
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
                                }}>
                                    <InputLabel>Language</InputLabel>
                                    <Select
                                        label="Language"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.language}
                                        name="language"
                                        error={!!touched.language && !!errors.language}
                                    >
                                        <MenuItem value="" selected>Select Language</MenuItem>
                                        <MenuItem value="FRENCH">FRENCH</MenuItem>
                                        <MenuItem value="ENGLISH">ENGLISH</MenuItem>

                                    </Select>
                                    {touched.language && errors.language && (
                                        <Alert severity="error">{errors.language}</Alert>
                                    )}
                                </FormControl>
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="CBS Account ID"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.cbsAccountId}
                                    name="cbsAccountId"
                                    error={!!touched.cbsAccountId && !!errors.cbsAccountId}
                                    helperText={touched.cbsAccountId && errors.cbsAccountId}
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
                                />



                                {id ? (

                                    <>



                                        <TextField
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            label="accountId"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.accountId}
                                            name="accountId"
                                            error={!!touched.accountId && !!errors.accountId}
                                            helperText={touched.accountId && errors.accountId}
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




                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={values.active}
                                                    onChange={handleChange}
                                                    name="active"
                                                    color="secondary"
                                                />
                                            }
                                            label="Alpha CBS"
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

                                    </>) : (

                                    <>

                                        <TextField
                                            fullWidth
                                            variant="filled"
                                            type="number"
                                            label="Daily Limit"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.dailyLimit}
                                            name="dailyLimit"
                                            error={!!touched.dailyLimit && !!errors.dailyLimit}
                                            helperText={touched.dailyLimit && errors.dailyLimit}
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
                                            label="Minimum Account Limit"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.minimumAccountLimit}
                                            name="minimumAccountLimit"
                                            error={!!touched.minimumAccountLimit && !!errors.minimumAccountLimit}
                                            helperText={touched.minimumAccountLimit && errors.minimumAccountLimit}
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
                                        />
                                        <TextField
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
                                        />

                                        <TextField
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            label="Internal ID"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.internalId}
                                            name="internalId"
                                            error={!!touched.internalId && !!errors.internalId}
                                            helperText={touched.internalId && errors.internalId}
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
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={values.otherCbs}
                                                    onChange={handleChange}
                                                    name="otherCbs"
                                                    color="secondary"
                                                />
                                            }
                                            label="Alpha CBS"
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


                            </Box>
                            <Box display="flex" justifyContent="end" mt="20px">
                                <Stack direction="row" spacing={2}>

                                    {/* <LoadingButton
                                    type="submit"
                                    color="secondary"
                                    variant="contained"
                                    loading={pending}
                                    loadingPosition="start"
                                    startIcon={<Save />}
                                >
                                    {id ? "Update Teller" : "Create Teller"}
                                </LoadingButton> */}
                                    {id ? "" :
                                        <LoadingButton
                                            type="submit"
                                            color="secondary"
                                            variant="contained"
                                            loading={pending}
                                            loadingPosition="start"
                                            startIcon={<Save />}
                                        >
                                            {/* {id ? "Update Teller" : "Create Teller"} */}
                                            Create Teller
                                        </LoadingButton>
                                    }
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
    );
};

const checkoutSchema = yup.object().shape({
    msisdn: yup.string().required("required"),
    branchId: yup.string().required("required"),
    language: yup.string().required("required"),
    cbsAccountId: yup.string(),
    tellerName: yup.string().required("required"),
    internalId: yup.string(),
    dailyLimit: yup.number().required("required"),
    minimumAccountLimit: yup.number().required("required"),
    maximumAccountLimit: yup.number().required("required"),
    otherCbs: yup.boolean(),
});

export default TellerForm;