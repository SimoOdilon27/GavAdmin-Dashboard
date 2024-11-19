import { Alert, Box, Button, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Snackbar, Stack } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CBS_Services from "../../../services/api/GAV_Sercives";
import { LoadingButton } from "@mui/lab";
import { Save } from "@mui/icons-material";
import { FormFieldStyles } from "../../../tools/fieldValuestyle";


const AssignRoleMenu = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const { roleName } = useParams();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.users);
    const [itemData, setItemData] = useState([]);
    const [subItemData, setSubItemData] = useState([]);
    const token = userData.token;

    const [initialValues, setInitialValues] = useState({
        roleName: roleName,
        itemId: [],
        subsItemId: []
    });


    const [pending, setPending] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
    const [selectedSubItems, setSelectedSubItems] = useState([]);


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

        let submitData = {}

        if (values.subsItemId.length === 0) {
            submitData = {
                ...values,
                roleName: roleName,
                itemId: [values.itemId],

            };
        } else {
            submitData = {
                ...values,
                roleName: roleName,
                itemId: []
            };
        }


        console.log("submitData====", submitData);
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



    const fetchSubItemDataById = async (itemId) => {
        setPending(true);
        try {
            const response = await CBS_Services('GATEWAY', `clientGateWay/subItem/getAllSubItemByItemId/${itemId}`, 'GET', null, token);
            console.log("respone=====", response);

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

    const handleItemChange = (formikProps, itemId) => {
        formikProps.setFieldValue("itemId", itemId);
        formikProps.setFieldValue("subsItemId", []);
        setSelectedSubItems([]);
        fetchSubItemDataById(itemId);

    };

    const handleSelectAllSubItems = (formikProps) => {
        if (selectedSubItems.length === subItemData.length) {
            setSelectedSubItems([]);
            formikProps.setFieldValue("subsItemId", []);
        } else {
            const allSubItemIds = subItemData.map((item) => item.id);
            setSelectedSubItems(allSubItemIds);
            formikProps.setFieldValue("subsItemId", allSubItemIds);
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
        fetchItemData();
    }, []);


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
                                    sx={FormFieldStyles("span 4")}

                                >
                                    <InputLabel>Menus</InputLabel>
                                    <Select

                                        label="Menus"
                                        onBlur={handleBlur}
                                        onChange={(e) => handleItemChange({ setFieldValue }, e.target.value)}
                                        value={values.itemId || []}
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
                                    sx={FormFieldStyles("span 4")}
                                    disabled={!values.itemId?.length}
                                >
                                    <InputLabel>Sub Menus</InputLabel>
                                    <Select
                                        multiple
                                        label="Sub Menus"
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            setFieldValue("subsItemId", e.target.value);
                                            setSelectedSubItems(e.target.value);
                                        }}
                                        value={selectedSubItems}
                                        name="subsItemId"
                                        error={!!touched.subsItemId && !!errors.subsItemId}
                                        renderValue={(selected) => getSelectedSubItemTitles()}
                                    >
                                        <MenuItem value="selectAll">
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={selectedSubItems.length === subItemData.length}
                                                        onChange={() => handleSelectAllSubItems({ setFieldValue })}
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



export default AssignRoleMenu
