import { Box, Button, Checkbox, FormControlLabel, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import { mockDataTeam } from "../../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../../components/Header";
import { useEffect, useState } from "react";
import CBS_Services from "../../../services/api/GAV_Sercives";
import { useSelector } from "react-redux";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Alert, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Add, Delete, EditOutlined, PlusOneOutlined } from "@mui/icons-material";






const Corporation = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [formData, setFormData] = useState({
        corporationId: '',
        name: '',
        email: '',
        contact: '',
        address: '',
        cbsCorporationId: '',
        country: '',
        corporationAccountThreshold: 0,
        corporationName: '',

    });

    const [pending_account, setpending_account] = useState({
        bankId: '',
        sourceCorpIdOrBankIdOrBranchId: '',
        corporationId: '',
        branchId: '',
        sourceCorpOrBankOrBranchName: '',
        externalCorpOrBankOrBranchName: '',
        externalCorpIdOrBankIdOrBranchId: '',
        cbsAccountNumber: '',
    });
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [bankData, setBankData] = useState();
    const [corporationData, setCorporationData] = useState();
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedCorporation, setSelectedCorporation] = useState(null);
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [corpID, setCorpID] = useState('');
    const [bankID, setBankID] = useState('');
    const [branchID, setBranchID] = useState('');
    const [showPendAccModal, setShowPendAccModal] = useState(false);
    const [selectedoption, setselectedoption] = useState('');
    const [pending, setPending] = useState(true);
    const userData = useSelector((state) => state.users)

    const token = userData.token

    const filteredCorporation = corporationData ? corporationData.filter((corporation) =>
        Object.values(corporation).some((field) =>
            typeof field === 'string' &&
            field.toLowerCase().includes(searchTerm.toLowerCase())
        )
    ) : [];

    const fetchCorporationData = async () => {
        setPending(true)
        try {
            const payload = {
                serviceReference: 'GET_ALL_CORPORATIONS',
                requestBody: ''
            }
            // const response = await CBS_Services('AP', 'api/gav/corporation/management/getAll', 'GET', null);
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            console.log("response", response);

            if (response && response.body.meta.statusCode === 200) {
                setCorporationData(response.body.data);
                setCorpID(response.body.data);

            } else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setPending(false)
    };

    const fetchBranchID = async () => {
        try {

            const payload = {
                serviceReference: 'GET_ALL_BRANCHES',
                requestBody: ''
            }
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

            // const response = await CBS_Services('AP', `api/gav/bankBranch/getAll`, 'GET', null);

            if (response && response.body.meta.statusCode === 200) {
                setBranchID(response.body.data);

            } else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchCorporationData();
        fetchBranchID()
    }, [])

    const handleConfirmAddPendingAccount = async () => {

        setLoading(true);
        try {
            const payload = {
                serviceReference: 'ADD_PENDING_ACCOUNT',
                requestBody: JSON.stringify(pending_account)
            }

            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            console.log("addresponse", response);

            if (response && response.body.meta.statusCode === 200) {
                hidePendAccBank();
                await fetchCorporationData();
                setSuccessMessage('Pending Account created successfully.');
                setErrorMessage('');
            } else {
                setSuccessMessage('');
                setErrorMessage(response.body.errors || 'Unauthorized to perform action');
            }
        } catch (error) {
            console.error('Error:', error);
            setSuccessMessage('Pending Account Created Successfully');
            setErrorMessage('Error adding Pending Account');
        }
        setLoading(false);
    };

    const handleConfirmEdit = async () => {
        setLoading(true);

        try {
            const payload = {
                serviceReference: 'UPDATE_CORPORATION',
                requestBody: JSON.stringify(formData)
            }

            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            console.log("editresp", response);
            console.log("editformresp", formData);


            if (response && response.body.meta.statusCode === 200) {
                hideEditCorporation();
                await fetchCorporationData();
                setSuccessMessage('Corporation updated successfully.');
                setErrorMessage('');
                setFormData({
                    corporationId: '',
                    name: '',
                    email: '',
                    contact: '',
                    address: '',
                    cbsCorporationId: '',
                    country: '',
                    corporationAccountThreshold: 0,
                    corporationName: '',


                });
            } else {
                setSuccessMessage('');
                setErrorMessage(response.body.errors);
            }
        } catch (error) {
            console.error('Error:', error);
            setSuccessMessage('Branch Updated Successfully');
            setErrorMessage('Error updating branch');
        }

        setLoading(false);
    };

    const handleConfirmAdd = async () => {
        // Check if the form is valid
        // if (!document.querySelector('form').checkValidity()) {
        //   setErrorMessage('Please fill in the right details');
        //   return;
        // }
        setLoading(true)
        try {

            const payload = {
                serviceReference: 'CREATE_CORPORATION',
                requestBody: JSON.stringify(formData)
            }
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            console.log("addresponse", response);

            if (response && response.body.meta.statusCode === 200) {
                hideAddCorporation();
                await fetchCorporationData();
                setSuccessMessage('Corporation created successfully.');
                setErrorMessage('');
            } else {
                setSuccessMessage('');
                setErrorMessage(response.body.errors || 'Unauthorized to perform action');
            }
        } catch (error) {
            console.error('Error:', error);
            setSuccessMessage('Corporation Created Successfully');
            setErrorMessage('Error adding corporation');
        }
        setLoading(false)
    };

    const handleCorpChange = (e) => {
        const { value } = e.target;
        const selectedCorp = corporationData.find(c => c.corporationId === value);
        setpending_account(prevState => ({
            ...prevState,
            corporationId: value,
            sourceCorpOrBankOrBranchName: selectedCorp ? selectedCorp.corporationName : "",
            sourceCorpIdOrBankIdOrBranchId: selectedCorp ? selectedCorp.corporationId : ""
        }));
    };
    const handleLevelChange = (e) => {
        setselectedoption(e.target.value);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handlePendAccChange = (e) => {
        const { name, value } = e.target;
        setpending_account({
            ...pending_account,
            [name]: value,
        });
    };


    const handleEdit = (corp) => {
        setSelectedCorporation(corp);
        setFormData({
            corporationId: corp.corporationId,
            name: corp.corporationName,
            email: corp.email,
            contact: corp.contact,
            address: corp.address,
            cbsCorporationId: corp.cbsCorporationId,
            country: corp.country,
            corporationAccountThreshold: corp.corporationAccountThreshold,
            corporationName: corp.corporationName,

        });
        setShowEditModal(true);
    };

    const handleToggleCorpModal = () => {
        setShowModal(!showModal);
    };

    const hideAddCorporation = () => {
        setShowModal(false);
        setSuccessMessage('');
        setErrorMessage('');
    };

    const handleToggleEditCorpModal = () => {
        setShowEditModal(!showEditModal);
        setFormData({
            corporationId: '',
            name: '',
            email: '',
            contact: '',
            address: '',
            cbsCorporationId: '',
            country: '',
            corporationAccountThreshold: 0,
            corporationName: '',

        });
    }
    const handleTogglePendingAccBankModal = () => {
        setShowPendAccModal(!showPendAccModal);
        setpending_account({
            bankId: '',
            sourceCorpIdOrBankIdOrBranchId: '',
            corporationId: '',
            branchId: '',
            sourceCorpOrBankOrBranchName: '',
            externalCorpOrBankOrBranchName: '',
            externalCorpIdOrBankIdOrBranchId: '',
            cbsAccountNumber: '',
        })
    };

    const hideEditCorporation = () => {
        setShowEditModal(false);
        setSuccessMessage('');
        setErrorMessage('');
    }

    const hidePendAccBank = () => {
        setShowPendAccModal(false);
        setSuccessMessage('');
        setErrorMessage('');
    };

    const columns = [
        { field: "corporationId", headerName: "Corporation ID", flex: 1 },
        { field: "corporationName", headerName: "Corporation Name", flex: 1 },
        { field: "contact", headerName: "Contact", flex: 1 },
        { field: "email", headerName: "Email", flex: 1 },
        { field: "address", headerName: "Address", flex: 1 },
        { field: "country", headerName: "Country", flex: 1 },
        {
            field: "activationDateTime",
            headerName: "Activation Date",
            flex: 1,
            type: "date",
            valueGetter: (params) => new Date(params.value),
        },

        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => {
                const corp = params.row; // Access the current row's data
                return (
                    <>
                        <Box
                            width="30%"
                            m="0 4px"
                            p="5px"
                            display="flex"
                            justifyContent="center"
                            backgroundColor={colors.greenAccent[600]}
                            borderRadius="4px"
                            onClick={() => handleEdit(corp)}
                        >
                            <EditOutlined />
                        </Box>
                        <Box
                            width="30%"
                            m="0"
                            p="5px"
                            display="flex"
                            justifyContent="center"
                            backgroundColor={colors.redAccent[600]}
                            borderRadius="4px"
                        >
                            <Delete />
                        </Box>
                    </>
                );
            },
        },

    ];

    useEffect(() => {
        const timeout = setTimeout(() => {
            // setRows(columns);
            setPending(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }, []);


    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Corporations" subtitle="Manage your corporations" />

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
                        onClick={handleToggleCorpModal}
                    >
                        <Add sx={{ mr: "10px" }} />
                        Add Corporation
                    </Button>
                    <Button
                        sx={{
                            backgroundColor: colors.blueAccent[700],
                            color: colors.grey[100],
                            fontSize: "14px",
                            fontWeight: "bold",
                            padding: "10px 20px",
                        }}
                        onClick={handleTogglePendingAccBankModal}
                    >
                        <Add sx={{ mr: "10px" }} />
                        Add Pending Account
                    </Button>
                </Box>
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
                <DataGrid checkboxSelection rows={filteredCorporation} columns={columns} components={{ Toolbar: GridToolbar }} loading={loading}
                />
            </Box>

            <>
                {/* Add Corporation Modal */}
                <Dialog open={showModal} onClose={handleToggleCorpModal} maxWidth="lg" fullWidth>
                    <DialogTitle>Add Corporation</DialogTitle>
                    <DialogContent>
                        {successMessage && <Alert severity="success" onClose={() => { }}>{successMessage}</Alert>}
                        {errorMessage && <Alert severity="error" onClose={() => { }}>{errorMessage}</Alert>}

                        <Box component="form" sx={{ mt: 3 }} noValidate>
                            <TextField
                                fullWidth
                                label="Corporation Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Corporation ID"
                                name="cbsCorporationId"
                                value={formData.cbsCorporationId}
                                onChange={handleChange}
                                required
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Phone Number"
                                name="contact"
                                value={formData.contact}
                                onChange={handleChange}
                                required
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Account Threshold"
                                name="corporationAccountThreshold"
                                value={formData.corporationAccountThreshold}
                                onChange={handleChange}
                                required
                                margin="normal"
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.hasCbsAccount}
                                        onChange={(e) => setFormData({ ...formData, hasCbsAccount: e.target.checked })}
                                        name="hasCbsAccount" />
                                }
                                label="Has CBS Account"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.otherCbs}
                                        onChange={(e) => setFormData({ ...formData, otherCbs: e.target.checked })}
                                        name="otherCbs" />
                                }
                                label="Other CBS Account"
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleConfirmAdd} variant="contained" color="primary" disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : "Add"}
                        </Button>
                        <Button onClick={hideAddCorporation} variant="outlined" color="secondary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Edit Corporation Modal */}
                <Dialog open={showEditModal} onClose={handleToggleEditCorpModal} maxWidth="lg" fullWidth>
                    <DialogTitle>Edit Corporation</DialogTitle>
                    <DialogContent>
                        {successMessage && <Alert severity="success" onClose={() => { }}>{successMessage}</Alert>}
                        {errorMessage && <Alert severity="error" onClose={() => { }}>{errorMessage}</Alert>}

                        <Box component="form" sx={{ mt: 3 }} noValidate>
                            <TextField
                                fullWidth
                                label="Corporation Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Corporation ID"
                                name="cbsCorporationId"
                                value={formData.cbsCorporationId}
                                onChange={handleChange}
                                required
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Phone Number"
                                name="contact"
                                value={formData.contact}
                                onChange={handleChange}
                                required
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                required
                                margin="normal"
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.hasCbsAccount}
                                        onChange={(e) => setFormData({ ...formData, hasCbsAccount: e.target.checked })}
                                        name="hasCbsAccount" />
                                }
                                label="Has CBS Account"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.otherCbs}
                                        onChange={(e) => setFormData({ ...formData, otherCbs: e.target.checked })}
                                        name="otherCbs" />
                                }
                                label="Other CBS Account"
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleConfirmEdit} variant="contained" color="primary" disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : "Update"}
                        </Button>
                        <Button onClick={hideEditCorporation} variant="outlined" color="secondary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Add Pending Bank Account Modal */}
                <Dialog open={showPendAccModal} onClose={handleTogglePendingAccBankModal} maxWidth="lg" fullWidth>
                    <DialogTitle>Add Pending Account(Bank)</DialogTitle>
                    <DialogContent>
                        {successMessage && <Alert severity="success" onClose={() => { }}>{successMessage}</Alert>}
                        {errorMessage && <Alert severity="error" onClose={() => { }}>{errorMessage}</Alert>}

                        <Box component="form" sx={{ mt: 3 }} noValidate>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="corporationId-label">Corporation ID</InputLabel>
                                <Select
                                    labelId="corporationId-label"
                                    id="corporationId"
                                    name="corporationId"
                                    value={pending_account.corporationId}
                                    onChange={handleCorpChange}
                                >
                                    <MenuItem value="">Select Corporation</MenuItem>
                                    {Array.isArray(corpID) && corpID.length > 0
                                        ? corpID.map((option) => (
                                            <MenuItem key={option.corporationId} value={option.corporationId}>
                                                {option.corporationName}
                                            </MenuItem>
                                        ))
                                        : <MenuItem value="">No Credit Unions available</MenuItem>}
                                </Select>
                            </FormControl>
                            <TextField
                                fullWidth
                                label="SourceID"
                                name="sourceCorpIdOrBankIdOrBranchId"
                                value={pending_account.sourceCorpIdOrBankIdOrBranchId}
                                onChange={handlePendAccChange}
                                required
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Source Name"
                                name="sourceCorpOrBankOrBranchName"
                                value={pending_account.sourceCorpOrBankOrBranchName}
                                onChange={handlePendAccChange}
                                required
                                margin="normal"
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="level-label">Level</InputLabel>
                                <Select
                                    labelId="level-label"
                                    id="selectedoption"
                                    value={selectedoption}
                                    onChange={handleLevelChange}
                                >
                                    <MenuItem value="" disabled>Select Level</MenuItem>
                                    <MenuItem value="Corporation">Corporation</MenuItem>
                                    <MenuItem value="Bank">Credit Union</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth margin="normal">
                                <InputLabel id="externalCorpIdOrBankIdOrBranchId-label">
                                    External Account <span className="h7 text-danger">(Please select level first)*</span>
                                </InputLabel>

                                {selectedoption === "" && (
                                    <MenuItem value="" disabled>
                                        Select External Account Id
                                    </MenuItem>
                                )}
                                {selectedoption === "Corporation" && (
                                    <>

                                        <Select
                                            labelId="corporationId-label"
                                            id="externalCorpIdOrBankIdOrBranchId"
                                            name="externalCorpIdOrBankIdOrBranchId"
                                            value={pending_account.externalCorpIdOrBankIdOrBranchId}
                                            onChange={handlePendAccChange}
                                        >
                                            <MenuItem value="">Select Corporation</MenuItem>
                                            {Array.isArray(corpID) && corpID.length > 0 ? (
                                                corpID.map((option) => (
                                                    <MenuItem key={option.corporationId} value={option.corporationId}>
                                                        {option.corporationName}
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <MenuItem value="">No Banks available</MenuItem>
                                            )}
                                        </Select>
                                    </>
                                )}
                                {selectedoption === "Bank" && (
                                    <>
                                        <Select
                                            labelId="externalCorpIdOrBankIdOrBranchId"
                                            id="externalCorpIdOrBankIdOrBranchId"
                                            name="externalCorpIdOrBankIdOrBranchId"
                                            value={pending_account.externalCorpIdOrBankIdOrBranchId}
                                            onChange={handlePendAccChange}
                                        >
                                            <MenuItem value="">Select  Credit Union</MenuItem>
                                            {Array.isArray(bankID) && bankID.length > 0 ? (
                                                bankID.map((option) => (
                                                    <option key={option.bankId} value={option.bankId}>
                                                        {option.bankName}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="">No Banks available</option>
                                            )}
                                        </Select>
                                    </>
                                )}

                            </FormControl>

                            <TextField
                                fullWidth
                                label="CBS Account Number"
                                name="cbsAccountNumber"
                                value={pending_account.cbsAccountNumber}
                                onChange={handlePendAccChange}
                                required
                                margin="normal"
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleConfirmAddPendingAccount} variant="contained" color="primary" disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : "Add"}
                        </Button>
                        <Button onClick={handleTogglePendingAccBankModal} variant="outlined" color="secondary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Edit Bank Account Modal */}
                {/* <Dialog open={showEditAccModal} onClose={handleToggleEditAccBankModal} maxWidth="lg" fullWidth>
                    <DialogTitle>Edit Bank Account</DialogTitle>
                    <DialogContent>
                        {successMessage && <Alert severity="success" onClose={() => { }}>{successMessage}</Alert>}
                        {errorMessage && <Alert severity="error" onClose={() => { }}>{errorMessage}</Alert>}

                        <Box component="form" sx={{ mt: 3 }} noValidate>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="corporationId-label">Corporation ID</InputLabel>
                                <Select
                                    labelId="corporationId-label"
                                    id="corporationId"
                                    name="corporationId"
                                    value={pending_account.corporationId}
                                    onChange={handleCorpChange}
                                >
                                    <MenuItem value="">Select Corporation</MenuItem>
                                    {Array.isArray(corpID) && corpID.length > 0
                                        ? corpID.map((option) => (
                                            <MenuItem key={option.corporationId} value={option.corporationId}>
                                                {option.corporationName}
                                            </MenuItem>
                                        ))
                                        : <MenuItem value="">No Banks available</MenuItem>}
                                </Select>
                            </FormControl>
                            <TextField
                                fullWidth
                                label="SourceID"
                                name="sourceCorpIdOrBankIdOrBranchId"
                                value={pending_account.sourceCorpIdOrBankIdOrBranchId}
                                onChange={handlePendAccChange}
                                required
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Source Name"
                                name="sourceCorpOrBankOrBranchName"
                                value={pending_account.sourceCorpOrBankOrBranchName}
                                onChange={handlePendAccChange}
                                required
                                margin="normal"
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="level-label">Level</InputLabel>
                                <Select
                                    labelId="level-label"
                                    id="selectedoption"
                                    value={selectedoption}
                                    onChange={handleLevelChange}
                                >
                                    <MenuItem value="" disabled>Select Level</MenuItem>
                                    <MenuItem value="Corporation">Corporation</MenuItem>
                                    <MenuItem value="Bank">Credit Union</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="externalCorpIdOrBankIdOrBranchId-label">
                                    External Account <span className="h7 text-danger">(Please select level first)*</span>
                                </InputLabel>
                                <Select
                                    labelId="externalCorpIdOrBankIdOrBranchId-label"
                                    id="externalCorpIdOrBankIdOrBranchId"
                                    name="externalCorpIdOrBankIdOrBranchId"
                                    value={pending_account.externalCorpIdOrBankIdOrBranchId}
                                    onChange={handlePendAccChange}
                                    disabled={selectedoption === ""}
                                >
                                    {selectedoption === "" && (
                                        <MenuItem value="" disabled>
                                            Select External Account Id
                                        </MenuItem>
                                    )}
                                    {selectedoption === "Corporation" && (
                                        <>
                                            <MenuItem value="">Select Corporation</MenuItem>
                                            {Array.isArray(corpID) && corpID.length > 0 ? (
                                                corpID.map((option) => (
                                                    <MenuItem key={option.corporationId} value={option.corporationId}>
                                                        {option.corporationName}
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <MenuItem value="">No Banks available</MenuItem>
                                            )}
                                        </>
                                    )}
                                    {selectedoption === "Bank" && (
                                        <>
                                            <MenuItem value="">Select Credit Union</MenuItem>
                                            {Array.isArray(bankID) && bankID.length > 0 ? (
                                                bankID.map((option) => (
                                                    <MenuItem key={option.bankId} value={option.bankId}>
                                                        {option.bankName}
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <MenuItem value="">No Banks available</MenuItem>
                                            )}
                                        </>
                                    )}
                                </Select>
                            </FormControl>

                            <TextField
                                fullWidth
                                label="CBS Account Number"
                                name="cbsAccountNumber"
                                value={pending_account.cbsAccountNumber}
                                onChange={handlePendAccChange}
                                required
                                margin="normal"
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleConfirmEditAccount} variant="contained" color="primary" disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : "Update"}
                        </Button>
                        <Button onClick={hideEditAccount} variant="outlined" color="secondary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog> */}
            </>
        </Box>
    );
};

export default Corporation;
