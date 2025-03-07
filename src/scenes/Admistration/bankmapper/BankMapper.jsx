import {
    Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle,
    MenuItem, TextField, useTheme
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { tokens } from '../../../theme';
import { useSelector } from 'react-redux';
import CBS_Services from '../../../services/api/GAV_Sercives';
import { Add } from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Header from '../../../components/Header';
import { FormFieldStyles } from '../../../tools/fieldValuestyle';
import { formatValue } from '../../../tools/formatValue';

const BankMapper = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [bankmapperData, setBankmapperData] = useState([]);
    const [formData, setFormData] = useState({
        bankIdCbs: '',
        bankIdGav: '',
        branchIdCbs: '',
        branchIdGav: '',
        bankNameGav: '',
        branchNameGav: ''
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [pending, setPending] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [bankID, setBankID] = useState([]);
    const [branchID, setBranchID] = useState([]);
    const userData = useSelector((state) => state.users);
    const token = userData.token;
    const spaceId = userData?.selectedSpace?.id
    const [CBSData, setCBSData] = useState([]);


    const filteredMapBanks = bankmapperData ? bankmapperData.filter((bank) =>
        Object.values(bank).some((field) =>
            typeof field === 'string' &&
            field.toLowerCase().includes(searchTerm.toLowerCase())
        )
    ) : [];

    const handleConfirmAdd = async () => {
        setPending(true);

        try {
            const payload = {
                serviceReference: 'ADD_BANK_MAPPER',
                requestBody: JSON.stringify(formData),
                spaceId: spaceId,
            };

            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            console.log("addresponse", response);

            if (response && response.body.meta.statusCode === 200) {
                handleToggleBankMapperModal();
                await fetchBankMapperData();
                setSuccessMessage('Bank Mapper created successfully.');
                setErrorMessage('');
            } else if (response && response.body.status === 401) {
                setErrorMessage(response.body.errors || 'Unauthorized to perform action');
            } else {
                setSuccessMessage('');
                setErrorMessage(response.body.errors || 'Unauthorized to perform action');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setPending(false);
    };

    const fetchBankMapperData = async () => {
        setPending(true);
        try {
            const payload = {
                serviceReference: 'GET_BANK_MAPPER',
                requestBody: '',
                spaceId: spaceId,
            };
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            console.log("fetchresponse", response);

            if (response && response.body.meta.statusCode === 200) {
                setBankmapperData(response.body.data);
            } else if (response && response.body.status === 401) {
                setErrorMessage(response.body.errors || 'Unauthorized to perform action');
            } else {
                setErrorMessage(response.body.errors || 'Error Finding Banks');
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setPending(false);
    };

    const fetchBankID = async () => {
        try {
            const payload = {
                serviceReference: 'GET_ALL_BANKS',
                requestBody: '',
                spaceId: spaceId,
            };
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            console.log("fetchbankid", response);

            if (response && response.body.meta.statusCode === 200) {
                setBankID(response.body.data);
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
                requestBody: '',
                spaceId: spaceId,
            };
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            console.log("fetchbranchid", response);

            if (response && response.body.meta.statusCode === 200) {
                setBranchID(response.body.data);
            } else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchCBSdata = async () => {
        try {

            const payload = {
                serviceReference: 'GET_AFFILIATED_CBS',
                requestBody: '',
                spaceId: spaceId,
            }
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

            console.log("fetchresp111111", response);

            if (response && response.body.meta.statusCode === 200) {
                setCBSData(response.body.data);
            } else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchBankMapperData();
        fetchBankID();
        fetchBranchID();
        fetchCBSdata();
    }, []);

    const handleToggleBankMapperModal = () => {
        setShowModal(!showModal);
        setFormData({
            bankIdCbs: '',
            bankIdGav: '',
            branchIdCbs: '',
            branchIdGav: '',
            bankNameGav: '',
            branchNameGav: ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'bankIdGav') {
            const selectedBank = bankID.find(bank => bank.bankId === value);
            setFormData({
                ...formData,
                bankIdGav: value,
                bankNameGav: selectedBank ? selectedBank.bankName : ''
            });
        } else if (name === 'branchIdGav') {
            const selectedBranch = branchID.find(branch => branch.id === value);
            setFormData({
                ...formData,
                branchIdGav: value,
                branchNameGav: selectedBranch ? selectedBranch.branchName : ''
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };


    const columns = [
        { field: "bankNameGav", headerName: "GAV Bank Name", flex: 1, valueGetter: (params) => formatValue(params.value), },
        // { field: "bankIdGav", headerName: "GAV Bank ID", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        { field: "branchNameGav", headerName: "GAV Branch Name", flex: 1, valueGetter: (params) => formatValue(params.value), },
        // { field: "branchIdGav", headerName: "GAV Branch ID", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        { field: "bankIdCbs", headerName: "CBS Bank ID", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        { field: "branchIdCbs", headerName: "CBS Branch ID", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
    ];

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Bank Mapper" subtitle="Map Bank/Branch to CBS" />

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
                        onClick={handleToggleBankMapperModal}
                    >
                        <Add sx={{ mr: "10px" }} />
                        Map New Bank
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
                <DataGrid
                    rows={filteredMapBanks}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                    getRowId={(row) => row.idGav}
                    loading={pending}
                />
            </Box>

            <Dialog open={showModal} onClose={handleToggleBankMapperModal} fullWidth maxWidth="lg">
                <DialogTitle> Map Bank/Branch To CBS</DialogTitle>
                <DialogContent>
                    {successMessage && (
                        <Alert severity="success" onClose={() => setSuccessMessage('')}>
                            {successMessage}
                        </Alert>
                    )}
                    {errorMessage && (
                        <Alert severity="error" onClose={() => setErrorMessage('')}>
                            {errorMessage}
                        </Alert>
                    )}
                    <form noValidate autoComplete="off">
                        <TextField
                            fullWidth
                            margin="normal"
                            label="CBS Bank ID"
                            select
                            value={formData.bankIdCbs}
                            onChange={handleChange}
                            name="bankIdCbs"
                            sx={FormFieldStyles("span 2")}

                        >
                            <MenuItem value="" disabled>Select CBS Bank</MenuItem>
                            {Array.isArray(CBSData) && CBSData.length > 0 ? (
                                CBSData.map((option) => (
                                    <MenuItem key={option.bankId} value={option.bankId}>
                                        {option.bankName}
                                    </MenuItem>
                                ))
                            ) : (
                                <option value="">No CBS available</option>
                            )}
                        </TextField>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="GAV Bank ID"
                            select
                            value={formData.bankIdGav}
                            onChange={handleChange}
                            name="bankIdGav"
                            sx={FormFieldStyles("span 2")}
                        >
                            <MenuItem value="" disabled>Select Bank</MenuItem>
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
                            label="CBS Branch ID"
                            select
                            value={formData.branchIdCbs}
                            onChange={handleChange}
                            name="branchIdCbs"
                            sx={FormFieldStyles("")}
                        >
                            <MenuItem value="" disabled>Select Branch ID</MenuItem>

                            {Array.isArray(CBSData) && CBSData.length > 0 ? (
                                CBSData.map((option) => (
                                    <MenuItem key={option.branchId} value={option.branchId}>
                                        {option.branchId}
                                    </MenuItem>
                                ))
                            ) : (
                                <option value="">No CBS available</option>
                            )}
                        </TextField>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="GAV Branch ID"
                            select
                            value={formData.branchIdGav}
                            onChange={handleChange}
                            name="branchIdGav"
                            sx={FormFieldStyles("span 2")}

                        >
                            <MenuItem value="" disabled>Select Branch</MenuItem>
                            {Array.isArray(branchID) && branchID.length > 0 ? (
                                branchID.map(option => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.branchName}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem value="">No Branch available</MenuItem>
                            )}
                        </TextField>


                    </form>
                </DialogContent>
                <DialogActions>

                    <Button onClick={handleToggleBankMapperModal} color="primary" variant='contained'>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmAdd} variant="contained" color="secondary">
                        {pending ? <CircularProgress size={24} /> : 'Map'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BankMapper;
