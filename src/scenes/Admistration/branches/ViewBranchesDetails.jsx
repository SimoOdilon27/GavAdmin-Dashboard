import { Box, Button, CardContent, TextField, Chip, IconButton, Typography, Grid, Card, Tooltip } from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import {
    Business,
    Email,
    LocationOn,
    Domain,
    CalendarToday,
    AccountBalance,
    Receipt,
    Search,
    Refresh,
    ArrowBack
} from "@mui/icons-material";
import { tokens } from "../../../theme";
import { useTheme } from '@mui/material/styles';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../../../components/Header";
import CBS_Services from "../../../services/api/GAV_Sercives";
import { formatValue } from "../../../tools/formatValue";

const ViewBranchesDetails = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const userData = useSelector((state) => state.users);
    const token = userData.token;
    const spaceId = userData?.selectedSpace?.id
    const { accounts } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [initialValues, setInitialValues] = useState({});
    const [accountsData, setAccountsData] = useState([]);
    const [pageInput, setPageInput] = useState("1");
    const [sizeInput, setSizeInput] = useState("10");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchAccounts = async (page, pageSize) => {
        setLoading(true);
        try {
            const payload = {
                serviceReference: 'GET_ACCOUNTS_BY_BRANCH_ID',
                requestBody: JSON.stringify({
                    page: page,
                    size: pageSize,
                    corporationOrBranchOrBankId: accounts
                }),
                spaceId: spaceId,
            };

            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

            if (response && response.status === 200) {
                setAccountsData(response.body.data || []);
                setRowCount(response.body.data.length || 0);
            } else {
                console.error("Error fetching accounts");
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

        if (isNaN(newPage) || isNaN(newSize) || newPage < 1 || newSize < 1) {
            return;
        }

        setCurrentPage(newPage);
        setPageSize(newSize);
        fetchAccounts(newPage, newSize);
    };

    const handleRefresh = () => {
        fetchAccounts(currentPage, pageSize);
    };

    useEffect(() => {
        fetchAccounts(currentPage, pageSize);
    }, [accounts]);

    useEffect(() => {
        if (accounts && location.state && location.state.branchData) {
            setInitialValues(location.state.branchData);
        }
    }, [accounts, location.state]);

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

    const statusBadgeStyles = {
        PENDING: { backgroundColor: 'orange', color: 'white' },
        SUCCESSFUL: { backgroundColor: 'green', color: 'white' },
        FAILED: { backgroundColor: 'red', color: 'white' },
    };

    const columns = [
        {
            field: 'dateTime',
            headerName: 'Date & Time',
            flex: 1,
            headerAlign: "center", align: "center",
            valueGetter: (params) => formatValue(params.value),
        },

        {
            field: 'fromAccount',
            headerName: 'From Account',
            flex: 1,
            headerAlign: "center", align: "center",
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>From Account</span>,

        },
        {
            field: 'toAccount',
            headerName: 'To Account',
            flex: 1,
            headerAlign: "center", align: "center",
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>To Account</span>,
        },

        {
            field: 'direction',
            headerName: 'Direction',
            flex: 1,
            headerAlign: "center", align: "center",
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Transaction Type</span>,
            valueGetter: (params) => formatValue(params.value),
        },
        {
            field: 'amount',
            headerName: 'Amount',
            flex: 1,
            headerAlign: "center", align: "center",
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Amount</span>,
            valueGetter: (params) => formatValue(params.value),
        },



        {
            field: 'service',
            headerName: 'Service',
            flex: 1,
            headerAlign: "center", align: "center",
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Service</span>,
            valueGetter: (params) => formatValue(params.value),
        },

        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            headerAlign: "center", align: "center",
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Status</span>,
            renderCell: (params) => (
                <div
                    style={{
                        padding: '5px 10px',
                        borderRadius: '12px',
                        backgroundColor: statusBadgeStyles[params.value]?.backgroundColor,
                        color: statusBadgeStyles[params.value]?.color,
                        textAlign: 'center',
                    }}
                >
                    {params.value}
                </div>
            ),
        },


    ]

    if (!initialValues) return null;

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header
                    title="BRANCH DETAILS"
                    subtitle={`Viewing details for ${initialValues.branchName}`}
                />
                <Box>
                    <Button
                        sx={{
                            backgroundColor: colors.blueAccent[700],
                            color: colors.grey[100],
                            fontSize: "14px",
                            fontWeight: "bold",
                            padding: "10px 20px",
                        }}
                        onClick={() => navigate(-1)}
                    >
                        <ArrowBack sx={{ mr: "10px" }} />
                        Back
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ backgroundColor: colors.primary[400], height: '100%' }}>
                        <CardContent>
                            <Typography variant="h5" mb={3} color={colors.greenAccent[500]}>
                                Basic Information
                            </Typography>
                            <InfoItem
                                icon={<Business />}
                                label="Branch Name"
                                value={initialValues.branchName}
                            />
                            <InfoItem
                                icon={<Domain />}
                                label="Branch ID"
                                value={initialValues.id}
                            />
                            <InfoItem
                                icon={<Email />}
                                label="Branch Email"
                                value={initialValues.email}
                            />
                            {/* <InfoItem
                                icon={<Phone />}
                                label="Contact"
                                value={initialValues.contact}
                            /> */}
                            <InfoItem
                                icon={<LocationOn />}
                                label="Address"
                                value={initialValues.address}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Additional Information */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ backgroundColor: colors.primary[400], height: '100%' }}>
                        <CardContent>
                            <Typography variant="h5" mb={3} color={colors.greenAccent[500]}>
                                Additional Details
                            </Typography>
                            <InfoItem
                                icon={<AccountBalance />}
                                label="Bank ID"
                                value={initialValues.bankId}
                            />
                            <InfoItem
                                icon={<AccountBalance />}
                                label="Account"
                                value={initialValues.accounts}
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
                                        borderRadius: 1, // Removes the rounded corners for a rectangular shape
                                        height: '30px', // Adjusts the height (you can tweak this value)
                                        padding: '0 12px', // Adds padding to give it more width

                                    }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Accounts Section */}
            <Box mt={6}>
                <Card sx={{ backgroundColor: colors.primary[400], mb: 3 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Box>
                                <Typography variant="h5" color={colors.greenAccent[500]}>
                                    <Receipt sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Branch Accounts
                                </Typography>
                                <Typography variant="body2" color={colors.grey[400]} mt={1}>
                                    Showing accounts for this branch
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
                                            '& fieldset': { borderColor: colors.grey[400] },
                                            '&:hover fieldset': { borderColor: colors.grey[300] },
                                        },
                                        '& .MuiInputLabel-root': { color: colors.grey[400] },
                                        '& input': { color: colors.grey[100] },
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
                                            '& fieldset': { borderColor: colors.grey[400] },
                                            '&:hover fieldset': { borderColor: colors.grey[300] },
                                        },
                                        '& .MuiInputLabel-root': { color: colors.grey[400] },
                                        '& input': { color: colors.grey[100] },
                                    }}
                                />
                                <LoadingButton
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleFetchData}
                                    loading={loading}
                                    loadingPosition="start"
                                    startIcon={<Search />}
                                >
                                    Fetch Data
                                </LoadingButton>
                                <Tooltip title="Refresh current page">
                                    <IconButton onClick={handleRefresh} sx={{ color: colors.grey[300] }}>
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
                        "& .MuiDataGrid-root": { border: "none" },
                        "& .MuiDataGrid-cell": { borderBottom: "none" },
                        "& .name-column--cell": { color: colors.greenAccent[300] },
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
                        rows={accountsData}
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
    );
};

export default ViewBranchesDetails;