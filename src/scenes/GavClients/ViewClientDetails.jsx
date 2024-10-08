import { Box, Button, CardContent, Tooltip, TextField, Chip, IconButton, Typography, Grid, Card, Avatar, useTheme, Tab, Tabs } from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import {
    Person,
    Phone,
    LocationOn,
    Email,
    CalendarToday,
    AccountBalance,
    Receipt,
    Search,
    Refresh,
    ArrowBack,
    Language,
    Work,
    Badge,
    Assignment,
    AttachMoney
} from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CBS_Services from "../../services/api/GAV_Sercives";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const ViewClientDetails = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const userData = useSelector((state) => state.users);
    const token = userData.token;
    const { msisdn } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [initialValues, setInitialValues] = useState({});
    const [transactionData, setTransactionData] = useState([]);
    const [pageInput, setPageInput] = useState("1");
    const [sizeInput, setSizeInput] = useState("10");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    // Similar fetchTransactions function as in your template
    const fetchTransactions = async (page, pageSize) => {
        setLoading(true);
        try {
            const payload = {
                serviceReference: 'GET_TRANSACTION_BY_ACCOUNT_NUMBER',
                requestBody: msisdn
            };

            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

            if (response && response.status === 200) {
                setTransactionData(response.body.data || []);
                setRowCount(response.body.data.length || 0);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFetchData = () => {
        const newPage = parseInt(pageInput);
        const newSize = parseInt(sizeInput);
        if (!isNaN(newPage) && !isNaN(newSize) && newPage > 0 && newSize > 0) {
            setCurrentPage(newPage);
            setPageSize(newSize);
            fetchTransactions(newPage, newSize);
        }
    };

    const handleRefresh = () => {
        fetchTransactions(currentPage, pageSize);
    };

    useEffect(() => {
        fetchTransactions(currentPage, pageSize);
    }, [msisdn]);

    useEffect(() => {
        if (msisdn && location.state && location.state.branchData) {
            setInitialValues(location.state.branchData);
        }
    }, [msisdn, location.state]);

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
            field: 'amount',
            headerName: 'Amount',
            width: 120,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Amount</span>,
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 100,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Status</span>,
        },
        {
            field: 'dateTime',
            headerName: 'Date & Time',
            width: 180,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Date & Time</span>,
        },
    ];

    useEffect(() => {
        if (msisdn && location.state && location.state.clientData) {
            setInitialValues(location.state.clientData);
        }
    }, [msisdn, location.state]);

    if (!initialValues) return null;

    const TabPanel = ({ children, value, index }) => (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );

    console.log("initialValues", initialValues);


    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Header
                    title="Client DETAILS"
                    subtitle={`Viewing details for ${initialValues.name || 'Unknown Branch'}`}
                />
                <Button
                    onClick={() => navigate(-1)}
                    startIcon={<ArrowBack />}
                    sx={{
                        backgroundColor: colors.blueAccent[700],
                        color: colors.grey[100],
                        fontSize: "14px",
                        fontWeight: "bold",
                        padding: "10px 20px",
                    }}
                >
                    Back
                </Button>
            </Box>

            <Card sx={{ backgroundColor: colors.primary[400], mb: 3 }}>
                <CardContent>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={3} display="flex" flexDirection="column" alignItems="center">
                            <Avatar
                                src={`../../assets/icons8-administrator-male.png`}
                                sx={{ width: 150, height: 150, mb: 2 }}
                            />
                            <Typography variant="h5" color={colors.grey[100]} gutterBottom>
                                {initialValues.name} {initialValues.surname}
                            </Typography>
                            <Chip
                                label={initialValues.active ? "Active Client" : "Inactive Client"}
                                color={initialValues.active ? "success" : "error"}
                                sx={{ mt: 1 }}
                            />
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <InfoItem icon={<Phone />} label="MSISDN" value={initialValues.msisdn} />
                                    <InfoItem icon={<Email />} label="Email" value={initialValues.email} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <InfoItem icon={<AccountBalance />} label="Account ID" value={initialValues.accountId} />
                                    <InfoItem icon={<Badge />} label="Internal ID" value={initialValues.internalId} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <InfoItem icon={<AttachMoney />} label="Initial Balance" value={initialValues.initialBalance} />
                                    <InfoItem icon={<Language />} label="Language" value={initialValues.language} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>


            <Card sx={{ backgroundColor: colors.primary[400] }}>
                <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        '& .MuiTab-root': {
                            borderRadius: '8px 8px 0 0',
                            margin: '0 5px',
                            '&.Mui-selected': {
                                // backgroundColor: colors.blueAccent[500],
                                color: theme.palette.mode === 'light' ? 'black' : `${colors.greenAccent[400]}`, // Dark label for light mode, white for dark mode

                            },
                        },
                    }}
                >
                    <Tab label="Personal Details" />
                    <Tab label="Account Details" />
                    <Tab label="Transactions" />
                </Tabs>

                <TabPanel value={activeTab} index={0}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <InfoItem icon={<CalendarToday />} label="Date of Birth" value={initialValues.dateOfBirth} />
                            <InfoItem icon={<LocationOn />} label="Place of Birth" value={initialValues.placeOfBirth} />
                            <InfoItem icon={<Work />} label="Occupation" value={initialValues.occupation} />
                            <InfoItem icon={<Person />} label="Father's Name" value={initialValues.fatherName} />
                            <InfoItem icon={<Person />} label="Mother's Name" value={initialValues.motherName} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <InfoItem icon={<LocationOn />} label="Address" value={initialValues.address} />
                            <InfoItem icon={<LocationOn />} label="Region" value={initialValues.region} />
                            <InfoItem icon={<Assignment />} label="CNI Number" value={initialValues.cniNumber} />
                            <InfoItem icon={<CalendarToday />} label="CNI Creation Date" value={initialValues.cniCreationDate} />
                            <InfoItem icon={<CalendarToday />} label="CNI Expiration Date" value={initialValues.cniExpirationDate} />
                        </Grid>
                    </Grid>
                </TabPanel>

                <TabPanel value={activeTab} index={1}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <InfoItem icon={<AccountBalance />} label="Bank ID" value={initialValues.bankId} />
                            <InfoItem icon={<Assignment />} label="CBS Account Number" value={initialValues.cbsAccountNumber} />
                            <InfoItem icon={<AttachMoney />} label="Maximum Account Limit" value={initialValues.maximumAccountLimit} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <InfoItem icon={<Assignment />} label="Branch ID" value={initialValues.branchId} />
                            <InfoItem icon={<CalendarToday />} label="Creation Date" value={initialValues.creationDate} />
                            <InfoItem icon={<AttachMoney />} label="Minimum Account Limit" value={initialValues.minimumAccountLimit} />
                        </Grid>
                    </Grid>
                </TabPanel>

                <TabPanel value={activeTab} index={2}>
                    <Box sx={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={transactionData}
                            columns={columns}
                            pageSize={pageSize}
                            rowsPerPageOptions={[5, 10, 20]}
                            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                            onPageChange={(newPage) => setCurrentPage(newPage)}
                            loading={loading}
                            components={{
                                Toolbar: GridToolbar,
                            }}
                            sx={{
                                border: 'none',
                                '& .MuiDataGrid-cell': { borderBottom: 'none' },
                                '& .MuiDataGrid-columnHeaders': {
                                    backgroundColor: colors.blueAccent[700],
                                    borderBottom: 'none',
                                },
                                '& .MuiDataGrid-virtualScroller': {
                                    backgroundColor: colors.primary[400],
                                },
                                '& .MuiDataGrid-footerContainer': {
                                    borderTop: 'none',
                                    backgroundColor: colors.blueAccent[700],
                                },
                                '& .MuiCheckbox-root': {
                                    color: `${colors.greenAccent[200]} !important`,
                                },
                                '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
                                    color: `${colors.grey[100]} !important`,
                                },
                            }}
                        />
                    </Box>
                </TabPanel>
            </Card>
        </Box>
    );
};

export default ViewClientDetails;