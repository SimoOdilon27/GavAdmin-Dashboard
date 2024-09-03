import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import CBS_Services from '../../../services/api/GAV_Sercives';
import { Alert, Badge, Box, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, MenuItem, TextField, useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import { Add, Delete, EditOutlined } from '@mui/icons-material';
import Header from '../../../components/Header';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

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



    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [branchData, setBranchData] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [bankID, setBankID] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(null);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
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




    useEffect(() => {
        fetchBranchData();
        fetchBankID();
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


            </>
        </Box>
    )
}

export default Branches
