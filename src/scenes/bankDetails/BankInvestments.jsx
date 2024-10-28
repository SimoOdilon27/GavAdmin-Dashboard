import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    useTheme,
    CircularProgress,
    Tab,
    Tabs,
    Snackbar,
    Alert
} from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import CBS_Services from '../../services/api/GAV_Sercives';
import Header from '../../components/Header';
import { formatValue } from '../../tools/formatValue';

const BankInvestments = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [capitalInvestmentData, setCapitalInvestmentData] = useState([]);

    const [awaitingInvestmentApprovalData, setAwaitingInvestmentApprovalData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingRows, setLoadingRows] = useState([]);
    const [confirmationModal, setConfirmationModal] = useState({ show: false, investmentId: "" });

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

    const handleShowConfirmationModal = (investmentId) => {
        setConfirmationModal({ show: true, investmentId });
    };

    const handleCloseConfirmationModal = () => {
        setConfirmationModal({ show: false, investmentId: "" });
    };

    const handleConfirmApproveInvestment = () => {
        handleApproveInvestment(confirmationModal.investmentId);
        handleCloseConfirmationModal();
    };




    const fetchInvestmentData = async () => {
        setLoading(true);
        try {

            const payload = {
                serviceReference: 'GET_ALL_BANK_INVESTMENTS',
                requestBody: '',
                spaceId: spaceId,
            };
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            // const response = await CBS_Services('AP', 'api/gav/account/investment/getAll', 'GET', null, token);
            console.log("response", response);

            if (response && response.body.meta.statusCode === 200) {
                setCapitalInvestmentData(response.body.data);
            } else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };



    const handleApproveInvestment = async (id) => {
        try {
            setLoadingRows((prevLoadingRows) => [...prevLoadingRows, id]);

            const payload = {
                serviceReference: 'APPROVE_INVESTMENTS',
                requestBody: JSON.stringify({ request: id }),
                spaceId: spaceId,
            };
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

            // const response = await CBS_Services('ACCOUNT', `api/gav/account/investment/approve/${id}`, 'PUT', null, token);
            console.log("response", response);
            console.log("id", id);

            if (response && response.body.meta.statusCode === 200) {
                showSnackbar('Investment approved successfully.', 'success');
                await fetchInvestmentData();
                await fetchAwaitingInvestmentApprovalData();
            } else {
                showSnackbar(response.body.errors || 'Approval Investment Failed.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showSnackbar('Network Error!!! Try again Later.', 'error');

        } finally {
            setLoadingRows((prevLoadingRows) => prevLoadingRows.filter((rowId) => rowId !== id));
        }
    };


    const fetchAwaitingInvestmentApprovalData = async () => {
        try {

            const payload = {
                serviceReference: 'GET_ALL_AWAITING_INVESTMENT_APPROVAL',
                requestBody: '',
                spaceId: spaceId,
            };
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

            // const response = await CBS_Services('AP', 'api/gav/bankAccount/investment/awaitingApproval/getAll', 'GET', null, token);
            if (response && response.body.meta.statusCode === 200) {
                setAwaitingInvestmentApprovalData(response.body.data);
            } else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
            showSnackbar('Network Error!!! Try again Later.', 'error');
        }
    };

    useEffect(() => {
        fetchInvestmentData();
        fetchAwaitingInvestmentApprovalData();
    }, []);

    const toSentenceCase = (text) => {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    };

    const InvestmentColumns = [
        // { field: 'id', headerName: ' Investment ID', flex: 1 },
        { field: 'accountName', headerName: 'Account Name', flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        { field: 'amount', headerName: 'Amount', flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        { field: 'investorName', headerName: 'Investor Name', flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        {
            field: 'approvalStatus',
            headerName: 'Approval Status',
            flex: 1, headerAlign: "center", align: "center",
            renderCell: (params) => (
                loadingRows.includes(params.row.id) ? (
                    <CircularProgress size={20} />
                ) : (
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleShowConfirmationModal(params.row.id)}
                        disabled={!awaitingInvestmentApprovalData.some((item) => item.id === params.row.id && !item.approved)}
                    >
                        {awaitingInvestmentApprovalData.some((item) => item.id === params.row.id && !item.approved) ? "Approve" : "Approved"}
                    </Button>
                )
            ),
        },
    ];



    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="BANK INVESTMENTS" subtitle="Manage your Bank Investments" />
                {/* <Button
                    variant="contained"
                    color="secondary"
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : "Update Daily Investments"}
                </Button> */}
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
                    rows={capitalInvestmentData}
                    columns={InvestmentColumns}
                    components={{ Toolbar: GridToolbar }}
                    // checkboxSelection
                    disableSelectionOnClick
                    loading={loading}
                />


            </Box>
            {/* Confirmation Modal for Capital Investment */}
            <Dialog open={confirmationModal.show} onClose={handleCloseConfirmationModal} fullWidth >
                <DialogTitle>Confirm Approval</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to approve this Investment?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmationModal} color="primary" variant="contained">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmApproveInvestment} color="secondary" variant="contained">
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
    );
};

export default BankInvestments;