import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CBS_Services from '../../../services/api/GAV_Sercives';
import { Box, Button, useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Header from '../../../components/Header';
import { Add, Delete, EditOutlined } from '@mui/icons-material';

const Tellers = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [tellerData, setTellerData] = useState([]);
    const [loading, setLoading] = useState(false);
    const userData = useSelector((state) => state.users);
    const token = userData.token;
    const navigate = useNavigate();

    const fetchTellerData = async () => {
        try {

            const payload = {
                serviceReference: 'GET_ALL_TELLERS',
                requestBody: JSON.stringify({ internalId: "Back-Office" }),
            }

            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            console.log("response", response);

            if (response && response.status === 200) {
                setTellerData(response.body.data || []);
            } else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchTellerData();
    }, [token]);

    const handleAddTeller = () => {
        navigate('/tellers/add');
    };

    const handleEdit = (id) => {
        navigate(`/tellers/edit/${id}`);
    };

    const columns = [
        { field: "id", headerName: "Teller ID", flex: 1 },
        { field: "tellerName", headerName: "Teller Name", flex: 1 },
        { field: "branchName", headerName: "Branch Name", flex: 1 },
        { field: "balance", headerName: "Balance", flex: 1 },
        { field: "virtualBalance", headerName: "Virtual Balance", flex: 1 },
        { field: "language", headerName: "Language", flex: 1 },
        { field: "active", headerName: "Active", flex: 1, type: 'boolean' },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
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
                            onClick={() => handleEdit(row.id)}
                        >
                            <EditOutlined />
                        </Box>
                        <Box
                            width="30%"
                            m="0"
                            p="5px"
                            display="flex"
                            justifyContent="center"
                            backgroundColor={colors.redAccent[600]}
                            borderRadius="4px"
                        >
                            <Delete />
                        </Box>
                    </>
                );
            },
        },
    ];

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Tellers" subtitle="Manage your tellers" />
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
