import { Alert, Box, Button, TextField, Stack, Snackbar } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CBS_Services from "../../services/api/GAV_Sercives";
import { LoadingButton } from "@mui/lab";
import { Save } from "@mui/icons-material";
import { tokens } from "../../theme";
import { useTheme } from '@mui/material/styles';
import { FormFieldStyles } from "../../tools/fieldValuestyle";

const BankServicesForm = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { serviceName } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const userData = useSelector((state) => state.users);
    const token = userData.token;
    const spaceId = userData?.selectedSpace?.id;

    const [formData, setFormData] = useState({
        serviceName: "",
        serviceTag: "",
        internalId: "Back-Office"
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

            const payload = {
                serviceReference: 'CREATE_BANK_SERVICE_TYPE',
                requestBody: JSON.stringify(values),
                spaceId: spaceId,
            }

            const response = await CBS_Services('APE', 'gavServiceType/add', 'POST', values, token);

            if (response && response.status === 200) {
                showSnackbar('Bank Service Created Successfully.', 'success');
                setTimeout(() => {
                    navigate(-1);
                }, 2000);
            } else {
                showSnackbar(response?.message || 'Error Adding Bank Service', 'error');
            }
        } catch (error) {
            console.error("Error:", error);
            showSnackbar('Error Try Again Later', 'error');
        }
        setPending(false);
    };

    useEffect(() => {
        if (serviceName && location.state && location.state.serviceData) {
            setFormData(location.state.serviceData);
        }
    }, [serviceName, location.state]);

    console.log("formData", formData);


    return (
        <Box m="20px">
            <Header
                title={serviceName ? "BANK SERVICE TYPE" : "BANK SERVICE TYPE"}
                subtitle={serviceName ? `Edit Bank Service Type ${serviceName}` : "Add a new Bank Service"}
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
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Service Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.serviceName}
                                    name="serviceName"
                                    error={!!touched.serviceName && !!errors.serviceName}
                                    helperText={touched.serviceName && errors.serviceName}
                                    sx={FormFieldStyles("span 4")}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Service Tag"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.serviceTag}
                                    name="serviceTag"
                                    error={!!touched.serviceTag && !!errors.serviceTag}
                                    helperText={touched.serviceTag && errors.serviceTag}
                                    sx={FormFieldStyles("span 4")}
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
                                        {serviceName ? "Update Service" : "Create Service"}
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
    );
};

const checkoutSchema = yup.object().shape({
    serviceName: yup.string().required("required"),
    serviceTag: yup.string().required("required"),
});

export default BankServicesForm;