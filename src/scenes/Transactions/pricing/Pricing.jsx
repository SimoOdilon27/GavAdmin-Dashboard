import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Button, IconButton, Menu, MenuItem, useTheme } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Add, Delete, EditOutlined, RemoveRedEyeSharp } from '@mui/icons-material';
import { tokens } from '../../../theme';
import CBS_Services from '../../../services/api/GAV_Sercives';
import Header from '../../../components/Header';
import { formatValue } from '../../../tools/formatValue';
import MoreVertIcon from "@mui/icons-material/MoreVert";


const Pricing = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [pricingData, setPricingData] = useState([]);
    const [loading, setLoading] = useState(false);
    const userData = useSelector((state) => state.users);
    const token = userData.token;
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentRow, setCurrentRow] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event, row) => {
        setAnchorEl(event.currentTarget);
        setCurrentRow(row); // Store the current row to pass to actions
    };

    const handleClose = () => {
        setAnchorEl(null);
        setCurrentRow(null);
    };
    const handleDelete = (row) => {
        console.log("Delete clicked", row);
        // Your delete logic here
    };

    const fetchPricingData = async () => {
        setLoading(true);
        try {
            const payload = {
                serviceReference: 'GET_ALL_CHARGES',
                requestBody: ''
            }
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

            // const response = await CBS_Services('APE', 'pricing/get/all', 'GET');
            if (response && response.status === 200) {
                setPricingData(response.body.data || []);
            } else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPricingData();
    }, []);

    // const handleAddPricing = () => {
    //     navigate('/pricing/configure');
    // };
    const handleAddPricing = () => {
        navigate('/pricing/configurecharges');
    };

    const handleEdit = (id) => {
        navigate(`/pricing/edit/${id}`);
    };


    const columns = [
        // { field: "id", headerName: "ID", flex: 1 },
        { field: "name", headerName: "Name", flex: 1, valueGetter: (params) => formatValue(params.value), },
        { field: "description", headerName: "Description", flex: 1, valueGetter: (params) => formatValue(params.value), },
        { field: "chargesType", headerName: "Charges Type", flex: 1, valueGetter: (params) => formatValue(params.value), },
        { field: "percentage", headerName: "Percentage", flex: 1, valueGetter: (params) => formatValue(params.value), },
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
                <Header title="Pricing" subtitle="Manage your pricing" />
                <Button
                    sx={{
                        backgroundColor: colors.blueAccent[700],
                        color: colors.grey[100],
                        fontSize: "14px",
                        fontWeight: "bold",
                        padding: "10px 20px",
                        marginRight: "10px",
                    }}
                    onClick={handleAddPricing}
                >
                    <Add sx={{ mr: "10px" }} />
                    Configure Pricing
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
                    rows={pricingData}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                    // checkboxSelection
                    disableSelectionOnClick
                    loading={loading}
                />
            </Box>
        </Box>
    );
}

export default Pricing;
