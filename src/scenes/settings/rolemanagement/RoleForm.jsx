import { Alert, Box, Button, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Snackbar, Stack, TextField, useTheme } from "@mui/material";
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
import { FormFieldStyles } from "../../../tools/fieldValuestyle";

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
    const [selectedSubItems, setSelectedSubItems] = useState([]);
    const [selectedType, setSelectedType] = useState("");
    const [initialValues, setInitialValues] = useState({
        roleName: "",
        description: "",
        typeId: "",
        itemId: [],
        subItemId: []
    });

    const [pending, setPending] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
    const [filteredItemData, setFilteredItemData] = useState([]);



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

        let submitData = {}

        if (values.subItemId.length > 0) {
            // If sub-items are selected, send empty itemId
            submitData = {
                ...values,
                itemId: [],
                subItemId: values.subItemId
            };
        } else {
            // If only items are selected, send the selected items
            submitData = {
                ...values,
                itemId: values.itemId,
                subItemId: []
            };
        }
        console.log("submitData====", submitData);
        try {
            const response = await CBS_Services('GATEWAY', 'clientGateWay/role/createRole', 'POST', submitData, token);
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
            console.log("responseTypeData", response);

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
            console.log("response", response);

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


    // const fetchSubItemDataById = async (itemId) => {
    //     setPending(true);
    //     try {
    //         const response = await CBS_Services('GATEWAY', `clientGateWay/subItem/getAllSubItemByItemId/${itemId}`, 'GET', null, token);
    //         console.log("respone=====", response);

    //         if (response && response.status === 200) {
    //             setSubItemData(response.body.data || []);
    //         } else {
    //             setSubItemData([]);
    //             showSnackbar('Error Finding SubItem Data.', 'error');
    //         }
    //     } catch (error) {
    //         console.log('Error:', error);
    //     }
    //     setPending(false);
    // };

    const fetchSubItemDataByItemIds = async (itemIds) => {
        setPending(true);
        try {
            const subItemPromises = itemIds.map(itemId =>
                CBS_Services('GATEWAY', `clientGateWay/subItem/getAllSubItemByItemId/${itemId}`, 'GET', null, token)
            );

            const responses = await Promise.all(subItemPromises);
            const combinedSubItems = responses.reduce((acc, response) => {
                if (response && response.status === 200) {
                    return [...acc, ...(response.body.data || [])];
                }
                return acc;
            }, []);

            // Remove duplicate subitems
            const uniqueSubItems = Array.from(new Set(combinedSubItems.map(item => item.id)))
                .map(id => combinedSubItems.find(item => item.id === id));

            setSubItemData(uniqueSubItems);
        } catch (error) {
            console.log('Error:', error);
            showSnackbar('Error Finding SubItem Data.', 'error');
        }
        setPending(false);
    };


    useEffect(() => {
        fetchTypeData();
        fetchItemData();
        // fetchSubItemData();
    }, []);

    const handleItemChange = (formikProps, itemIds) => {
        formikProps.setFieldValue("itemId", itemIds);
        formikProps.setFieldValue("subItemId", []);
        setSelectedSubItems([]);
        // fetchSubItemDataById(itemId);
        fetchSubItemDataByItemIds(itemIds);

    };

    const filterItemDataByType = (typeId) => {
        // Ensure typeId is an array
        const typeArray = Array.isArray(typeId) ? typeId : [typeId];
        const filtered = itemData.filter((item) =>
            typeArray.some(type => item.typeId.includes(type))
        );

        setFilteredItemData(filtered);
        console.log("filtered", filtered);
        console.log("typeId", typeId);
    };

    console.log("itemdata", itemData);


    const handleTypeChange = (formikProps, typeId) => {
        formikProps.setFieldValue("typeId", typeId);
        formikProps.setFieldValue("itemId", []); // Reset selected items
        formikProps.setFieldValue("subItemId", []); // Reset selected sub-items
        setSelectedSubItems([]); // Clear selected sub-items
        filterItemDataByType(typeId);
        setSelectedType(typeId);
    };

    const handleSelectAllSubItems = () => {
        if (selectedSubItems.length === subItemData.length) {
            setSelectedSubItems([]);
        } else {
            setSelectedSubItems(subItemData.map((item) => item.id));
        }
    };

    const handleSubItemSelect = (id) => {
        if (selectedSubItems.includes(id)) {
            setSelectedSubItems(selectedSubItems.filter((itemId) => itemId !== id));
        } else {
            setSelectedSubItems([...selectedSubItems, id]);
        }
    };
    const getSelectedSubItemTitles = () => {
        return subItemData.filter((item) => selectedSubItems.includes(item.id)).map((item) => item.title).join(", ");
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
                                    sx={FormFieldStyles("span 2")}
                                />



                                <FormControl fullWidth variant="filled" sx={FormFieldStyles("span 2")}>
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
                                    sx={FormFieldStyles("span 4")}
                                />

                                <FormControl
                                    fullWidth
                                    variant="filled"
                                    sx={FormFieldStyles("span 2")}
                                    disabled={!values.typeId}
                                >
                                    <InputLabel>Menus</InputLabel>
                                    <Select
                                        multiple
                                        label="Menus"
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            handleItemChange({ setFieldValue }, e.target.value);
                                        }}
                                        value={values.itemId}
                                        name="itemId"
                                        error={!!touched.itemId && !!errors.itemId}
                                        renderValue={(selected) =>
                                            filteredItemData
                                                .filter(item => selected.includes(item.id))
                                                .map(item => item.title)
                                                .join(", ")
                                        }
                                    >
                                        <MenuItem value="" selected disabled>Select Menu</MenuItem>
                                        {Array.isArray(filteredItemData) && filteredItemData.length > 0 ? (
                                            filteredItemData.map((item) => (
                                                <MenuItem key={item.id} value={item.id}>
                                                    {item.title}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem value="">{selectedType} Menus are not available</MenuItem>
                                        )}
                                    </Select>
                                    {touched.itemId && errors.itemId && (
                                        <Alert severity="error">{errors.itemId}</Alert>
                                    )}
                                </FormControl>


                                <FormControl
                                    fullWidth
                                    variant="filled"
                                    sx={FormFieldStyles("span 2")}
                                    disabled={!values.itemId?.length}
                                >
                                    <InputLabel>Sub Menus</InputLabel>
                                    <Select
                                        multiple
                                        label="Sub Menus"
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            setFieldValue("subItemId", e.target.value);
                                            setSelectedSubItems(e.target.value);
                                        }}
                                        value={selectedSubItems}
                                        name="subItemId"
                                        error={!!touched.subItemId && !!errors.subItemId}
                                        renderValue={(selected) => getSelectedSubItemTitles()}
                                    >
                                        <MenuItem value="selectAll">
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={selectedSubItems.length === subItemData.length}
                                                        onChange={handleSelectAllSubItems}
                                                        color="secondary"
                                                    />
                                                }
                                                label="Select All"
                                            />
                                        </MenuItem>
                                        {subItemData.map((subItem) => (
                                            <MenuItem key={subItem.id} value={subItem.id}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={selectedSubItems.includes(subItem.id)}
                                                            onChange={() => handleSubItemSelect(subItem.id)}
                                                            color="secondary"
                                                        />
                                                    }
                                                    label={subItem.title}
                                                />
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
    // typeId: yup.string(),
    // itemId: yup.string().required("required"),
    // subItemId: yup.array().of(yup.string()).required("required")
});

export default RoleForm;