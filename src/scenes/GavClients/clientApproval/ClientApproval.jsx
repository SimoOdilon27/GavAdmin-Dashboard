import { Alert, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { tokens } from '../../../theme';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Header from '../../../components/Header';
import { formatValue } from '../../../tools/formatValue';
import { Add, TaskAlt } from '@mui/icons-material';
import CBS_Services from '../../../services/api/GAV_Sercives';

const ClientApproval = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [awaitingclientData, setAwaitingClientData] = useState([]);
    const [selectedClients, setSelectedClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const navigate = useNavigate();
    const userData = useSelector((state) => state.users);
    const token = userData.token;
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

    const fetchAwaitingApprovalClientData = async () => {
        setLoading(true);
        try {
            const payload = {
                serviceReference: 'GET_CLIENTS_AWAITING_APPROVAL_BY_ID',
                requestBody: spaceId,
                spaceId: spaceId,
            }

            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

            if (response && response.body.meta.statusCode === 200) {
                setAwaitingClientData(response.body.data || []);
            }
            else if (response && response.body.status === 401) {
                showSnackbar(response.body.errors || 'Unauthorized to perform action', 'error');
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
        fetchAwaitingApprovalClientData();
    }, []);

    const handleApproveClients = async () => {
        try {
            // Determine clients to approve
            const clientsToApprove = selectedClients.length > 0
                ? selectedClients
                : [openConfirmDialog];

            // Prepare payload with MSISDN array
            const payload = {
                serviceReference: 'APPROVE_CLIENTS',
                requestBody: JSON.stringify({
                    msisdn: clientsToApprove.map(client => client.msisdn),
                    branchId: spaceId,
                }),
                spaceId: spaceId,
            }

            console.log("payload", payload);

            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            console.log("responseadd", response);

            if (response && response.body.meta.statusCode === 200) {
                fetchAwaitingApprovalClientData();
                setSelectedClients([]);
                showSnackbar('Client(s) Approved Successfully', 'success');
            } else {
                showSnackbar(response.body.errors || 'Failed to approve clients', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showSnackbar('Error approving clients', 'error');
        } finally {
            setOpenConfirmDialog(false);
        }
    };

    const columns = [
        { field: "name", headerName: "Client Name", flex: 1, valueGetter: (params) => formatValue(params.value) },
        { field: "msisdn", headerName: "MSISDN", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value) },
        { field: "cbsAccountNumber", headerName: "Account Number", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value) },
        {
            field: "status",
            headerName: "Status",
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
            field: 'approvalStatus',
            headerName: 'Approval Action',
            flex: 1,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                        setOpenConfirmDialog(params.row);
                    }}
                ><TaskAlt sx={{ mr: "10px" }} />
                    Approve
                </Button>
            ),
        },
    ];

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="GAV Clients Approval" subtitle="Manage clients awaiting approval" />
                {selectedClients.length > 0 && (
                    <Button
                        sx={{
                            backgroundColor: colors.greenAccent[700],
                            color: colors.grey[100],
                            fontSize: "14px",
                            fontWeight: "bold",
                            padding: "10px 20px",
                            marginRight: "10px",
                        }}
                        onClick={() => setOpenConfirmDialog(true)}
                    >
                        <TaskAlt sx={{ mr: "10px" }} />
                        Approve all {selectedClients.length} Clients
                    </Button>


                )}
            </Box>
            <Box
                m="40px 15px 15px 15px"
                height="70vh"
                sx={{
                    "& .MuiDataGrid-root": { border: "none" },
                    "& .MuiDataGrid-cell": { borderBottom: "none" },
                    "& .name-column--cell": { color: colors.greenAccent[300] },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.blueAccent[700],
                    },
                    "& .MuiCheckbox-root": { color: `${colors.greenAccent[200]} !important` },
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        color: `${colors.grey[100]} !important`,
                    },
                }}
            >
                <DataGrid
                    rows={awaitingclientData}
                    columns={columns}
                    checkboxSelection
                    onSelectionModelChange={(newSelectionModel) => {
                        const selectedRowsData = newSelectionModel.map(
                            (id) => awaitingclientData.find((row) => row.id === id)
                        );
                        setSelectedClients(selectedRowsData);
                        console.log("selectedRowsData", selectedRowsData);

                    }}
                    components={{ Toolbar: GridToolbar }}
                    disableSelectionOnClick
                    loading={loading}
                />
            </Box>

            {/* Confirmation Dialog */}
            <Dialog
                open={!!openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
                aria-labelledby="approval-dialog-title"
                aria-describedby="approval-dialog-description"
                fullWidth
            >
                <DialogTitle id="approval-dialog-title">
                    {"Confirm Client Approval"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="approval-dialog-description">
                        {selectedClients.length > 0
                            ? `Are you sure you want to approve all  selected clients(${selectedClients.length})?`
                            : `Are you sure you want to approve the client: ${openConfirmDialog.name}?`
                        }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirmDialog(false)} color="primary" variant='outlined'>
                        Cancel
                    </Button>
                    <Button onClick={handleApproveClients} color="secondary" variant='contained' autoFocus>
                        Confirm
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

export default ClientApproval