import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Select, Snackbar, Stack, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CBS_Services from "../../../services/api/GAV_Sercives";
import { LoadingButton } from "@mui/lab";
import { Save } from "@mui/icons-material";
import { tokens } from "../../../theme";
import { useTheme } from "@emotion/react";
import { FormFieldStyles } from "../../../tools/fieldValuestyle";

const CatalogForm = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const { id } = useParams();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.users);
    const token = userData.token;
    const spaceId = userData?.selectedSpace?.id
    const [initialValues, setInitialValues] = useState({
        catalogName: "",
        serviceProvider: "",
        description: "",
        endPoint: "",
        requestType: "",
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
                // Update existing catalog item
                const response = await CBS_Services('APE', 'catalog/addOrUpdate', 'POST', values);
                console.log("editresponse", response);


                if (response && response.status === 200) {
                    showSnackbar('Catalog Edited Successfully.', 'success');
                    setTimeout(() => {
                        navigate('/menu-catalog');
                    }, 2000);
                } else {
                    // toast.error(response.body.errors || "Error Editing Catalog");
                    showSnackbar(response.body.errors || 'Error Editing Catalog', 'error');

                }
            } else {
                // Add new catalog item
                const response = await CBS_Services('APE', 'catalog/addOrUpdate', 'POST', values);

                if (response && response.status === 200) {
                    showSnackbar('Catalog Created Successfully.', 'success');
                    // navigate("/menu-catalog"); // Navigate back to the catalog list
                    setTimeout(() => {
                        navigate('/menu-catalog');
                    }, 2000);
                } else {
                    showSnackbar(response.body.errors || 'Error Adding Catalog', 'error');
                }
            }

            if (response && response.status === 200) {
                navigate("/menu-catalog"); // Navigate back to the catalog list
            }
        } catch (error) {
            console.error("Error:", error);
            // toast.error(`Error ${id ? "Editing" : "Adding"} Catalog`);
            showSnackbar('Error Try Again Later', 'error');

        }
        setPending(false);
    };

    useEffect(() => {
        if (id) {
            // Fetch the existing catalog item by ID to populate the form for editing
            CBS_Services("APE", `catalog/get/${id}`, "GET", null,)
                .then((response) => {
                    if (response && response.status === 200) {
                        setInitialValues(response.body.data);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching catalog item:", error);
                });
        }
    }, []);

    return (
        <Box m="20px">
            <Header
                title={id ? "EDIT RESOURCE ITEM" : "ADD RESOURCE ITEM"}
                subtitle={id ? "Edit the Resource item" : "Add a new Resource item"}
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
                                    padding: "40px",
                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                                }}
                            >

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Catalog Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.id}
                                    name="id"
                                    error={!!touched.id && !!errors.id}
                                    helperText={touched.id && errors.serviceProvider}
                                    sx={FormFieldStyles("span 2")}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Service Provider"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.serviceProvider}
                                    name="serviceProvider"
                                    error={!!touched.serviceProvider && !!errors.serviceProvider}
                                    helperText={touched.serviceProvider && errors.serviceProvider}
                                    sx={FormFieldStyles("span 2")}
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
                                    sx={FormFieldStyles("span 4")}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Endpoint"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.endPoint}
                                    name="endPoint"
                                    error={!!touched.endPoint && !!errors.endPoint}
                                    helperText={touched.endPoint && errors.endPoint}
                                    sx={FormFieldStyles("span 3")}
                                />


                                <FormControl fullWidth variant="filled"
                                    sx={FormFieldStyles("span 1")}>
                                    <InputLabel>Request Type</InputLabel>
                                    <Select
                                        label="Request Type"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.requestType}
                                        name="requestType"
                                        error={!!touched.requestType && !!errors.requestType}
                                    >
                                        <MenuItem value="POST">POST</MenuItem>
                                        <MenuItem value="GET">GET</MenuItem>
                                        <MenuItem value="PUT">PUT</MenuItem>
                                        <MenuItem value="DELETE">DELETE</MenuItem>
                                    </Select>
                                    {touched.requestType && errors.requestType && (
                                        <Alert severity="error">{errors.requestType}</Alert>
                                    )}
                                </FormControl>
                            </Box>
                            <Box display="flex" justifyContent="end" mt="20px">
                                <Stack direction="row" spacing={2}>
                                    <Button color="primary" variant="contained" disabled={pending} onClick={() => navigate(-1)}>
                                        Cancel
                                    </Button>
                                    <LoadingButton type="submit" color="secondary" variant="contained" loading={pending} loadingPosition="start"
                                        startIcon={<Save />}>
                                        {id ? "Update Catalog" : "Create Catalog"}
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
    id: yup.string().required("required"),
    serviceProvider: yup.string().required("required"),
    description: yup.string().required("required"),
    endPoint: yup.string().required("required"),
    requestType: yup.string().required("required"),
});

export default CatalogForm;
