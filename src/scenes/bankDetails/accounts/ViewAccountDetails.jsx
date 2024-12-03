import {
  Box,
  Button,
  CardContent,
  Tooltip,
  TextField,
  Chip,
  IconButton,
  Typography,
  Grid,
  Card,
  DialogContent,
  Dialog,
  DialogActions,
  DialogTitle,
  Alert,
  Snackbar,
} from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import {
  AccountBalance,
  Receipt,
  Search,
  Refresh,
  ArrowBack,
  AccountBalanceWallet,
  Assignment,
  Business,
  CalendarToday,
  Payment,
  Lock,
  Phone,
  CreditCard,
  MoneyOff,
  MoneyRounded,
} from "@mui/icons-material";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material/styles";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../../../components/Header";
import CBS_Services from "../../../services/api/GAV_Sercives";

const ViewAccountDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const userData = useSelector((state) => state.users);
  const token = userData.token;
  const spaceId = userData?.selectedSpace?.id;
  const { accountId } = useParams();
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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const [formData, setFormData] = useState({
    accountId: "",
    amount: 0,
    investorName: userData?.userName,
  });

  const [showModal, setShowModal] = useState(false);

  const handleToggleInvestmentModal = (accountId) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      accountId: accountId,
    }));
    setShowModal(!showModal);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchTransactions = async (page, pageSize) => {
    setLoading(true);
    try {
      const payload = {
        serviceReference: "GET_TRANSACTION_BY_ACCOUNT_ID",
        requestBody: JSON.stringify({
          page: page,
          size: pageSize,
          corporationOrBranchOrBankId: accountId,
        }),
        spaceId: spaceId,
      };

      console.log("payload", payload);

      const response = await CBS_Services(
        "GATEWAY",
        "gavClientApiService/request",
        "POST",
        payload,
        token
      );

      console.log("response", response);

      if (response && response.status === 200) {
        setTransactionData(response.body.data || []);
        setRowCount(response.body.data.length || 0);
      } else {
        console.error("Error fetching transactions");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAdd = async () => {
    setLoading(true);
    try {
      const payload = {
        serviceReference: "CREATE_INVESTMENT",
        requestBody: JSON.stringify(formData),
        spaceId: spaceId,
      };
      const response = await CBS_Services(
        "GATEWAY",
        "gavClientApiService/request",
        "POST",
        payload,
        token
      );

      if (response && response.status === 200) {
        setShowModal(false);

        showSnackbar("Investment created successfully.", "success");
      } else {
        showSnackbar(
          response.body.errors || "Error adding investment",
          "error"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      showSnackbar("Network Error!!! Try again Later", "error");
    }
    setLoading(false);
  };

  const handleFetchData = () => {
    const newPage = parseInt(pageInput);
    const newSize = parseInt(sizeInput);

    if (isNaN(newPage) || isNaN(newSize) || newPage < 1 || newSize < 1) {
      return;
    }

    setCurrentPage(newPage);
    setPageSize(newSize);
    fetchTransactions(newPage, newSize);
  };

  const handleRefresh = () => {
    fetchTransactions(currentPage, pageSize);
  };

  useEffect(() => {
    fetchTransactions(currentPage, pageSize);
  }, [accountId]);

  useEffect(() => {
    if (accountId && location.state && location.state.accountData) {
      setInitialValues(location.state.accountData);
    }
  }, [accountId, location.state]);

  console.log("initialValues", initialValues);

  const InfoItem = ({ icon, label, value, tooltip }) => (
    <Box display="flex" alignItems="center" mb={2}>
      <Tooltip title={tooltip || label}>
        <IconButton sx={{ color: colors.greenAccent[500], mr: 2 }}>
          {icon}
        </IconButton>
      </Tooltip>
      <Box>
        <Typography variant="subtitle2" color={colors.grey[400]}>
          {label}
        </Typography>
        <Typography variant="body1" color={colors.grey[100]}>
          {value === null
            ? "N/A"
            : value === true
            ? "Yes"
            : value === false
            ? "No"
            : value}
        </Typography>
      </Box>
    </Box>
  );

  const statusBadgeStyles = {
    PENDING: { backgroundColor: "orange", color: "white" },
    SUCCESSFUL: { backgroundColor: "green", color: "white" },
    FAILED: { backgroundColor: "red", color: "white" },
  };

  const columns = [
    {
      field: "dateTime",
      headerName: "Date & Time",
      flex: 1,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => formatValue(params.value),
    },

    {
      field: "fromAccount",
      headerName: "From Account",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderHeader: () => (
        <span style={{ fontWeight: "bold" }}>From Account</span>
      ),
    },
    {
      field: "toAccount",
      headerName: "To Account",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderHeader: () => (
        <span style={{ fontWeight: "bold" }}>To Account</span>
      ),
    },

    {
      field: "direction",
      headerName: "Direction",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderHeader: () => (
        <span style={{ fontWeight: "bold" }}>Transaction Type</span>
      ),
      valueGetter: (params) => formatValue(params.value),
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderHeader: () => <span style={{ fontWeight: "bold" }}>Amount</span>,
      valueGetter: (params) => formatValue(params.value),
    },

    {
      field: "service",
      headerName: "Service",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderHeader: () => <span style={{ fontWeight: "bold" }}>Service</span>,
      valueGetter: (params) => formatValue(params.value),
    },

    {
      field: "status",
      headerName: "Status",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderHeader: () => <span style={{ fontWeight: "bold" }}>Status</span>,
      renderCell: (params) => (
        <div
          style={{
            padding: "5px 10px",
            borderRadius: "12px",
            backgroundColor: statusBadgeStyles[params.value]?.backgroundColor,
            color: statusBadgeStyles[params.value]?.color,
            textAlign: "center",
          }}
        >
          {params.value}
        </div>
      ),
    },
  ];

  if (!initialValues) return null;

  const toPascalCase = (str) => {
    return str
      .split(" ") // Split string by spaces
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter and lowercase the rest
      .join(" "); // Join back the words
  };

  const formatValue = (value) => {
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    if (value === null || value === undefined) {
      return "N/A";
    }
    if (typeof value === "number") {
      return value.toLocaleString(); // Format numbers with commas
    }
    if (typeof value === "string") {
      // Check if it's an ISO 8601 date string and convert it to Date object
      if (isISODateString(value)) {
        const dateObj = new Date(value);
        return `${dateObj.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })} ${dateObj.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}`;
      }
      // For non-date strings, format to Pascal Case and replace underscores with spaces
      return toPascalCase(value.replace(/_/g, " "));
    }
    if (value instanceof Date) {
      return `${value.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })} ${value.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })}`;
    }
    return value.toString();
  };

  // Helper function to check if the string is in ISO 8601 format
  const isISODateString = (str) => {
    return /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d+/.test(str);
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="ACCOUNT DETAILS"
          subtitle={`Viewing details for ${initialValues.name}`}
        />
        <Box>
          {initialValues.type === "CLIENT" ? (
            ""
          ) : (
            <Button
              sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
                marginRight: "10px",
              }}
              onClick={() =>
                handleToggleInvestmentModal(initialValues.accountId)
              }
            >
              <MoneyRounded sx={{ mr: "10px" }} />
              Invest
            </Button>
          )}

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
          <Card sx={{ backgroundColor: colors.primary[400], height: "100%" }}>
            <CardContent>
              <Typography variant="h5" mb={3} color={colors.greenAccent[500]}>
                Basic Information
              </Typography>
              <InfoItem
                icon={<Assignment />}
                label="Account Name"
                value={initialValues.name}
              />
              <InfoItem
                icon={<AccountBalance />}
                label="Account ID"
                value={initialValues.accountId}
              />
              <InfoItem
                icon={<Business />}
                label="Bank Code"
                value={formatValue(initialValues.bankCode)}
              />
              <InfoItem
                icon={<Business />}
                label="Bank ID"
                value={initialValues.bankId}
              />
              <InfoItem
                icon={<CreditCard />}
                label="CBS Account Number"
                value={initialValues.cbsAccountNumber}
              />
              <InfoItem
                icon={<Business />}
                label="Corporation ID"
                value={initialValues.corporationId}
              />
              <Box mt={2}>
                <Typography variant="subtitle2" color={colors.grey[400]} mb={1}>
                  Account Status
                </Typography>
                <Box display="flex" gap={2}>
                  <Chip
                    label={initialValues.active ? "Active" : "Inactive"}
                    sx={{
                      backgroundColor: initialValues.active
                        ? colors.greenAccent[500]
                        : colors.redAccent[500],
                      color: "white",
                    }}
                  />
                  <Chip
                    label={initialValues.blocked ? "Blocked" : "Not Blocked"}
                    sx={{
                      backgroundColor: initialValues.blocked
                        ? colors.redAccent[500]
                        : colors.greenAccent[500],
                      color: "white",
                    }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Balance Information */}
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: colors.primary[400], height: "100%" }}>
            <CardContent>
              <Typography variant="h5" mb={3} color={colors.greenAccent[500]}>
                Balance Information
              </Typography>
              <InfoItem
                icon={<AccountBalanceWallet />}
                label="Current Balance"
                value={formatValue(initialValues.balance)}
              />
              <InfoItem
                icon={<Payment />}
                label="Total Amount with Interest"
                value={formatValue(initialValues.totalAmountWithInterest)}
              />
              <InfoItem
                icon={<Payment />}
                label="Total Capital Invested"
                value={formatValue(initialValues.totalCapitalInvested)}
              />
              <InfoItem
                icon={<Payment />}
                label="Total Credit Balance"
                value={formatValue(initialValues.totalCreditBalance)}
              />
              <InfoItem
                icon={<MoneyOff />}
                label="Total Debit Balance"
                value={formatValue(initialValues.totalDebitBalance)}
              />
              <InfoItem
                icon={<Payment />}
                label="Total Interest"
                value={formatValue(initialValues.totalInterest)}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Account Limits */}
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: colors.primary[400], height: "100%" }}>
            <CardContent>
              <Typography variant="h5" mb={3} color={colors.greenAccent[500]}>
                Account Limits & Additional Details
              </Typography>
              <InfoItem
                icon={<Lock />}
                label="Maximum Bound"
                value={formatValue(initialValues.maximumBound)}
              />
              <InfoItem
                icon={<Lock />}
                label="Minimum Bound"
                value={formatValue(initialValues.minimumBound)}
              />
              <InfoItem
                icon={<Phone />}
                label="MSISDN"
                value={initialValues.msisdn}
              />
              <InfoItem
                icon={<Assignment />}
                label="Type"
                value={formatValue(initialValues.type)}
              />
              <InfoItem
                icon={<Assignment />}
                label="RIB Key"
                value={initialValues.ribKey}
              />
              <InfoItem
                icon={<Assignment />}
                label="IBAN"
                value={initialValues.iban}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Dates Information */}
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: colors.primary[400], height: "100%" }}>
            <CardContent>
              <Typography variant="h5" mb={3} color={colors.greenAccent[500]}>
                Dates & System Information
              </Typography>
              <InfoItem
                icon={<CalendarToday />}
                label="Creation Date"
                value={formatValue(initialValues.creationDateTime)}
              />
              <InfoItem
                icon={<CalendarToday />}
                label="Last Investment Date"
                value={formatValue(initialValues.lastInvestmentDate)}
              />
              <InfoItem
                icon={<CalendarToday />}
                label="Last Modification Date"
                value={formatValue(initialValues.lastModificationDate)}
              />
              <InfoItem
                icon={<Business />}
                label="Branch ID"
                value={initialValues.branchId}
              />
              <InfoItem
                icon={<Assignment />}
                label="CBS Bank Code"
                value={initialValues.cbsBankCode}
              />
              <InfoItem
                icon={<Assignment />}
                label="CBS Branch Code"
                value={initialValues.cbsBranchCode}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Transactions Section */}
      <Box mt={6}>
        <Card sx={{ backgroundColor: colors.primary[400], mb: 3 }}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Box>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  <Receipt sx={{ mr: 1, verticalAlign: "middle" }} />
                  {`${initialValues.name} Account Transactions `}
                </Typography>
                <Typography variant="body2" color={colors.grey[400]} mt={1}>
                  Showing transactions for this teller
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Typography variant="body2" color={colors.grey[400]} mr={2}>
                  Total Records: {rowCount}
                </Typography>
              </Box>
            </Box>

            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <TextField
                  label="Page"
                  variant="outlined"
                  size="small"
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  sx={{
                    width: "80px",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: colors.grey[400] },
                      "&:hover fieldset": { borderColor: colors.grey[300] },
                    },
                    "& .MuiInputLabel-root": { color: colors.grey[400] },
                    "& input": { color: colors.grey[100] },
                  }}
                />
                <TextField
                  label="Size"
                  variant="outlined"
                  size="small"
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  sx={{
                    width: "80px",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: colors.grey[400] },
                      "&:hover fieldset": { borderColor: colors.grey[300] },
                    },
                    "& .MuiInputLabel-root": { color: colors.grey[400] },
                    "& input": { color: colors.grey[100] },
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
            rows={transactionData}
            columns={columns}
            loading={loading}
            components={{
              Toolbar: GridToolbar,
            }}
            disableRowSelectionOnClick
          />
        </Box>
      </Box>

      {/* Investment Modal */}
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Investment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Account ID"
            name="accountId"
            value={formData.accountId}
            disabled
            sx={{
              "& .MuiInputLabel-root": {
                color: theme.palette.mode === "light" ? "black" : "white", // Dark label for light mode, white for dark mode
              },
              "& .MuiFilledInput-root": {
                color: theme.palette.mode === "light" ? "black" : "white", // Optional: input text color
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: theme.palette.mode === "light" ? "black" : "white", // Same behavior when focused
              },
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            sx={{
              "& .MuiInputLabel-root": {
                color: theme.palette.mode === "light" ? "black" : "white", // Dark label for light mode, white for dark mode
              },
              "& .MuiFilledInput-root": {
                color: theme.palette.mode === "light" ? "black" : "white", // Optional: input text color
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: theme.palette.mode === "light" ? "black" : "white", // Same behavior when focused
              },
            }}
          />
          {/* <TextField
                        fullWidth
                        margin="normal"
                        label="Creator Name"
                        name="investorName"
                        value={formData.investorName}
                        onChange={handleChange}
                    /> */}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowModal(false)}
            color="primary"
            variant="contained"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAdd}
            color="secondary"
            disabled={loading}
            variant="contained"
          >
            {loading ? "Adding..." : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ViewAccountDetails;
