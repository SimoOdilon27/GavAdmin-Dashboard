import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Box,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    useTheme,
    Switch,
    CircularProgress,
    Alert,
    Tooltip,
    Tab,
    Tabs
} from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Add, Delete, EditOutlined, Money, MoneyOff, TrendingUp, Visibility } from '@mui/icons-material';
import { tokens } from '../../theme';
import CBS_Services from '../../services/api/GAV_Sercives';
import Header from '../../components/Header';

const BankInvestments = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [investmentData, setInvestmentData] = useState([]);
    const [dailyInvestmentData, setDailyInvestmentData] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [awaitingApprovalData, setAwaitingApprovalData] = useState([]);
    const [awaitingDailyApprovalData, setAwaitingDailyApprovalData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingRows, setLoadingRows] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [confirmationModal, setConfirmationModal] = useState({ show: false, investmentId: "" });
    const [confirmationDailyInvestModal, setConfirmationDailyInvestModal] = useState({ show: false, dailyInvestmentPropositionId: "" });

    const userData = useSelector((state) => state.users);
    const token = userData.token;

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

    const handleShowConfirmationDailyInvestModal = (dailyInvestmentPropositionId) => {
        setConfirmationDailyInvestModal({ show: true, dailyInvestmentPropositionId });
    };

    const handleCloseConfirmationDailyInvestModal = () => {
        setConfirmationDailyInvestModal({ show: false, dailyInvestmentPropositionId: "" });
    };

    const handleConfirmApproveDailyInvestment = () => {
        handleApproveDailyInvestment(confirmationDailyInvestModal.dailyInvestmentPropositionId);
        handleCloseConfirmationDailyInvestModal();
    };

    const handleDailyInvestment = async () => {
        try {
            setLoading(true);
            const response = await CBS_Services('AP', 'api/gav/bankAccount/dailyInvestment/invest/automatic', 'POST', null, token);

            if (response && response.status === 200) {
                setSuccessMessage('Daily Investments updated successfully.');
                setErrorMessage('');
            } else {
                setSuccessMessage('');
                setErrorMessage(response.body.errors || 'Todays Daily Investment Have Already Been Made');
            }
        } catch (error) {
            console.error('Error:', error);
            setSuccessMessage('');
            setErrorMessage('Error updating investments');
        } finally {
            setLoading(false);
        }
    };

    const fetchInvestmentData = async () => {
        try {
            const response = await CBS_Services('AP', 'api/gav/bankAccount/investment/getAll', 'GET', null, token);

            if (response && response.status === 200) {
                setInvestmentData(response.body.data);
            } else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchDailyInvestmentData = async () => {
        try {
            const response = await CBS_Services('AP', 'api/gav/bankAccount/dailyInvestment/detailInvestmentsApproval/getAll', 'GET', null, token);

            if (response && response.status === 200) {
                setDailyInvestmentData(response.body.data);
            } else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleApproveInvestment = async (investmentId) => {
        try {
            setLoadingRows((prevLoadingRows) => [...prevLoadingRows, investmentId]);
            const response = await CBS_Services('AP', `api/gav/bankAccount/investment/approval/${investmentId}`, 'PUT', null, token);

            if (response && response.status === 200) {
                setSuccessMessage('Investment approved successfully.');
                setErrorMessage('');
                await fetchInvestmentData();
                await fetchAwaitingApprovalData();
            } else {
                setSuccessMessage('');
                setErrorMessage(response.body.errors);
            }
        } catch (error) {
            console.error('Error:', error);
            setSuccessMessage('');
            setErrorMessage('Error approving investment');
        } finally {
            setLoadingRows((prevLoadingRows) => prevLoadingRows.filter((rowId) => rowId !== investmentId));
        }
    };

    const handleApproveDailyInvestment = async (detailInvestmentPropositionId) => {
        try {
            setLoadingRows((prevLoadingRows) => [...prevLoadingRows, detailInvestmentPropositionId]);
            const response = await CBS_Services('AP', `api/gav/bankAccount/dailyInvestment/approve/${detailInvestmentPropositionId}`, 'POST', null, token);

            if (response && response.status === 200) {
                setSuccessMessage('Daily Investment approved successfully.');
                setErrorMessage('');
                fetchDailyInvestmentData();
                await fetchAwaitingApprovalData();
            } else {
                setSuccessMessage('');
                setErrorMessage(response.body.errors);
            }
        } catch (error) {
            console.error('Error:', error);
            setSuccessMessage('');
            setErrorMessage('Error approving investment');
        } finally {
            setLoadingRows((prevLoadingRows) => prevLoadingRows.filter((rowId) => rowId !== detailInvestmentPropositionId));
        }
    };

    const fetchAwaitingDailyApprovalData = async () => {
        try {
            const response = await CBS_Services('AP', 'api/gav/bankAccount/dailyInvestment/detailInvestmentsAwaitingApproval/getAll', 'GET', null, token);
            if (response && response.status === 200) {
                setAwaitingDailyApprovalData(response.body.data);
            } else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchAwaitingApprovalData = async () => {
        try {
            const response = await CBS_Services('AP', 'api/gav/bankAccount/investment/awaitingApproval/getAll', 'GET', null, token);
            if (response && response.status === 200) {
                setAwaitingApprovalData(response.body.data);
            } else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchInvestmentData();
        fetchDailyInvestmentData();
        fetchAwaitingApprovalData();
        fetchAwaitingDailyApprovalData();
    }, []);

    const investmentColumns = [
        { field: 'investmentId', headerName: 'Investment ID', flex: 1 },
        { field: 'bankId', headerName: 'Bank ID', flex: 1 },
        { field: 'amount', headerName: 'Amount', flex: 1 },
        { field: 'creatorName', headerName: 'Creator Name', flex: 1 },
        {
            field: 'approvalStatus',
            headerName: 'Approval Status',
            flex: 1,
            renderCell: (params) => (
                loadingRows.includes(params.row.investmentId) ? (
                    <CircularProgress size={20} />
                ) : (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleShowConfirmationModal(params.row.investmentId)}
                        disabled={!awaitingApprovalData.some((item) => item.investmentId === params.row.investmentId && !item.approved)}
                    >
                        {awaitingApprovalData.some((item) => item.investmentId === params.row.investmentId && !item.approved) ? "Approve" : "Approved"}
                    </Button>
                )
            ),
        },
    ];

    const dailyInvestmentColumns = [
        { field: 'dailyInvestmentPropositionId', headerName: 'Daily Investment ID', flex: 1 },
        { field: 'bankId', headerName: 'Bank ID', flex: 1 },
        { field: 'bankName', headerName: 'Bank Name', flex: 1 },
        { field: 'amount', headerName: 'Amount', flex: 1 },
        { field: 'totalAmount', headerName: 'Total Amount', flex: 1 },
        { field: 'creatorName', headerName: 'Creator Name', flex: 1 },
        {
            field: 'approvalStatus',
            headerName: 'Approval Status',
            flex: 1,
            renderCell: (params) => (
                loadingRows.includes(params.row.dailyInvestmentPropositionId) ? (
                    <CircularProgress size={20} />
                ) : (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleShowConfirmationDailyInvestModal(params.row.dailyInvestmentPropositionId)}
                        disabled={!awaitingDailyApprovalData.some((item) => item.dailyInvestmentPropositionId === params.row.dailyInvestmentPropositionId && !item.approved)}
                    >
                        {awaitingDailyApprovalData.some((item) => item.dailyInvestmentPropositionId === params.row.dailyInvestmentPropositionId && !item.approved) ? "Approve" : "Approved"}
                    </Button>
                )
            ),
        },
    ];


    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Bank Investments" subtitle="Manage your Bank Investments" />
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleDailyInvestment}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : "Update Daily Investments"}
                </Button>
            </Box>




            <Box
                m="40px 0 0 0"
                height="75vh"
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

                {/* <Tabs value={value} onChange={handleChange} aria-label="icon label tabs example">
                    <Tab icon={<PhoneIcon />} label="RECENTS" />
                    <Tab icon={<FavoriteIcon />} label="FAVORITES" />
                    <Tab icon={<PersonPinIcon />} label="NEARBY" />
                </Tabs>
                <DataGrid
                    rows={investmentData}
                    columns={investmentColumns}
                    components={{ Toolbar: GridToolbar }}
                    checkboxSelection
                    disableSelectionOnClick
                /> */}

                <Box mt={2}>
                    <Tabs value={tabValue} onChange={(event, newValue) => setTabValue(newValue)}>
                        <Tab label="Capital Investment" />
                        <Tab label="Daily Investment" />
                    </Tabs>

                    {tabValue === 0 && (
                        <DataGrid
                            rows={investmentData}
                            columns={investmentColumns}
                            components={{ Toolbar: GridToolbar }}
                            checkboxSelection
                            disableSelectionOnClick
                        />
                    )}
                    {tabValue === 1 && (
                        <DataGrid
                            rows={dailyInvestmentData}
                            columns={dailyInvestmentColumns}
                            components={{ Toolbar: GridToolbar }}
                            checkboxSelection
                            disableSelectionOnClick
                        />
                    )}
                </Box>
            </Box>
            {/* Confirmation Modal for Investment */}
            <Dialog open={confirmationModal.show} onClose={handleCloseConfirmationModal}>
                <DialogTitle>Confirm Approval</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to approve this investment?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmationModal} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmApproveInvestment} color="secondary" variant="contained">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Confirmation Modal for Daily Investment */}
            <Dialog open={confirmationDailyInvestModal.show} onClose={handleCloseConfirmationDailyInvestModal}>
                <DialogTitle>Confirm Approval</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to approve this daily investment?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmationDailyInvestModal} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmApproveDailyInvestment} color="secondary" variant="contained">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BankInvestments;