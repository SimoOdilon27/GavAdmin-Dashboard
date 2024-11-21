import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Button, IconButton, Menu, MenuItem } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Add, Delete, EditOutlined } from '@mui/icons-material';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import { formatValue } from '../../../tools/formatValue';
import CBS_Services from '../../../services/api/GAV_Sercives';
import Header from '../../../components/Header';

const BankServiceConfigs = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [configData, setConfigData] = useState([]);
    const [loading, setLoading] = useState(false);
    const userData = useSelector((state) => state.users);
    const token = userData.token;
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

    const fetchServiceConfigs = async () => {
        setLoading(true);
        try {

            const payload = {
                serviceReference: 'GET_ALL_SERVICES_CONFIGS',
                requestBody: '',
                spaceId: spaceId,
            };
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            // const response = await CBS_Services('GAV', 'serviceConfiguration/getAllServicesConfiguration', 'GET');
            if (response && response.status === 200) {
                // Add unique id for DataGrid
                const dataWithIds = (response.body.data || []).map((item, index) => ({
                    ...item,
                    id: index,
                    serviceNameString: Array.isArray(item.serviceName)
                        ? item.serviceName.join(', ')
                        : item.serviceName
                }));
                setConfigData(dataWithIds);
            } else {
                console.error('Error fetching service configurations');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchServiceConfigs();
    }, []);

    const handleAddConfig = () => {
        navigate('/bankserviceconfigs/add');
    };

    const handleEdit = (row) => {
        navigate(`/bankserviceconfigs/edit/${row.bankOrCorporationId}`, {
            state: { configData: row }
        });
    };

    const columns = [
        {
            field: "bankOrCorporationId",
            headerName: "Bank/Corporation ID",
            flex: 1,
            headerAlign: "center",
            align: "center",
            valueGetter: (params) => formatValue(params.value),
        },
        {
            field: "level",
            headerName: "Level",
            flex: 1,
            headerAlign: "center",
            align: "center",
            valueGetter: (params) => formatValue(params.value),
        },
        {
            field: "serviceNameString",
            headerName: "Services",
            flex: 1.5,
            headerAlign: "center",
            align: "center",
            valueGetter: (params) => formatValue(params.value),
        },
        {
            field: "userId",
            headerName: "User ID",
            flex: 1,
            headerAlign: "center",
            align: "center",
            valueGetter: (params) => formatValue(params.value),
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
                <Header title="Service Configurations" subtitle="Manage Bank Service Configurations" />
                <Button
                    sx={{
                        backgroundColor: colors.blueAccent[700],
                        color: colors.grey[100],
                        fontSize: "14px",
                        fontWeight: "bold",
                        padding: "10px 20px",
                        marginRight: "10px",
                    }}
                    onClick={handleAddConfig}
                >
                    <Add sx={{ mr: "10px" }} />
                    Add Configuration
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
                    rows={configData}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                    disableSelectionOnClick
                    loading={loading}
                />
            </Box>
        </Box>
    );
}

export default BankServiceConfigs;