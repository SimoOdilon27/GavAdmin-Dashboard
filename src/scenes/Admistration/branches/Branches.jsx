import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import CBS_Services from '../../../services/api/GAV_Sercives';
import { Box, Button, Chip, IconButton, Menu, MenuItem, useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import { Add, Delete, EditOutlined, RemoveRedEyeSharp } from '@mui/icons-material';
import Header from '../../../components/Header';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { formatValue } from '../../../tools/formatValue';


const Branches = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [branchData, setBranchData] = useState([]);
    const [loading, setLoading] = useState(false);
    const userData = useSelector((state) => state.users);
    const navigate = useNavigate();
    const token = userData.token
    const spaceId = userData?.selectedSpace?.id
    const usertype = userData.selectedSpace.role


    const [anchorEl, setAnchorEl] = useState(null);
    const [currentRow, setCurrentRow] = useState(null);
    const open = Boolean(anchorEl);

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


    const fetchBranchData = async () => {
        setLoading(true);
        try {
            let payload = {}
            if (usertype === "CREDIX_ADMIN") {
                payload = {
                    serviceReference: 'GET_ALL_BRANCHES',
                    requestBody: '',
                    spaceId: spaceId
                }
            } else {
                payload = {
                    serviceReference: 'GET_ALL_BRANCHES_BY_BANK_ID',
                    requestBody: spaceId,
                    spaceId: spaceId,
                }
            }

            console.log("payload", payload);


            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            console.log("response=====", response);
            // const response = await CBS_Services('AP', 'api/gav/bank_branch/getAll', 'GET', null);

            if (response && response.body.meta.statusCode === 200) {
                setBranchData(response.body.data);

            } else if (response && response.body.status === 401) {
                alert(response.body.errors || 'Unauthorized to perform action');
            }

            else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };

    const handleAddBranch = () => {
        navigate('/branches/add');
    };

    const handleEditBranch = (row) => {
        // Pass the entire row data to the edit page
        navigate(`/branches/edit/${row.id}`, { state: { branchData: row } });
    };
    const handleViewBranch = (row) => {
        // Pass the entire row data to the edit page
        navigate(`/branches/view/${row.accounts}`, { state: { branchData: row } });
    };




    useEffect(() => {
        fetchBranchData();
    }, []);

    const columns = [
        { field: "branchName", headerName: "Branch Name", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        { field: "cbsBranchId", headerName: "CBS Branch ID", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        { field: "address", headerName: "Address", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        { field: "email", headerName: "Email", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        { field: "country", headerName: "Country", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
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
                        <MenuItem onClick={() => handleEditBranch(currentRow)}>
                            <EditOutlined fontSize="small" style={{ marginRight: "8px" }} />
                            Edit
                        </MenuItem>
                        <MenuItem onClick={() => handleViewBranch(currentRow)}>
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
                <Header title="Branches" subtitle="Manage your Branches" />

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
                        onClick={handleAddBranch}
                    >
                        <Add sx={{ mr: "10px" }} />
                        Add Branch
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
                <DataGrid rows={branchData} columns={columns} components={{ Toolbar: GridToolbar }} loading={loading}
                />
            </Box>

        </Box>
    )
}

export default Branches
