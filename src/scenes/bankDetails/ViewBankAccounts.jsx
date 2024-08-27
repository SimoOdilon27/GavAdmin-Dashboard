import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Typography, useTheme, Switch, Grid, Paper, Divider, Alert, Tooltip, Snackbar, CircularProgress } from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Add, Delete, EditOutlined, Money, MoneyOff, TrendingUp, Visibility } from '@mui/icons-material';
import { tokens } from '../../theme';
import CBS_Services from '../../services/api/GAV_Sercives';
import Header from '../../components/Header';


const BankAccount = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [bankAccountData, setBankAccountData] = useState([]);
    const [formData, setFormData] = useState({
        accountId: '',
        amount: 0,
        investorName: '',
    });
    const [showModal, setShowModal] = useState(false);
    const [showDailyInvestModal, setShowDailyInvestModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [globalLoading, setGlobalLoading] = useState(false);
    const [globalMessage, setGlobalMessage] = useState({ type: '', content: '' });
    const [selectedAccountId, setSelectedAccountId] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
    const [action, setAction] = useState('activate');
    const [showStatusModal, setShowStatusModal] = useState(false);


    const userData = useSelector((state) => state.users);
    const token = userData.token;

    const handleToggleInvestmentModal = (accountId) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            accountId: accountId,
        }));
        setShowModal(!showModal);
    };

    const handleToggleDailyInvestmentModal = (accountId) => {
        setSelectedAccountId(accountId);
        setFormData(prevFormData => ({
            ...prevFormData,
            accountId: accountId,
        }));
        setShowDailyInvestModal(!showDailyInvestModal);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleConfirmAdd = async () => {
        setLoading(true);
        try {
            const payload = {
                serviceReference: 'CREATE_INVESTMENT',
                requestBody: JSON.stringify(formData)
            };
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

            if (response && response.status === 200) {
                setShowModal(false);

                showSnackbar('Investment created successfully.', 'success');

            } else {
                showSnackbar(response.body.errors || 'Error adding investment', 'error');

            }
        } catch (error) {
            console.error('Error:', error);
            showSnackbar('Network Error!!! Try again Later', 'error');

        }
        setLoading(false);
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



    const columns = [
        { field: "name", headerName: "Account Name", flex: 1 },
        { field: "externalCorpOrBankOrBranchName", headerName: "External Acc Name", flex: 1 },
        { field: "type", headerName: "Account Type", flex: 1 },
        { field: "totalCapitalInvested", headerName: "Total Capital Invested", flex: 1 },
        { field: "totalDebitBalance", headerName: "Total Debit Balance", flex: 1 },
        { field: "totalCreditBalance", headerName: "Total Credit Balance", flex: 1 },
        { field: "balance", headerName: "Account Balance", flex: 1 },
        { field: "dailyAccountThreshold", headerName: "Daily Account Threshold", flex: 1 },
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
                    <Tooltip title="Investment">
                        <Box
                            width="30%"
                            m="0 4px"
                            p="5px"
                            display="flex"
                            justifyContent="center"
                            onClick={() => handleToggleInvestmentModal(params.row.accountId)}
                            variant="outlined"
                            size="small"
                            style={{ marginRight: '5px', backgroundColor: colors.greenAccent[600] }}
                        >
                            <MoneyOff style={{ color: '#fff' }} /> {/* Replace MoneyOff with your preferred icon */}
                        </Box>
                    </Tooltip>

                    <Tooltip title="View Details">
                        <Box
                            width="30%"
                            m="0 4px"
                            p="5px"
                            display="flex"
                            justifyContent="center"
                            onClick={() => handleView(params.row)}
                            variant="outlined"
                            size="small"
                            style={{ marginRight: '5px', backgroundColor: colors.greenAccent[600] }}
                        >
                            <Visibility style={{ color: '#fff' }} /> {/* Replace Visibility with your preferred icon */}
                        </Box>
                    </Tooltip>
                </>
            ),
        }
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

    const groupData = (data) => {
        const groups = {
            'Account Info': ['name', 'accountId', 'type', 'active'],
            'Balance Info': ['balance', 'totalCapitalInvested', 'totalDebitBalance', 'totalCreditBalance'],
            'Other Details': ['externalCorpOrBankOrBranchName', 'dailyAccountThreshold'],
        };

        const groupedData = {};
        Object.entries(data).forEach(([key, value]) => {
            for (const [groupName, fields] of Object.entries(groups)) {
                if (fields.includes(key)) {
                    if (!groupedData[groupName]) groupedData[groupName] = {};
                    groupedData[groupName][key] = value;
                    return;
                }
            }
            if (!groupedData['Other']) groupedData['Other'] = {};
            groupedData['Other'][key] = value;
        });

        return groupedData;
    };

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Bank Accounts" subtitle="Manage your Bank Accounts" />
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

            {/* Investment Modal */}
            <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add Investment</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Account ID"
                        name="accountId"
                        value={formData.accountId}
                        disabled
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Amount"
                        name="amount"
                        type="number"
                        value={formData.amount}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Creator Name"
                        name="investorName"
                        value={formData.investorName}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmAdd} color="primary" disabled={loading}>
                        {loading ? 'Adding...' : 'Add'}
                    </Button>
                    <Button onClick={() => setShowModal(false)} color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>



            {/* View Modal */}
            <Dialog open={showViewModal} onClose={() => setShowViewModal(false)} maxWidth="md" fullWidth>
                <DialogTitle>Bank Account Details</DialogTitle>
                <DialogContent>
                    {selectedAccount && (
                        <Grid container spacing={3}>
                            {Object.entries(groupData(selectedAccount)).map(([groupName, groupData]) => (
                                <Grid item xs={12} key={groupName}>
                                    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                                        <Typography variant="h6" gutterBottom>{groupName}</Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        <Grid container spacing={2}>
                                            {Object.entries(groupData).map(([key, value]) => (
                                                <Grid item xs={6} key={key}>
                                                    <Typography variant="subtitle2" color="text.secondary">
                                                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}:
                                                    </Typography>
                                                    <Typography variant="body1">{formatValue(value)}</Typography>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowViewModal(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>



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