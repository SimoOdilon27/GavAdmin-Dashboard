import { Box, Button, Checkbox, DialogTitle, FormControlLabel, Snackbar, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";

import Header from "../../../components/Header";
import { useEffect, useState } from "react";
import CBS_Services from "../../../services/api/GAV_Sercives";
import { useSelector } from "react-redux";
import { Dialog, DialogActions, DialogContent, TextField, Alert, CircularProgress } from '@mui/material';
import { Add, Delete, EditOutlined } from "@mui/icons-material";



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


    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [corporationData, setCorporationData] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedCorporation, setSelectedCorporation] = useState([]);
    const [loading, setLoading] = useState(false)
    const [corpID, setCorpID] = useState([]);
    const [branchID, setBranchID] = useState([]);
    const [pending, setPending] = useState(true);
    const userData = useSelector((state) => state.users)

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
                setCorporationData(response.body.data || []);
                setCorpID(response.body.data || []);

            } else if (response && response.body.status === 401) {
                showSnackbar('Unauthorized', 'error');

            }

            else {
                console.error('Error fetching data');
                showSnackbar('Error Fetching data.', 'error');

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
                setBranchID(response.body.data || []);

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



    const handleConfirmEdit = async () => {
        setLoading(true);

        try {
            const payload = {
                serviceReference: 'UPDATE_CORPORATION',
                requestBody: JSON.stringify(formData)
            }

            console.log("payload", payload);


            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            console.log("editresp", response);
            console.log("editformresp", formData);
            if (response && response.body.meta.statusCode === 200) {
                hideEditCorporation();
                await fetchCorporationData();
                showSnackbar('Corporation updated successfully.', 'success');
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
                showSnackbar(response.body.errors || 'Error Updating Data.', 'error');

            }
        } catch (error) {
            console.error('Error:', error);
            showSnackbar('Netowrk Error!!!! Try again Later', 'error');
        }

        setLoading(false);
    };

    const handleConfirmAdd = async () => {

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
                showSnackbar('Corporation created successfully.', 'success');
            } else {
                showSnackbar(response.body.errors || 'Unauthorized to perform action', 'error');
                // setErrorMessage(response.body.errors || 'Unauthorized to perform action');
            }
        } catch (error) {
            console.error('Error:', error);
            showSnackbar('Netowrk Error!!!! Try again Later', 'error');

        }
        setLoading(false)
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
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


    const hideEditCorporation = () => {
        setShowEditModal(false);
        setSuccessMessage('');
        setErrorMessage('');
    }


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
                <DataGrid checkboxSelection rows={corporationData} columns={columns} components={{ Toolbar: GridToolbar }} loading={pending}
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


            </>
        </Box>
    );
};

export default Corporation;
