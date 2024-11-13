import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, useTheme, Alert, Snackbar, MenuItem, Menu, IconButton, Chip, Tab, Tabs } from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Delete, NotInterested, RemoveRedEyeSharp, VerifiedOutlined } from '@mui/icons-material';
import { tokens } from '../../../theme';
import CBS_Services from '../../../services/api/GAV_Sercives';
import Header from '../../../components/Header';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { formatValue } from '../../../tools/formatValue';



const BankAccount = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const userData = useSelector((state) => state.users);
    const token = userData.token;
    const spaceId = userData?.selectedSpace?.id
    const usertype = userData.selectedSpace.role
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentRow, setCurrentRow] = useState(null);
    const [selectedTab, setSelectedTab] = useState(0);
    const [bankAccountData, setBankAccountData] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
    const [action, setAction] = useState('activate');
    const [showStatusModal, setShowStatusModal] = useState(false);


    const fetchBankAccountData = async () => {
        setLoading(true);
        try {
            let payload = {}

            if (usertype === "CREDIX_ADMIN") {
                payload = {
                    serviceReference: 'GET_ALL_BANK_ACCOUNT',
                    requestBody: '',
                    spaceId: spaceId,
                }
            } else {
                payload = {
                    serviceReference: 'GET_ACCOUNTS_BY_CORPID_BANKID_BRANCHID',
                    requestBody: spaceId,
                    spaceId: spaceId,
                }
            }
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            console.log("response", response);

            if (response && response.body.meta.statusCode === 200) {
                setBankAccountData(response.body.data || []);
            } else {
                showSnackbar(response.body.errors || `Error fetching data`, 'error');

            }
        } catch (error) {
            console.error('Error:', error);
            showSnackbar(`Error fetching data`, 'error');
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

                showSnackbar(`Account ${action}d successfully.`, 'success');
                setShowStatusModal(false)

            } else {
                showSnackbar(response.body.errors || `Error ${action}ing account`, 'error');


            }
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
            showSnackbar(`Error ${action}ing account`, 'error');

        }
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


    const columns = [
        { field: "name", headerName: "Account Name", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        { field: "type", headerName: "Account Type", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        { field: "totalCapitalInvested", headerName: "Total Capital Invested", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value) },
        { field: "totalCreditBalance", headerName: "Total Credit Balance", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value) },
        { field: "balance", headerName: "Account Balance", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value) },
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

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const filterDataByType = (type) => {
        const typeKeywords = {
            OPERATION: ["operation"],
            COMPENSATION: ["compensation"],
            COMMISSION: ["commission"],
            GIMAC: ["gimac"],
            CLIENT: ["client"]
        };

        return bankAccountData.filter(account =>
            typeKeywords[type].some(keyword => account.type.toLowerCase().includes(keyword))
        );
    };


    // const date = new Date(params.value);



    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="ACCOUNTS" subtitle="Manage GAV Accounts" />
            </Box>
            <Box
                m="10px 15px 15px 15px">
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="account type tabs"
                    sx={{
                        borderBottom: 1,
                        borderRadius: '8px 8px 0 0',
                        backgroundColor: colors.primary[400],
                        borderColor: 'divider',
                        '& .MuiTab-root': {
                            borderRadius: '8px 8px 0 0',
                            margin: '0 5px',
                            '&.Mui-selected': {
                                color: theme.palette.mode === 'light' ? 'black' : `${colors.greenAccent[400]}`,
                            },
                        },
                    }}
                >
                    <Tab label="Operation" />
                    <Tab label="Compensation" />
                    <Tab label="Commission" />
                    <Tab label="GIMAC" />
                    <Tab label="Client" />
                </Tabs>
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
                    rows={
                        selectedTab === 0 ? filterDataByType("OPERATION") :
                            selectedTab === 1 ? filterDataByType("COMPENSATION") :
                                selectedTab === 2 ? filterDataByType("COMMISSION") :
                                    selectedTab === 3 ? filterDataByType("GIMAC") :
                                        filterDataByType("CLIENT")
                    }
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
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