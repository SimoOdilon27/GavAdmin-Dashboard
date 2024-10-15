import { Add, Delete, EditOutlined, RemoveRedEyeSharp } from '@mui/icons-material';
import { Box, Button, Checkbox, Chip, FormControl, FormControlLabel, IconButton, InputLabel, Menu, Snackbar, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import CBS_Services from '../../../services/api/GAV_Sercives';
import { tokens } from '../../../theme';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Header from '../../../components/Header';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, CircularProgress, Alert } from '@mui/material';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from 'react-router-dom';

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

    const [showModal, setShowModal] = useState(false);
    const [bankData, setBankData] = useState([]);
    const [corpID, setCorpID] = useState('');
    const [loading, setLoading] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBank, setSelectedBank] = useState(null);
    const userData = useSelector((state) => state.users)
    const navigate = useNavigate();

    const token = userData.token
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

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

    const [anchorEl, setAnchorEl] = useState(null);
    const [currentRow, setCurrentRow] = useState(null);
    const open = Boolean(anchorEl);

    // Define or import the handleEdit and handleDelete functions


    const handleDelete = (row) => {
        console.log("Delete clicked", row);
        // Your delete logic here
    };

    const handleClick = (event, row) => {
        setAnchorEl(event.currentTarget);
        setCurrentRow(row); // Store the current row to pass to actions
    };

    const handleClose = () => {
        setAnchorEl(null);
        setCurrentRow(null);
    };


    const hideAddBank = () => {
        setShowModal(false);

    };


    const handleToggleEditBankModal = () => {
        setShowEditModal(!showEditModal);
    };
    const hideEditBank = () => {
        setShowEditModal(false);

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
                serviceReference: 'ADD_BANK',
                requestBody: JSON.stringify(formData)
            }

            console.log("formData", formData);

            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            console.log("addresponse", response);

            if (response && response.body.meta.statusCode === 200) {
                hideAddBank();
                await fetchBankData();
                showSnackbar('Bank created successfully.', 'success');
            } else if (response && response.body.meta.statusCode === 401) {
                showSnackbar(response.body.errors || 'Unauthorized to perform action', 'error');
            }

            else {
                showSnackbar(response.body.errors || 'Failed to create bank', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showSnackbar('Network Error!!! try again later', 'error');

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
                showSnackbar('Bank updated successfully.', 'success');

            } else if (response && response.body.meta.statusCode === 401) {
                showSnackbar(response.body.errors || 'Unauthorized to perform action', 'error');
            }

            else {
                showSnackbar(response.body.errors || 'Failed to update bank', 'error');

            }
        } catch (error) {
            console.error('Error:', error);
            showSnackbar('Network Error!!! try again later', 'error');

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
                setBankData(response.body.data || []);

            } else {
                showSnackbar(response.body.errors || 'Error Finding Banks', 'error');

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




    useEffect(() => {
        // Fetch Bank data when the component mounts
        fetchBankData();
        fetchCorpID();

    }, []);

    const handleAddBank = () => {
        navigate('/bank/add');
    };

    const handleEditBank = (row) => {
        // Pass the entire row data to the edit page
        navigate(`/bank/edit/${row.id}`, { state: { bankData: row } });
    };
    const handleViewCorp = (row) => {
        // Pass the entire row data to the edit page
        navigate(`/bank/view/${row.accounts}`, { state: { bankData: row } });
    };

    const toSentenceCase = (text) => {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    };

    const columns = [
        { field: "bankName", headerName: "Bank Name", flex: 1, valueGetter: (params) => toSentenceCase(params.value), },
        { field: "bankCode", headerName: "Bank Code", flex: 1, valueGetter: (params) => toSentenceCase(params.value), },
        { field: "cbsBankId", headerName: "CBS Bank ID", flex: 1, valueGetter: (params) => toSentenceCase(params.value), },
        { field: "address", headerName: "Address", flex: 1, valueGetter: (params) => toSentenceCase(params.value), },
        { field: "bankEmail", headerName: "Email", flex: 1, valueGetter: (params) => toSentenceCase(params.value), },
        { field: "contact", headerName: "Phone Number", flex: 1, valueGetter: (params) => toSentenceCase(params.value), },
        { field: "bankManger", headerName: "Bank Manager", flex: 1, valueGetter: (params) => toSentenceCase(params.value), },
        { field: "country", headerName: "Country", flex: 1, valueGetter: (params) => toSentenceCase(params.value), },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
            renderCell: (params) => {
                const isActive = params.row.active; // Access the "active" field from the row data
                return (
                    <Chip
                        label={isActive ? "Active" : "Inactive"}
                        style={{
                            backgroundColor: isActive ? "green" : "red",
                            color: "white",
                            padding: "1px 1px 1px 1px",
                        }}
                    />
                );
            },
        },


        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
                <>
                    <IconButton
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClick={(event) => handleClick(event, params.row)}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                            style: {
                                maxHeight: 48 * 4.5,
                                width: "20ch",
                                transform: "translateX(-50%)",
                            },
                        }}
                    >
                        <MenuItem onClick={() => handleEditBank(currentRow)}>
                            <EditOutlined fontSize="small" style={{ marginRight: "8px" }} />
                            Edit
                        </MenuItem>
                        <MenuItem onClick={() => handleViewCorp(currentRow)}>
                            <RemoveRedEyeSharp fontSize="small" style={{ marginRight: "8px" }} />
                            View
                        </MenuItem>
                        <MenuItem onClick={() => handleDelete(currentRow)}>
                            <Delete fontSize="small" style={{ marginRight: "8px" }} />
                            Delete
                        </MenuItem>
                    </Menu>
                </>
            ),
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
                        onClick={handleAddBank}
                    >
                        <Add sx={{ mr: "10px" }} />
                        Add Bank
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
                <DataGrid rows={bankData} columns={columns} components={{ Toolbar: GridToolbar }} loading={loading} />

            </Box>


            <>
                <Dialog open={showModal} onClose={handleToggleBankModal} fullWidth maxWidth="lg">
                    <DialogTitle>Add Bank</DialogTitle>
                    <DialogContent>

                        <form noValidate autoComplete="off">
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Corporation"
                                select
                                value={formData.corporationId}
                                onChange={handleChange}
                                name="corporationId"
                                required
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
                                label="CBS Bank Id"
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
            </>

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
    )
}

export default Bank
