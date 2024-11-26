import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Select, Snackbar, Stack, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CBS_Services from "../../../services/api/GAV_Sercives";
import { LoadingButton } from "@mui/lab";
import { Save } from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import { FormFieldStyles } from "../../../tools/fieldValuestyle";

const BankServiceConfigForm = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const userData = useSelector((state) => state.users);
    const token = userData.token;
    const spaceId = userData?.selectedSpace?.id;
    const type = userData?.selectedSpace?.type;
    const UserId = userData.userId;
    const [services, setServices] = useState([]);
    const [pending, setPending] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

    const levelOptions = ["CORPORATION", "BANK"]; // For Credix

    const [formData, setFormData] = useState({
        bankOrCorporationId: spaceId,
        level: "",
        serviceName: [],
        userId: UserId,
    });

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    const fetchServices = async () => {
        try {
            const payload = {
                serviceReference: 'GET_ALL_SERVICES_TYPES',
                requestBody: '',
                spaceId: spaceId,
            };
            // const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            const response = await CBS_Services('APE', 'gavServiceType/getAll', 'GET');

            if (response && response.body.meta.statusCode === 200) {
                setServices(response.body.data);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };



    useEffect(() => {
        fetchServices();
    }, []);

    const handleFormSubmit = async (values) => {
        setPending(true);
        try {

            const submitData = {
                ...values,
                spaceId: spaceId,
                level: type
            };

            const payload = {
                serviceReference: 'CREATE_SERVICE_CONFIGURATION',
                requestBody: JSON.stringify(submitData),
                spaceId: spaceId,
            };

            // const response = await CBS_Services('GATEWAY', 'api/gav/serviceConfiguration/getAllServicesConfiguration/create', 'POST', submitData, token);
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

            if (response && response.status === 200) {

                showSnackbar('Service Configuration Created Successfully.', 'success');
                setTimeout(() => {
                    navigate('/service-configurations');
                }, 2000);
            } else {
                showSnackbar(response?.message || 'Error Creating Service Configuration', 'error');
            }
        } catch (error) {
            console.error("Error:", error);
            showSnackbar('Error Try Again Later', 'error');
        }
        setPending(false);
    };

    return (
        <Box m="20px">
            <Header
                title="ADD SERVICE CONFIGURATION"
                subtitle="Create a new service configuration (This Configuration is meant for Corporations and Banks)"
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
                                {/* <FormControl fullWidth variant="filled" sx={FormFieldStyles("span 2")}>
                                    <InputLabel>Bank/Corporation</InputLabel>
                                    <Select
                                        value={values.bankOrCorporationId}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        name="bankOrCorporationId"
                                        error={!!touched.bankOrCorporationId && !!errors.bankOrCorporationId}
                                    >
                                        {banks.map((bank) => (
                                            <MenuItem key={bank.id} value={bank.id}>
                                                {bank.bankName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {touched.bankOrCorporationId && errors.bankOrCorporationId && (
                                        <Alert severity="error">{errors.bankOrCorporationId}</Alert>
                                    )}
                                </FormControl> */}

                                {type === "CREDIX" &&
                                    <FormControl fullWidth variant="filled" sx={FormFieldStyles("span 4")}>
                                        <InputLabel>Level</InputLabel>
                                        <Select
                                            value={values.level}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            name="level"
                                            error={!!touched.level && !!errors.level}
                                        >
                                            {levelOptions.map((level) => (
                                                <MenuItem key={level} value={level}>
                                                    {level}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {touched.level && errors.level && (
                                            <Alert severity="error">{errors.level}</Alert>
                                        )}
                                    </FormControl>
                                }


                                <FormControl fullWidth variant="filled" sx={FormFieldStyles("span 4")}>
                                    <InputLabel>Services</InputLabel>
                                    <Select
                                        multiple
                                        value={values.serviceName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        name="serviceName"
                                        error={!!touched.serviceName && !!errors.serviceName}
                                    >
                                        {services.map((service) => (
                                            <MenuItem key={service.serviceName} value={service.serviceName}>
                                                {service.serviceName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {touched.serviceName && errors.serviceName && (
                                        <Alert severity="error">{errors.serviceName}</Alert>
                                    )}
                                </FormControl>

                                {/* <FormControl fullWidth variant="filled" sx={FormFieldStyles("span 2")}>
                                    <InputLabel>User</InputLabel>
                                    <Select
                                        value={values.userId}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        name="userId"
                                        error={!!touched.userId && !!errors.userId}
                                    >
                                        {users.map((user) => (
                                            <MenuItem key={user.id} value={user.id}>
                                                {user.username}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {touched.userId && errors.userId && (
                                        <Alert severity="error">{errors.userId}</Alert>
                                    )}
                                </FormControl> */}
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
                                        disabled={type === "CREDIX"}
                                    >
                                        Create Configuration
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
    bankOrCorporationId: yup.string().required("Bank/Corporation is required"),
    level: yup.string().required("Level is required"),
    serviceName: yup.array().min(1, "At least one service must be selected").required("Services are required"),
    userId: yup.string().required("User is required"),
});

export default BankServiceConfigForm;