import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Select, Snackbar, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import React, { useEffect, useState } from "react";
import CBS_Services from "../../../services/api/GAV_Sercives";
import { useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import { Save } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const UserForm = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [initialValues, setInitialValues] = useState({
        userName: "",
        password: "",
        email: "",
        roles: "",
        refId: "",
        actif: true,
        tel: "",
        language: ""
    })

    console.log("initialValues", initialValues);

    const [tellerData, setTellerData] = useState([]);
    const [roleData, setRoleData] = useState([]);
    const [loading, setLoading] = useState(false);
    const userData = useSelector((state) => state.users);
    const token = userData.token;
    const [selectedTeller, setSelectedTeller] = useState(''); // New state for selected lawyer
    const navigate = useNavigate();
    console.log("selectedTe,", selectedTeller);

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

    const fetchRoleData = async () => {
        try {
            const response = await CBS_Services('GATEWAY', 'role/getAllRole', 'GET', null, token);
            if (response && response.status === 200) {
                setRoleData(response.body.data || []);
            } else {
                showSnackbar('Error Finding Data.', 'error');
            }
        } catch (error) {
            console.log('Error:', error);
            showSnackbar('Network Error!!! Try again Later.', 'error');
        }
    };

    const fetchTellerData = async () => {
        try {
            const payload = {
                serviceReference: 'GET_ALL_TELLERS',
                requestBody: JSON.stringify({ internalId: "string" })
            };
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            if (response && response.status === 200) {
                setTellerData(response.body.data || []);
            } else {
                showSnackbar('Error Finding Data.', 'error');
            }
        } catch (error) {
            console.log(error);
            showSnackbar('Network Error!!! Try again Later.', 'error');
        }
    };

    useEffect(() => {
        fetchRoleData();
        fetchTellerData();
    }, []);

    const handleFormSubmit = async () => {
        setLoading(true);
        try {
            const response = await CBS_Services('GATEWAY', `authentification/register`, 'POST', initialValues, token);
            if (response && response.status === 200) {
                await fetchRoleData();
                showSnackbar('User created successfully.', 'success');
                setTimeout(() => {
                    navigate(-1);
                }, 2000);
            } else if (response && response.status === 401) {
                showSnackbar(response.body.errors || 'Unauthorized to perform action', 'error');
            } else {
                showSnackbar(response.body.errors || 'Error Adding User', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showSnackbar('Network Error!!! Try again Later.', 'error');
        }
        setLoading(false);
    };



    const handleChangeValues = (e) => {
        const { name, value } = e.target;

        if (name === 'selectedTeller' && initialValues.roles === 'TELLER') {
            setSelectedTeller(value);
            const selectedTellerData = tellerData.find(teller => teller.id === value);
            if (selectedTellerData) {
                setInitialValues(prevValues => ({
                    ...prevValues,
                    refId: value,
                }));
                // If you're using Formik, you should also update the Formik values
                // setFieldValue('refId', value);
            }
        }
    }



    return (
        <Box m="20px">
            <Header title="CREATE USER" subtitle="Create a New User Profile" />

            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
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
                    <form onSubmit={handleSubmit}>
                        <Box
                            display="grid"
                            gap="30px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            sx={{
                                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                            }}
                        >

                            <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 4" }}>
                                <InputLabel>Role</InputLabel>
                                <Select
                                    label="Role"
                                    onBlur={handleBlur}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setFieldValue("roles", e.target.value);
                                        setInitialValues(prevValues => ({
                                            ...prevValues,
                                            roles: e.target.value,
                                            refId: "", // Clear refId
                                        }));
                                        setSelectedTeller(""); // Clear selected teller
                                        setFieldValue("refId", ""); // Clear Formik's refId value
                                        // If "TELLER" is selected, reset tellerId
                                        if (e.target.value !== "TELLER") {
                                            setFieldValue("id", "");
                                        }
                                    }}
                                    value={values.roles}
                                    name="roles"
                                    error={!!touched.roles && !!errors.roles}
                                >
                                    <MenuItem value="" disabled>Select Role</MenuItem>
                                    {roleData.length > 0
                                        ? roleData.map((option) => (
                                            <MenuItem key={option.roleName} value={option.roleName}>
                                                {option.roleName}
                                            </MenuItem>
                                        ))
                                        : <MenuItem value="">No Roles available</MenuItem>}
                                </Select>
                                {touched.roles && errors.roles && (
                                    <Alert severity="error">{errors.roles}</Alert>
                                )}
                            </FormControl>

                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Username"
                                onBlur={handleBlur}
                                onChange={(e) => {
                                    handleChange(e);
                                    setFieldValue("userName", e.target.value);
                                    setInitialValues({ ...initialValues, userName: e.target.value });
                                }}
                                value={values.userName}
                                name="userName"
                                error={!!touched.userName && !!errors.userName}
                                helperText={touched.userName && errors.userName}
                                sx={{ gridColumn: "span 4" }}
                            />

                            {/* Conditional Teller Dropdown */}
                            {values.roles === "TELLER" && (
                                <>
                                    <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 4" }}>
                                        <InputLabel>Teller</InputLabel>
                                        <Select
                                            label="Teller"
                                            onBlur={handleBlur}
                                            onChange={handleChangeValues}
                                            value={selectedTeller}
                                            name="selectedTeller"
                                            error={!!touched.selectedTeller && !!errors.selectedTeller}
                                        >
                                            <MenuItem value="" disabled>Select Teller</MenuItem>
                                            {Array.isArray(tellerData) && tellerData.length > 0
                                                ? tellerData.map((teller) => (
                                                    <MenuItem key={teller.id} value={teller.id}>
                                                        {teller.tellerName}
                                                    </MenuItem>
                                                ))
                                                : <MenuItem value="">No Tellers available</MenuItem>}
                                        </Select>
                                        {touched.selectedTeller && errors.selectedTeller && (
                                            <Alert severity="error">{errors.selectedTeller}</Alert>
                                        )}
                                    </FormControl>

                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Reference ID"
                                        onBlur={handleBlur}
                                        onChange={handleChangeValues}
                                        value={initialValues.refId}
                                        name="refId"
                                        error={!!touched.refId && !!errors.refId}
                                        helperText={touched.refId && errors.refId}
                                        sx={{ gridColumn: "span 4" }}
                                        disabled
                                    />
                                </>



                            )}

                            <TextField
                                fullWidth
                                variant="filled"
                                type="password"
                                label="Password"
                                onBlur={handleBlur}
                                onChange={(e) => {
                                    handleChange(e);
                                    setFieldValue("password", e.target.value);
                                    setInitialValues({ ...initialValues, password: e.target.value });
                                }}
                                value={values.password}
                                name="password"
                                error={!!touched.password && !!errors.password}
                                helperText={touched.password && errors.password}
                                sx={{ gridColumn: "span 2" }}
                            />

                            <TextField
                                fullWidth
                                variant="filled"
                                type="tel"
                                label="Phone Number"
                                onBlur={handleBlur}
                                onChange={(e) => {
                                    handleChange(e);
                                    setFieldValue("tel", e.target.value);
                                    setInitialValues({ ...initialValues, tel: e.target.value });
                                }}
                                value={values.tel}
                                name="tel"
                                error={!!touched.tel && !!errors.tel}
                                helperText={touched.tel && errors.tel}
                                sx={{ gridColumn: "span 2" }}
                            />

                            <TextField
                                fullWidth
                                variant="filled"
                                type="email"
                                label="Email"
                                onBlur={handleBlur}
                                onChange={(e) => {
                                    handleChange(e);
                                    setFieldValue("email", e.target.value);
                                    setInitialValues({ ...initialValues, email: e.target.value });
                                }}
                                value={values.email}
                                name="email"
                                error={!!touched.email && !!errors.email}
                                helperText={touched.email && errors.email}
                                sx={{ gridColumn: "span 3" }}
                            />


                            <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 1" }}>
                                <InputLabel>Language</InputLabel>
                                <Select
                                    label="Language"
                                    onBlur={handleBlur}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setFieldValue("language", e.target.value);
                                        setInitialValues({ ...initialValues, language: e.target.value });
                                    }}
                                    value={values.language}
                                    name="language"
                                    error={!!touched.language && !!errors.language}
                                >
                                    <MenuItem value="" selected>Select Language</MenuItem>
                                    <MenuItem value="fr">FRENCH</MenuItem>
                                    <MenuItem value="en">ENGLISH</MenuItem>

                                </Select>
                                {touched.language && errors.language && (
                                    <Alert severity="error">{errors.language}</Alert>
                                )}
                            </FormControl>









                        </Box>
                        <Box display="flex" justifyContent="end" mt="20px">
                            <LoadingButton type="submit" color="secondary" variant="contained" loading={loading} loadingPosition="start"
                                startIcon={<Save />} >
                                {loading ? 'Creating User...' : 'Create User'}
                            </LoadingButton>
                            <Button color="primary" variant="contained" disabled={loading} onClick={() => navigate(-1)}>
                                Cancel
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

const checkoutSchema = yup.object().shape({
    userName: yup.string().required("required"),
    password: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    roles: yup.string().required("required"),
    refId: yup.string(),
    actif: yup.boolean().required("required"),
    id: yup.string().when('roles', {
        is: 'TELLER',
        then: yup.string(),
    }),
});

export default UserForm;
