import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Typography, useTheme, Switch, Grid, Paper, Divider, Alert, Tooltip, Snackbar, CircularProgress, MenuItem, Menu, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Add, Delete, EditOutlined, Money, MoneyOff, RemoveRedEyeSharp, TrendingUp, Visibility } from '@mui/icons-material';
import { tokens } from '../../../theme';
import CBS_Services from '../../../services/api/GAV_Sercives';
import Header from '../../../components/Header';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from 'react-router-dom';



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
                    requestBody: selectedAccount.accountId
                }

            } else if (action === 'deactivate') {
                payload = {
                    serviceReference: 'DEACTIVATE_ACCOUNT',
                    requestBody: selectedAccount.accountId
                }
            }
            // const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

            const endpoint = `api/gav/account/${action}/${selectedAccount.accountId}`;
            const response = await CBS_Services('ACCOUNT', endpoint, 'PUT', null);
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

    const toSentenceCase = (text) => {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    };


    const handleViewAccount = (row) => {
        // Pass the entire row data to the edit page
        navigate(`/bankaccount/view/${row.accountId}`, { state: { accountData: row } });
    };

    const columns = [
        { field: "name", headerName: "Account Name", flex: 1, valueGetter: (params) => toSentenceCase(params.value), },
        // { field: "externalCorpOrBankOrBranchName", headerName: "External Acc Name", flex: 1, valueGetter: (params) => toSentenceCase(params.value), },
        { field: "type", headerName: "Account Type", flex: 1, valueGetter: (params) => toSentenceCase(params.value), },
        { field: "totalCapitalInvested", headerName: "Total Capital Invested", flex: 1, },
        // { field: "totalDebitBalance", headerName: "Total Debit Balance", flex: 1, valueGetter: (params) => toSentenceCase(params.value), },
        { field: "totalCreditBalance", headerName: "Total Credit Balance", flex: 1, },
        { field: "balance", headerName: "Account Balance", flex: 1, },
        // { field: "dailyAccountThreshold", headerName: "Daily Account Threshold", flex: 1, valueGetter: (params) => toSentenceCase(params.value), },
        {
            field: "active",
            headerName: "Status",
            flex: 1,
            renderCell: (params) => (
                <Box>
                    <Switch
                        checked={params.value}
                        onChange={() => handleActivateDeactivate(params.row.accountId, params.value ? 'deactivate' : 'activate')}
                        color="secondary"
                    />
                    <Typography
                        color={params.value ? colors.greenAccent[500] : colors.redAccent[500]}
                    >
                        {params.value ? 'Active' : 'Inactive'}
                    </Typography>
                </Box>
            ),
        },


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
                        <MenuItem onClick={() => handleViewAccount(currentRow)}>
                            <RemoveRedEyeSharp fontSize="small" style={{ marginRight: "8px" }} />
                            View More
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
        return value.toString();
    };

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Accounts" subtitle="Manage yourAccounts" />
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
                    checkboxSelection
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
                    <Button onClick={confirmActivateDeactivate} color="secondary" disabled={loading}>
                        {loading ? <CircularProgress animation="border" size="sm" /> : `${action.charAt(0).toUpperCase() + action.slice(1)}`}
                    </Button>
                    <Button onClick={() => setShowStatusModal(false)} color="primary">
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
    );
};

export default BankAccount;