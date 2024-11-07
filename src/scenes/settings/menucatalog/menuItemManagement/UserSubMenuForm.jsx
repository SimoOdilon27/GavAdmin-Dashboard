import {
    Alert, Box, Button, FormControl, InputLabel, MenuItem, Select, Snackbar, Stack, TextField, Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    InputAdornment,
    Checkbox,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../../components/Header";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CBS_Services from "../../../../services/api/GAV_Sercives";
import { LoadingButton } from "@mui/lab";
import { Label, Save, Search } from "@mui/icons-material";
import { tokens } from "../../../../theme";
import { useTheme } from "@emotion/react";
import IconSelector from "../IconSelector";

const UserSubMenuForm = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [MenuData, setMenuData] = useState([]);
    const userData = useSelector((state) => state.users);
    const token = userData.token;
    const spaceId = userData?.selectedSpace?.id
    const [showTagModal, setShowTagModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectAll, setSelectAll] = useState(false);
    const [availableTags, setAvailableTags] = useState([]);


    const [pending, setPending] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

    const [initialValues, setInitialValues] = useState({
        itemId: "",
        title: "",
        route: "",
        icon: "",
        tagId: []
    })

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

    const handleOpenTagModal = (index) => {
        setShowTagModal(true);
    };

    const handleCloseTagModal = () => {
        setShowTagModal(false);
        setSearchTerm("");
        setSelectAll(false);
    };

    const handleSelectAll = (setFieldValue) => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);

        if (newSelectAll) {
            const allTags = availableTags.map(tag => tag.id);
            setFieldValue(`tagId`, allTags);
        } else {
            setFieldValue(`tagId`, []);
        }
    };

    const handleUnselectAll = (setFieldValue) => {
        setFieldValue(`tagId`, []);
        setSelectAll(false);
    };

    const handleToggleTag = (tagId, values, setFieldValue) => {
        const currentTags = values.tagId || [];
        const newTags = currentTags.includes(tagId)
            ? currentTags.filter(id => id !== tagId)
            : [...currentTags, tagId];

        console.log("Updating tags for subitem", "to:", newTags); // Debug log
        setFieldValue(`tagId`, newTags);
    };


    const handleFormSubmit = async (values) => {
        setPending(true);

        console.log("values", values);

        try {
            let response;
            if (id) {
                // Update existing SubMenu item
                const response = await CBS_Services('GATEWAY', 'clientGateWay/subItem/updateSubsItem', 'PUT', values, token);
                console.log("editresponse", response);


                if (response && response.status === 200) {
                    showSnackbar('SubMenu Edited Successfully.', 'success');
                    setTimeout(() => {
                        navigate(-1);
                    }, 2000);
                } else {
                    // toast.error(response.body.errors || "Error Editing SubMenu");
                    showSnackbar(response.body.errors || 'Error Editing SubMenu', 'error');

                }
            } else {
                // Add new SubMenu item
                const response = await CBS_Services('GATEWAY', 'clientGateWay/subItem/createSubItem', 'POST', values, token);

                if (response && response.status === 200) {
                    showSnackbar('SubMenu Created Successfully.', 'success');
                    // navigate("/menu-SubMenu"); // Navigate back to the SubMenu list
                    setTimeout(() => {
                        navigate(-1);
                    }, 2000);
                } else {
                    showSnackbar(response.body.errors || 'Error Adding SubMenu', 'error');
                }
            }

            if (response && response.status === 200) {
                navigate("/menu-SubMenu"); // Navigate back to the SubMenu list
            }
        } catch (error) {
            console.error("Error:", error);
            // toast.error(`Error ${id ? "Editing" : "Adding"} SubMenu`);
            showSnackbar('Error Try Again Later', 'error');

        }
        setPending(false);
    };

    const fetchMenuData = async () => {
        setPending(true);
        try {
            const response = await CBS_Services('GATEWAY', 'clientGateWay/items/getAllItems', 'GET', null, token);
            console.log("responsemenus", response);

            if (response && response.status === 200) {
                setMenuData(response.body.data || []);
            } else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setPending(false);
    };
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
        fetchMenuData();
        fetchTags();
    }, [])

    useEffect(() => {
        if (id && location.state && location.state.submenuData) {
            setInitialValues(location.state.submenuData);
        }
    }, [id, location.state]);

    console.log("initialValues", initialValues);


    return (
        <Box m="20px">
            <Header
                title={id ? "EDIT Sub-Menu ITEM" : "ADD Sub-Menu ITEM"}
                subtitle={id ? "Edit the Sub-Menu item" : "Add a new Sub-Menu item"}
            />

            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                enableReinitialize={true}
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
                                    padding: "40px",
                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                                }}
                            >


                                {!id &&
                                    <FormControl fullWidth variant="filled"
                                        sx={formFieldStyles("span 4")}>
                                        <InputLabel>Parent Menu</InputLabel>
                                        <Select
                                            label="Parent Menu"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.itemId}
                                            name="itemId"
                                            error={!!touched.itemId && !!errors.itemId}
                                        >
                                            <MenuItem value="" selected disabled>Select Menu</MenuItem>
                                            {Array.isArray(MenuData) && MenuData.length > 0 ? (
                                                MenuData.map((option) => (
                                                    <MenuItem key={option.id} value={option.id}>
                                                        {option.title}
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <option value="">No Menus available</option>
                                            )}
                                        </Select>
                                        {touched.country && errors.country && (
                                            <Alert severity="error">{errors.country}</Alert>
                                        )}

                                    </FormControl>
                                }



                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Title"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.title}
                                    name="title"
                                    error={!!touched.title && !!errors.title}
                                    helperText={touched.title && errors.title}
                                    sx={formFieldStyles("span 4")}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Route"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.route}
                                    name="route"
                                    error={!!touched.route && !!errors.route}
                                    helperText={touched.route && errors.route}
                                    sx={formFieldStyles("span 2")}
                                />
                                <Box sx={formFieldStyles("span 2")}>
                                    <IconSelector
                                        value={values.icon}
                                        onChange={(newValue) => setFieldValue('icon', newValue)}
                                        error={!!touched.icon && !!errors.icon}
                                        helperText={touched.icon && errors.icon}
                                        label="Select Icon"

                                    />
                                </Box>

                                {!id &&
                                    <Button
                                        color="secondary"
                                        variant="outlined"
                                        startIcon={<Label />}
                                        onClick={() => handleOpenTagModal()}
                                        sx={{ mt: 0 }}
                                    >
                                        Select Tags ({(values?.tagId || []).length})
                                    </Button>
                                }

                            </Box>
                            <Box display="flex" justifyContent="end" mt="20px">
                                <Stack direction="row" spacing={2}>

                                    <LoadingButton type="submit" color="secondary" variant="contained" loading={pending} loadingPosition="start"
                                        startIcon={<Save />}>
                                        {id ? "Update SubMenu" : "Create SubMenu"}
                                    </LoadingButton>

                                    <Button color="primary" variant="contained" disabled={pending} onClick={() => navigate(-1)}>
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
                                        {availableTags
                                            .filter(tag => tag.id.toLowerCase().includes(searchTerm.toLowerCase()))
                                            .map((tag) => {
                                                const isSelected = values?.tagId?.includes(tag.id);
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
                                            })}
                                    </List>
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseTagModal} color="primary" variant="contained">
                                    Done
                                </Button>
                                <Button color="secondary" variant="contained">
                                    Selected Tags({(values?.tagId || []).length})
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
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default UserSubMenuForm
