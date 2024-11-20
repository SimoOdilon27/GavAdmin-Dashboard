import { Box, Button, Checkbox, Chip, DialogTitle, FormControlLabel, Snackbar, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";

import Header from "../../../components/Header";
import { useEffect, useState } from "react";
import CBS_Services from "../../../services/api/GAV_Sercives";
import { useSelector } from "react-redux";
import { Alert } from '@mui/material';
import { Add, Delete, EditOutlined, RemoveRedEyeSharp } from "@mui/icons-material";
import { Menu, MenuItem, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { formatValue } from "../../../tools/formatValue";


const Corporation = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);


    const [corporationData, setCorporationData] = useState([]);

    const [corpID, setCorpID] = useState([]);
    const [pending, setPending] = useState(true);
    const userData = useSelector((state) => state.users)
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

    const fetchCorporationData = async () => {
        setPending(true)
        try {
            const payload = {
                serviceReference: 'GET_ALL_CORPORATIONS',
                requestBody: '',
                spaceId: spaceId,
            }
            // const response = await CBS_Services('AP', 'api/gav/corporation/management/getAll', 'GET', null);
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            console.log("response", response);

            if (response && response.body.meta.statusCode === 200) {
                setCorporationData(response.body.data || []);

            } else if (response && response.body.status === 401) {
                showSnackbar('Unauthorized', 'error');

            }

            else {
                console.error('Error fetching data');
                showSnackbar('Error Fetching data.', 'error');

            }
        } catch (error) {
            console.error('Error:', error);
        }
        setPending(false)
    };



    useEffect(() => {
        fetchCorporationData();
    }, [])


    const handleAddCorp = () => {
        navigate('/corporation/add');
    };

    const handleEditCorp = (row) => {
        // Pass the entire row data to the edit page
        navigate(`/corporation/edit/${row.id}`, { state: { corporationData: row } });
    };
    const handleViewCorp = (row) => {
        // Pass the entire row data to the edit page
        navigate(`/corporation/view/${row.accounts}`, { state: { corporationData: row } });
    };


    const columns = [
        // { field: "corporationId", headerName: "Corporation ID", flex: 1 },
        { field: "corporationName", headerName: "Name", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        { field: "contact", headerName: "Phone Number", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        { field: "email", headerName: "Email", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        { field: "address", headerName: "Address", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        // { field: "country", headerName: "Country", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value) },

        {
            field: "creationDateTime",
            headerName: "Creation Date",
            flex: 1, headerAlign: "center", align: "center",
            valueGetter: (params) => {
                const date = new Date(params.value);
                return date.toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                });
            },
        },
        {
            field: "status",
            headerName: "Status",
            flex: 1, headerAlign: "center", align: "center",
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
                        <MenuItem onClick={() => handleEditCorp(currentRow)}>
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

    useEffect(() => {
        const timeout = setTimeout(() => {
            // setRows(columns);
            setPending(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }, []);


    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Corporations" subtitle="Manage your corporations" />

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
                        onClick={handleAddCorp}
                    >
                        <Add sx={{ mr: "10px" }} />
                        Add Corporation
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
                <DataGrid rows={corporationData} columns={columns} components={{ Toolbar: GridToolbar }} loading={pending}
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

        </Box>
    );
};

export default Corporation;
