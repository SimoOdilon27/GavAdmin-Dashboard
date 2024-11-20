import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Button, IconButton, Menu, MenuItem } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Add, Delete, EditOutlined } from '@mui/icons-material';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';
import { formatValue } from '../../tools/formatValue';
import CBS_Services from '../../services/api/GAV_Sercives';
import Header from '../../components/Header';

const BankServices = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [bankServicesData, setBankServicesData] = useState([]);
    const [loading, setLoading] = useState(false);
    const userData = useSelector((state) => state.users);
    const navigate = useNavigate();
    const spaceId = userData?.selectedSpace?.id;
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentRow, setCurrentRow] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event, row) => {
        setAnchorEl(event.currentTarget);
        setCurrentRow(row);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setCurrentRow(null);
    };

    const handleDelete = (row) => {
        console.log("Delete clicked", row);
        // Implement delete logic here
    };



    const fetchBankServices = async () => {
        setLoading(true);
        try {

            const payload = {
                serviceReference: 'GET_BANK_SERVICE_TYPES',
                requestBody: "",
                spaceId: spaceId,
            }
            const response = await CBS_Services('APE', 'gavServiceType/getAll', 'GET');
            if (response && response.status === 200) {
                setBankServicesData(response.body.data || []);
            } else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBankServices();
    }, []);

    const handleAddService = () => {
        navigate('/bankservices/add');
    };
    const handleEdit = (row) => {
        navigate(`/bankservices/edit/${row.serviceName}`, { state: { serviceData: row } });
    };



    const columns = [
        {
            field: "serviceName",
            headerName: "Service Name",
            flex: 1,
            headerAlign: "center",
            align: "center",
            valueGetter: (params) => formatValue(params.value),
        },
        {
            field: "serviceTag",
            headerName: "Service Tag",
            flex: 1,
            headerAlign: "center",
            align: "center",
            valueGetter: (params) => formatValue(params.value),
        },
        {
            field: "creationDate",
            headerName: "Creation Date",
            flex: 1,
            headerAlign: "center",
            align: "center",
            valueGetter: (params) => {
                const date = new Date(params.value);
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            },
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            headerAlign: "center",
            align: "center",
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
                <Header title="Bank Services" subtitle="Manage Bank Services" />
                <Button
                    sx={{
                        backgroundColor: colors.blueAccent[700],
                        color: colors.grey[100],
                        fontSize: "14px",
                        fontWeight: "bold",
                        padding: "10px 20px",
                        marginRight: "10px",
                    }}
                    onClick={handleAddService}
                >
                    <Add sx={{ mr: "10px" }} />
                    Add Bank Service
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
                    rows={bankServicesData}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                    disableSelectionOnClick
                    getRowId={(row) => row.serviceName}
                    loading={loading}
                />
            </Box>
        </Box>
    );
}

export default BankServices;