import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Select, Snackbar, Stack, TextField, useTheme } from "@mui/material";
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

const RoleForm = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const userData = useSelector((state) => state.users);
    const [typeData, setTypeData] = useState([]);
    const [itemData, setItemData] = useState([]);
    const [subItemData, setSubItemData] = useState([]);
    const token = userData.token;
    const spaceId = userData?.selectedSpace?.id
    const [initialValues, setInitialValues] = useState({
        roleName: "",
        description: "",
        typeId: "",
        itemId: [],
        subItemId: []
    });

    const [pending, setPending] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
    const [filteredItems, setFilteredItems] = useState([]);
    const [filteredSubItems, setFilteredSubItems] = useState([]);

    const formFieldStyles = (gridColumn = "span 2") => ({
        gridColumn,
        '& .MuiInputLabel-root': {
            color: theme.palette.mode === "dark"
                ? colors.grey[100]
                : colors.black[700],
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
        console.log("values====", values);

        try {
            const response = await CBS_Services('GATEWAY', 'clientGateWay/role/createRole', 'POST', values, token);
            console.log("responseCreateRole", response);
            if (response && response.status === 200) {
                showSnackbar('Role Created Successfully.', 'success');
                setTimeout(() => {
                    navigate(-1);
                }, 2000);
            } else {
                showSnackbar(response.body.errors || 'Error Creating Role', 'error');
            }
        } catch (error) {
            console.error("Error:", error);
            showSnackbar('Error Try Again Later', 'error');
        }
        setPending(false);
    };

    useEffect(() => {
        if (id && location.state && location.state.roleData) {
            setInitialValues(location.state.roleData);
        }
    }, [id, location.state]);

    const fetchTypeData = async () => {
        setPending(true);
        try {
            const response = await CBS_Services('GATEWAY', 'clientGateWay/type/getAllType', 'GET', null, token);
            if (response && response.status === 200) {
                setTypeData(response.body.data || []);
            } else {
                setTypeData([]);
                showSnackbar('Error Finding Type Data.', 'error');
            }
        } catch (error) {
            console.log('Error:', error);
        }
        setPending(false);
    };

    // Mock fetch functions for items and subitems - replace with actual endpoints
    const fetchItemData = async () => {
        setPending(true);
        try {
            const response = await CBS_Services('GATEWAY', 'clientGateWay/items/getAllItems', 'GET', null, token);
            if (response && response.status === 200) {
                setItemData(response.body.data || []);
            } else {
                setItemData([]);
                showSnackbar('Error Finding Item Data.', 'error');
            }
        } catch (error) {
            console.log('Error:', error);
        }
        setPending(false);
    };

    const fetchSubItemData = async () => {
        setPending(true);
        try {
            const response = await CBS_Services('GATEWAY', 'clientGateWay/subItem/getAllSubsItems', 'GET', null, token);
            if (response && response.status === 200) {
                setSubItemData(response.body.data || []);
            } else {
                setSubItemData([]);
                showSnackbar('Error Finding SubItem Data.', 'error');
            }
        } catch (error) {
            console.log('Error:', error);
        }
        setPending(false);
    };

    useEffect(() => {
        fetchTypeData();
        fetchItemData();
        fetchSubItemData();
    }, []);

    const handleTypeChange = (formikProps, value) => {
        // Update typeId in form
        formikProps.setFieldValue('typeId', value);
        // Reset itemId and subItemId as empty arrays
        formikProps.setFieldValue('itemId', []);
        formikProps.setFieldValue('subItemId', []);

        // Filter items based on selected type
        const filtered = itemData.filter(item => item.typeId === value);
        setFilteredItems(filtered);
        setFilteredSubItems([]);
    };

    const handleItemChange = (formikProps, selectedItems) => {
        formikProps.setFieldValue('itemId', selectedItems);
        formikProps.setFieldValue('subItemId', []); // Reset as empty array

        const filteredSubs = subItemData.filter(subItem =>
            selectedItems.some(selectedItemId => {
                const selectedItemData = itemData.find(item => item.id === selectedItemId);
                return selectedItemData && subItem.itemId === selectedItemData.title;
            })
        );
        setFilteredSubItems(filteredSubs);
    };


    useEffect(() => {
        if (id && location.state && location.state.roleData) {
            const roleData = location.state.roleData;
            setInitialValues({
                ...roleData,
                itemId: Array.isArray(roleData.itemId) ? roleData.itemId : [], // Ensure array
                subItemId: Array.isArray(roleData.subItemId) ? roleData.subItemId : [] // Ensure array
            });
        }
    }, [id, location.state]);



    return (
        <Box m="20px">
            <Header
                title={id ? "EDIT ROLE" : "ADD ROLE"}
                subtitle={id ? "Edit the role" : "Add a new role"}
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
                                    label="Role Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.roleName}
                                    name="roleName"
                                    error={!!touched.roleName && !!errors.roleName}
                                    helperText={touched.roleName && errors.roleName}
                                    sx={formFieldStyles("span 2")}
                                />

                                {/* <FormControl fullWidth variant="filled" sx={formFieldStyles("span 2")}>
                                    <InputLabel>Type</InputLabel>
                                    <Select
                                        label="Type"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.typeId}
                                        name="typeId"
                                        error={!!touched.typeId && !!errors.typeId}
                                    >
                                        <MenuItem value="">Select type</MenuItem>
                                        {typeData.map((type) => (
                                            <MenuItem key={type.intitule} value={type.intitule}>
                                                {type.intitule}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {touched.typeId && errors.typeId && (
                                        <Alert severity="error">{errors.typeId}</Alert>
                                    )}
                                </FormControl> */}

                                <FormControl fullWidth variant="filled" sx={formFieldStyles("span 2")}>
                                    <InputLabel>Type</InputLabel>
                                    <Select
                                        label="Type"
                                        onBlur={handleBlur}
                                        onChange={(e) => handleTypeChange({ setFieldValue }, e.target.value)}
                                        value={values.typeId}
                                        name="typeId"
                                        error={!!touched.typeId && !!errors.typeId}
                                    >
                                        <MenuItem value="">Select type</MenuItem>
                                        {typeData.map((type) => (
                                            <MenuItem key={type.intitule} value={type.intitule}>
                                                {type.intitule}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {touched.typeId && errors.typeId && (
                                        <Alert severity="error">{errors.typeId}</Alert>
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
                                    sx={formFieldStyles("span 4")}
                                />

                                <FormControl
                                    fullWidth
                                    variant="filled"
                                    sx={formFieldStyles("span 2")}
                                // disabled={!values.typeId}
                                >
                                    <InputLabel>Items</InputLabel>
                                    <Select
                                        multiple // Add this
                                        label="Items"
                                        onBlur={handleBlur}
                                        onChange={(e) => handleItemChange({ setFieldValue }, e.target.value)}
                                        value={Array.isArray(values.itemId) ? values.itemId : []} // Ensure array
                                        name="itemId"
                                        error={!!touched.itemId && !!errors.itemId}
                                    >
                                        {itemData.map((item) => (
                                            <MenuItem key={item.id} value={item.id}>
                                                {item.title}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {touched.itemId && errors.itemId && (
                                        <Alert severity="error">{errors.itemId}</Alert>
                                    )}
                                </FormControl>


                                <FormControl
                                    fullWidth
                                    variant="filled"
                                    sx={formFieldStyles("span 2")}
                                // disabled={!values.itemId?.length}
                                >
                                    <InputLabel>Sub Items</InputLabel>
                                    <Select
                                        multiple // Add this
                                        label="Sub Items"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={Array.isArray(values.subItemId) ? values.subItemId : []} // Ensure array
                                        name="subItemId"
                                        error={!!touched.subItemId && !!errors.subItemId}
                                    >
                                        {subItemData.map((subItem) => (
                                            <MenuItem key={subItem.id} value={subItem.id}>
                                                {subItem.title}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {touched.subItemId && errors.subItemId && (
                                        <Alert severity="error">{errors.subItemId}</Alert>
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
                                        {id ? "Update Role" : "Create Role"}
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
    roleName: yup.string().required("required"),
    description: yup.string().required("required"),
    typeId: yup.string(),
    itemId: yup.array().of(yup.string()).required("required"),
    subItemId: yup.array().of(yup.string()).required("required")
});

export default RoleForm;