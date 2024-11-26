import { Alert, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Snackbar, Stack, TextField, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header'
import { tokens } from '../../../theme';
import { Add, Delete, EditOutlined, Save, Search, VerifiedUser, Widgets } from '@mui/icons-material';
import CBS_Services from '../../../services/api/GAV_Sercives';
import { useSelector } from 'react-redux';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { LoadingButton } from '@mui/lab';
import { Formik } from 'formik';
import * as yup from "yup";
import { formatValue } from '../../../tools/formatValue';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import MoreVertIcon from "@mui/icons-material/MoreVert";


const RoleManagement = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { id } = useParams();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const navigate = useNavigate();
    const [roleData, setRoleData] = React.useState([])
    const [loading, setLoading] = useState(false);
    const [CatalogData, setCatalogData] = useState([]);
    const [assignedRoleData, setAssignedRoleData] = useState([]);
    const [showModal, setShowModal] = React.useState(false)
    const [showAssignRoleModal, setShowAssignRoleModal] = React.useState(false)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
    const [selectedRow, setSelectedRow] = useState(null);
    const location = useLocation();


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
    const [selectAll, setSelectAll] = useState(false);
    const userData = useSelector((state) => state.users);
    const token = userData.token;
    const spaceId = userData?.selectedSpace?.id

    const [anchorEl, setAnchorEl] = useState(null);
    const [currentRow, setCurrentRow] = useState(null);
    const open = Boolean(anchorEl);

    // Define or import the handleEdit and handleDelete functions


    const handleDelete = (row) => {
        console.log("Delete clicked", row);
        // Your delete logic here
    };
    const handleEdit = (row) => {
        navigate(`/rolemanagement/edit/${row.id}`, { state: { roleData: row } });
    }
    const handleAssignMenu = (row) => {
        navigate(`/rolemanagement/assignmenu/${row.roleName}`);
    }

    const handleClick = (event, row) => {
        setAnchorEl(event.currentTarget);
        setCurrentRow(row); // Store the current row to pass to actions
    };

    const handleClose = () => {
        setAnchorEl(null);
        setCurrentRow(null);
    };


    useEffect(() => {
        if (id && location.state && location.state.roleData) {
            setFormData(location.state.roleData);
        }
    }, [id, location.state]);

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        if (!selectAll) {
            // Select all unassigned tags
            const unassignedTags = CatalogData
                .filter(option => !assignedRoleData[selectedRow]?.includes(option.id))
                .map(option => option.id);
            setAssignRoleData({
                ...assignRoleData,
                tagNames: unassignedTags
            });
        } else {
            // Deselect all
            setAssignRoleData({
                ...assignRoleData,
                tagNames: []
            });
        }
    };
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

        // Update selectAll state
        const unassignedTags = CatalogData
            .filter(option => !assignedRoleData[selectedRow]?.includes(option.id))
            .map(option => option.id);
        setSelectAll(newChecked.length === unassignedTags.length);
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
        setLoading(true);
        try {
            const response = await CBS_Services('GATEWAY', 'clientGateWay/role/getAllRole', 'GET', null, token);
            console.log("fetchresponse=====", response);

            if (response && response.status === 200) {
                setRoleData(response.body.data || []);
                // setSuccessMessage('');
                // setErrorMessage('');
            } else {
                setRoleData([]);
                showSnackbar('Error Finding Data.', 'error');
            }

        } catch (error) {
            console.log('Error:', error);
        }
        setLoading(false);
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

    const handleConfirmAssignRole = async () => {
        setLoading(true);
        const results = [];
        let hasError = false;

        try {
            const alreadyAssignedTags = assignedRoleData[selectedRow] || [];
            const tagsToAssign = assignRoleData.tagNames.filter(tag => !alreadyAssignedTags.includes(tag));

            for (const tagName of tagsToAssign) {
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
            await fetchAssignedRoleData();  // Refresh the assigned roles data

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
                requestBody: '',
                spaceId: spaceId,
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

    const fetchAssignedRoleData = async () => {
        try {
            const response = await CBS_Services('GATEWAY', 'role/getAllServiceToRole', 'GET', "", token);

            if (response && response.status === 200) {
                // Transform the data into a more useful format
                const assignedData = response.body.data.reduce((acc, item) => {
                    if (!acc[item.roleName]) {
                        acc[item.roleName] = [];
                    }
                    acc[item.roleName].push(item.serviceTags);
                    return acc;
                }, {});
                setAssignedRoleData(assignedData);
            } else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    useEffect(() => {
        fetchRoleData();
        fetchCatalogData();
        fetchAssignedRoleData();
    }, []);

    // console.log("selectedrow", selectedRow);


    const handleAssignUserRole = (assignrole) => {
        setSelectedRow(assignrole);
        setAssignRoleData({
            ...assignRoleData,
            roleName: assignrole,
            tagNames: [],  // Reset tagNames when opening the modal
        });
        setSelectAll(false);  // Reset selectAll state
        setShowAssignRoleModal(!showAssignRoleModal);
    };

    const handleAddRole = () => {
        navigate('/rolemanagement/addrole')
    }




    const columns = [
        {
            field: "creationDate",
            headerName: "Creation Date",
            flex: 1,
            headerAlign: "center", // Center the header
            align: "center", // Center the content
            valueGetter: (params) => formatValue(params.value),
            renderCell: (params) => (
                <Typography variant="body2">
                    {new Date(params.value).toLocaleDateString()}
                </Typography>
            ),
        },
        {
            field: "roleName",
            headerName: "Role",
            flex: 1,
            headerAlign: "center", // Center the header
            align: "center", // Center the content
            valueGetter: (params) => formatValue(params.value),
            renderCell: (params) => (
                <Typography variant="body2" style={{ fontWeight: 'medium' }}>
                    {params.value}
                </Typography>
            ),
        },
        {
            field: "type",
            headerName: "Type",
            flex: 1,
            headerAlign: "center", // Center the header
            align: "center", // Center the content
            valueGetter: (params) => formatValue(params.value),
            renderCell: (params) => (
                <Typography variant="body2" style={{ fontWeight: 'medium' }}>
                    {params.value}
                </Typography>
            ),
        },
        {
            field: "description",
            headerName: "Description",
            flex: 1,
            // headerAlign: "center", // Center the header
            // align: "center", // Center the content
            valueGetter: (params) => formatValue(params.value),
            renderCell: (params) => (
                <Typography variant="body2" style={{ fontWeight: 'medium' }}>
                    {params.value}
                </Typography>
            ),
        },
        // {
        //     field: "permissions",
        //     headerName: "Permissions",
        //     flex: 1,
        //     headerAlign: "center", // Center the header
        //     align: "center", // Center the content
        //     renderCell: (params) => {
        //         const row = params.row;
        //         return (
        //             <Tooltip title="Assign User Role">
        //                 <Box
        //                     width="30%"
        //                     m="0 auto"
        //                     p="5px"
        //                     display="flex"
        //                     justifyContent="center"
        //                     backgroundColor={colors.greenAccent[600]}
        //                     borderRadius="4px"
        //                     onClick={() => handleAssignUserRole(row.roleName)}
        //                     style={{ cursor: 'pointer' }}
        //                 >
        //                     <VerifiedUser />
        //                 </Box>
        //             </Tooltip>
        //         );
        //     },
        // },

        {
            field: "actions",
            headerName: "Actions",
            flex: 1, headerAlign: "center", align: "center",
            renderCell: (params) => (
                <>
                    <IconButton
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClick={(event) => handleClick(event, params.row)}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                            style: {
                                maxHeight: 48 * 4.5,
                                width: "20ch",
                                transform: "translateX(-50%)",
                            },
                        }}
                    >
                        <MenuItem onClick={() => handleEdit(currentRow)}>
                            <EditOutlined fontSize="small" style={{ marginRight: "8px" }} />
                            Edit
                        </MenuItem>
                        <MenuItem onClick={() => handleAssignMenu(currentRow)}>
                            <Widgets fontSize="small" style={{ marginRight: "8px" }} />
                            Assign Menu
                        </MenuItem>

                        <MenuItem onClick={() => handleDelete(currentRow)}>
                            <Delete fontSize="small" style={{ marginRight: "8px" }} />
                            Delete
                        </MenuItem>
                    </Menu>
                </>
            ),
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
                        onClick={handleAddRole}
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
                                <ListItem dense>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={selectAll}
                                            tabIndex={-1}
                                            disableRipple
                                            onChange={handleSelectAll}
                                            color='secondary'
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary="Select All" />
                                </ListItem>
                                {Array.isArray(CatalogData) && CatalogData?.length > 0 ? (
                                    CatalogData
                                        .filter(option =>
                                            option.id.toLowerCase().includes(searchTerm.toLowerCase())
                                        )
                                        .map((option) => {
                                            const labelId = `checkbox-list-label-${option.id}`;
                                            const isAssigned = assignedRoleData[selectedRow]?.includes(option.id);
                                            const isChecked = assignRoleData.tagNames.indexOf(option.id) !== -1;

                                            return (
                                                <ListItem
                                                    key={option.id}
                                                    dense
                                                    button
                                                    onClick={isAssigned ? null : handleToggle(option.id)}
                                                    disabled={isAssigned}
                                                >
                                                    <ListItemIcon>
                                                        <Checkbox
                                                            edge="start"
                                                            checked={isChecked}
                                                            tabIndex={-1}
                                                            disableRipple
                                                            inputProps={{ 'aria-labelledby': labelId }}
                                                            color='secondary'
                                                            disabled={isAssigned}
                                                        />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        id={labelId}
                                                        primary={option.id}
                                                        secondary={isAssigned ? "Already assigned" : null}
                                                    />
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
                                {assignRoleData?.tagNames.length > 0 ? (
                                    <Alert severity="info" sx={{ mr: 2 }}>
                                        {assignRoleData?.tagNames.length} menu(s) selected
                                    </Alert>
                                ) : ("")}
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
                                    disabled={assignRoleData?.tagNames.length === 0}
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
