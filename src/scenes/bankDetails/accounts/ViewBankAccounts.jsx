import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Typography, useTheme, Switch, Grid, Paper, Divider, Alert, Tooltip, Snackbar, CircularProgress, MenuItem, Menu, IconButton, Chip } from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Add, Delete, EditOutlined, Money, MoneyOff, NotInterested, RemoveRedEyeSharp, Save, TrendingUp, Verified, VerifiedOutlined, Visibility } from '@mui/icons-material';
import { tokens } from '../../../theme';
import CBS_Services from '../../../services/api/GAV_Sercives';
import Header from '../../../components/Header';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';



const BankAccount = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const userData = useSelector((state) => state.users);
    const token = userData.token;
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentRow, setCurrentRow] = useState(null);
    const open = Boolean(anchorEl);



    const [bankAccountData, setBankAccountData] = useState([]);
    const [formData, setFormData] = useState({
        accountId: '',
        amount: 0,
        investorName: userData?.userName,
    });
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const [globalMessage, setGlobalMessage] = useState({ type: '', content: '' });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
    const [action, setAction] = useState('activate');
    const [showStatusModal, setShowStatusModal] = useState(false);



    const handleToggleInvestmentModal = (accountId) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            accountId: accountId,
        }));
        setShowModal(!showModal);
    };






    const fetchBankAccountData = async () => {
        setLoading(true);
        try {
            const payload = {
                serviceReference: 'GET_ALL_BANK_ACCOUNT',
                requestBody: ''
            };
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            console.log("response", response);

            if (response && response.body.meta.statusCode === 200) {
                setBankAccountData(response.body.data || []);
            } else {
                setGlobalMessage({ type: 'error', content: 'Error fetching data' });
            }
        } catch (error) {
            console.error('Error:', error);
            setGlobalMessage({ type: 'error', content: 'Error fetching bank account data' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBankAccountData();
    }, []);

    const handleActivateDeactivate = (accountId, action) => {
        setSelectedAccount(bankAccountData.find(account => account.accountId === accountId) || null);
        setAction(action);
        setShowStatusModal(true);
    };

    const confirmActivateDeactivate = async () => {
        try {
            if (!selectedAccount) return;

            setLoading(true);

            let payload = {}

            if (action === 'activate') {
                payload = {
                    serviceReference: 'ACTIVATE_ACCOUNT',
                    requestBody: JSON.stringify({
                        request: selectedAccount.accountId
                    })
                }

            } else if (action === 'deactivate') {
                payload = {
                    serviceReference: 'DEACTIVATE_ACCOUNT',
                    requestBody: JSON.stringify({
                        request: selectedAccount.accountId
                    })
                }
            }
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

            // const endpoint = `api/gav/account/${action}/${selectedAccount.accountId}`;
            // const response = await CBS_Services('ACCOUNT', endpoint, 'PUT', null);
            fetchBankAccountData();

            setLoading(false);

            console.log('Response====:', response);
            console.log('payload:', payload);

            if (response && response.body.meta.statusCode === 200) {

                setGlobalMessage({ type: 'success', content: `Account ${action}d successfully.` });
                showSnackbar(`Account ${action}d successfully.`, 'success');
                setShowStatusModal(false)

            } else {
                showSnackbar(response.body.errors || `Error ${action}ing account`, 'error');

                setGlobalMessage({ type: 'error', content: `Error ${action}ing account` });

            }
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
            setSuccessMessage('');
            setErrorMessage(`Error ${action}ing account`);
        }
    };

    const handleView = (account) => {
        setSelectedAccount(account);
        setShowViewModal(true);
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




    const handleViewAccount = (row) => {
        // Pass the entire row data to the edit page
        navigate(`/bankaccount/view/${row.accountId}`, { state: { accountData: row } });
    };

    const toSentenceCase = (text) => {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    };

    const columns = [
        { field: "name", headerName: "Account Name", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        // { field: "externalCorpOrBankOrBranchName", headerName: "External Acc Name", flex: 1,  headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        { field: "type", headerName: "Account Type", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        { field: "totalCapitalInvested", headerName: "Total Capital Invested", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value) },
        // { field: "totalDebitBalance", headerName: "Total Debit Balance", flex: 1,  headerAlign: "center", align: "center", valueGetter: (params) => toSentenceCase(params.value), },
        { field: "totalCreditBalance", headerName: "Total Credit Balance", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value) },
        { field: "balance", headerName: "Account Balance", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value) },
        // { field: "dailyAccountThreshold", headerName: "Daily Account Threshold", flex: 1,  headerAlign: "center", align: "center", valueGetter: (params) => toSentenceCase(params.value), },


        {
            field: "active",
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
                const isActive = params.row?.active; // Safely access the 'active' field

                return (
                    <>
                        <IconButton
                            aria-label="more"
                            aria-controls={`actions-menu-${params.row?.accountId}`}
                            aria-haspopup="true"
                            onClick={(event) => handleClick(event, params.row)}
                        >
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            id={`actions-menu-${params.row?.accountId}`}
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl) && currentRow?.accountId === params.row?.accountId}
                            onClose={handleClose}
                            PaperProps={{
                                style: {
                                    maxHeight: 48 * 4.5,
                                    width: "20ch",
                                    transform: "translateX(-50%)",
                                },
                            }}
                        >
                            <MenuItem onClick={() => handleViewAccount(params.row)}>
                                <RemoveRedEyeSharp fontSize="small" style={{ marginRight: "8px" }} />
                                View More
                            </MenuItem>

                            <MenuItem
                                onClick={() => {
                                    const action = isActive ? 'deactivate' : 'activate';
                                    handleActivateDeactivate(params.row?.accountId, action);
                                    handleClose();
                                }}
                            >
                                {isActive ? (
                                    <>
                                        <NotInterested style={{ marginRight: "8px", color: "red" }} />
                                        Deactivate
                                    </>
                                ) : (
                                    <>
                                        <VerifiedOutlined style={{ marginRight: "8px", color: "green" }} />
                                        Activate
                                    </>
                                )}
                            </MenuItem>

                            <MenuItem onClick={() => handleDelete(params.row)}>
                                <Delete fontSize="small" style={{ marginRight: "8px" }} />
                                Delete
                            </MenuItem>
                        </Menu>
                    </>
                );
            },
        }

    ];

    const toPascalCase = (str) => {
        return str
            .split(' ') // Split string by spaces
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter and lowercase the rest
            .join(' '); // Join back the words
    };

    const formatValue = (value) => {
        if (typeof value === 'boolean') {
            return value ? 'Yes' : 'No';
        }
        if (value === null || value === undefined) {
            return 'N/A';
        }
        if (typeof value === 'number') {
            return value.toLocaleString(); // Format numbers with commas
        }
        if (typeof value === 'string') {
            return toPascalCase(value.replace(/_/g, ' ')); // Replace underscores with spaces and format in Pascal Case
        }

        if (typeof value === 'date') {
            return `${value.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            })} ${value.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            })}`;
        }
        return value.toString();
    };


    // const date = new Date(params.value);



    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="ACCOUNTS" subtitle="Manage yourAccounts" />
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
                    rows={bankAccountData}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                    // checkboxSelection
                    disableSelectionOnClick
                    loading={loading}

                />
            </Box>



            <Dialog open={showStatusModal} onClose={() => setShowStatusModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{action === 'activate' ? 'Activate Bank' : 'Deactivate Bank'}</DialogTitle>
                <DialogContent>
                    Are you sure you want to {action} {selectedAccount?.name}?

                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setShowStatusModal(false)} color="primary" variant='contained'>
                        Cancel
                    </Button>
                    {/* <Button onClick={confirmActivateDeactivate} color="secondary" disabled={loading} variant='contained'>
                        {loading ? <CircularProgress animation="border" size="sm" /> : `${action.charAt(0).toUpperCase() + action.slice(1)}`}
                    </Button> */}

                    <LoadingButton
                        type="submit"
                        color="secondary"
                        onClick={confirmActivateDeactivate}
                        variant="contained"
                        loading={loading}
                        loadingPosition="start"
                    // startIcon={<VerifiedOutlined />}
                    >
                        {`${action.charAt(0).toUpperCase() + action.slice(1)}`}
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
    );
};

export default BankAccount;