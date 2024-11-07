import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Select, Snackbar, Stack, TextField, Checkbox, FormControlLabel, Typography, IconButton, Divider, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemIcon, ListItemText, InputAdornment, } from "@mui/material";
import { FieldArray, Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../../components/Header";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import { Save, Cancel, RemoveCircle, Add, Label, Search } from "@mui/icons-material";
import { tokens } from "../../../../theme";
import { useTheme } from "@emotion/react";
import IconSelector from "../IconSelector";
import { MenuLinks } from "../../../global/SideBarLinks";
import { formatValue } from "../../../../tools/formatValue";
import CBS_Services from "../../../../services/api/GAV_Sercives";

const CreateMenuForm = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const { id } = useParams();
    const navigate = useNavigate();
    const [typeData, settypeData] = React.useState([])
    const [showTagModal, setShowTagModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [availableTags, setAvailableTags] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [activeSubItemIndex, setActiveSubItemIndex] = useState(null);
    const userData = useSelector((state) => state.users);
    const token = userData.token;
    const location = useLocation();


    const [initialValues, setInitialValues] = useState({
        hasSubMenu: true,
        title: "",
        icon: "",
        typeId: "",
        category: "",
        menuOrder: "",
        subItems: [{
            title: "",
            route: "",
            icon: "",
            tagId: ''
        }],
    });
    const [pending, setPending] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "" });

    const formFieldStyles = (gridColumn = "span 2") => ({
        gridColumn,
        "& .MuiInputLabel-root": {
            color: theme.palette.mode === "dark" ? colors.grey[100] : colors.black[700],
        },
        "& .MuiFilledInput-root": {
            color: theme.palette.mode === "dark" ? colors.grey[100] : colors.black[700],
        },
        "& .MuiInputLabel-root.Mui-focused": {
            color: theme.palette.mode === "dark" ? colors.grey[100] : colors.black[100],
        },
    });

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === "clickaway") return;
        setSnackbar({ ...snackbar, open: false });
    };

    const createItem = async (itemData) => {
        try {
            console.log("itemdata", itemData);

            const response = await CBS_Services('GATEWAY', 'clientGateWay/items/createItem', 'POST', itemData, token);
            console.log("response", response);

            if (response.status === 200) {
                showSnackbar("Item created successfully", "success");
                navigate(-1)
            } else {
                showSnackbar("Failed to create item", "error");

            }
            return response;
        } catch (error) {
            throw new Error('Failed to create item');
        }
    };

    const createSubItem = async (subItemData) => {
        console.log("subItemData", subItemData);

        try {
            const response = await CBS_Services('GATEWAY', 'clientGateWay/subItem/createSubItem', 'POST', subItemData, token);
            console.log("responsesubItemData", response);

            if (response.status === 200) {
                showSnackbar("Sub Item created successfully", "success");
            }
            else {
                showSnackbar("Failed to create sub item", "error");
            }
        } catch (error) {
            throw new Error('Failed to create subitem');
        }
    };

    const handleFormSubmit = async (values, { resetForm }) => {
        setPending(true);
        try {

            if (id) {
                // Update existing catalog item
                const response = await CBS_Services('GATEWAY', 'clientGateWay/items/updateItem', 'PUT', values, token);
                console.log("editresponse", response);


                if (response && response.status === 200) {
                    showSnackbar('Menu Edited Successfully.', 'success');
                    setTimeout(() => {
                        navigate(-1);
                    }, 2000);
                } else {
                    // toast.error(response.body.errors || "Error Editing Catalog");
                    showSnackbar(response.body.errors || 'Error Editing Menu', 'error');

                }
            } else {
                // Prepare the item data
                const itemData = {
                    title: values.title,
                    typeId: values.typeId,
                    icon: values.icon,
                    category: values.category,
                    menuOrder: parseInt(values.menuOrder),
                };

                if (!values.hasSubMenu) {
                    // If no subitems, just create the item
                    const itemResponse = await createItem(itemData);
                    showSnackbar("Item created successfully", "success");
                    // setTimeout(() => navigate(-1), 2000);
                } else {
                    // If has subitems, create item first then create subitems
                    const itemResponse = await createItem(itemData);
                    console.log("itemResponse", itemResponse);

                    const itemId = itemResponse.body.data.title; // Adjust based on your API response structure


                    // Create all subitems sequentially
                    for (const subItem of values.subItems) {
                        await createSubItem({
                            itemId: itemId,
                            title: subItem.title,
                            route: subItem.route,
                            icon: subItem.icon,
                            tagId: subItem.tagId || [],
                        });
                    }

                    showSnackbar("Item and subitems created successfully", "success");
                    // setTimeout(() => navigate("/items-management"), 2000);
                    resetForm({
                        values: {
                            hasSubMenu: true,
                            title: "",
                            icon: "",
                            typeId: "",
                            category: "",
                            menuOrder: "",
                            subItems: [{
                                title: "",
                                route: "",
                                icon: "",
                                tagId: []
                            }],
                        }
                    });
                    setActiveSubItemIndex(null);
                    setSelectAll(false);
                    setSearchTerm("");
                }
            }

        } catch (error) {
            console.error("Error:", error);
            showSnackbar(error.message || "Error creating items", "error");
        } finally {
            setPending(false);
        }
    };

    const fetchtypeData = async () => {

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

    }

    useEffect(() => {
        fetchtypeData();
    }, [])

    const fetchTags = async () => {
        try {
            const response = await CBS_Services('APE', 'catalog/get/all', 'GET', null, token);
            if (response && response.status === 200) {
                setAvailableTags(response.body.data || []);
            } else {
                showSnackbar('Error fetching tags.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showSnackbar('Error fetching tags.', 'error');
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    // Add handlers for tag modal
    const handleOpenTagModal = (index) => {
        setActiveSubItemIndex(index);
        setShowTagModal(true);
    };

    const handleCloseTagModal = () => {
        setShowTagModal(false);
        setActiveSubItemIndex(null);
        setSearchTerm("");
        setSelectAll(false);
    };

    const handleSelectAll = (setFieldValue) => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);

        if (newSelectAll) {
            const allTags = availableTags?.map(tag => tag.id);
            setFieldValue(`subItems.${activeSubItemIndex}.tagId`, allTags);
        } else {
            setFieldValue(`subItems.${activeSubItemIndex}.tagId`, []);
        }
    };



    const handleUnselectAll = (setFieldValue) => {
        console.log("Clearing all tags for subitem:", activeSubItemIndex); // Debug log
        setFieldValue(`subItems.${activeSubItemIndex}.tagId`, []);
        setSelectAll(false);
    };

    // const handleToggleTag = (tagId, values, setFieldValue) => {
    //     const currentTags = values.subItems[activeSubItemIndex].tagId || [];
    //     const newTags = currentTags.includes(tagId)
    //         ? currentTags.filter(id => id !== tagId)
    //         : [...currentTags, tagId];

    //     setFieldValue(`subItems.${activeSubItemIndex}.tagId`, newTags);
    // };

    const handleToggleTag = (tagId, values, setFieldValue) => {
        const currentTags = values.subItems[activeSubItemIndex].tagId || [];
        const newTags = currentTags.includes(tagId)
            ? currentTags.filter(id => id !== tagId)
            : [...currentTags, tagId];

        console.log("Updating tags for subitem", activeSubItemIndex, "to:", newTags); // Debug log
        setFieldValue(`subItems.${activeSubItemIndex}.tagId`, newTags);
    };

    useEffect(() => {
        if (id && location.state && location.state.menuData) {
            setInitialValues(location.state.menuData);
        }
    }, [id, location.state]);

    console.log("initialValues", initialValues);

    return (
        <Box m="20px">
            <Header
                title={id ? "EDIT MENU ITEM" : "ADD MENU ITEM"}
                subtitle={id ? "Edit the item" : "Add a new item"}
            />
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                enableReinitialize={true}
            // validationSchema={itemSchema}
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
                            padding: "10px 100px 20px 100px",
                        }}
                    >
                        <form onSubmit={handleSubmit}>
                            {/* Menu Type Selection */}
                            {!id &&
                                <Box
                                    display="grid"
                                    gap="30px"
                                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                    sx={{
                                        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
                                        borderRadius: "10px",
                                        padding: "40px",
                                        marginBottom: "20px",
                                        "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                                    }}
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={values.hasSubMenu}
                                                onChange={(e) => {
                                                    const isChecked = e.target.checked;
                                                    setFieldValue("hasSubMenu", isChecked);
                                                    if (isChecked && (!values.subItems || values.subItems.length === 0)) {
                                                        // Initialize subItems with one empty item when checkbox is checked
                                                        setFieldValue("subItems", [{
                                                            title: "",
                                                            route: "",
                                                            icon: ""
                                                        }]);
                                                    }
                                                }}
                                                name="hasSubMenu"
                                                color="secondary"
                                            />
                                        }
                                        label="This item has subitems"
                                        sx={{ gridColumn: "span 4" }}
                                    />
                                </Box>
                            }


                            {/* Main Item Form */}
                            <Box
                                display="grid"
                                gap="30px"
                                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                sx={{
                                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
                                    borderRadius: "10px",
                                    padding: "40px",
                                    marginBottom: "20px",
                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                                }}
                            >
                                <Typography variant="h5" sx={{ gridColumn: "span 4" }}>
                                    Item Details
                                </Typography>



                                <FormControl fullWidth variant="filled"
                                    sx={formFieldStyles("span 2")}

                                    InputLabelProps={{
                                        sx: {
                                            color: 'white', // Default label color
                                        }
                                    }}
                                >
                                    <InputLabel>Type</InputLabel>
                                    <Select
                                        label="Type"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.typeId}
                                        name="typeId"
                                        error={!!touched.typeId && !!errors.typeId}

                                    >
                                        <MenuItem value="" disabled>Select Type</MenuItem>
                                        {Array.isArray(typeData) && typeData.length > 0 ? (
                                            typeData.map(option => (
                                                <MenuItem key={option.intitule} value={option.intitule}>
                                                    {option.intitule}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem value="">No Types available</MenuItem>
                                        )}
                                    </Select>
                                    {touched.typeId && errors.typeId && (
                                        <Alert severity="error">{errors.typeId}</Alert>
                                    )}
                                </FormControl>

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    label="Category"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.category}
                                    name="category"
                                    error={!!touched.category && !!errors.category}
                                    helperText={touched.category && errors.category}
                                    sx={formFieldStyles("span 2")}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    label="Title"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.title}
                                    name="title"
                                    error={!!touched.title && !!errors.title}
                                    helperText={touched.title && errors.title}
                                    sx={formFieldStyles("span 2")}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    label="Menu Order"
                                    type="number"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.menuOrder}
                                    name="menuOrder"
                                    error={!!touched.menuOrder && !!errors.menuOrder}
                                    helperText={touched.menuOrder && errors.menuOrder}
                                    sx={formFieldStyles("span 2")}
                                />

                                {!values.hasSubMenu && (
                                    <Box sx={formFieldStyles("span 4")}>
                                        <IconSelector
                                            value={values.icon}
                                            onChange={(newValue) => setFieldValue('icon', newValue)}
                                            error={!!touched.icon && !!errors.icon}
                                            helperText={touched.icon && errors.icon}
                                            label="Select Icon"

                                        />
                                    </Box>
                                )}

                                <Divider sx={{ gridColumn: "span 4", my: 2 }} />



                                {/* Subitems Form */}
                                {values.hasSubMenu && (
                                    <FieldArray name="subItems">
                                        {({ push, remove }) => (
                                            <Box sx={{ gridColumn: "span 4" }}>
                                                <Typography variant="h5" sx={{ gridColumn: "span 4", mb: 2 }}>
                                                    Subitem Details
                                                </Typography>

                                                {values?.subItems?.map((subItem, index) => (
                                                    <Box key={index} sx={{
                                                        display: 'grid',
                                                        gridTemplateColumns: "2fr 2fr 2fr 1fr auto",
                                                        gap: 2,
                                                        mb: 3,
                                                        alignItems: 'start',
                                                        backgroundColor: colors.primary[400],
                                                        padding: "20px",
                                                        borderRadius: "8px"
                                                    }}>
                                                        {/* Subitem Title Field */}
                                                        <TextField
                                                            fullWidth
                                                            variant="filled"
                                                            label="Subitem Title"
                                                            name={`subItems.${index}.title`}
                                                            value={subItem.title}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={touched.subItems?.[index]?.title && errors.subItems?.[index]?.title}
                                                            helperText={touched.subItems?.[index]?.title && errors.subItems?.[index]?.title}
                                                            sx={formFieldStyles("span 1")}
                                                        />



                                                        <FormControl fullWidth variant="filled"
                                                            sx={formFieldStyles("span 1")}>
                                                            <InputLabel>Route</InputLabel>
                                                            <Select
                                                                label="Route"
                                                                onBlur={handleBlur}
                                                                onChange={handleChange}
                                                                value={subItem.route}
                                                                name={`subItems.${index}.route`}
                                                                error={touched.subItems?.[index]?.route && errors.subItems?.[index]?.route}

                                                            >
                                                                <MenuItem value="" disabled>Select Path</MenuItem>
                                                                {MenuLinks.map((menu) => (
                                                                    <MenuItem key={menu.value} value={menu.value} disabled={!menu.value}>
                                                                        {formatValue(menu.linkname)}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                            {touched.subItems?.[index]?.route && errors.subItems?.[index]?.route && (
                                                                <Alert severity="error">{errors.subItems?.[index]?.route}</Alert>
                                                            )}
                                                        </FormControl>

                                                        {/* Icon Selector */}
                                                        <Box sx={formFieldStyles("span 1")}>
                                                            <IconSelector
                                                                value={subItem.icon}
                                                                onChange={(newValue) => setFieldValue(`subItems.${index}.icon`, newValue)}
                                                                error={touched.subItems?.[index]?.icon && errors.subItems?.[index]?.icon}
                                                                helperText={touched.subItems?.[index]?.icon && errors.subItems?.[index]?.icon}
                                                                label="Select Icon"
                                                            />
                                                        </Box>

                                                        <Button
                                                            color="secondary"
                                                            variant="outlined"
                                                            startIcon={<Label />}
                                                            onClick={() => handleOpenTagModal(index)}
                                                            sx={{ mt: 0, padding: 2 }}
                                                        >
                                                            Select Tags ({(subItem.tagId || []).length})
                                                        </Button>

                                                        {/* Remove Button */}
                                                        {values.subItems.length > 1 && (
                                                            <IconButton
                                                                color="error"
                                                                variant="contained"
                                                                sx={{ gridColumn: "auto", color: colors.redAccent[500], mr: 2 }}
                                                                onClick={() => remove(index)}
                                                            >
                                                                <RemoveCircle />
                                                            </IconButton>
                                                        )}
                                                    </Box>
                                                ))}

                                                {/* Add Subitem Button */}
                                                <Button
                                                    color="secondary"
                                                    variant="outlined"
                                                    startIcon={<Add />}
                                                    onClick={() => push({ title: "", route: "", icon: "" })}
                                                    sx={{ mt: 1 }}
                                                >
                                                    Add Another Subitem
                                                </Button>
                                            </Box>
                                        )}
                                    </FieldArray>
                                )}

                            </Box>


                            <Box display="flex" justifyContent="end" mt="20px">
                                <Stack direction="row" spacing={2}>
                                    <LoadingButton
                                        type="submit"
                                        color="secondary"
                                        variant="contained"
                                        loading={pending}
                                        startIcon={<Save />}
                                    >
                                        {id ? "Update Item" : "Create Item"}
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

                        <Dialog
                            open={showTagModal}
                            onClose={handleCloseTagModal}
                            fullWidth
                            maxWidth="md"
                        >
                            <DialogTitle>Select Tags</DialogTitle>
                            <DialogContent>
                                <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                    <TextField
                                        fullWidth
                                        sx={{ mb: 2 }}
                                        placeholder="Search tags..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Search />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <List sx={{
                                        width: '100%',
                                        bgcolor: 'background.paper',
                                        maxHeight: 300,
                                        overflow: 'auto'
                                    }}>
                                        <ListItem dense>
                                            <ListItemIcon>
                                                <Checkbox
                                                    edge="start"
                                                    checked={selectAll}
                                                    tabIndex={-1}
                                                    disableRipple
                                                    onChange={() => handleSelectAll(setFieldValue)}
                                                    color='secondary'
                                                />
                                            </ListItemIcon>
                                            <ListItemText primary="Select All" />
                                        </ListItem>
                                        {Array.isArray(availableTags) && availableTags > 0 ?

                                            availableTags
                                                .filter(tag => tag.id.toLowerCase().includes(searchTerm.toLowerCase()))
                                                .map((tag) => {
                                                    const isSelected = values?.subItems[activeSubItemIndex]?.tagId?.includes(tag.id);
                                                    return (
                                                        <ListItem
                                                            key={tag.id}
                                                            dense
                                                            button
                                                            onClick={() => handleToggleTag(tag.id, values, setFieldValue)}
                                                        >
                                                            <ListItemIcon>
                                                                <Checkbox
                                                                    edge="start"
                                                                    checked={isSelected}
                                                                    tabIndex={-1}
                                                                    disableRipple
                                                                    color='secondary'
                                                                />
                                                            </ListItemIcon>
                                                            <ListItemText primary={tag.id} />
                                                        </ListItem>
                                                    );
                                                })


                                            : "No tags"}

                                    </List>
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseTagModal} color="primary" variant="contained">
                                    Done
                                </Button>
                                <Button onClick={handleUnselectAll} color="secondary" variant="contained">
                                    Clear Selected Tags
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                )}

            </Formik>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

const itemSchema = yup.object().shape({
    hasSubMenu: yup.boolean().required(),
    title: yup.string().required('Title is required').min(2, 'Title must be at least 2 characters'),
    typeId: yup.string().required('Type ID is required'),
    icon: yup.string().nullable(),
    category: yup.string().required('Category is required'),
    menuOrder: yup.number().required('Menu order is required').min(0, 'Order must be positive'),
    subItems: yup.array().when('hasSubMenu', {
        is: true,
        then: yup.array().of(
            yup.object().shape({
                title: yup.string().required('Subitem title is required'),
                route: yup.string().required('Route is required'),
                icon: yup.string().nullable(),
                tagId: yup.array().of(yup.string()).nullable()
            })
        ),
        otherwise: yup.array().nullable()
    }),
});

export default CreateMenuForm;




