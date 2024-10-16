import { Alert, Box, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputAdornment, InputLabel, List, ListItem, ListItemIcon, ListItemText, ListSubheader, MenuItem, Select, Snackbar, Stack, TextField, useMediaQuery, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header'
import { tokens } from '../../../theme';
import { Add, EditOutlined, MenuBook, Save, Search, VerifiedUser } from '@mui/icons-material';
import CBS_Services from '../../../services/api/GAV_Sercives';
import { useSelector } from 'react-redux';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { LoadingButton } from '@mui/lab';
import { Formik } from 'formik';
import * as yup from "yup";
import { formatValue } from '../../../tools/formatValue';

const RoleManagement = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const [roleData, setRoleData] = React.useState([])
    const [loading, setLoading] = useState(false);
    const [CatalogData, setCatalogData] = useState([]);
    const [showModal, setShowModal] = React.useState(false)
    const [showAssignRoleModal, setShowAssignRoleModal] = React.useState(false)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
    const [selectedRow, setSelectedRow] = useState(null);



    const [assignRoleData, setAssignRoleData] = React.useState(
        {
            id: 0,
            tagNames: [],
            roleName: '',
            creationDate: '',
            serviceTags: ''
        }
    )
    const [formData, setFormData] = React.useState(
        {
            id: 0,
            roleName: '',
            creationDate: '',
            level: 0,
        }
    )
    const [searchTerm, setSearchTerm] = useState('')
    const userData = useSelector((state) => state.users);
    const token = userData.token;

    console.log("yserss", userData);

    const handleToggle = (value) => () => {
        const currentIndex = assignRoleData.tagNames.indexOf(value);
        const newChecked = [...assignRoleData.tagNames];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setAssignRoleData({
            ...assignRoleData,
            tagNames: newChecked
        });
    };


    const handleToggleRoleModal = () => {
        setFormData({
            id: 0,
            roleName: '',
            creationDate: '',

        });
        setShowModal(!showModal);
    };

    console.log("form", formData);

    const handleToggleAssignRoleModal = (assignrole) => {
        setSelectedRow(assignrole);
        setAssignRoleData({
            id: 0,
            tagNames: [], // Reset to empty array
            roleName: assignrole,
            creationDate: '',
            serviceTags: ''
        });

        setShowAssignRoleModal(!showAssignRoleModal);
    };

    console.log('assignRoleData', assignRoleData);

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 80;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

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
            console.log("fetchresponse=====", response);

            if (response && response.status === 200) {
                setRoleData(response.body.data || null);
                // setSuccessMessage('');
                // setErrorMessage('');
            } else {
                showSnackbar('Error Finding Data.', 'error');
            }

        } catch (error) {
            console.log('Error:', error);
        }

    }

    const handleConfirmAddRole = async () => {
        setLoading(true);
        try {
            const response = await CBS_Services('GATEWAY', `role/createRole`, 'POST', formData, token);

            console.log("response", response);
            if (response && response.status === 200) {
                handleToggleRoleModal();
                await fetchRoleData();
                showSnackbar('Role created successfully.', 'success');

            } else if (response && response.status === 401) {
                showSnackbar(response.body.errors || 'Unauthorized to perform action', 'error');
            }

            else {
                showSnackbar(response.body.errors || 'Error Adding Role', 'error');

            }
        } catch (error) {
            console.error('Error:', error);
            showSnackbar('Network Error!!! Try again Later.', 'error');
        }

        setLoading(false);
    };



    //     setLoading(true);
    //     try {
    //         const payload = {
    //             tagName: assignRoleData.tagName,
    //             roleName: selectedRow,
    //         };

    //         const response = await CBS_Services('GATEWAY', `role/addRoleToService`, 'POST', payload, token);
    //         console.log("assignroleform", payload);
    //         console.log("responseassign", response);

    //         if (response && response.status === 200) {
    //             showSnackbar('Role assigned successfully.', 'success');
    //             handleToggleAssignRoleModal();
    //             await fetchRoleData();
    //         } else {
    //             showSnackbar(response.body.errors || 'Error assigning role', 'error');
    //         }
    //     } catch (error) {
    //         console.error('Error:', error);
    //         showSnackbar('Network Error! Try again later.', 'error');
    //     }

    //     setLoading(false);
    // };


    // Function to fetch Catalog data

    const handleConfirmAssignRole = async () => {
        setLoading(true);
        const results = [];
        let hasError = false;

        try {
            // Process each tag sequentially
            for (const tagName of assignRoleData.tagNames) {
                const payload = {
                    tagName: tagName,
                    roleName: selectedRow,
                };

                const response = await CBS_Services('GATEWAY', `role/addRoleToService`, 'POST', payload, token);

                if (response && response.status === 200) {
                    results.push(`Success: ${tagName}`);
                } else {
                    results.push(`Failed: ${tagName} - ${response.body.errors || 'Unknown error'}`);
                    hasError = true;
                }
            }

            if (hasError) {
                showSnackbar(`Some role assignments failed. ${results.join(', ')}`, 'warning');
            } else {
                showSnackbar('All roles assigned successfully.', 'success');
            }

            handleToggleAssignRoleModal();
            await fetchRoleData();

        } catch (error) {
            console.error('Error:', error);
            showSnackbar('Network Error! Try again later.', 'error');
        }

        setLoading(false);
    };

    const fetchCatalogData = async () => {
        try {

            const payload = {
                serviceReference: 'GET_ALL_CATALOG',
                requestBody: ''
            }
            // const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            const response = await CBS_Services('APE', 'catalog/get/all', 'GET');

            console.log("response", response);

            if (response && response.status === 200) {
                setCatalogData(response.body.data);
            } else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    useEffect(() => {
        fetchRoleData();
        fetchCatalogData()
    }, []);

    console.log("selectedrow", selectedRow);


    // const handleAssignUserRole = (assignrole) => {
    //     setSelectedRow(assignrole);
    //     setShowAssignRoleModal(!showAssignRoleModal);
    // };
    const handleAssignUserRole = (assignrole) => {
        setSelectedRow(assignrole);
        setAssignRoleData({
            ...assignRoleData,
            roleName: assignrole,
            tagName: '',  // Reset tagName when opening the modal
        });
        setShowAssignRoleModal(!showAssignRoleModal);
    };


    const columns = [
        {
            field: "level", headerName: "Level", flex: 1, renderCell: (params) => (
                <Box
                    sx={{ marginLeft: '10px', }}
                >
                    {params.value}
                </Box>
            ),
            renderHeader: () => (
                <Box sx={{ marginLeft: '10px', }}> {/* Add left margin and center text */}
                    Level
                </Box>
            ),
        },
        { field: "roleName", headerName: "Role", flex: 2, valueGetter: (params) => formatValue(params.value), },
        { field: "creationDate", headerName: "Creation Date", flex: 2, valueGetter: (params) => formatValue(params.value), },

        {
            field: "actions",
            headerName: "Actions",
            flex: 2,
            renderCell: (params) => {
                const row = params.row;
                return (
                    <>
                        <Box
                            width="30%"
                            m="0 4px"
                            p="5px"
                            display="flex"
                            justifyContent="center"
                            backgroundColor={colors.greenAccent[600]}
                            borderRadius="4px"
                            onClick={() => handleAssignUserRole(row.roleName)}
                        >
                            <VerifiedUser />
                        </Box>
                        {/* <Box
                            width="30%"
                            m="0"
                            p="5px"
                            display="flex"
                            justifyContent="center"
                            backgroundColor={colors.redAccent[600]}
                            borderRadius="4px"
                        >
                            <Delete />
                        </Box> */}
                    </>
                );
            },
        },
    ];

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Role Management" subtitle="Manage your roles" />
                <Box>
                    <Button
                        sx={{
                            backgroundColor: colors.blueAccent[700],
                            color: colors.grey[100],
                            fontSize: "14px",
                            fontWeight: "bold",
                            padding: "10px 20px",
                            marginRight: "10px",
                        }}
                        onClick={handleToggleRoleModal}
                    >
                        <Add sx={{ mr: "10px" }} />
                        Add Role
                    </Button>

                </Box>
            </Box>


            <Box
                m="40px 100px 15px 100px"
                height="70vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",

                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                    },
                    "& .name-column--cell": {
                        color: colors.greenAccent[300],
                        display: "flex",

                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",

                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.blueAccent[700],
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
                    },
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        color: `${colors.grey[100]} !important`,
                    },
                }}
            >
                <DataGrid
                    rows={roleData}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                    disableSelectionOnClick
                    loading={loading}
                    setFieldValue
                />
            </Box>

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

            <Dialog open={showModal} onClose={handleToggleRoleModal} fullWidth>
                <DialogTitle>Add Role</DialogTitle>
                <DialogContent>

                    <Formik
                        onSubmit={handleConfirmAddRole}
                        initialValues={formData}
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
                            setFieldValue
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

                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Role Name"
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setFieldValue("roleName", e.target.value);
                                            setFormData({ ...formData, roleName: e.target.value });
                                        }}
                                        value={values.roleName}
                                        name="roleName"
                                        error={!!touched.roleName && !!errors.roleName}
                                        helperText={touched.roleName && errors.roleName}
                                        sx={{ gridColumn: "span 4" }}
                                    />
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="number"
                                        label="Level"
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setFieldValue("level", e.target.value);
                                            setFormData({ ...formData, level: e.target.value });
                                        }}
                                        value={values.level}
                                        name="level"
                                        error={!!touched.level && !!errors.level}
                                        helperText={touched.level && errors.level}
                                        sx={{ gridColumn: "span 4" }}
                                    />

                                </Box>
                            </form>
                        )}
                    </Formik>
                </DialogContent>
                <DialogActions>
                    <Box display="flex" justifyContent="end" mt="20px">
                        <Stack direction="row" spacing={2}>

                            <LoadingButton type="submit" color="secondary" variant="contained" loading={loading} loadingPosition="start"
                                startIcon={<Save />} onClick={handleConfirmAddRole}>
                                Add
                            </LoadingButton>

                            <Button color="primary" variant="contained" disabled={loading} onClick={handleToggleRoleModal}>
                                Cancel
                            </Button>
                        </Stack>
                    </Box>
                </DialogActions>
            </Dialog>
            <Dialog open={showAssignRoleModal} onClose={handleToggleAssignRoleModal} fullWidth >
                <DialogTitle>Assign Role</DialogTitle>


                <Dialog
                    open={showAssignRoleModal}
                    onClose={handleToggleAssignRoleModal}
                    fullWidth
                    maxWidth="md" // Increased width for better visibility
                >
                    <DialogTitle>Assign Role to Multiple Menus</DialogTitle>
                    <DialogContent>
                        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                            <TextField
                                fullWidth
                                sx={{ mb: 2 }}
                                placeholder="Search menus..."
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
                                {Array.isArray(CatalogData) && CatalogData.length > 0 ? (
                                    CatalogData
                                        .filter(option =>
                                            option.id.toLowerCase().includes(searchTerm.toLowerCase())
                                        )
                                        .map((option) => {
                                            const labelId = `checkbox-list-label-${option.id}`;

                                            return (
                                                <ListItem
                                                    key={option.id}
                                                    dense
                                                    button
                                                    onClick={handleToggle(option.id)}
                                                >
                                                    <ListItemIcon>
                                                        <Checkbox
                                                            edge="start"
                                                            checked={assignRoleData.tagNames.indexOf(option.id) !== -1}
                                                            tabIndex={-1}
                                                            disableRipple
                                                            inputProps={{ 'aria-labelledby': labelId }}
                                                            color='secondary'
                                                        />
                                                    </ListItemIcon>
                                                    <ListItemText id={labelId} primary={option.id} />
                                                </ListItem>
                                            );
                                        })
                                ) : (
                                    <ListItem>
                                        <ListItemText primary="No menus available" />
                                    </ListItem>
                                )}
                            </List>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Box display="flex" justifyContent="space-between" width="100%" px={2}>
                            <Box>
                                {assignRoleData.tagNames.length > 0 && (
                                    <Alert severity="info" sx={{ mr: 2 }}>
                                        {assignRoleData.tagNames.length} menu(s) selected
                                    </Alert>
                                )}
                            </Box>
                            <Stack direction="row" spacing={2}>
                                <LoadingButton
                                    type="submit"
                                    color="secondary"
                                    variant="contained"
                                    loading={loading}
                                    loadingPosition="start"
                                    startIcon={<VerifiedUser />}
                                    onClick={handleConfirmAssignRole}
                                    disabled={assignRoleData.tagNames.length === 0}
                                >
                                    Assign
                                </LoadingButton>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    disabled={loading}
                                    onClick={handleToggleAssignRoleModal}
                                >
                                    Cancel
                                </Button>
                            </Stack>
                        </Box>
                    </DialogActions>
                </Dialog>
                <DialogActions>
                    <Box display="flex" justifyContent="end" mt="20px">
                        <Stack direction="row" spacing={2}>

                            <LoadingButton type="submit" color="secondary" variant="contained" loading={loading} loadingPosition="start"
                                startIcon={<VerifiedUser />} onClick={handleConfirmAssignRole}>
                                Assign
                            </LoadingButton>

                            <Button color="primary" variant="contained" disabled={loading} onClick={handleToggleAssignRoleModal}>
                                Cancel
                            </Button>
                        </Stack>
                    </Box>
                </DialogActions>
            </Dialog>

        </Box>
    )
}

const checkoutSchema = yup.object().shape({
    roleName: yup.string().required("required"),

});

export default RoleManagement
