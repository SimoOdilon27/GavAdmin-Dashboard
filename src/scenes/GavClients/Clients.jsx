import React, { useEffect, useState } from 'react'
import CBS_Services from '../../services/api/GAV_Sercives';
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, TextField, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import { useSelector } from 'react-redux';
import { Add, Delete, EditOutlined, NotificationsActiveRounded, SupervisedUserCircle, Verified, VerifiedOutlined } from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Header from '../../components/Header';
import { useNavigate, useParams } from 'react-router-dom';

const Clients = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [clientData, setClientData] = useState([]);
    const [loading, setLoading] = useState(false);  // State to handle loading state
    const navigate = useNavigate();
    const userData = useSelector((state) => state.users);
    const token = userData.token;
    const [selectedMsisdn, setSelectedMsisdn] = useState('');
    const [showActivateClientModal, setShowActivateClientModal] = useState(false);
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

    const [activateClientFormData, setActivateClientFormData] = useState({
        msisdn: '',
        activationCode: '',
        internalId: 'backOffice',
    })

    const fetchClientData = async () => {
        setLoading(true);
        try {

            const payload = {
                serviceReference: 'GET_ALLCLIENT_ACCOUNTS',
                requestBody: ''
            }
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            // const response = await CBS_Services('AP', 'api/gav/client/getAllClients', 'POST', null);

            console.log("respfetch", response);

            if (response && response.body.meta.statusCode === 200) {
                setClientData(response.body.data || []);
            }
            else if (response && response.body.status === 401) {
                // setErrorMessage(response.body.errors || 'Unauthorized to perform action');
            }
            else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false)
    };

    useEffect(() => {
        fetchClientData();

    }, []);

    const handleToggleActivateClientModal = (selectedClient) => {
        setSelectedMsisdn(selectedClient);

        setActivateClientFormData(prevFormData => ({
            ...prevFormData,
            msisdn: selectedClient,
            activationCode: '',

            // Add other properties you want to update here
        }));

        setShowActivateClientModal(!showActivateClientModal);
    };

    const handleConfirmActivate = async () => {
        setLoading(true)
        try {

            const payload = {
                serviceReference: 'ACTIVATE_CLIENT',
                requestBody: JSON.stringify(activateClientFormData),
            }
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            // const response = await CBS_Services('AP', 'api/gav/client/activateClient', 'POST', activateClientFormData);
            console.log("resp", response);
            console.log("ClientFormData", activateClientFormData);
            if (response && response.body.meta.statusCode === 200) {
                handleToggleActivateClientModal();
                await fetchClientData();
                // setSuccessMessage('Client Activated successfully.');
                showSnackbar('Client Activated successfully', 'success');
            }
            else if (response && response.body.status === 401) {
                // setErrorMessage(response.body.errors || 'Unauthorized to perform action');
                showSnackbar(response.body.errors || 'Unauthorized to perform action', 'error');

            }
            else {
                showSnackbar(response.body.errors || 'Error Activating client', 'error');

            }
        } catch (error) {
            console.error('Error:', error);
            showSnackbar('Network Error Try Again Later!!!!', 'error');

        }

        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setActivateClientFormData({
            ...activateClientFormData,
            [name]: value,
        })
    };

    const formatDate = (date) => {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        let year = d.getFullYear();
        let hour = d.getHours();
        let minutes = d.getMinutes();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        let hours = [hour, minutes].join(':');
        let days = [year, month, day].join('-');

        return [days, hours].join(' ');
    }

    const handleAddClient = () => {
        navigate('/client/add-client');
    }

    const handleEdit = (msisdn) => {
        navigate(`/client/edit/${msisdn}`);
    };

    const columns = [
        { field: "name", headerName: "Client Name", flex: 1 },
        { field: "msisdn", headerName: "MSISDN", flex: 1 },
        { field: "language", headerName: "Language", flex: 1 },
        { field: "dateOfBirth", headerName: "Date of Birth", flex: 1 },
        { field: "cniNumber", headerName: "Cni", flex: 1 },
        { field: "initialBalance", headerName: "Initial Balance", flex: 1 },
        { field: "email", headerName: "Email", flex: 1 },
        { field: "address", headerName: "Address", flex: 1 },
        // { field: "email", headerName: "Email", flex: 1 },
        {
            field: "active", headerName: "STATUS", flex: 1,
            renderCell: (params) => {
                const row = params.row;
                return (
                    <>
                        {row.active ? (
                            <span className="text-success">Active</span>
                        ) : (
                            <span className="text-danger">Inactive</span>
                        )}
                    </>
                );

            }
        },
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
                            onClick={() => handleEdit(row.msisdn)}

                        >
                            <EditOutlined />
                        </Box>
                        <Box
                            width="30%"
                            m="0 4px"
                            p="5px"
                            display="flex"
                            justifyContent="center"
                            backgroundColor={row.active ? colors.greenAccent[600] : colors.grey[500]}
                            borderRadius="4px"
                            onClick={() => !row.active && handleToggleActivateClientModal(row.msisdn)}
                            style={{ cursor: row.active ? 'not-allowed' : 'pointer' }}
                        >
                            {row.active ? <Verified /> : <VerifiedOutlined />}
                        </Box>
                        <Box
                            width="30%"
                            m="0 4px"
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
                <Header title="GAV Clients" subtitle="Manage your clients" />
                <Button
                    sx={{
                        backgroundColor: colors.blueAccent[700],
                        color: colors.grey[100],
                        fontSize: "14px",
                        fontWeight: "bold",
                        padding: "10px 20px",
                        marginRight: "10px",
                    }}
                    onClick={handleAddClient}
                >
                    <Add sx={{ mr: "10px" }} />
                    Onboard Client
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
                    rows={clientData}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                    checkboxSelection
                    disableSelectionOnClick
                    loading={loading}
                />
            </Box>

            <Dialog open={showActivateClientModal} onClose={() => handleToggleActivateClientModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Activate Client</DialogTitle>
                <DialogContent>

                </DialogContent>
                <Box
                    display="grid"
                    gap="30px"
                    padding="10px"
                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"

                >

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Activation Code"
                        value={activateClientFormData.activationCode}
                        onChange={handleChange}
                        name="activationCode"
                        required
                        sx={{ gridColumn: "span 4" }}

                    />
                </Box>

                <DialogActions>
                    <Button onClick={handleConfirmActivate} color="secondary" disabled={loading}>
                        {loading ? <CircularProgress animation="border" size="sm" /> : "Activate"}
                    </Button>
                    <Button onClick={() => handleToggleActivateClientModal(false)} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

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

export default Clients
