import { Alert, Box, Button, Divider, FormControl, IconButton, InputLabel, MenuItem, Select, Snackbar, Stack, TextField, useTheme } from "@mui/material";
import { FieldArray, Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import React, { useEffect, useState } from "react";
import CBS_Services from "../../../services/api/GAV_Sercives";
import { useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import { Add, RemoveCircle, Save } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../../theme";

const UserForm = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [initialValues, setInitialValues] = useState({
        userName: "",
        password: "",
        email: "",
        refId: "",
        actif: true,
        tel: "",
        language: "",
        bankCode: "",
        spaceRoleDtoList: []

    })

    // console.log("initialValues", initialValues);

    const [tellerData, setTellerData] = useState([]);
    const [spaceData, setSpaceData] = React.useState([])
    const [roleData, setRoleData] = React.useState([])

    const [loading, setLoading] = useState(false);
    const userData = useSelector((state) => state.users);
    const token = userData.token;
    const spaceId = userData?.selectedSpace?.id
    const connectedUserRole = userData.roles; // Assuming the connected user's role is stored here
    const [filteredRoles, setFilteredRoles] = useState([]);
    const [selectedTeller, setSelectedTeller] = useState(''); // New state for selected lawyer
    const navigate = useNavigate();
    console.log("selectedTe,", selectedTeller);

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
            const response = await CBS_Services('GATEWAY', 'clientGateWay/role/getAllRole', 'GET', null, token);

            if (response && response.status === 200) {
                const allRoles = response.body.data || [];
                setRoleData(allRoles);
                filterRoles(allRoles);
            } else {
                showSnackbar('Error Finding Data.', 'error');
            }
        } catch (error) {
            console.log('Error:', error);
            showSnackbar('Network Error!!! Try again Later.', 'error');
        }
    };

    const filterRoles = (allRoles) => {
        const connectedUserRoleData = allRoles.find(role => role.roleName === connectedUserRole);
        if (connectedUserRoleData) {
            const nextLevel = connectedUserRoleData.level + 1;
            const filteredRoles = allRoles.filter(role => role.level === nextLevel);
            setFilteredRoles(filteredRoles);
        }
    };

    const fetchTellerData = async () => {
        try {
            const payload = {
                serviceReference: 'GET_ALL_TELLERS',
                requestBody: JSON.stringify({ internalId: "string" }),
                spaceId: spaceId,
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

    const handlenavigate = async (userName) => {
        console.log("userName", userName);
        navigate(`/usermanagement/userconfig/${userName}`);
    }

    const handleFormSubmit = async (values, { setSubmitting }) => {
        setLoading(true);
        try {
            const response = await CBS_Services('GATEWAY', 'authentification/register', 'POST', values, token);

            if (response && response.status === 200) {
                showSnackbar('User created successfully.', 'success');

                const userName = response.body.data.userName;

                setTimeout(() => {
                    handlenavigate(userName);
                }, 2000);

            } else if (response && response.status === 401) {
                showSnackbar(response.body.errors || 'Unauthorized to perform action', 'error');
            } else {
                showSnackbar(response.body.errors || 'Error Adding User', 'error');
            }

        } catch (error) {
            console.error('Error:', error);
            showSnackbar('Network Error!!! Try again Later.', 'error');
        } finally {
            setLoading(false);
            if (setSubmitting) setSubmitting(false);
        }
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


    const fetchSpaceData = async () => {
        setLoading(true);
        try {
            const response = await CBS_Services('GATEWAY', 'clientGateWay/space/getAllSpaces', 'GET', null, token);
            console.log("fetchresponse=====", response);

            if (response && response.status === 200) {
                setSpaceData(response.body.data || []);
                // setSuccessMessage('');
                // setErrorMessage('');
            } else {
                setSpaceData([]);
                showSnackbar('Error Finding Data.', 'error');
            }

        } catch (error) {
            console.log('Error:', error);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchSpaceData();
    }, []);



    return (
        <Box m="20px">
            <Header title="CREATE USER" subtitle="Create a New User Profile" />

            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
            // validationSchema={checkoutSchema}
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
                                    sx={formFieldStyles("span 4")}
                                />

                                {/* Conditional Teller Dropdown */}
                                {values.roles === "TELLER" && (
                                    <>
                                        <FormControl fullWidth variant="filled" sx={formFieldStyles("span 4")}>
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
                                            sx={formFieldStyles("span 4")}
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
                                    sx={formFieldStyles("span 2")}
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
                                    sx={formFieldStyles("span 2")}
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
                                    sx={formFieldStyles("span 3")}
                                />


                                <FormControl fullWidth variant="filled" sx={formFieldStyles("span 1")}>
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


                                {/* <Divider sx={{ gridColumn: "span 4", my: 2 }} />
                                <FieldArray name="spaceRoleDtoList">
                                    {({ push, remove }) => (
                                        <Box sx={{ gridColumn: "span 4" }}>
                                            {values.spaceRoleDtoList.map((item, index) => (
                                                <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                                    <FormControl fullWidth variant="filled" sx={formFieldStyles()}>
                                                        <InputLabel>Space</InputLabel>
                                                        <Select
                                                            label="Space"
                                                            onBlur={handleBlur}
                                                            onChange={(e) => {
                                                                setFieldValue(`spaceRoleDtoList.${index}.spaceId`, e.target.value);
                                                            }}
                                                            value={item.spaceId}
                                                            name={`spaceRoleDtoList.${index}.spaceId`}
                                                            error={!!touched.spaceRoleDtoList?.[index]?.spaceId && !!errors.spaceRoleDtoList?.[index]?.spaceId}
                                                        >
                                                            <MenuItem value="" disabled>Select Space</MenuItem>
                                                            {Array.isArray(spaceData) && spaceData.map((space) => (
                                                                <MenuItem key={space.id} value={space.id}>
                                                                    {space.label}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>

                                                    <FormControl fullWidth variant="filled" sx={formFieldStyles()}>
                                                        <InputLabel>Role</InputLabel>
                                                        <Select
                                                            label="Role"
                                                            onBlur={handleBlur}
                                                            onChange={(e) => {
                                                                setFieldValue(`spaceRoleDtoList.${index}.roleId`, e.target.value);
                                                            }}
                                                            value={item.roleId}
                                                            name={`spaceRoleDtoList.${index}.roleId`}
                                                            error={!!touched.spaceRoleDtoList?.[index]?.roleId && !!errors.spaceRoleDtoList?.[index]?.roleId}
                                                        >
                                                            <MenuItem value="" disabled>Select Role</MenuItem>
                                                            {Array.isArray(roleData) && roleData.map((role) => (
                                                                <MenuItem key={role.id} value={role.id}>
                                                                    {role.roleName}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>

                                                    {index > 0 && (
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => remove(index)}
                                                            sx={{ alignSelf: 'center' }}
                                                        >
                                                            <RemoveCircle />
                                                        </IconButton>
                                                    )}
                                                </Box>
                                            ))}
                                            <Button
                                                color="secondary"
                                                variant="outlined"
                                                startIcon={<Add />}
                                                onClick={() => push({ spaceId: "", roleId: "" })}
                                                sx={{ mt: 1 }}
                                            >
                                                Add Space-Role Pair
                                            </Button>
                                        </Box>
                                    )}
                                </FieldArray> */}
                            </Box>
                            <Box display="flex" justifyContent="end" mt="20px">
                                <Stack direction="row" spacing={2}>
                                    <Button color="primary" variant="contained" disabled={loading} onClick={() => navigate(-1)}>
                                        Cancel
                                    </Button>
                                    <LoadingButton type="submit" color="secondary" variant="contained" loading={loading} loadingPosition="start"
                                        startIcon={<Save />} >
                                        {loading ? 'Creating User...' : 'Create User'}
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
