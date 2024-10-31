import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Snackbar, Stack, useTheme } from "@mui/material";
import { Formik } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CBS_Services from "../../../services/api/GAV_Sercives";
import { LoadingButton } from "@mui/lab";
import { Save } from "@mui/icons-material";
import { tokens } from "../../../theme";

const AssignUsertoSpace = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const { userName } = useParams();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.users);
    const [spaceData, setSpaceData] = useState([]);
    const [roleData, setRoleData] = useState([]);
    const [isInSpace, setIsInSpace] = useState(false);

    const token = userData.token;
    const spaceId = userData?.selectedSpace?.id;
    const type = userData?.selectedSpace?.type;

    const [initialValues, setInitialValues] = useState({
        userName: userName,
        spaceId: "",
        roleId: ""
    });
    const [pending, setPending] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

    const formFieldStyles = (gridColumn = "span 2") => ({
        gridColumn,
        '& .MuiInputLabel-root': {
            color: theme.palette.mode === "dark" ? colors.grey[100] : colors.black[700],
        },
        '& .MuiFilledInput-root': {
            color: theme.palette.mode === "dark" ? colors.grey[100] : colors.black[700],
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: theme.palette.mode === "dark" ? colors.grey[100] : colors.black[100],
        },
    });

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    const handleFormSubmit = async (values) => {
        setPending(true);
        const submitData = {
            userName: userName,
            spaceId: isInSpace ? spaceId : values.spaceId,
            roleId: values.roleId

        };
        console.log("submitData", submitData);
        try {
            const response = await CBS_Services('GATEWAY', 'clientGateWay/space/addSpaceAndRoleToUser', 'POST', submitData, token);
            if (response && response.status === 200) {
                showSnackbar('Role Assigned Successfully.', 'success');
                setTimeout(() => navigate(-1), 2000);
            } else {
                showSnackbar(response.body.errors || 'Error while Assigning Role', 'error');
            }
        } catch (error) {
            console.error("Error:", error);
            showSnackbar('Error Try Again Later', 'error');
        }
        setPending(false);
    };

    const fetchSpaceData = async () => {
        setPending(true);
        try {
            const response = await CBS_Services('GATEWAY', 'clientGateWay/space/getAllSpaces', 'GET', null, token);
            if (response && response.status === 200) {
                setSpaceData(response.body.data || []);
            } else {
                setSpaceData([]);
                showSnackbar('Error Finding Space Data.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showSnackbar('Network Error!', 'error');
        }
        setPending(false);
    };

    const fetchRoleData = async (selectedSpaceId) => {
        try {
            // Use the selectedSpaceId when checkbox is unchecked, otherwise use the current spaceId
            const currentSpaceId = isInSpace ? spaceId : selectedSpaceId;

            if (!currentSpaceId) {
                showSnackbar('Please select a space first.', 'error');
                return;
            }

            console.log("currentSpaceId", currentSpaceId);

            const response = await CBS_Services('GATEWAY', `clientGateWay/role/getAllRoleBySpaceId/${currentSpaceId}`, 'GET', null, token);
            console.log("response++++++", response);

            if (response && response.status === 200) {
                setRoleData(response.body.data || []);
            } else {
                showSnackbar('Error Finding Role Data.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showSnackbar('Network Error!', 'error');
        }
    };

    const formatSpaceData = (data) => {
        return data.map(item => {
            const id = getSpaceId(item);
            const name = getSpaceName(item);
            return { ...item, id, name };
        });
    };

    const fetchSpaceId = async () => {
        setPending(true);
        let apiConfig = {
            service: '',
            url: '',
            method: 'GET',
            body: null
        };

        // Configure API call based on space type
        switch (type) {
            case "CREDIX":
                apiConfig.service = "AP";
                apiConfig.url = "api/gav/corporation/management/getAll";
                break;
            case "CORPORATION":
                apiConfig.service = "AP";
                apiConfig.url = `api/gav/bankBranch/getAll/byCorporation/${spaceId}`;
                break;
            case "BANK":
                apiConfig.service = "AP";
                apiConfig.url = `api/gav/bankBranch/getAll/byBank/${spaceId}`;
                break;
            case "BRANCH":
                apiConfig.service = "AP";
                apiConfig.url = "api/gav/teller/tellers";
                break;
            case "TELLER":
                apiConfig.service = "CLIENT";
                apiConfig.url = "api/gav/teller/tellers";
                apiConfig.method = "POST";
                apiConfig.body = { internalId: "Back Office" };
                break;
            default:
                showSnackbar('Invalid type for fetching data.', 'error');
                setPending(false);
                return;
        }

        try {
            const response = await CBS_Services(apiConfig.service, apiConfig.url, apiConfig.method, apiConfig.body, token);

            if (response?.body?.meta?.statusCode === 200) {
                const formattedData = formatSpaceData(response.body.data || []);
                setSpaceData(formattedData);
            } else {
                setSpaceData([]);
                showSnackbar('Error: Unable to fetch space data.', 'error');
            }
        } catch (error) {
            console.error('Error in fetchSpaceData:', error);
            showSnackbar('Network error. Please try again later.', 'error');
            setSpaceData([]);
        }
        setPending(false);
    };


    const getSpaceId = (item) => {
        switch (type) {
            case "CREDIX":
                return item.corporationId;
            case "CORPORATION":
                return item.corporationId;
            case "BANK":
                return item.bankId;
            case "BRANCH":
                return item.branchId;
            case "TELLER":
                return item.id;
            default:
                return item.id;
        }
    };

    // Get the correct name field based on space type
    const getSpaceName = (item) => {
        switch (type) {
            case "CREDIX":
                return item.corporationName;

            case "CORPORATION":
                return item.corporationName;
            case "BANK":
                return item.bankName;
            case "BRANCH":
                return item.branchName;
            case "TELLER":
                return item.tellerName;
            default:
                return "Unnamed";
        }
    };
    useEffect(() => {

        if (!isInSpace) {
            fetchSpaceId();
            fetchRoleData();
        } else {
            fetchRoleData();
            fetchSpaceData();
        }
    }, [isInSpace, spaceId]);

    return (
        <Box m="20px">
            <Header title="ROLE ASSIGNMENT" subtitle={`Assign Space and Role to User "${userName}"`} />



            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                enableReinitialize={true}
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
                    <Box display="grid" sx={{ px: 2, padding: "10px 100px 20px 100px" }}>
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

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isInSpace}
                                            onChange={(e) => {
                                                setIsInSpace(e.target.checked);
                                                setInitialValues({
                                                    ...initialValues,
                                                    spaceId: e.target.checked ? spaceId : "",
                                                    roleId: ""
                                                });
                                            }}
                                            color="secondary"
                                        />
                                    }
                                    label="In Current Space"
                                    sx={{ mb: 0 }}
                                />
                                {!isInSpace && (
                                    <FormControl fullWidth variant="filled" sx={formFieldStyles("span 4")}>
                                        <InputLabel>Select Space</InputLabel>
                                        <Select
                                            label={`Select Space`}
                                            onBlur={handleBlur}
                                            onChange={(e) => {
                                                setFieldValue("spaceId", e.target.value);
                                                fetchRoleData(e.target.value);
                                                setFieldValue("roleId", "");
                                            }}
                                            value={values.spaceId}
                                            name="spaceId"
                                            error={!!touched.spaceId && !!errors.spaceId}
                                        >
                                            <MenuItem value="" disabled>Select Space</MenuItem>
                                            {spaceData.map((space) => (
                                                <MenuItem key={space.id} value={space.id}>
                                                    {space.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {touched.spaceId && errors.spaceId && (
                                            <Alert severity="error">{errors.spaceId}</Alert>
                                        )}
                                    </FormControl>
                                )}

                                <FormControl fullWidth variant="filled" sx={formFieldStyles("span 4")}>
                                    <InputLabel>Role</InputLabel>
                                    <Select
                                        label="Role"
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            setFieldValue("roleId", e.target.value);
                                        }}
                                        value={values.roleId}
                                        name="roleId"
                                        error={!!touched.roleId && !!errors.roleId}
                                    >
                                        <MenuItem value="" disabled>Select Role</MenuItem>
                                        {roleData.map((role) => (
                                            <MenuItem key={role.id} value={role.id}>
                                                {role.roleName}
                                            </MenuItem>
                                        ))}
                                    </Select>
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
                                        Assign Role
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

export default AssignUsertoSpace;