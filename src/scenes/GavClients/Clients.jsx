import React, { useEffect, useState } from 'react'
import CBS_Services from '../../services/api/GAV_Sercives';
import { Alert, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Menu, MenuItem, Snackbar, Stack, TextField, useTheme, useMediaQuery, FormControl, InputLabel, Select } from '@mui/material';
import { tokens } from '../../theme';
import { useSelector } from 'react-redux';
import { Add, Delete, EditOutlined, Lock, NotificationsActiveRounded, RemoveRedEyeSharp, SupervisedUserCircle, Verified, VerifiedOutlined, VerifiedUser } from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { formatValue } from '../../tools/formatValue';
import { LoadingButton } from '@mui/lab';
import { Formik } from 'formik';
import * as yup from "yup";
import { FormFieldStyles } from '../../tools/fieldValuestyle';


const Clients = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [clientData, setClientData] = useState([]);
    const [loading, setLoading] = useState(false);  // State to handle loading state
    const navigate = useNavigate();
    const userData = useSelector((state) => state.users);
    const token = userData.token;
    const spaceId = userData?.selectedSpace?.id
    const usertype = userData.selectedSpace.role
    const [selectedMsisdn, setSelectedMsisdn] = useState('');
    const [approvedclientData, setApprovedClientData] = useState([]);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [showActivateClientModal, setShowActivateClientModal] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentRow, setCurrentRow] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event, row) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setCurrentRow(row);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setCurrentRow(null);
    };

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
        branchId: ""
    })

    const fetchClientData = async () => {
        setLoading(true);
        try {

            let payload = {}

            if (usertype === "CREDIX_ADMIN") {
                payload = {
                    serviceReference: 'GET_ALLCLIENT_ACCOUNTS',
                    spaceId: spaceId,
                }
            } else {
                payload = {
                    serviceReference: 'GET_APPROVED_CLIENTS_BY_ID',
                    requestBody: spaceId,
                    spaceId: spaceId,
                }
            }


            console.log("payload", payload);

            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            // const response = await CBS_Services('AP', 'api/gav/client/getAllClients', 'POST', null);

            console.log("respfetch=========", response);

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

    //     const fetchApprovedClientData = async () => {
    //         setLoading(true);
    //         try {

    //  const payload = {
    //                 serviceReference: 'GET_APPROVED_CLIENTS_BY_ID',
    //                 requestBody: spaceId,
    //                 spaceId: spaceId,
    //             }

    //             console.log("payload", payload);

    //             const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
    //             // const response = await CBS_Services('AP', 'api/gav/client/getAllClients', 'POST', null);

    //             console.log("respfetch=========", response);

    //             if (response && response.body.meta.statusCode === 200) {
    //                 setApprovedClientData(response.body.data || []);

    //             }
    //             else if (response && response.body.status === 401) {
    //                 // setErrorMessage(response.body.errors || 'Unauthorized to perform action');
    //             }
    //             else {
    //                 console.error('Error fetching data');
    //             }
    //         } catch (error) {
    //             console.error('Error:', error);
    //         }
    //         setLoading(false)
    //     };

    useEffect(() => {
        fetchClientData();
        // fetchApprovedClientData()
    }, []);

    const handleToggleActivateClientModal = (selectedClient) => {
        setSelectedMsisdn(selectedClient);

        console.log("spaceId", spaceId);

        setActivateClientFormData(prevFormData => ({
            ...prevFormData,
            msisdn: selectedClient?.msisdn,
            branchId: spaceId,
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
                spaceId: spaceId,
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



    const handleAddClient = () => {
        navigate('/client/add-client');
    }

    const handleEdit = (row) => {
        navigate(`/client/edit/${row.msisdn}`);
    };

    const handleView = (row) => {
        // Pass the entire row data to the edit page
        navigate(`/client/view/${row.msisdn}`, { state: { clientData: row } });
    };

    console.log("current Row+++", currentRow);


    const columns = [
        { field: "name", headerName: "Client Name", flex: 1, valueGetter: (params) => formatValue(params.value), },
        { field: "msisdn", headerName: "MSISDN", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        { field: "language", headerName: "Language", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        { field: "dateOfBirth", headerName: "Date of Birth", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        { field: "cniNumber", headerName: "CNI", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        { field: "initialBalance", headerName: "Initial Balance", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        { field: "email", headerName: "Email", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        { field: "address", headerName: "Address", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        // { field: "email", headerName: "Email", flex: 1 },
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
            renderCell: (params) => {
                const isActive = params.row.active;

                return (
                    <>
                        <IconButton
                            aria-label="more"
                            aria-controls={`actions-menu-${params.row.msisdn}`}
                            aria-haspopup="true"
                            onClick={(event) => handleClick(event, params.row)}
                        >
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            id={`actions-menu-${params.row.msisdn}`}
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl) && currentRow?.msisdn === params.row.msisdn}
                            onClose={handleClose}
                            PaperProps={{
                                style: {
                                    maxHeight: 48 * 4.5,
                                    width: "20ch",
                                    transform: "translateX(-50%)",
                                },
                            }}
                        >
                            <MenuItem onClick={() => {
                                handleEdit(currentRow);
                                handleClose();
                            }}>
                                <EditOutlined fontSize="small" style={{ marginRight: "8px" }} />
                                Edit
                            </MenuItem>
                            <MenuItem onClick={() => {
                                handleView(currentRow);
                                handleClose();
                            }}>
                                <RemoveRedEyeSharp fontSize="small" style={{ marginRight: "8px" }} />
                                View
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    if (!currentRow.active) {
                                        handleToggleActivateClientModal(currentRow);
                                    }
                                    handleClose();
                                }}
                                disabled={currentRow?.active}
                                style={{
                                    color: currentRow?.active ? colors.greenAccent[500] : 'inherit',
                                }}
                            >
                                {currentRow?.active ? (""
                                    // <>
                                    //     <Verified style={{ marginRight: "8px", color: colors.greenAccent[500] }} />
                                    //     Already Active
                                    // </>
                                ) : (
                                    <>
                                        <VerifiedOutlined style={{ marginRight: "8px" }} />
                                        Activate
                                    </>
                                )}

                            </MenuItem>

                        </Menu>
                    </>
                );
            },
        }

    ];

    // table for client Account
    const columns2 = [
        { field: "name", headerName: "Client Name", flex: 1, valueGetter: (params) => formatValue(params.value), },
        { field: "msisdn", headerName: "MSISDN", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        { field: "balance", headerName: "Balance", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        {
            field: "approvalstatus",
            headerName: "Approval Status",
            flex: 1,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => {
                const isActive = params.row.accepted;
                return (
                    <Chip
                        label={isActive ? "Approved" : "Pending Approval"}
                        color={isActive ? "success" : "warning"}
                        variant="filled"
                        size="small"
                    />
                );
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
            renderCell: (params) => {
                const isActive = params.row.active;

                return (
                    <>
                        <IconButton
                            aria-label="more"
                            aria-controls={`actions-menu-${params.row.msisdn}`}
                            aria-haspopup="true"
                            onClick={(event) => handleClick(event, params.row)}
                        >
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            id={`actions-menu-${params.row.msisdn}`}
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl) && currentRow?.msisdn === params.row.msisdn}
                            onClose={handleClose}
                            PaperProps={{
                                style: {
                                    maxHeight: 48 * 4.5,
                                    width: "20ch",
                                    transform: "translateX(-50%)",
                                },
                            }}
                        >
                            <MenuItem onClick={() => {
                                handleEdit(currentRow);
                                handleClose();
                            }}>
                                <EditOutlined fontSize="small" style={{ marginRight: "8px" }} />
                                Edit
                            </MenuItem>
                            <MenuItem onClick={() => {
                                handleView(currentRow);
                                handleClose();
                            }}>
                                <RemoveRedEyeSharp fontSize="small" style={{ marginRight: "8px" }} />
                                View
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    if (!currentRow.active) {
                                        handleToggleActivateClientModal(currentRow);
                                    }
                                    handleClose();
                                }}
                                disabled={currentRow?.active}
                                style={{
                                    color: currentRow?.active ? colors.greenAccent[500] : 'inherit',
                                }}
                            >
                                {currentRow?.active ? (""
                                    // <>
                                    //     <Verified style={{ marginRight: "8px", color: colors.greenAccent[500] }} />
                                    //     Already Active
                                    // </>
                                ) : (
                                    <>
                                        <VerifiedOutlined style={{ marginRight: "8px" }} />
                                        Activate
                                    </>
                                )}

                            </MenuItem>

                        </Menu>
                    </>
                );
            },
        }

    ];

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="GAV Clients" subtitle="Manage your clients" />
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
                        onClick={handleAddClient}
                    >
                        <Add sx={{ mr: "10px" }} />
                        Onboard Client
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
                <DataGrid
                    rows={clientData}
                    columns={(usertype === "CREDIX_ADMIN") ? columns : columns2}
                    components={{ Toolbar: GridToolbar }}
                    disableSelectionOnClick
                    loading={loading}
                />
            </Box>

            <Dialog open={showActivateClientModal} onClose={() => handleToggleActivateClientModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Activate Client</DialogTitle>
                <DialogContent>
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

                </DialogContent>


                <DialogActions>
                    <Button onClick={() => handleToggleActivateClientModal(false)} color="primary" variant='contained'>
                        Cancel
                    </Button>
                    <LoadingButton loading={loading} variant="contained" color="secondary" onClick={handleConfirmActivate} startIcon={<VerifiedUser />} >
                        Activate
                    </LoadingButton>

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
