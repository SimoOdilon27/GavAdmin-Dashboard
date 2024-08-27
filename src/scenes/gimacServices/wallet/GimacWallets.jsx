import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CBS_Services from '../../../services/api/GAV_Sercives';
import { Box, Button, useTheme } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Header from '../../../components/Header';
import { Add, Delete, EditOutlined } from '@mui/icons-material';
import { tokens } from '../../../theme';


const GimacWallets = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [walletsData, setWalletsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const userData = useSelector((state) => state.users);
    const token = userData.token;
    const navigate = useNavigate();

    const fetchWalletsData = async () => {
        setLoading(true);
        try {
            const payload = {
                serviceReference: 'GET_GIMAC_WALLETS',
                requestBody: JSON.stringify({ internalId: "Back-Office" }),
            }
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            if (response && response.body.meta.statusCode === 200) {
                setWalletsData(response.body.data || []);
            } else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchWalletsData();
    }, []);

    const handleAddWallet = () => {
        navigate('/gimac-wallets/add');
    };

    const handleEdit = (id) => {
        navigate(`/gimac-wallets/edit/${id}`);
    };


    const columns = [
        { field: "id", headerName: "ID", flex: 1 },
        { field: "name", headerName: "Wallet Name", flex: 1 },
        { field: "gimacMemberCode", headerName: "Gimac Member Code", flex: 1 },
        { field: "walletType", headerName: "Wallet Type", flex: 1 },
        { field: "countryName", headerName: "Country", flex: 1 },
        { field: "countryCode", headerName: "Country Code", flex: 1 },
        { field: "serviceDescription", headerName: "Service Description", flex: 1 },
        { field: "serviceRef", headerName: "Service Ref", flex: 1 },
        { field: "queryName", headerName: "Query Name", flex: 1 },
        { field: "queryRef", headerName: "Query Ref", flex: 1 },
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
                <Header title="Gimac Wallets" subtitle="Manage Gimac Wallets" />
                <Button
                    sx={{
                        backgroundColor: colors.blueAccent[700],
                        color: colors.grey[100],
                        fontSize: "14px",
                        fontWeight: "bold",
                        padding: "10px 20px",
                        marginRight: "10px",
                    }}
                    onClick={handleAddWallet}
                >
                    <Add sx={{ mr: "10px" }} />
                    Add Wallet
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
                    rows={walletsData}
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

export default GimacWallets;
