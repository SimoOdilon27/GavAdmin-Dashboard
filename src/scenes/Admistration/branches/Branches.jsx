import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import CBS_Services from '../../../services/api/GAV_Sercives';
import { Alert, Badge, Box, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField, useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import { Add, Delete, EditOutlined } from '@mui/icons-material';
import Header from '../../../components/Header';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import CountrySelect from '../../../components/CountrySelect';

const Branches = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [formData, setFormData] = useState({
        id: '',
        bankId: '',
        branchName: '',
        address: '',
        cbsBranchId: '',
        email: '',
        country: '',
        active: false,
        cbsAccount: '',
        accountThreshold: "",
        hasCbsAccount: false,
        otherCbs: false,
        accounts: '',

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

    const [branchData, setBranchData] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [bankID, setBankID] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [corpID, setCorpID] = useState('');
    const [branchID, setBranchID] = useState('');
    const [pending, setPending] = React.useState(true);
    const [showPendAccModal, setShowPendAccModal] = useState(false);
    const [selectedBank, setSelectedBank] = useState(null);
    const [selectedoption, setselectedoption] = useState('');

    console.log("formada", formData);

    const userData = useSelector((state) => state.users)

    const token = userData.token

    const handleEdit = (branch) => {
        setSelectedBranch(branch);
        setFormData({
            id: branch.id,
            bankId: branch.bankId,
            branchName: branch.branchName,
            address: branch.address,
            cbsBranchId: branch.cbsBranchId,
            email: branch.email,
            country: branch.country,
            active: branch.active,
            cbsAccount: branch.cbsAccount,
            accountThreshold: branch.accountThreshold,
            hasCbsAccount: branch.hasCbsAccount,
            otherCbs: branch.otherCbs,
            accounts: branch.accounts,

        });
        setShowEditModal(true);
    };


    const handleToggleBranchModal = () => {
        setShowModal(!showModal);
    };


    const hideAddBranch = () => {
        setShowModal(false);
        setSuccessMessage('');
        setErrorMessage('');
    };

    const handleToggleEditBranchModal = () => {
        setFormData({
            id: '',
            bankId: '',
            branchName: '',
            address: '',
            cbsBranchId: '',
            email: '',
            country: '',
            active: false,
            cbsAccount: '',
            accountThreshold: 0,
            hasCbsAccount: false,
            otherCbs: false,
            accounts: '',
        })
        setShowEditModal(!showEditModal);
    };

    const hideEditBranch = () => {
        setShowEditModal(false);
        setSelectedBranch(null);
        setSuccessMessage('');
        setErrorMessage('');
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
        const selectedBank = branchData.find(b => b.bankId === value);
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
                serviceReference: 'ADD_BANK_BRANCH',
                requestBody: JSON.stringify(formData)
            }

            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            // const response = await CBS_Services('AP', 'api/gav/bankBranch/create', 'POST', formData);
            console.log("resp", response);

            if (response && response.body.meta.statusCode === 200) {
                hideAddBranch();
                await fetchBranchData();
                setSuccessMessage('Branch created successfully.');
                setErrorMessage('');
                setFormData({
                    id: '',
                    bankId: '',
                    branchName: '',
                    address: '',
                    cbsBranchId: '',
                    email: '',
                    country: '',
                    active: false,
                    cbsAccount: '',
                    accountThreshold: 0,
                    hasCbsAccount: false,
                    otherCbs: false,
                    accounts: '',

                });
            } else {
                setSuccessMessage('');
                setErrorMessage(response.body.errors);
            }
        } catch (error) {
            console.error('Error:', error);
            setSuccessMessage('Branch Created Successfully');
            setErrorMessage('Error adding branch');
        }
        setLoading(false);
    };

    // console.log("editform", formData);


    const handleConfirmEdit = async () => {
        setLoading(true);
        // const requestData = { branchId: selectedBranch, ...formData }

        try {

            const payload = {
                serviceReference: 'UPDATE_BRANCH',
                requestBody: JSON.stringify(formData)
            }

            console.log(payload);


            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

            // const response = await CBS_Services('AP', 'api/gav/bankBranch/update', 'PUT', formData);
            console.log("editresp", response);
            console.log("editformresp", formData);


            if (response && response.body.meta.statusCode === 200) {
                hideEditBranch();
                await fetchBranchData();
                setSuccessMessage('Branch updated successfully.');
                setErrorMessage('');
                setFormData({
                    id: '',
                    bankId: '',
                    branchName: '',
                    address: '',
                    cbsBranchId: '',
                    email: '',
                    country: '',
                    active: false,
                    cbsAccount: '',
                    accountThreshold: 0,
                    hasCbsAccount: false,
                    otherCbs: false,
                    accounts: '',


                });
            } else if (response && response.body.status === 401) {
                setErrorMessage(response.body.errors || 'Unauthorized to perform action');
            }

            else {
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
                handleTogglePendingAccBankModal();
                await fetchBranchData();
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


    const fetchBranchData = async () => {
        setLoading(true);
        try {
            const payload = {
                serviceReference: 'GET_ALL_BRANCHES',
                requestBody: ''
            }
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

            console.log("response", response);

            // const response = await CBS_Services('AP', 'api/gav/bank_branch/getAll', 'GET', null);

            if (response && response.body.meta.statusCode === 200) {
                setBranchData(response.body.data);
                setBranchID(response.body.data);

            } else if (response && response.body.status === 401) {
                setErrorMessage(response.body.errors || 'Unauthorized to perform action');
            }

            else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };

    const fetchBankID = async () => {
        try {
            const payload = {
                serviceReference: 'GET_ALL_BANKS',
                requestBody: ''
            }
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

            // const response = await CBS_Services('AP', `api/gav/bank/getAll`, 'GET', null);
            console.log("fetchbankid", response);

            if (response && response.status === 200) {
                setBankID(response.body.data);

            } else if (response && response.body.status === 401) {
                setErrorMessage(response.body.errors || 'Unauthorized to perform action');
            }
            else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchCorpID = async () => {
        try {

            const payload = {
                serviceReference: 'GET_ALL_CORPORATIONS',
                requestBody: ''
            }
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            // const response = await CBS_Services('AP', `api/gav/corporation/management/getAll`, 'GET', null);

            if (response && response.status === 200) {
                setCorpID(response.body.data);

            } else if (response && response.body.status === 401) {
                setErrorMessage(response.body.errors || 'Unauthorized to perform action');
            }
            else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    useEffect(() => {
        fetchBranchData();
        fetchBankID();
        fetchCorpID();
    }, []);

    const columns = [
        { field: "branchName", headerName: "Branch Name", flex: 1 },
        { field: "cbsBranchId", headerName: "CBS Branch ID", flex: 1 },
        { field: "address", headerName: "ADDRESS", flex: 1 },
        { field: "email", headerName: "Email", flex: 1 },
        { field: "country", headerName: "Country", flex: 1 },
        {
            field: "active",
            headerName: "Status",
            flex: 1,
            renderCell: (params) => {
                const corp = params.row; // Access the current row's data
                return (
                    <>
                        {corp.active ? (
                            // <span className="badge bg-success">Active</span>
                            <Badge className="badge bg-success">Active</Badge>
                        ) : (
                            // <span className="badge bg-danger">Inactive</span>
                            <Badge className="badge bg-danger">Inactive</Badge>

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
                <Header title="Branches" subtitle="Manage your Branches" />

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
                        onClick={handleToggleBranchModal}
                    >
                        <Add sx={{ mr: "10px" }} />
                        Add Braches
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
                <DataGrid checkboxSelection rows={branchData} columns={columns} components={{ Toolbar: GridToolbar }} loading={loading}
                />
            </Box>


            <>
                <Dialog open={showModal} onClose={handleToggleBranchModal} fullWidth maxWidth="lg">
                    <DialogTitle>Add Branch</DialogTitle>
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
                                label="Bank"
                                select
                                value={formData.bankId}
                                onChange={handleChange}
                                name="bankId"
                            >
                                <MenuItem value="">Select Bank</MenuItem>
                                {Array.isArray(bankID) && bankID.length > 0 ? (
                                    bankID.map(option => (
                                        <MenuItem key={option.bankId} value={option.bankId}>
                                            {option.bankName}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem value="">No Banks available</MenuItem>
                                )}
                            </TextField>

                            <TextField
                                fullWidth
                                margin="normal"
                                label="Branch Name"
                                value={formData.branchName}
                                onChange={handleChange}
                                name="branchName"
                                required
                            />

                            <TextField
                                fullWidth
                                margin="normal"
                                label=" CBS Branch Id"
                                value={formData.cbsBranchId}
                                onChange={handleChange}
                                name="cbsBranchId"
                                required
                            />

                            <TextField
                                fullWidth
                                margin="normal"
                                label="Account Threshold"
                                value={formData.accountThreshold}
                                onChange={handleChange}
                                name="accountThreshold"
                                required
                            />

                            <TextField
                                fullWidth
                                margin="normal"
                                label="Email"
                                value={formData.email}
                                onChange={handleChange}
                                name="email"
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
                                label="Country"
                                value={formData.country}
                                onChange={handleChange}
                                name="country"
                                required
                            />

                            <TextField
                                fullWidth
                                margin="normal"
                                label="CBS Account Number"
                                value={formData.cbsAccount}
                                onChange={handleChange}
                                name="cbsAccount"
                                required
                            />
                            {/* <CountrySelect fullWidth value={formData.country} onChange={handleChange} /> */}


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
                        <Button onClick={handleToggleBranchModal} color="secondary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={showEditModal} onClose={handleToggleEditBranchModal} fullWidth maxWidth="lg">
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
                                label="Bank"
                                select
                                value={formData.bankId}
                                onChange={handleChange}
                                name="bankId"
                            >
                                <MenuItem value="">Select Bank</MenuItem>
                                {Array.isArray(bankID) && bankID.length > 0 ? (
                                    bankID.map(option => (
                                        <MenuItem key={option.bankId} value={option.bankId}>
                                            {option.bankName}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem value="">No Banks available</MenuItem>
                                )}
                            </TextField>

                            <TextField
                                fullWidth
                                margin="normal"
                                label="Branch Name"
                                value={formData.branchName}
                                onChange={handleChange}
                                name="branchName"
                                required
                            />

                            <TextField
                                fullWidth
                                margin="normal"
                                label=" CBS Branch Id"
                                value={formData.cbsBranchId}
                                onChange={handleChange}
                                name="cbsBranchId"
                                required
                            />

                            <TextField
                                fullWidth
                                margin="normal"
                                label="Account Threshold"
                                value={formData.accountThreshold}
                                onChange={handleChange}
                                name="accountThreshold"
                                required
                            />

                            <TextField
                                fullWidth
                                margin="normal"
                                label="Email"
                                value={formData.email}
                                onChange={handleChange}
                                name="email"
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
                                label="Country"
                                value={formData.country}
                                onChange={handleChange}
                                name="country"
                                required
                            />

                            <TextField
                                fullWidth
                                margin="normal"
                                label="CBS Account Number"
                                value={formData.cbsAccount}
                                onChange={handleChange}
                                name="cbsAccount"
                                required
                            />
                            {/* <CountrySelect fullWidth value={formData.country} onChange={handleChange} /> */}


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
                        <Button onClick={handleToggleEditBranchModal} color="secondary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Add Pending Bank Account Modal */}
                <Dialog open={showPendAccModal} onClose={handleTogglePendingAccBankModal} maxWidth="lg" fullWidth>
                    <DialogTitle>Add Pending Account(Branch)</DialogTitle>
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
                                    onChange={handlePendAccChange}
                                >
                                    <MenuItem value="">Select Corporation</MenuItem>
                                    {Array.isArray(corpID) && corpID.length > 0
                                        ? corpID.map((option) => (
                                            <MenuItem key={option.corporationId} value={option.corporationId}>
                                                {option.corporationName}
                                            </MenuItem>
                                        ))
                                        :
                                        <MenuItem value="">No Corporatiion available</MenuItem>}
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

export default Branches
