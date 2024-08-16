import { Add, Delete, EditOutlined } from '@mui/icons-material';
import { Box, Button, Checkbox, FormControl, FormControlLabel, InputLabel, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import CBS_Services from '../../../services/api/GAV_Sercives';
import { tokens } from '../../../theme';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Header from '../../../components/Header';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, CircularProgress, Alert } from '@mui/material';

const Bank = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [formData, setFormData] = useState({
        id: "",
        address: "",
        contact: "",
        categoryId: "",
        bankEmail: "",
        email: "",
        bankName: "",
        cbsBankId: "",
        bankCode: "",
        bankSignature: "",
        bankSite: "",
        corporationId: "",
        accountType: "",
        dailyLimit: 0,
        country: "",
        bankManager: "",
        region: '',
        bankId: '',
        active: false
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
    const [showPendAccModal, setShowPendAccModal] = useState(false);
    const [bankData, setBankData] = useState();
    const [bankID, setBankID] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [corpID, setCorpID] = useState('');
    const [branchID, setBranchID] = useState('');
    const [loading, setLoading] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBank, setSelectedBank] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedoption, setselectedoption] = useState('');
    const [pending, setPending] = React.useState(true);
    const userData = useSelector((state) => state.users)

    const token = userData.token

    console.log("----pending", pending_account);

    const filteredBanks = bankData ? bankData.filter((bank) =>
        Object.values(bank).some((field) =>
            typeof field === 'string' &&
            field.toLowerCase().includes(searchTerm.toLowerCase())
        )
    ) : [];


    const handleToggleBankModal = () => {
        setShowModal(!showModal);
        setFormData({
            id: "",
            address: "",
            contact: "",
            categoryId: "",
            bankEmail: "",
            email: "",
            bankName: "",
            cbsBankId: "",
            bankCode: "",
            bankSignature: "",
            bankSite: "",
            corporationId: "",
            accountType: "",
            dailyLimit: 0,
            country: "",
            bankManager: "",
            region: '',
            bankId: '',
            active: false
        })
    };
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

    const hidePendAccBank = () => {
        setShowPendAccModal(false);
        setSuccessMessage('');
        setErrorMessage('');
    };


    const hideAddBank = () => {
        setShowModal(false);
        setSuccessMessage('');
        setErrorMessage('');
    };

    const handleEdit = (bank) => {
        setSelectedBank(bank);
        setFormData({
            id: bank.id,
            bankId: bank.bankId,
            address: bank.address,
            contact: bank.contact,
            bankEmail: bank.bankEmail,
            bankName: bank.bankName,
            cbsBankId: bank.cbsBankId,
            bankCode: bank.bankCode,
            bankSignature: bank.bankSignature,
            bankSite: bank.bankSite,
            corporationId: bank.corporationId,
            accountType: bank.accountType,
            dailyLimit: bank.dailyLimit,
            country: bank.country,
            bankManager: bank.bankManager,
            active: bank.active,
            region: bank.region,
            email: bank.bankEmail,
            categoryId: bank.categoryId,


        });
        setShowEditModal(true);
    };

    const handleToggleEditBankModal = () => {
        setShowEditModal(!showEditModal);
    };
    const hideEditBank = () => {
        setShowEditModal(false);
        setSuccessMessage('');
        setErrorMessage('');
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
            [name]: value
        });

    };


    const handleBankChange = (e) => {
        const { value } = e.target;
        const selectedBank = bankData.find(b => b.bankId === value);
        setpending_account(prevState => ({
            ...prevState,
            bankId: value,
            sourceCorpOrBankOrBranchName: selectedBank ? selectedBank.bankName : "",
            sourceCorpIdOrBankIdOrBranchId: selectedBank ? selectedBank.bankId : ""
        }));
    };

    const handleLevelChange = (e) => {
        setselectedoption(e.target.value);
    };

    const handleConfirmAdd = async () => {


        setLoading(true);
        try {

            const payload = {
                serviceReference: 'ADD_BANK_ACCOUNT',
                requestBody: JSON.stringify(formData)
            }
            const response = await CBS_Services('AP', 'gavClientApiService/request', 'POST', payload, token);
            console.log("addresponse", response);

            if (response && response.body.meta.statusCode === 200) {
                hideAddBank();
                await fetchBankData();
                setSuccessMessage('Bank created successfully.');
                setErrorMessage('');
            } else {
                setSuccessMessage('');
                setErrorMessage(response.body.errors || 'Unauthorized to perform action');
            }
        } catch (error) {
            console.error('Error:', error);
            setSuccessMessage('Bank Created Successfully');
            setErrorMessage('Error adding Bank');
        }
        setLoading(false);
    };


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
                await fetchBankData();
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
                serviceReference: 'UPDATE_BANK',
                requestBody: JSON.stringify(formData)
            }
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            console.log("editresp", response);
            console.log("editformresp", formData);


            if (response && response.body.meta.statusCode === 200) {
                hideEditBank();
                await fetchBankData();
                setSuccessMessage('Bank updated successfully.');
                setErrorMessage('');
            } else {
                setSuccessMessage('');
                setErrorMessage(response.body.errors);
            }
        } catch (error) {
            console.error('Error:', error);
            setSuccessMessage('Bank Updated Successfully');
            setErrorMessage('Error updating Bank');
        }
        setLoading(false);
    };

    const fetchBankData = async () => {
        setLoading(true);
        try {

            const payload = {
                serviceReference: 'GET_ALL_BANKS',
                requestBody: ''
            }
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            // const response = await CBS_Services('AP', 'api/gav/bank/getAll', 'GET', null);
            console.log("fetchresponse", response);

            if (response && response.body.meta.statusCode === 200) {
                setBankData(response.body.data);
                setBankID(response.body.data);

            } else {
                setErrorMessage(response.body.errors || 'Error Finding Banks');
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };

    const fetchCorpID = async () => {
        try {

            const payload = {
                serviceReference: 'GET_ALL_CORPORATIONS',
                requestBody: ''
            }
            // const response = await CBS_Services('AP', 'api/gav/corporation/management/getAll', 'GET', null);
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

            if (response && response.body.meta.statusCode === 200) {
                setCorpID(response.body.data);

            } else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    const fetchBranchID = async () => {
        try {

            const payload = {
                serviceReference: 'GET_ALL_BRANCHES',
                requestBody: ''
            }
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

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
        // Fetch Bank data when the component mounts
        fetchBankData();
        fetchCorpID();
        fetchBranchID();
        setSuccessMessage('');
    }, []);



    const columns = [
        { field: "bankName", headerName: "BANK NAME", flex: 1 },
        { field: "cbsBankId", headerName: "CBS BANK ID", flex: 1 },
        { field: "address", headerName: "ADDRESS", flex: 1 },
        { field: "bankEmail", headerName: "Email", flex: 1 },
        { field: "contact", headerName: "PHONE NUMBER", flex: 1 },
        { field: "bankManger", headerName: "BANK MANAGER", flex: 1 },
        { field: "country", headerName: "COUNTRY", flex: 1 },
        {
            field: "active",
            headerName: "Status",
            flex: 1,
            renderCell: (params) => {
                const corp = params.row; // Access the current row's data
                return (
                    <>
                        {corp.active ? (
                            <span className="badge bg-success">Active</span>
                        ) : (
                            <span className="badge bg-danger">Inactive</span>
                        )}
                    </>
                );
            },
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
    return (

        <Box m="20px">

            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Banks" subtitle="Manage your Banks" />

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
                        onClick={handleToggleBankModal}
                    >
                        <Add sx={{ mr: "10px" }} />
                        Add Bank
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
                <DataGrid checkboxSelection rows={filteredBanks} columns={columns} components={{ Toolbar: GridToolbar }}
                />
            </Box>


            <>
                <Dialog open={showModal} onClose={handleToggleBankModal} fullWidth maxWidth="lg">
                    <DialogTitle>Add Bank</DialogTitle>
                    <DialogContent>
                        {successMessage && <Alert severity="success" onClose={() => { /* Close success message */ }}>
                            {successMessage}
                        </Alert>}
                        {errorMessage && <Alert severity="error" onClose={() => { /* Close error message */ }}>
                            {errorMessage}
                        </Alert>}
                        <form noValidate autoComplete="off">
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Corporation"
                                select
                                value={formData.corporationId}
                                onChange={handleChange}
                                name="corporationId"
                            >
                                <MenuItem value="">Select Corporation</MenuItem>
                                {Array.isArray(corpID) && corpID.length > 0 ? (
                                    corpID.map(option => (
                                        <MenuItem key={option.corporationId} value={option.corporationId}>
                                            {option.corporationName}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem value="">No Corporations available</MenuItem>
                                )}
                            </TextField>

                            <TextField
                                fullWidth
                                margin="normal"
                                label="Bank Name"
                                value={formData.bankName}
                                onChange={handleChange}
                                name="bankName"
                                required
                            />

                            <TextField
                                fullWidth
                                margin="normal"
                                label="Credit Union Id"
                                value={formData.cbsBankId}
                                onChange={handleChange}
                                name="cbsBankId"
                                required
                            />

                            <TextField
                                fullWidth
                                margin="normal"
                                label="Bank Manager"
                                value={formData.bankManager}
                                onChange={handleChange}
                                name="bankManager"
                                required
                            />

                            <TextField
                                fullWidth
                                margin="normal"
                                label="Daily Limit"
                                value={formData.dailyLimit}
                                onChange={handleChange}
                                name="dailyLimit"
                                required
                            />

                            <TextField
                                fullWidth
                                margin="normal"
                                label="Email"
                                value={formData.bankEmail}
                                onChange={handleChange}
                                name="bankEmail"
                                required
                            />

                            <TextField
                                fullWidth
                                margin="normal"
                                label="Phone Number"
                                value={formData.contact}
                                onChange={handleChange}
                                name="contact"
                                required
                            />

                            <TextField
                                fullWidth
                                margin="normal"
                                label="Address"
                                value={formData.address}
                                onChange={handleChange}
                                name="address"
                                required
                            />

                            <TextField
                                fullWidth
                                margin="normal"
                                label="Region"
                                select
                                value={formData.region}
                                onChange={handleChange}
                                name="region"
                            >
                                <MenuItem value="" disabled>Select Region</MenuItem>
                                <MenuItem value="ADAMAOUA">ADAMAOUA</MenuItem>
                                <MenuItem value="CENTRE">CENTRE</MenuItem>
                                <MenuItem value="ESTE">ESTE</MenuItem>
                                <MenuItem value="EXTREME-NORD">EXTREME-NORD</MenuItem>
                                <MenuItem value="LITTORAL">LITTORAL</MenuItem>
                                <MenuItem value="NORD">NORD</MenuItem>
                                <MenuItem value="NORD-OUEST">NORD-OUEST</MenuItem>
                                <MenuItem value="OUEST">OUEST</MenuItem>
                                <MenuItem value="SUD">SUD</MenuItem>
                                <MenuItem value="SUD-OUEST">SUD-OUEST</MenuItem>
                            </TextField>

                            <TextField
                                fullWidth
                                margin="normal"
                                label="Country"
                                value={formData.country}
                                onChange={handleChange}
                                name="country"
                                required
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

                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleConfirmAdd} variant="contained" color="primary">
                            {loading ? <CircularProgress size={24} /> : 'Add'}
                        </Button>
                        <Button onClick={hideAddBank} color="secondary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={showEditModal} onClose={handleToggleEditBankModal} fullWidth maxWidth="lg">
                    <DialogTitle>Edit Bank</DialogTitle>
                    <DialogContent>
                        {successMessage && <Alert severity="success" onClose={() => { /* Close success message */ }}>
                            {successMessage}
                        </Alert>}
                        {errorMessage && <Alert severity="error" onClose={() => { /* Close error message */ }}>
                            {errorMessage}
                        </Alert>}
                        <form noValidate autoComplete="off">
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Corporation"
                                select
                                value={formData.corporationId}
                                onChange={handleChange}
                                name="corporationId"
                            >
                                <MenuItem value="">Select Corporation</MenuItem>
                                {Array.isArray(corpID) && corpID.length > 0 ? (
                                    corpID.map(option => (
                                        <MenuItem key={option.corporationId} value={option.corporationId}>
                                            {option.corporationName}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem value="">No Corporations available</MenuItem>
                                )}
                            </TextField>

                            <TextField
                                fullWidth
                                margin="normal"
                                label="Bank Name"
                                value={formData.bankName}
                                onChange={handleChange}
                                name="bankName"
                                required
                            />

                            <TextField
                                fullWidth
                                margin="normal"
                                label="Bank Id"
                                value={formData.cbsBankId}
                                onChange={handleChange}
                                name="cbsBankId"
                                required
                            />

                            <TextField
                                fullWidth
                                margin="normal"
                                label="Bank Manager"
                                value={formData.bankManager}
                                onChange={handleChange}
                                name="bankManager"
                                required
                            />

                            <TextField
                                fullWidth
                                margin="normal"
                                label="Daily Limit"
                                value={formData.dailyLimit}
                                onChange={handleChange}
                                name="dailyLimit"
                                required
                            />

                            <TextField
                                fullWidth
                                margin="normal"
                                label="Email"
                                value={formData.bankEmail}
                                onChange={handleChange}
                                name="bankEmail"
                                required
                            />

                            <TextField
                                fullWidth
                                margin="normal"
                                label="Phone Number"
                                value={formData.contact}
                                onChange={handleChange}
                                name="contact"
                                required
                            />

                            <TextField
                                fullWidth
                                margin="normal"
                                label="Address"
                                value={formData.address}
                                onChange={handleChange}
                                name="address"
                                required
                            />

                            <TextField
                                fullWidth
                                margin="normal"
                                label="Region"
                                select
                                value={formData.region}
                                onChange={handleChange}
                                name="region"
                            >
                                <MenuItem value="" disabled>Select Region</MenuItem>
                                <MenuItem value="ADAMAOUA">ADAMAOUA</MenuItem>
                                <MenuItem value="CENTRE">CENTRE</MenuItem>
                                <MenuItem value="ESTE">ESTE</MenuItem>
                                <MenuItem value="EXTREME-NORD">EXTREME-NORD</MenuItem>
                                <MenuItem value="LITTORAL">LITTORAL</MenuItem>
                                <MenuItem value="NORD">NORD</MenuItem>
                                <MenuItem value="NORD-OUEST">NORD-OUEST</MenuItem>
                                <MenuItem value="OUEST">OUEST</MenuItem>
                                <MenuItem value="SUD">SUD</MenuItem>
                                <MenuItem value="SUD-OUEST">SUD-OUEST</MenuItem>
                            </TextField>

                            <TextField
                                fullWidth
                                margin="normal"
                                label="Country"
                                value={formData.country}
                                onChange={handleChange}
                                name="country"
                                required
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Account Number"
                                value={formData.accountNumber}
                                onChange={handleChange}
                                name="accountNumber"
                                required
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

                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleConfirmEdit} variant="contained" color="primary">
                            {loading ? <CircularProgress size={24} /> : 'Update'}
                        </Button>
                        <Button onClick={hideEditBank} color="secondary">
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
                                <InputLabel id="bankId-label">Corporation ID</InputLabel>
                                <Select
                                    labelId="bankId-label"
                                    id="bankId"
                                    name="bankId"
                                    value={pending_account.bankId}
                                    onChange={handleBankChange}
                                >
                                    <MenuItem value="">Select Credit Union</MenuItem>
                                    {Array.isArray(corpID) && corpID.length > 0
                                        ? corpID.map((option) => (
                                            <MenuItem key={option.bankId} value={option.bankId}>
                                                {option.bankName}
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


                                {selectedoption === "" && (
                                    <>

                                        <MenuItem value="" disabled>
                                            External Account <span className="h7 text-danger">(Please select level first)*</span>
                                        </MenuItem>

                                    </>
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
                                            <MenuItem value="" selected>Select Corporation</MenuItem>
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
                                {selectedoption === "Branch" && (
                                    <>
                                        <Select
                                            labelId="externalCorpIdOrBankIdOrBranchId"
                                            id="externalCorpIdOrBankIdOrBranchId"
                                            name="externalCorpIdOrBankIdOrBranchId"
                                            value={pending_account.externalCorpIdOrBankIdOrBranchId}
                                            onChange={handlePendAccChange}
                                        >
                                            <MenuItem value="">Select Branch</MenuItem>
                                            {Array.isArray(branchID) && branchID.length > 0 ? (
                                                branchID.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.branchName}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="">No Bank Branch available</option>
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
            </>
        </Box>
    )
}

export default Bank
