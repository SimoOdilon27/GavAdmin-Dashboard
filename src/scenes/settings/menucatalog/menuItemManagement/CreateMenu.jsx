
import {
    Alert,
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    Stack,
    TextField,
    Checkbox,
    FormControlLabel,
    Typography,
    IconButton,
    Divider,
} from "@mui/material";
import { FieldArray, Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../../components/Header";
import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import { Save, Cancel, RemoveCircle, Add } from "@mui/icons-material";
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
    const userData = useSelector((state) => state.users);

    const [initialValues, setInitialValues] = useState({
        hasSubMenu: false,
        title: "",
        icon: "",
        typeId: "",
        category: "",
        menuOrder: "",
        subItems: [{
            title: "",
            route: "",
            icon: "",
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

            const response = await CBS_Services('GATEWAY', 'clientGateWay/items/createItem', 'POST', itemData);
            console.log("response", response);

            if (response.status === 200) {
                showSnackbar("Item created successfully", "success");
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
            const response = await CBS_Services('GATEWAY', 'clientGateWay/subItem/createSubItem', 'POST', subItemData);
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

    const handleFormSubmit = async (values) => {
        setPending(true);
        try {
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
                        icon: subItem.icon
                    });
                }

                showSnackbar("Item and subitems created successfully", "success");
                // setTimeout(() => navigate("/items-management"), 2000);
            }
        } catch (error) {
            console.error("Error:", error);
            showSnackbar(error.message || "Error creating items", "error");
        } finally {
            setPending(false);
        }
    };


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
                validationSchema={itemSchema}
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

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    label="Type ID"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.typeId}
                                    name="typeId"
                                    error={!!touched.typeId && !!errors.typeId}
                                    helperText={touched.typeId && errors.typeId}
                                    sx={formFieldStyles("span 2")}
                                />

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

                                <Box sx={formFieldStyles("span 4")}>
                                    <IconSelector
                                        value={values.icon}
                                        onChange={(newValue) => setFieldValue('icon', newValue)}
                                        error={!!touched.icon && !!errors.icon}
                                        helperText={touched.icon && errors.icon}
                                        label="Select Icon"
                                    />
                                </Box>

                                <Divider sx={{ gridColumn: "span 4", my: 2 }} />



                                {/* Subitems Form */}
                                {values.hasSubMenu && (
                                    <FieldArray name="subItems">
                                        {({ push, remove }) => (
                                            <Box sx={{ gridColumn: "span 4" }}>
                                                <Typography variant="h5" sx={{ gridColumn: "span 4", mb: 2 }}>
                                                    Subitem Details
                                                </Typography>

                                                {values.subItems.map((subItem, index) => (
                                                    <Box key={index} sx={{ display: 'grid', gridTemplateColumns: "1fr 1fr 1fr auto", gap: 2, mb: 2 }}>
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

                                                        {/* Route Field */}
                                                        {/* <TextField
                                                            fullWidth
                                                            variant="filled"
                                                            label="Route"
                                                            name={`subItems.${index}.route`}
                                                            value={subItem.route}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={touched.subItems?.[index]?.route && errors.subItems?.[index]?.route}
                                                            helperText={touched.subItems?.[index]?.route && errors.subItems?.[index]?.route}
                                                            sx={formFieldStyles("span 1")}
                                                        /> */}

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
                                                        <Box sx={{ gridColumn: "span 1" }}>
                                                            <IconSelector
                                                                value={subItem.icon}
                                                                onChange={(newValue) => setFieldValue(`subItems.${index}.icon`, newValue)}
                                                                error={touched.subItems?.[index]?.icon && errors.subItems?.[index]?.icon}
                                                                helperText={touched.subItems?.[index]?.icon && errors.subItems?.[index]?.icon}
                                                                label="Select Icon"
                                                            />
                                                        </Box>

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

export default CreateMenuForm;

const itemSchema = yup.object().shape({
    hasSubMenu: yup.boolean(),
    title: yup.string().required('Title is required'),
    typeId: yup.string().required('Type ID is required'),
    icon: yup.string().required('Icon is required'),
    category: yup.string().required('Category is required'),
    menuOrder: yup.number().required('Menu order is required'),
    subItems: yup.array().when('hasSubMenu', {
        is: true,
        then: yup.array().of(
            yup.object().shape({
                title: yup.string().required('Subitem title is required'),
                route: yup.string().required('Route is required'),
                icon: yup.string().required('Icon is required'),
            })
        ),
    }),
});



// import {
//     Alert,
//     Box,
//     Button,
//     FormControl,
//     InputLabel,
//     MenuItem,
//     Select,
//     Snackbar,
//     Stack,
//     TextField,
//     Checkbox,
//     FormControlLabel,
//     Typography,
// } from "@mui/material";
// import { Formik } from "formik";
// import * as yup from "yup";
// import useMediaQuery from "@mui/material/useMediaQuery";
// import Header from "../../../components/Header";
// import { useParams, useNavigate } from "react-router-dom";
// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { LoadingButton } from "@mui/lab";
// import { Save, Cancel } from "@mui/icons-material";
// import { tokens } from "../../../theme";
// import { useTheme } from "@emotion/react";
// import CBS_Services from "../../../services/api/GAV_Sercives";
// import IconSelector from "./IconSelector";
// import { MenuLinks } from "../../global/SideBarLinks";
// import { formatValue } from "../../../tools/formatValue";


// const CreateMenuForm = () => {
//     const theme = useTheme();
//     const colors = tokens(theme.palette.mode);
//     const isNonMobile = useMediaQuery("(min-width:600px)");
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const userData = useSelector((state) => state.users);
//     const token = userData.token;

//     const [initialValues, setInitialValues] = useState({
//         hasSubMenu: false,
//         title: "",
//         icon: "",
//         route: "",
//         category: "",
//         menuOrder: "",
//         subItems: [{
//             itemId: "", // id of the item
//             title: "",
//             route: "",
//             icon: "",
//         }],
//     });
//     const [pending, setPending] = useState(false);
//     const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "" });

//     const formFieldStyles = (gridColumn = "span 2") => ({
//         gridColumn,
//         "& .MuiInputLabel-root": {
//             color: theme.palette.mode === "dark" ? colors.grey[100] : colors.black[700],
//         },
//         "& .MuiFilledInput-root": {
//             color: theme.palette.mode === "dark" ? colors.grey[100] : colors.black[700],
//         },
//         "& .MuiInputLabel-root.Mui-focused": {
//             color: theme.palette.mode === "dark" ? colors.grey[100] : colors.black[100],
//         },
//     });

//     const showSnackbar = (message, severity) => {
//         setSnackbar({ open: true, message, severity });
//     };

//     const handleSnackbarClose = (event, reason) => {
//         if (reason === "clickaway") {
//             return;
//         }
//         setSnackbar({ ...snackbar, open: false });
//     };

//     const handleFormSubmit = async (values) => {
//         setPending(true);
//         try {
//             let response;

//             console.log("values", values);

//             if (id) {
//                 // Update existing menu
//                 response = await CBS_Services("POST", "menu/addOrUpdate", values);
//                 if (response?.status === 200) {
//                     showSnackbar("Menu Updated Successfully", "success");
//                     setTimeout(() => navigate("/menu-management"), 2000);
//                 } else {
//                     showSnackbar(response?.body?.errors || "Error Updating Menu", "error");
//                 }
//             } else {
//                 // Add new menu
//                 response = await CBS_Services("POST", "menu/addOrUpdate", values);
//                 if (response?.status === 200) {
//                     showSnackbar("Menu Created Successfully", "success");
//                     setTimeout(() => navigate("/menu-management"), 2000);
//                 } else {
//                     showSnackbar(response?.body?.errors || "Error Adding Menu", "error");
//                 }
//             }
//         } catch (error) {
//             console.error("Error:", error);
//             showSnackbar("Error Try Again Later", "error");
//         }
//         setPending(false);
//     };

//     useEffect(() => {
//         if (id) {
//             // Fetch the existing menu item by ID
//             CBS_Services("GET", `menu/get/${id}`, null)
//                 .then((response) => {
//                     if (response?.status === 200) {
//                         setInitialValues(response.body.data);
//                     }
//                 })
//                 .catch((error) => console.error("Error fetching menu item:", error));
//         }
//     }, [id]);

//     return (
//         <Box m="20px">
//             <Header
//                 title={id ? "EDIT MENU ITEM" : "ADD MENU ITEM"}
//                 subtitle={id ? "Edit the menu item" : "Add a new menu item"}
//             />
//             <Formik
//                 onSubmit={handleFormSubmit}
//                 initialValues={initialValues}
//                 enableReinitialize={true}
//                 validationSchema={menuSchema}
//             >
//                 {({
//                     values,
//                     errors,
//                     touched,
//                     handleBlur,
//                     handleChange,
//                     handleSubmit,
//                     setFieldValue
//                 }) => (
//                     <Box
//                         display="grid"
//                         sx={{
//                             px: 2,
//                             padding: "10px 100px 20px 100px",
//                         }}
//                     >
//                         <form onSubmit={handleSubmit}>
//                             {/* Initial Menu Type Selection */}
//                             <Box
//                                 display="grid"
//                                 gap="30px"
//                                 gridTemplateColumns="repeat(4, minmax(0, 1fr))"
//                                 sx={{
//                                     boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
//                                     borderRadius: "10px",
//                                     padding: "40px",
//                                     marginBottom: "20px",
//                                     "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
//                                 }}
//                             >
//                                 <Typography
//                                     variant="h5"
//                                     sx={{
//                                         gridColumn: "span 4",
//                                         color: theme.palette.mode === "dark" ? colors.grey[100] : colors.black[700],
//                                         marginBottom: "20px"
//                                     }}
//                                 >
//                                     Menu Type Selection
//                                 </Typography>
//                                 <FormControlLabel
//                                     control={
//                                         <Checkbox
//                                             checked={values.hasSubMenu}
//                                             onChange={(e) => {
//                                                 const isChecked = e.target.checked;
//                                                 setFieldValue("hasSubMenu", isChecked);
//                                                 // Reset form fields if checked or unchecked
//                                                 if (!isChecked) {
//                                                     setFieldValue("title", "");
//                                                     setFieldValue("icon", "");
//                                                     setFieldValue("route", "");
//                                                     setFieldValue("subItems", [{
//                                                         title: "",
//                                                         route: "",
//                                                         icon: "",
//                                                     }]);
//                                                     setFieldValue("menuOrder", "");
//                                                     setFieldValue("category", "");
//                                                 } else {
//                                                     // Optionally reset specific fields if needed
//                                                     setFieldValue("subItems", [{ title: "", route: "", icon: "" }]);
//                                                 }
//                                             }}
//                                             name="hasSubMenu"
//                                             color="secondary"
//                                         />
//                                     }
//                                     label="This menu has submenu items"
//                                     sx={{ gridColumn: "span 4" }}
//                                 />
//                             </Box>

//                             {/* Conditional Form Fields */}
//                             {!values.hasSubMenu ? (
//                                 // Single Menu Form
//                                 <Box
//                                     display="grid"
//                                     gap="30px"
//                                     gridTemplateColumns="repeat(4, minmax(0, 1fr))"
//                                     sx={{
//                                         boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
//                                         borderRadius: "10px",
//                                         padding: "40px",
//                                         "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
//                                     }}
//                                 >

//                                     <TextField
//                                         fullWidth
//                                         variant="filled"
//                                         label="Category"
//                                         onBlur={handleBlur}
//                                         onChange={handleChange}
//                                         value={values.category}
//                                         name="category"
//                                         error={!!touched.category && !!errors.category}
//                                         helperText={touched.category && errors.category}
//                                         sx={formFieldStyles("span 3")}
//                                     />
//                                     <TextField
//                                         fullWidth
//                                         variant="filled"
//                                         label="Menu Order"
//                                         onBlur={handleBlur}
//                                         onChange={handleChange}
//                                         value={values.menuOrder}
//                                         name="menuOrder"
//                                         error={!!touched.menuOrder && !!errors.menuOrder}
//                                         helperText={touched.menuOrder && errors.menuOrder}
//                                         sx={formFieldStyles("span 1")}
//                                     />
//                                     <TextField
//                                         fullWidth
//                                         variant="filled"
//                                         label="Menu Name"
//                                         onBlur={handleBlur}
//                                         onChange={handleChange}
//                                         value={values.title}
//                                         name="title"
//                                         error={!!touched.title && !!errors.title}
//                                         helperText={touched.title && errors.title}
//                                         sx={formFieldStyles("span 2")}
//                                     />

//                                     <Box sx={formFieldStyles("span 2")}>
//                                         <IconSelector
//                                             value={values.icon}
//                                             onChange={(newValue) => setFieldValue('icon', newValue)}
//                                             error={!!touched.icon && !!errors.icon}
//                                             helperText={touched.icon && errors.icon}
//                                             label="Select Icon"
//                                         />
//                                     </Box>

//                                     {/* <TextField
//                                         fullWidth
//                                         variant="filled"
//                                         label="Route"
//                                         onBlur={handleBlur}
//                                         onChange={handleChange}
//                                         value={values.route}
//                                         name="route"
//                                         error={!!touched.route && !!errors.route}
//                                         helperText={touched.route && errors.route}
//                                         sx={formFieldStyles("span 4")}
//                                     /> */}

//                                     <FormControl fullWidth variant="filled"
//                                         sx={formFieldStyles("span 4")}>
//                                         <InputLabel>Route</InputLabel>
//                                         <Select
//                                             label="Route"
//                                             onBlur={handleBlur}
//                                             onChange={handleChange}
//                                             value={values.route}
//                                             name="route"
//                                             error={!!touched.route && !!errors.route}

//                                         >
//                                             <MenuItem value="" disabled>Select Path</MenuItem>
//                                             {MenuLinks.map((menu) => (
//                                                 <MenuItem key={menu.value} value={menu.value} disabled={!menu.value}>
//                                                     {formatValue(menu.linkname)}
//                                                 </MenuItem>
//                                             ))}
//                                         </Select>
//                                         {touched.route && errors.route && (
//                                             <Alert severity="error">{errors.route}</Alert>
//                                         )}
//                                     </FormControl>
//                                 </Box>
//                             ) : (
//                                 // Submenu Form
//                                 <>
//                                     {/* Parent Menu Details */}
//                                     <Box
//                                         display="grid"
//                                         gap="30px"
//                                         gridTemplateColumns="repeat(4, minmax(0, 1fr))"
//                                         sx={{
//                                             boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
//                                             borderRadius: "10px",
//                                             padding: "40px",
//                                             marginBottom: "20px",
//                                             "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
//                                         }}
//                                     >
//                                         <Typography
//                                             variant="h5"
//                                             sx={{
//                                                 gridColumn: "span 4",
//                                                 color: theme.palette.mode === "dark" ? colors.grey[100] : colors.black[700],
//                                                 marginBottom: "20px"
//                                             }}
//                                         >
//                                             Parent Menu Details
//                                         </Typography>
//                                         <TextField
//                                             fullWidth
//                                             variant="filled"
//                                             label="Category"
//                                             onBlur={handleBlur}
//                                             onChange={handleChange}
//                                             value={values.category}
//                                             name="category"
//                                             error={!!touched.category && !!errors.category}
//                                             helperText={touched.category && errors.category}
//                                             sx={formFieldStyles("span 2")}
//                                         />
//                                         <TextField
//                                             fullWidth
//                                             variant="filled"
//                                             label="Menu Order"
//                                             onBlur={handleBlur}
//                                             onChange={handleChange}
//                                             value={values.menuOrder}
//                                             name="menuOrder"
//                                             error={!!touched.menuOrder && !!errors.menuOrder}
//                                             helperText={touched.menuOrder && errors.menuOrder}
//                                             sx={formFieldStyles("span 2")}
//                                         />
//                                     </Box>

//                                     {/* Submenu Details */}
//                                     <Box
//                                         display="grid"
//                                         gap="30px"
//                                         gridTemplateColumns="repeat(4, minmax(0, 1fr))"
//                                         sx={{
//                                             boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
//                                             borderRadius: "10px",
//                                             padding: "40px",
//                                             "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
//                                         }}
//                                     >
//                                         <Typography
//                                             variant="h5"
//                                             sx={{
//                                                 gridColumn: "span 4",
//                                                 color: theme.palette.mode === "dark" ? colors.grey[100] : colors.black[700],
//                                                 marginBottom: "20px"
//                                             }}
//                                         >
//                                             Submenu Details
//                                         </Typography>
//                                         {values.subItems.map((_, index) => (
//                                             <React.Fragment key={index}>
//                                                 <TextField
//                                                     fullWidth
//                                                     variant="filled"
//                                                     label="Submenu Title"
//                                                     onBlur={handleBlur}
//                                                     onChange={handleChange}
//                                                     value={values.subItems[index].title}
//                                                     name={`subItems.${index}.title`}
//                                                     sx={formFieldStyles("span 2")}
//                                                 />
//                                                 <Box sx={formFieldStyles("span 2")}>
//                                                     <IconSelector
//                                                         value={values.subItems[index].icon}
//                                                         onChange={handleChange}
//                                                         error={!!touched.icon && !!errors.icon}
//                                                         helperText={touched.icon && errors.icon}
//                                                         label="Select Icon"
//                                                     />
//                                                 </Box>
//                                                 <TextField
//                                                     fullWidth
//                                                     variant="filled"
//                                                     label="Submenu Route"
//                                                     onBlur={handleBlur}
//                                                     onChange={handleChange}
//                                                     value={values.subItems[index].route}
//                                                     name={`subItems.${index}.route`}
//                                                     sx={formFieldStyles("span 4")}
//                                                 />



//                                             </React.Fragment>
//                                         ))}
//                                     </Box>
//                                 </>
//                             )}



//                             <Box display="flex" justifyContent="end" mt="20px">
//                                 <Stack direction="row" spacing={2}>

//                                     <LoadingButton
//                                         type="submit"
//                                         color="secondary"
//                                         variant="contained"
//                                         loading={pending}
//                                         startIcon={<Save />}
//                                     >
//                                         {id ? "Update Menu" : "Add Menu"}
//                                     </LoadingButton>

//                                     <Button color="primary" variant="contained" disabled={pending} onClick={() => navigate(-1)}>
//                                         Cancel
//                                     </Button>
//                                 </Stack>
//                             </Box>
//                         </form>
//                     </Box>
//                 )}
//             </Formik>

//             <Snackbar
//                 open={snackbar.open}
//                 autoHideDuration={6000}
//                 onClose={handleSnackbarClose}
//             >
//                 <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
//                     {snackbar.message}
//                 </Alert>
//             </Snackbar>
//         </Box>
//     );
// };

// export default CreateMenuForm;

// const menuSchema = yup.object().shape({
//     hasSubMenu: yup.boolean(),
//     title: yup.string().when('hasSubMenu', {
//         is: false,
//         then: yup.string().required('Menu name is required'),
//     }),
//     icon: yup.string().when('hasSubMenu', {
//         is: false,
//         then: yup.string().required('Icon is required'),
//     }),
//     route: yup.string().when('hasSubMenu', {
//         is: false,
//         then: yup.string().required('Route is required'),
//     }),
//     category: yup.string().required('Category is required'),
//     menuOrder: yup.string().required('Menu order is required'),
//     subItems: yup.array().when('hasSubMenu', {
//         is: true,
//         then: yup.array().of(
//             yup.object().shape({
//                 title: yup.string().required('Submenu title is required'),
//                 route: yup.string().required('Submenu route is required'),
//                 icon: yup.string().required('Submenu icon is required'),
//             })
//         ),
//     }),
// });

