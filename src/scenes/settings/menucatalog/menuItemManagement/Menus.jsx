import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CBS_Services from '../../../../services/api/GAV_Sercives';
import { Box, Button, IconButton, Menu, MenuItem, Tab, Tabs, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from '@mui/material';
import { tokens } from '../../../../theme';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Header from '../../../../components/Header';
import { Add, Delete, EditOutlined } from '@mui/icons-material';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { formatValue } from '../../../../tools/formatValue';

const Menus = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [MenuData, setMenuData] = useState([]);
    const [SubMenuData, setSubMenuData] = useState([]);
    const [loading, setLoading] = useState(false);
    const userData = useSelector((state) => state.users);
    const token = userData.token;
    const spaceId = userData?.selectedSpace?.id
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState(0);

    const [anchorEl, setAnchorEl] = useState(null);
    const [currentRow, setCurrentRow] = useState(null);
    const open = Boolean(anchorEl);
    const [deleteMenuDialogOpen, setDeleteMenuDialogOpen] = useState(false);
    const [deleteSubMenuDialogOpen, setDeleteSubMenuDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "" });

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === "clickaway") return;
        setSnackbar({ ...snackbar, open: false });
    };

    const handleClick = (event, row) => {
        setAnchorEl(event.currentTarget);
        setCurrentRow(row); // Store the current row to pass to actions
    };

    const handleClose = () => {
        setAnchorEl(null);
        setCurrentRow(null);
    };

    const fetchMenuData = async () => {
        setLoading(true);
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
        setLoading(false);
    };
    const fetchSubMenuData = async () => {
        setLoading(true);
        try {
            const response = await CBS_Services('GATEWAY', 'clientGateWay/subItem/getAllSubsItems', 'GET', null, token);
            console.log("responsesubmenus", response);

            if (response && response.status === 200) {
                setSubMenuData(response.body.data || []);
            } else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMenuData();
        fetchSubMenuData();
    }, []);

    const handleDeleteMenuConfirm = async () => {
        setDeleteMenuDialogOpen(false);
        try {
            const response = await CBS_Services('GATEWAY', `clientGateWay/items/deleteItem/${currentRow.id}`, 'DELETE', null, token);
            console.log("responsedeletemenus", response);

            if (response && response.status === 200) {
                showSnackbar("Item Deleted successfully", "success");
                handleClose()
                fetchMenuData();
            } else {
                showSnackbar("Failed to delete item", "error");

                console.error('Error Deleting data');
            }
        } catch (error) {
            showSnackbar("A connection error occurred", "error");
            console.error('Error:', error);
        }
    };

    const handleDeleteSubMenuConfirm = async () => {
        setDeleteSubMenuDialogOpen(false);
        try {
            const response = await CBS_Services('GATEWAY', `clientGateWay/subItem/deleteSubItem/${currentRow.id}`, 'DELETE', null, token);
            console.log("responsesubmenus", response);

            if (response && response.status === 200) {
                showSnackbar("Sub Item Deleted successfully", "success");
                handleClose()
                fetchSubMenuData();
            } else {
                showSnackbar("Failed to delete Sub item", "error");
                console.error('Error Deleting data');
            }
        } catch (error) {
            showSnackbar("A connection error occurred", "error");
            console.error('Error:', error);
        }
    };

    const handleDeleteMenu = (row) => {
        console.log("Delete clicked", row);
        setCurrentRow(row);
        setDeleteMenuDialogOpen(!deleteMenuDialogOpen);

    };

    const handleDeleteSubMenu = (row) => {
        console.log("Delete clicked", currentRow);
        setDeleteSubMenuDialogOpen(!deleteSubMenuDialogOpen);

    };

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handleAddMenu = () => {
        navigate('/menus/createmenu');
    };
    const handleAddSubMenu = () => {
        navigate('/menus/submenuform');
    };

    const handleEdit = (row) => {
        navigate(`/menus/editmenu/${row.id}`, { state: { menuData: row } });
    };

    const handleEditSubMenu = (row) => {
        navigate(`/menus/submenuform/${row.id}`, { state: { submenuData: row } });
    };

    const columns = [
        { field: "title", headerName: "Menu Title", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        { field: "typeId", headerName: "Type", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        { field: "icon", headerName: "Icon", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        { field: "menuOrder", headerName: "Menu Order", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
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

                        <MenuItem onClick={() => handleDeleteMenu(currentRow)}>
                            <Delete fontSize="small" style={{ marginRight: "8px" }} />
                            Delete
                        </MenuItem>
                    </Menu>
                </>
            ),
        },
    ];
    const sunmenucolumns = [
        { field: "title", headerName: "Sub-Menu Title", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        { field: "itemId", headerName: "Parent Menu", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        { field: "icon", headerName: "Icon", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        { field: "route", headerName: "Route", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
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
                        <MenuItem onClick={() => handleEditSubMenu(currentRow)}>
                            <EditOutlined fontSize="small" style={{ marginRight: "8px" }} />
                            Edit
                        </MenuItem>

                        <MenuItem onClick={() => handleDeleteSubMenu(currentRow)}>
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
                <Header title="User Menus Management" subtitle="Manage your menus" />
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
                        onClick={handleAddMenu}
                    >
                        <Add sx={{ mr: "10px" }} />
                        Add Menu
                    </Button>
                    <Button
                        sx={{
                            backgroundColor: colors.blueAccent[700],
                            color: colors.grey[100],
                            fontSize: "14px",
                            fontWeight: "bold",
                            padding: "10px 20px",

                        }}
                        onClick={handleAddSubMenu}
                    >
                        <Add sx={{ mr: "10px" }} />
                        Add Sub Menu
                    </Button>
                </Box>

            </Box>

            <Box
                m="10px 15px 15px 15px">
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="account type tabs"
                    sx={{

                        borderBottom: 1,
                        borderRadius: '8px 8px 0 0',
                        backgroundColor: colors.primary[400],
                        borderColor: 'divider',
                        '& .MuiTab-root': {
                            borderRadius: '8px 8px 0 0',
                            margin: '0 5px',
                            '&.Mui-selected': {
                                color: theme.palette.mode === 'light' ? 'black' : `${colors.greenAccent[400]}`,
                            },
                        },
                    }}
                >
                    <Tab label="Menus" />
                    <Tab label="Sub-Menus" />
                </Tabs>
            </Box>
            <Box
                m="40px 15px 15px 15px"
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
                    rows={
                        selectedTab === 0 ? MenuData :
                            selectedTab === 1 ? SubMenuData :
                                MenuData
                    }
                    columns={
                        selectedTab === 0 ? columns :
                            selectedTab === 1 ? sunmenucolumns :
                                columns
                    }
                    components={{ Toolbar: GridToolbar }}
                    disableSelectionOnClick
                    loading={loading}
                />
            </Box>

            <Dialog open={deleteMenuDialogOpen} onClose={handleDeleteMenu} fullWidth>
                <DialogTitle>Confirm Menu Deletion</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this menu?
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' onClick={handleDeleteMenu}>Cancel</Button>
                    <Button variant='outlined' color="error" onClick={handleDeleteMenuConfirm}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteSubMenuDialogOpen} onClose={handleDeleteSubMenu} fullWidth>
                <DialogTitle>Confirm Sub-Menu Deletion</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this sub-menu?
                </DialogContent>
                <DialogActions>
                    <Button variant='outlined' onClick={handleDeleteSubMenu}>Cancel</Button>
                    <Button variant='outlined' color="error" onClick={handleDeleteSubMenuConfirm}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

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
    )
}

export default Menus
