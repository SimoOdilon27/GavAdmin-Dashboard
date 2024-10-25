import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Select, Snackbar, Stack, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../../components/Header";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CBS_Services from "../../../../services/api/GAV_Sercives";
import { LoadingButton } from "@mui/lab";
import { Save } from "@mui/icons-material";
import { tokens } from "../../../../theme";
import { useTheme } from "@emotion/react";



const SpaceForm = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const userData = useSelector((state) => state.users);
    const [typeData, settypeData] = useState([]);
    const token = userData.token;
    const [initialValues, setInitialValues] = useState({
        id: "",
        type: "",
        description: "",
        intitule: "",
    });

    const [pending, setPending] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

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
                // Update existing Space item
                const response = await CBS_Services('APE', 'Space/addOrUpdate', 'POST', values);
                console.log("editresponse", response);


                if (response && response.status === 200) {
                    showSnackbar('Space Edited Successfully.', 'success');
                    setTimeout(() => {
                        navigate(-1);
                    }, 2000);
                } else {
                    // toast.error(response.body.errors || "Error Editing Space");
                    showSnackbar(response.body.errors || 'Error Editing Space', 'error');

                }
            } else {
                // Add new Space item
                const response = await CBS_Services('APE', 'Space/addOrUpdate', 'POST', values);

                if (response && response.status === 200) {
                    showSnackbar('Space Created Successfully.', 'success');
                    // navigate("/menu-Space"); // Navigate back to the Space list
                    setTimeout(() => {
                        navigate(-1);
                    }, 2000);
                } else {
                    showSnackbar(response.body.errors || 'Error Adding Space', 'error');
                }
            }

            if (response && response.status === 200) {
                navigate("/menu-Space"); // Navigate back to the Space list
            }
        } catch (error) {
            console.error("Error:", error);
            // toast.error(`Error ${id ? "Editing" : "Adding"} Space`);
            showSnackbar('Error Try Again Later', 'error');

        }
        setPending(false);
    };


    useEffect(() => {
        if (id && location.state && location.state.spaceData) {
            // Use the data passed from the spaceData component
            setInitialValues(location.state.spaceData);
        }
    }, [id, location.state]);

    const fetchtypeData = async () => {
        setPending(true);
        try {
            const response = await CBS_Services('GATEWAY', 'clientGateWay/type/getAllType', 'GET', null, token);
            console.log("fetchresponse=====", response);

            if (response && response.status === 200) {
                settypeData(response.body.data || []);
                // setSuccessMessage('');
                // setErrorMessage('');
            } else {
                settypeData([]);
                showSnackbar('Error Finding Data.', 'error');
            }

        } catch (error) {
            console.log('Error:', error);
        }
        setPending(false);
    }

    useEffect(() => {
        fetchtypeData();
    }, []);
    return (
        <Box m="20px">
            <Header
                title={id ? "EDIT Space ITEM" : "ADD Space ITEM"}
                subtitle={id ? "Edit the Space item" : "Add a new Space item"}
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
                                    label="Space Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.id}
                                    name="id"
                                    error={!!touched.id && !!errors.id}
                                    helperText={touched.id && errors.id}
                                    sx={formFieldStyles("span 2")}
                                />

                                <FormControl fullWidth variant="filled"
                                    sx={formFieldStyles("span 2")}>
                                    <InputLabel>Type</InputLabel>
                                    <Select
                                        label="Type"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.type}
                                        name="type"
                                        error={!!touched.type && !!errors.type}
                                    >
                                        <MenuItem value="">Select type</MenuItem>
                                        {typeData.map((type) => (
                                            <MenuItem key={type.intitule} value={type.intitule}>
                                                {type.intitule}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {touched.type && errors.type && (
                                        <Alert severity="error">{errors.type}</Alert>
                                    )}
                                </FormControl>

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
                                    sx={formFieldStyles("span 3")}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Label"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.intitule}
                                    name="intitule"
                                    error={!!touched.intitule && !!errors.intitule}
                                    helperText={touched.intitule && errors.intitule}
                                    sx={formFieldStyles("span 1")}
                                />

                            </Box>
                            <Box display="flex" justifyContent="end" mt="20px">
                                <Stack direction="row" spacing={2}>

                                    <LoadingButton type="submit" color="secondary" variant="contained" loading={pending} loadingPosition="start"
                                        startIcon={<Save />}>
                                        {id ? "Update Space" : "Create Space"}
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
    )
}
const checkoutSchema = yup.object().shape({
    id: yup.string().required("required"),
    type: yup.string().required("required"),
    intitule: yup.string().required("required"),
    description: yup.string().required("required"),

});

export default SpaceForm
