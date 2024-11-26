import { Box, Button, CardContent, Tooltip, TextField, Chip, IconButton, Typography, Grid, Card, Avatar, useTheme, Tab, Tabs, Dialog, DialogTitle, DialogContent, useMediaQuery, Snackbar, FormControl, InputLabel, Select, MenuItem, Alert, Stack } from "@mui/material";
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
    AttachMoney,
    Lock
} from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CBS_Services from "../../services/api/GAV_Sercives";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { formatValue } from "../../tools/formatValue";
import { Formik } from "formik";
import { FormFieldStyles } from "../../tools/fieldValuestyle";
import * as yup from "yup";


const ViewClientDetails = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const userData = useSelector((state) => state.users);
    const token = userData.token;
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const spaceId = userData?.selectedSpace?.id
    const { msisdn } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [showModal, setShowModal] = useState(false);
    const [initialValues, setInitialValues] = useState({});
    const [transactionData, setTransactionData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [bankID, setBankID] = useState('');

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

    const [resetClientPinFormData, setresetClientPinFormData] = useState({
        bankCode: "",
        msisdn: msisdn,
        pin: "",
        internalId: "back-office"

    })

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    // Similar fetchTransactions function as in your template
    const fetchTransactions = async (page, pageSize) => {
        setLoading(true);
        try {
            const payload = {
                serviceReference: 'GET_TRANSACTION_BY_ACCOUNT_NUMBER',
                requestBody: msisdn,
                spaceId: spaceId,
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



    useEffect(() => {
        fetchTransactions(currentPage, pageSize);
        fetchBankID();
    }, [msisdn]);

    useEffect(() => {
        if (msisdn && location.state && location.state.branchData) {
            setInitialValues(location.state.branchData);
        }
    }, [msisdn, location.state]);

    const handleToggleModal = () => {
        setShowModal(!showModal);
    }

    const handleResetClientPin = async (values) => {
        setLoading(true);
        try {
            const payload = {
                serviceReference: 'RESET_CLIENT_PIN',
                requestBody: JSON.stringify(values),
                spaceId: spaceId,

            }
            console.log("values", values);

            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            console.log("response", response);

            if (response && response.body.meta.statusCode === 200) {
                handleToggleModal();
                showSnackbar('Client PIN reset successfully.', 'success');
            } else if (response && response.body.meta.statusCode === 401) {
                showSnackbar(response.body.errors || 'Unauthorized to perform action', 'error');
            } else {
                showSnackbar(response.body.errors || 'An error occurred while resetting client PIN', 'error');
            }
        } catch (error) {
            showSnackbar('An error occurred while resetting client PIN', 'error');

        }
        setLoading(false);
    }

    const fetchBankID = async () => {
        setLoading(true);
        try {
            const payload = {
                serviceReference: 'GET_ALL_BANKS',
                requestBody: '',
                spaceId: spaceId,
            }
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            if (response && response.status === 200) {
                setBankID(response.body.data);

            } else if (response && response.body.status === 401) {
                // setErrorMessage(response.body.errors || 'Unauthorized to perform action');
            }
            else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false)
    };



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
                <Box display="flex">

                    <Button
                        sx={{
                            backgroundColor: colors.blueAccent[700],
                            color: colors.grey[100],
                            fontSize: "14px",
                            fontWeight: "bold",
                            padding: "10px 20px",
                            marginRight: "10px",
                        }}
                        onClick={handleToggleModal}
                    >
                        <Lock sx={{ mr: "10px" }} />
                        Reset Client Pin
                    </Button>
                    <Button
                        onClick={() => navigate(-1)}
                        startIcon={<ArrowBack />}
                        sx={{
                            backgroundColor: colors.blueAccent[700],
                            color: colors.grey[100],
                            fontSize: "14px",
                            fontWeight: "bold",
                            padding: "10px 20px",
                            marginRight: "10px",
                        }}
                    >
                        Back
                    </Button>


                </Box>

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

                            {!initialValues.active &&
                                <Chip
                                    label={initialValues.active ? "Active Client" : "Inactive Client"}
                                    color={initialValues.active ? "success" : "error"}
                                    sx={{ mt: 1 }}
                                />}
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
                                    <InfoItem icon={<AttachMoney />} label="Initial Balance" value={formatValue(initialValues.initialBalance)} />
                                    <InfoItem icon={<Language />} label="Language" value={formatValue(initialValues.language)} />
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
                            <InfoItem icon={<CalendarToday />} label="Date of Birth" value={formatValue(initialValues.dateOfBirth)} />
                            <InfoItem icon={<LocationOn />} label="Place of Birth" value={initialValues.placeOfBirth} />
                            <InfoItem icon={<Work />} label="Occupation" value={initialValues.occupation} />
                            <InfoItem icon={<Person />} label="Father's Name" value={initialValues.fatherName} />
                            <InfoItem icon={<Person />} label="Mother's Name" value={initialValues.motherName} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <InfoItem icon={<LocationOn />} label="Address" value={initialValues.address} />
                            <InfoItem icon={<LocationOn />} label="Region" value={initialValues.region} />
                            <InfoItem icon={<Assignment />} label="CNI Number" value={initialValues.cniNumber} />
                            <InfoItem icon={<CalendarToday />} label="CNI Creation Date" value={formatValue(initialValues.cniCreationDate)} />
                            <InfoItem icon={<CalendarToday />} label="CNI Expiration Date" value={formatValue(initialValues.cniExpirationDate)} />
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
                            <InfoItem icon={<CalendarToday />} label="Creation Date" value={formatValue(initialValues.creationDate)} />
                            <InfoItem icon={<AttachMoney />} label="Minimum Account Limit" value={formatValue(initialValues.minimumAccountLimit)} />
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

            <Dialog open={showModal} onClose={() => handleToggleModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Reset Client PIN ({`${msisdn}`})</DialogTitle>
                <DialogContent>
                    <Formik
                        onSubmit={handleResetClientPin}
                        initialValues={resetClientPinFormData}
                        enableReinitialize={true}
                        validationSchema={checkoutSchema}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleBlur,
                            handleChange,
                            handleSubmit,

                        }) => (
                            <form onSubmit={handleSubmit}>
                                <Box
                                    display="grid"
                                    gap="30px"
                                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                    sx={{
                                        "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                                    }}
                                >

                                    {/* <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Msisdn (Begin with 237)"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.msisdn}
                                        name="msisdn"
                                        error={!!touched.msisdn && !!errors.msisdn}
                                        helperText={touched.msisdn && errors.msisdn}
                                        sx={FormFieldStyles("span 4")}
                                        required
                                    /> */}

                                    <FormControl fullWidth variant="filled"
                                        sx={FormFieldStyles("span 4")} required>
                                        <InputLabel>Bank</InputLabel>
                                        <Select
                                            label="Bank"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.bankCode}
                                            name="bankCode"
                                            error={!!touched.bankCode && !!errors.bankCode}
                                        >
                                            <MenuItem value="" selected disabled>Select Bank</MenuItem>
                                            {Array.isArray(bankID) && bankID.length > 0 ? (
                                                bankID.map((option) => (
                                                    <MenuItem key={option.bankCode} value={option.bankCode}>
                                                        {option.bankName}
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <option value="">No Bank available</option>
                                            )}
                                        </Select>
                                        {touched.bankCode && errors.bankCode && (
                                            <Alert severity="error">{errors.bankCode}</Alert>
                                        )}

                                    </FormControl>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="number"
                                        label="Pin (5 digits)"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.pin}
                                        name="pin"
                                        error={!!touched.pin && !!errors.pin}
                                        helperText={touched.pin && errors.pin}
                                        sx={FormFieldStyles("span 4")}
                                        required

                                    />

                                </Box>
                                <Box display="flex" justifyContent="end" mt="20px">
                                    <Stack direction="row" spacing={2}>
                                        <Button color="primary" variant="contained" disabled={loading} onClick={handleToggleModal}>
                                            Cancel
                                        </Button>

                                        <LoadingButton type="submit" color="secondary" variant="contained" loading={loading} loadingPosition="start"
                                            startIcon={<Lock />} >
                                            Reset
                                        </LoadingButton>


                                    </Stack>
                                </Box>
                            </form>

                        )}

                    </Formik>
                </DialogContent>

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

const checkoutSchema = yup.object().shape({
    msisdn: yup
        .string()
        .matches(/^\d{12}$/, "MSISDN must be exactly 12 digits")
        .required("Required"),
    bankCode: yup.string().required("Required"),
    pin: yup.number().required("Required"),
});

export default ViewClientDetails;