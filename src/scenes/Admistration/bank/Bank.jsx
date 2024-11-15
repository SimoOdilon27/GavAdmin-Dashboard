import { Add, Delete, EditOutlined, RemoveRedEyeSharp } from '@mui/icons-material';
import { Box, Button, Chip, IconButton, Menu, Snackbar, useTheme } from "@mui/material";
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import CBS_Services from '../../../services/api/GAV_Sercives';
import { tokens } from '../../../theme';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Header from '../../../components/Header';
import { MenuItem, Alert } from '@mui/material';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from 'react-router-dom';
import { formatValue } from '../../../tools/formatValue';

const Bank = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [bankData, setBankData] = useState([]);
    const [loading, setLoading] = useState(false);
    const userData = useSelector((state) => state.users)
    const usertype = userData.selectedSpace.role
    const navigate = useNavigate();
    const token = userData.token
    const spaceId = userData?.selectedSpace?.id
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const [currentRow, setCurrentRow] = useState(null);
    const open = Boolean(anchorEl);

    // Define or import the handleEdit and handleDelete functions


    const handleDelete = (row) => {
        console.log("Delete clicked", row);
        // Your delete logic here
    };

    const handleClick = (event, row) => {
        setAnchorEl(event.currentTarget);
        setCurrentRow(row); // Store the current row to pass to actions
    };

    const handleClose = () => {
        setAnchorEl(null);
        setCurrentRow(null);
    };

    const fetchBankData = async () => {
        setLoading(true);
        try {
            let payload = {}

            if (usertype === "CREDIX_ADMIN") {
                payload = {
                    serviceReference: 'GET_ALL_BANKS',
                    requestBody: '',
                    spaceId: spaceId,
                }
            } else {
                payload = {
                    serviceReference: 'GET_ALL_BANKS_BY_CORPORATION_ID',
                    requestBody: spaceId,
                    spaceId: spaceId,
                }
            }


            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            // const response = await CBS_Services('AP', 'api/gav/bank/getAll', 'GET', null);
            console.log("fetchresponse", response);

            if (response && response.body.meta.statusCode === 200) {
                setBankData(response.body.data || []);

            } else {
                showSnackbar(response.body.errors || 'Error Finding Banks', 'error');

                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };


    useEffect(() => {
        // Fetch Bank data when the component mounts
        fetchBankData();


    }, []);

    const handleAddBank = () => {
        navigate('/bank/add');
    };

    const handleEditBank = (row) => {
        // Pass the entire row data to the edit page
        navigate(`/bank/edit/${row.id}`, { state: { bankData: row } });
    };
    const handleViewCorp = (row) => {
        // Pass the entire row data to the edit page
        navigate(`/bank/view/${row.accounts}`, { state: { bankData: row } });
    };

    const toSentenceCase = (text) => {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    };

    const columns = [
        { field: "bankName", headerName: "Bank Name", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value) },
        { field: "bankCode", headerName: "Bank Code", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value) },
        { field: "cbsBankId", headerName: "CBS Bank ID", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value) },
        { field: "address", headerName: "Address", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value) },
        { field: "bankEmail", headerName: "Email", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value) },
        { field: "contact", headerName: "Phone Number", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value) },
        { field: "bankManger", headerName: "Bank Manager", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value) },
        { field: "country", headerName: "Country", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value) },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
            headerAlign: "center", align: "center",
            renderCell: (params) => {
                const isActive = params.row.active; // Access the "active" field from the row data
                return (
                    <Chip
                        label={isActive ? "Active" : "Inactive"}
                        style={{
                            backgroundColor: isActive ? "green" : "red",
                            color: "white",
                            padding: "1px 1px 1px 1px",
                        }}
                    />
                );
            },
        },


        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            headerAlign: "center", align: "center",
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
                        <MenuItem onClick={() => handleEditBank(currentRow)}>
                            <EditOutlined fontSize="small" style={{ marginRight: "8px" }} />
                            Edit
                        </MenuItem>
                        <MenuItem onClick={() => handleViewCorp(currentRow)}>
                            <RemoveRedEyeSharp fontSize="small" style={{ marginRight: "8px" }} />
                            View
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
                <Header title="Banks" subtitle="Manage your Banks" />

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
                        onClick={handleAddBank}
                    >
                        <Add sx={{ mr: "10px" }} />
                        Add Bank
                    </Button>

                </Box>
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
                <DataGrid rows={bankData} columns={columns} components={{ Toolbar: GridToolbar }} loading={loading} />

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
        </Box>
    )
}

export default Bank
