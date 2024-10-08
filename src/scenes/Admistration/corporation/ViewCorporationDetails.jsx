import { Alert, Box, Button, FormControl, Tooltip, InputLabel, MenuItem, Select, CardContent, Snackbar, Stack, TextField, Switch, FormControlLabel, Checkbox, RadioGroup, Radio, FormLabel, Chip, IconButton, Typography, Grid, Card } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CBS_Services from "../../../services/api/GAV_Sercives";
import { LoadingButton } from "@mui/lab";
import {
    Business,
    Email,
    Phone,
    LocationOn,
    Domain,
    CalendarToday,
    AccountBalance,
    Receipt,
    Search,
    Refresh,
    BackHand,
    ArrowBack
} from "@mui/icons-material";
import { tokens } from "../../../theme";
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";


const ViewCorporationDetails = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { accounts } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const userData = useSelector((state) => state.users);
    const token = userData.token;

    const [initialValues, setInitialValues] = useState({})
    const [transactionData, setTransactionData] = useState([]);
    const [pending, setPending] = useState(false);
    const [pageInput, setPageInput] = useState("1"); // For user input
    const [sizeInput, setSizeInput] = useState("10"); // For user input
    const [currentPage, setCurrentPage] = useState(1); // Actual page for API
    const [pageSize, setPageSize] = useState(10); // Actual size for API

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [pageSizeOptions] = useState([5, 10, 25, 50]);

    const InfoItem = ({ icon, label, value }) => (
        <Box display="flex" alignItems="center" mb={2}>
            <IconButton sx={{ color: colors.greenAccent[500], mr: 2 }}>
                {icon}
            </IconButton>
            <Box>
                <Typography variant="subtitle2" color={colors.grey[400]}>
                    {label}
                </Typography>
                <Typography variant="body1" color={colors.grey[100]}>
                    {value || 'N/A'}
                </Typography>
            </Box>
        </Box>
    );

    const fetchTransactions = async (page, pageSize) => {
        setLoading(true);
        try {
            const payload = {
                serviceReference: 'GET_TRANSACTION_BY_ACCOUNT_ID',
                requestBody: JSON.stringify({
                    page: page, // DataGrid uses 0-based indexing
                    size: pageSize,
                    corporationOrBranchOrBankId: accounts
                })
            };


            console.log("payload", payload);

            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            console.log("response", response);

            if (response && response.status === 200) {
                setTransactionData(response.body.data || []);
                setRowCount(response.body.data.length || 0); // Adjust based on your API response
            } else {
                console.error("Error fetching transactions");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (accounts) {
            fetchTransactions(paginationModel.page, paginationModel.pageSize);
        }
    }, [paginationModel.page, paginationModel.pageSize, accounts]);


    const handleFetchData = () => {
        const newPage = parseInt(pageInput);
        const newSize = parseInt(sizeInput);

        if (isNaN(newPage) || isNaN(newSize) || newPage < 1 || newSize < 1) {
            // You might want to show an error message here
            return;
        }

        setCurrentPage(newPage);
        setPageSize(newSize);
        fetchTransactions(newPage, newSize);
    };

    const handleRefresh = () => {
        fetchTransactions(currentPage, pageSize);
    };


    // Initial fetch
    useEffect(() => {
        fetchTransactions(currentPage, pageSize);
    }, [accounts]);

    useEffect(() => {
        if (accounts && location.state && location.state.corporationData) {
            // Use the data passed from the corporationData component
            setInitialValues(location.state.corporationData);
        }
    }, [accounts, location.state]);

    if (!initialValues) return null;

    // console.log("initialValues", initialValues);

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 80,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>ID</span>,
        },
        {
            field: 'transactionId',
            headerName: 'Transaction ID',
            width: 150,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Transaction ID</span>,
        },
        {
            field: 'transactionType',
            headerName: 'Type',
            width: 120,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Type</span>,
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 100,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Status</span>,
        },
        {
            field: 'processingId',
            headerName: 'Processing ID',
            width: 150,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Processing ID</span>,
        },
        {
            field: 'direction',
            headerName: 'Direction',
            width: 100,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Transaction Type</span>,
        },
        {
            field: 'amount',
            headerName: 'Amount',
            width: 120,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Amount</span>,
        },
        {
            field: 'fromAccount',
            headerName: 'From Account',
            width: 150,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>From Account</span>,
        },
        {
            field: 'fromBankId',
            headerName: 'From Bank ID',
            width: 120,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>From Bank ID</span>,
        },
        {
            field: 'toAccount',
            headerName: 'To Account',
            width: 150,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>To Account</span>,
        },
        {
            field: 'toBankId',
            headerName: 'To Bank ID',
            width: 120,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>To Bank ID</span>,
        },
        {
            field: 'transactionCategory',
            headerName: 'Category',
            width: 150,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Category</span>,
        },
        {
            field: 'service',
            headerName: 'Service',
            width: 120,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Service</span>,
        },
        {
            field: 'dateTime',
            headerName: 'Date & Time',
            width: 180,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Date & Time</span>,
        },
    ]

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header
                    title="CORPORATION DETAILS"
                    subtitle={`Viewing details for ${initialValues.corporationName}`}
                />

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
                        onClick={() => navigate(-1)}
                    >
                        <ArrowBack sx={{ mr: "10px" }} />
                        Back
                    </Button>

                </Box>
            </Box>


            <Grid container spacing={3}>
                {/* Main Info Card */}
                <Grid item xs={12} md={6}>
                    <Card
                        sx={{
                            backgroundColor: colors.primary[400],
                            height: '100%'
                        }}
                    >
                        <CardContent>
                            <Typography variant="h5" mb={3} color={colors.greenAccent[500]}>
                                Basic Information
                            </Typography>
                            <InfoItem
                                icon={<Business />}
                                label="Corporation Name"
                                value={initialValues.corporationName}
                            />
                            <InfoItem
                                icon={<Domain />}
                                label="Corporation ID"
                                value={initialValues.corporationId}
                            />
                            <InfoItem
                                icon={<Email />}
                                label="Email"
                                value={initialValues.email}
                            />
                            <InfoItem
                                icon={<Phone />}
                                label="Contact"
                                value={initialValues.contact}
                            />
                            <InfoItem
                                icon={<LocationOn />}
                                label="Address"
                                value={initialValues.address}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Additional Info Card */}
                <Grid item xs={12} md={6}>
                    <Card
                        sx={{
                            backgroundColor: colors.primary[400],
                            height: '100%'
                        }}
                    >
                        <CardContent>
                            <Typography variant="h5" mb={3} color={colors.greenAccent[500]}>
                                Additional Details
                            </Typography>
                            <InfoItem
                                icon={<AccountBalance />}
                                label="Account ID"
                                value={initialValues.accounts}
                            />
                            <InfoItem
                                icon={<AccountBalance />}
                                label="Account Threshold"
                                value={initialValues.corporationAccountThreshold}
                            />
                            <InfoItem
                                icon={<CalendarToday />}
                                label="Creation Date"
                                value={new Date(initialValues.creationDateTime).toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                            />

                            <Box mt={4}>
                                <Typography variant="subtitle2" color={colors.grey[400]} mb={1}>
                                    Status
                                </Typography>
                                <Chip
                                    label={initialValues.active ? "Active" : "Inactive"}
                                    sx={{
                                        backgroundColor: initialValues.active ? colors.greenAccent[500] : colors.redAccent[500],
                                        color: "white",
                                    }}
                                />
                            </Box>

                            {/* CBS Account Information */}
                            {/* <Box mt={4}>
                                <Typography variant="subtitle1" color={colors.grey[100]} mb={2}>
                                    CBS Account Status
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Chip
                                            label={initialValues.hasCbsAccount ? "Has CBS Account" : "No CBS Account"}
                                            sx={{
                                                backgroundColor: initialValues.hasCbsAccount ? colors.greenAccent[500] : colors.grey[500],
                                                color: "white",
                                                width: '100%'
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Chip
                                            label={initialValues.otherCbs ? "Has Other CBS" : "No Other CBS"}
                                            sx={{
                                                backgroundColor: initialValues.otherCbs ? colors.greenAccent[500] : colors.grey[500],
                                                color: "white",
                                                width: '100%'
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Box> */}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>


            {/* Transaction Section */}
            <Box mt={6}>
                <Card
                    sx={{
                        backgroundColor: colors.primary[400],
                        mb: 3
                    }}
                >
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Box>
                                <Typography variant="h5" color={colors.greenAccent[500]}>
                                    <Receipt sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Transaction History
                                </Typography>
                                <Typography variant="body2" color={colors.grey[400]} mt={1}>
                                    Showing transactions for this corporation
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center">
                                <Typography variant="body2" color={colors.grey[400]} mr={2}>
                                    Total Records: {rowCount}
                                </Typography>
                            </Box>
                        </Box>

                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <TextField
                                    label="Page"
                                    variant="outlined"
                                    size="small"
                                    value={pageInput}
                                    onChange={(e) => setPageInput(e.target.value)}
                                    sx={{
                                        width: '80px',
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: colors.grey[400],
                                            },
                                            '&:hover fieldset': {
                                                borderColor: colors.grey[300],
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: theme.palette.mode === 'light' ? 'black' : 'white', // Same behavior when focused
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: colors.grey[400],
                                        },
                                        '& input': {
                                            color: colors.grey[100],
                                        },
                                    }}
                                />
                                <TextField
                                    label="Size"
                                    variant="outlined"
                                    size="small"
                                    value={sizeInput}
                                    onChange={(e) => setSizeInput(e.target.value)}
                                    sx={{
                                        width: '80px',
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: colors.grey[400],
                                            },
                                            '&:hover fieldset': {
                                                borderColor: colors.grey[300],
                                            },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: theme.palette.mode === 'light' ? 'black' : 'white', // Same behavior when focused
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: colors.grey[400],
                                        },
                                        '& input': {
                                            color: colors.grey[100],
                                        },
                                    }}
                                />
                                <LoadingButton
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleFetchData}
                                    loading={loading}
                                    loadingPosition="start"
                                    startIcon={<Search />}
                                // sx={{
                                //     backgroundColor: colors.greenAccent[600],
                                //     '&:hover': {
                                //         backgroundColor: colors.greenAccent[700],
                                //     },
                                // }}
                                >
                                    Fetch Data
                                </LoadingButton>
                                <Tooltip title="Refresh current page">
                                    <IconButton
                                        onClick={handleRefresh}
                                        sx={{ color: colors.grey[300] }}
                                    >
                                        <Refresh />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Box>
                                <Typography variant="body2" color={colors.grey[400]}>
                                    Current Page: {currentPage} | Page Size: {pageSize}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                {/* DataGrid */}
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
                        rows={transactionData}
                        columns={columns}
                        loading={loading}
                        components={{
                            Toolbar: GridToolbar,
                        }}
                        checkboxSelection
                        disableRowSelectionOnClick
                    />
                </Box>
            </Box>

        </Box>
    )
}

export default ViewCorporationDetails
