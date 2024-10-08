import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CBS_Services from '../../../services/api/GAV_Sercives';
import { Box, Button, Chip, IconButton, Menu, MenuItem, useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Header from '../../../components/Header';
import { Add, Delete, EditOutlined, RemoveRedEyeRounded, RemoveRedEyeSharp } from '@mui/icons-material';
import MoreVertIcon from "@mui/icons-material/MoreVert";


const Tellers = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [tellerData, setTellerData] = useState([]);
    const [loading, setLoading] = useState(false);
    const userData = useSelector((state) => state.users);
    const token = userData.token;
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentRow, setCurrentRow] = useState(null);
    const open = Boolean(anchorEl);

    const fetchTellerData = async () => {
        setLoading(true);
        try {

            const payload = {
                serviceReference: 'GET_ALL_TELLERS',
                requestBody: JSON.stringify({ internalId: "Back-Office" }),
            }

            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            console.log("response", response);

            if (response && response.body.meta.statusCode === 200) {
                setTellerData(response.body.data || []);
            } else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTellerData();
    }, [token]);

    const handleAddTeller = () => {
        navigate('/tellers/add');
    };
    const handleEdit = (row) => {
        // Pass the entire row data to the edit page
        navigate(`/tellers/edit/${row.id}`, { state: { tellerData: row } });
    };

    const handleView = (row) => {
        // Pass the entire row data to the edit page
        navigate(`/tellers/view/${row.accountId}`, { state: { tellerData: row } });
    };


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



    const toSentenceCase = (text) => {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    };

    const columns = [
        { field: "id", headerName: "Teller ID", flex: 1, valueGetter: (params) => toSentenceCase(params.value), },
        { field: "tellerName", headerName: "Teller Name", flex: 1, valueGetter: (params) => toSentenceCase(params.value), },
        { field: "branchName", headerName: "Branch Name", flex: 1, valueGetter: (params) => toSentenceCase(params.value), },
        { field: "balance", headerName: "Balance", flex: 1, },
        { field: "virtualBalance", headerName: "Virtual Balance", flex: 1, },
        { field: "language", headerName: "Language", flex: 1, valueGetter: (params) => toSentenceCase(params.value), },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
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
                        <MenuItem onClick={() => handleView(currentRow)}>
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
                <Header title="TELLERS" subtitle="Manage your tellers" />
                <Button
                    sx={{
                        backgroundColor: colors.blueAccent[700],
                        color: colors.grey[100],
                        fontSize: "14px",
                        fontWeight: "bold",
                        padding: "10px 20px",
                        marginRight: "10px",
                    }}
                    onClick={handleAddTeller}
                >
                    <Add sx={{ mr: "10px" }} />
                    Add Teller
                </Button>
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
                    rows={tellerData}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                    checkboxSelection
                    disableSelectionOnClick
                    loading={loading}
                />
            </Box>
        </Box>
    );
}

export default Tellers;
