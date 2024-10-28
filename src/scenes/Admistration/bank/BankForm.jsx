import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Select, Snackbar, Stack, TextField, Switch, FormControlLabel, RadioGroup, Radio, FormLabel, Checkbox } from "@mui/material";
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

const BankForm = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const userData = useSelector((state) => state.users);
    const token = userData.token;
    const spaceId = userData?.selectedSpace?.id
    const [corpID, setCorpID] = useState('');
    const [countryData, setCountryData] = useState([]);

    const regionsInCameroon = ["Adamaoua", "Centre", "Est", "Extrême-Nord", "Littoral", "Nord", "Nord-Ouest", "Ouest", "Sud", "Sud-Ouest"];

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

    const [formData, setFormData] = useState({
        id: "",
        address: "",
        contact: "",
        categoryId: "",
        bankEmail: "",
        email: "",
        bankName: "",
        cbsBankId: "",
        bankCode: "",
        bankSignature: "",
        bankSite: "",
        corporationId: "",
        accountType: "",
        dailyLimit: 0,
        country: "",
        bankManger: "",
        region: '',
        bankId: '',
        accountNumber: '',
        active: false
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
                const payload = {
                    serviceReference: 'UPDATE_BANK',
                    requestBody: JSON.stringify(values)
                };
                response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

                if (response && response.body.meta.statusCode === 200) {
                    showSnackbar('Bank Updated Successfully.', 'success');
                    setTimeout(() => {
                        navigate(-1);
                    }, 2000);
                } else {
                    showSnackbar(response.body.errors || 'Error Updating Bank', 'error');
                }
            } else {
                const payload = {
                    serviceReference: 'ADD_BANK',
                    requestBody: JSON.stringify(values)
                };
                response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

                if (response && response.body.meta.statusCode === 200) {
                    showSnackbar('Bank Created Successfully.', 'success');
                    setTimeout(() => {
                        navigate('/bank');
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

    const fetchCorpID = async () => {
        try {

            const payload = {
                serviceReference: 'GET_ALL_CORPORATIONS',
                requestBody: '',
                spaceId: spaceId,
            }
            // const response = await CBS_Services('AP', 'api/gav/corporation/management/getAll', 'GET', null);
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

            if (response && response.body.meta.statusCode === 200) {
                setCorpID(response.body.data);

            } else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchCountryDataWithDefaultId = async () => {
        try {
            const defaultInternalId = 'default'; // Set the default internalId here
            const response = await CBS_Services('APE', 'wallet/mapper/gimacCountries/list/all', 'POST', { internalId: defaultInternalId });

            console.log("fetchresp", response);

            if (response && response.status === 200) {
                setCountryData(response.body.data);
            } else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };



    useEffect(() => {
        // Fetch Bank data when the component mounts
        fetchCorpID();
        fetchCountryDataWithDefaultId();

    }, []);

    useEffect(() => {
        if (id && location.state && location.state.bankData) {
            setFormData(location.state.bankData);
        }
    }, [id, location.state]);

    return (
        <Box m="20px">
            <Header
                title={id ? "EDIT BANK" : "ADD BANK"}
                subtitle={id ? "Edit the Bank" : "Add a new Bank"}
            />

            <Formik
                onSubmit={handleFormSubmit}
                initialValues={formData}
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



                                <FormControl fullWidth variant="filled"
                                    sx={formFieldStyles("span 2")}

                                    InputLabelProps={{
                                        sx: {
                                            color: 'white', // Default label color
                                        }
                                    }}
                                >
                                    <InputLabel>Corporation</InputLabel>
                                    <Select
                                        label="Corporation"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.corporationId}
                                        name="corporationId"
                                        error={!!touched.corporationId && !!errors.corporationId}

                                    >
                                        <MenuItem value="">Select Corporation</MenuItem>
                                        {Array.isArray(corpID) && corpID.length > 0 ? (
                                            corpID.map(option => (
                                                <MenuItem key={option.corporationId} value={option.corporationId}>
                                                    {option.corporationName}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem value="">No Corporations available</MenuItem>
                                        )}
                                    </Select>
                                    {touched.corporationId && errors.corporationId && (
                                        <Alert severity="error">{errors.corporationId}</Alert>
                                    )}
                                </FormControl>

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Bank Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.bankName}
                                    name="bankName"
                                    error={!!touched.bankName && !!errors.bankName}
                                    helperText={touched.bankName && errors.bankName}
                                    sx={formFieldStyles("span 2")}

                                    InputLabelProps={{
                                        sx: {
                                            color: 'white', // Default label color
                                        }
                                    }}
                                />



                                {id &&
                                    (<TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label=" Account Number"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.accountNumber}
                                        name="accountNumber"
                                        error={!!touched.accountNumber && !!errors.accountNumber}
                                        helperText={touched.accountNumber && errors.accountNumber}
                                        sx={formFieldStyles("span 2")}

                                        InputLabelProps={{
                                            sx: {
                                                color: 'white', // Default label color
                                            }
                                        }}
                                    />)}

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="CBS Bank ID"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.cbsBankId}
                                    name="cbsBankId"
                                    error={!!touched.cbsBankId && !!errors.cbsBankId}
                                    helperText={touched.cbsBankId && errors.cbsBankId}
                                    sx={formFieldStyles("span 2")}

                                    InputLabelProps={{
                                        sx: {
                                            color: 'white', // Default label color
                                        }
                                    }}
                                />


                                <FormControl
                                    sx={formFieldStyles("span 2")}
                                    InputLabelProps={{
                                        sx: {
                                            color: 'white', // Default label color
                                        }
                                    }}
                                >
                                    <FormLabel >CBS Account Type</FormLabel>
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
                                    label="Bank Manager"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.bankManger}
                                    name="bankManger"
                                    error={!!touched.bankManger && !!errors.bankManger}
                                    helperText={touched.bankManger && errors.bankManger}
                                    sx={formFieldStyles("span 3")}

                                    InputLabelProps={{
                                        sx: {
                                            color: 'white', // Default label color
                                        }
                                    }}
                                />

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
                                    label="Bank Email"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.bankEmail}
                                    name="bankEmail"
                                    error={!!touched.bankEmail && !!errors.bankEmail}
                                    helperText={touched.bankEmail && errors.bankEmail}
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
                                    label="Contact"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.contact}
                                    name="contact"
                                    error={!!touched.contact && !!errors.contact}
                                    helperText={touched.contact && errors.contact}
                                    sx={formFieldStyles("span 1")}
                                    InputLabelProps={{
                                        sx: {
                                            color: 'white', // Default label color
                                        }
                                    }}
                                />

                                <FormControl fullWidth variant="filled"
                                    sx={formFieldStyles("span 1")}

                                    InputLabelProps={{
                                        sx: {
                                            color: 'white', // Default label color
                                        }
                                    }}
                                    error={!!touched.region && !!errors.region}
                                    helperText={touched.region && errors.region}
                                >
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
                                    sx={formFieldStyles("span 2")}

                                    InputLabelProps={{
                                        sx: {
                                            color: 'white', // Default label color
                                        }
                                    }}
                                />



                                <FormControl fullWidth variant="filled"
                                    sx={formFieldStyles("span 2")}>
                                    <InputLabel>Country</InputLabel>
                                    <Select
                                        label="Country"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.country}
                                        name="country"
                                        error={!!touched.country && !!errors.country}
                                    >
                                        <MenuItem value="" selected disabled>Select Wallet Type</MenuItem>
                                        {Array.isArray(countryData) && countryData.length > 0 ? (
                                            countryData.map((option) => (
                                                <MenuItem key={option.countryId} value={option.countryId}>
                                                    {option.country}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <option value="">No Countries available</option>
                                        )}
                                    </Select>
                                    {touched.country && errors.country && (
                                        <Alert severity="error">{errors.country}</Alert>
                                    )}

                                </FormControl>

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
                                        {id ? "Update Bank" : "Create Bank"}
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
    bankName: yup.string().required("required"),
    bankEmail: yup.string().email("Invalid email").required("required"),
    contact: yup.string().required("required"),
    region: yup.string(),
    address: yup.string().required("required"),
    bankManger: yup.string().required("required"),
    // dailyLimit: yup.number().required("required"),
    contact: yup.string().required("required"),
    cbsBankId: yup.string().required("required"),
    corporationId: yup.string().required("required"),
    // Add other validation rules here
});

export default BankForm;
