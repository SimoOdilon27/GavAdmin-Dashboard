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


const AssignRoleMenu = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const { roleName } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const userData = useSelector((state) => state.users);
    const [typeData, setTypeData] = useState([]);
    const [itemData, setItemData] = useState([]);
    const [subItemData, setSubItemData] = useState([]);
    const token = userData.token;
    const spaceId = userData?.selectedSpace?.id

    const [initialValues, setInitialValues] = useState({
        roleName: roleName,
        itemId: [],
        subsItemId: []
    });

    const [filteredItems, setFilteredItems] = useState([]);
    const [filteredSubItems, setFilteredSubItems] = useState([]);

    const [pending, setPending] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

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

        const submitData = {
            ...values,
            roleName: roleName,
        };
        console.log("values====", submitData);
        try {
            const response = await CBS_Services('GATEWAY', 'clientGateWay/role/addItemAndSubsItemToRole', 'POST', submitData, token);
            console.log("responseCreateRole", response);
            if (response && response.status === 200) {
                showSnackbar('Role Assigned to Menu Successfully.', 'success');
                setTimeout(() => {
                    navigate(-1);
                }, 2000);
            } else {
                showSnackbar(response.body.errors || 'Error while Assigning Role', 'error');
            }
        } catch (error) {
            console.error("Error:", error);
            showSnackbar('Error Try Again Later', 'error');
        }
        setPending(false);
    };

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
        fetchItemData();
        fetchSubItemData();
    }, []);

    const handleItemChange = (formikProps, selectedItems) => {
        // selectedItems will already be an array because of multiple prop
        formikProps.setFieldValue('itemId', selectedItems);
        // Reset subItemId as empty array
        // formikProps.setFieldValue('subItemId', []);

        // Filter subitems based on selected items
        const filteredSubs = subItemData.filter(subItem =>
            selectedItems.some(selectedItemId => {
                const selectedItemData = itemData.find(item => item.id === selectedItemId);
                return selectedItemData && subItem.itemId === selectedItemData.title;
            })
        );
        setFilteredSubItems(filteredSubs);
    };
    return (
        <Box m="20px">
            <Header
                title={`ROLE ASSIGNMENT `}
                subtitle={`Assign Menu to ${roleName}`}
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
                                <FormControl
                                    fullWidth
                                    variant="filled"
                                    sx={formFieldStyles("span 4")}

                                >
                                    <InputLabel>Items</InputLabel>
                                    <Select
                                        multiple // Add this
                                        label="Items"
                                        onBlur={handleBlur}
                                        onChange={(e) => handleItemChange({ setFieldValue }, e.target.value)}
                                        value={values.itemId}
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
                                    sx={formFieldStyles("span 4")}
                                // disabled={!values.itemId?.length}
                                >
                                    <InputLabel>Sub Items</InputLabel>
                                    <Select
                                        multiple // Add this
                                        label="Sub Items"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.subsItemId}
                                        name="subsItemId"
                                        error={!!touched.subsItemId && !!errors.subsItemId}
                                    >
                                        {subItemData.map((subItem) => (
                                            <MenuItem key={subItem.id} value={subItem.id}>
                                                {subItem.title}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {touched.subsItemId && errors.subsItemId && (
                                        <Alert severity="error">{errors.subsItemId}</Alert>
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
                                        {"Assign Role to Menu"}
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
    )
}

const checkoutSchema = yup.object().shape({
    itemId: yup.array().of(yup.string()).required("required"),
    subsItemId: yup.array()
});

export default AssignRoleMenu
