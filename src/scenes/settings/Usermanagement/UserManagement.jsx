import { useTheme } from '@emotion/react';
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputAdornment, InputLabel, ListSubheader, Menu, MenuItem, Select, Snackbar, Stack, TextField, Tooltip, useMediaQuery } from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import { tokens } from '../../../theme';
import Header from '../../../components/Header';
import { Add, Assignment, AssuredWorkload, BackupRounded, Delete, EditOutlined, LocalActivitySharp, ManageAccounts, MenuBook, Save, Search, SwitchAccessShortcut, SwitchAccount, VerifiedUser, Workspaces } from '@mui/icons-material';
import CBS_Services from '../../../services/api/GAV_Sercives';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { Formik } from 'formik';
import { formatValue } from '../../../tools/formatValue';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { FormFieldStyles } from '../../../tools/fieldValuestyle';


const UserManagement = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const [formData, setFormData] = useState({
        userNameOrEmail: '',
        refId: '',
        bankCode: '',
    })
    const [assignbankCode, setAssignbankCode] = useState({
        userNameOrEmail: '',
        bankCode: ''
    })
    const [loading, setLoading] = useState(false);
    const [usersData, setUsersData] = React.useState([])
    const navigate = useNavigate();
    const userData = useSelector((state) => state.users);
    const token = userData.token;
    const spaceId = userData?.selectedSpace?.id
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
    const [showModal, setShowModal] = useState(false)
    const [bankCode, setBankCode] = useState('');
    const [selectedRow, setSelectedRow] = useState(null);
    const [showAssignBankCodeModal, setShowAssignBankCodeModal] = React.useState(false)

    console.log("selectedRow", selectedRow);


    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const [currentRow, setCurrentRow] = useState(null);
    const open = Boolean(anchorEl);

    // Define or import the handleEdit and handleDelete functions


    const handleDelete = (row) => {
        console.log("Delete clicked", row);
        // Your delete logic here
    };
    const handleEdit = (row) => {
        console.log("Edit clicked", row);
    };

    const handleClick = (event, row) => {
        setAnchorEl(event.currentTarget);
        setCurrentRow(row); // Store the current row to pass to actions
    };

    const handleClose = () => {
        setAnchorEl(null);
        setCurrentRow(null);
    };

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 80;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };
    const [searchTerm, setSearchTerm] = useState('')

    const handleToggleAssignBankCodeModal = () => {

        setShowAssignBankCodeModal(!showAssignBankCodeModal);
    };

    const fetchUserData = async () => {
        setLoading(true);
        try {
            const response = await CBS_Services('GATEWAY', 'authentification/getAllUser', 'GET', null, token);

            console.log("fetchresponse", response);

            if (response && response.status === 200) {
                setUsersData(response.body.data || null);
                // setSuccessMessage('');
                // setErrorMessage('');

            } else {
                showSnackbar('Error Finding Data.', 'error');

            }

        } catch (error) {
            console.log('Error:', error);
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchUserData();
    }, []);



    const handleAddUser = () => {
        navigate('/usermanagement/adduser');
    };
    const handleEditUser = (row) => {
        navigate(`/usermanagement/userconfig/${row.userName}`);
    };

    const handleToggleModal = () => {
        setShowModal(!showModal);
        setFormData({});
    }

    useEffect(() => {
        fetchBankID();
    }, [])

    const fetchBankID = async () => {
        try {
            const payload = {
                serviceReference: 'GET_ALL_BANKS',
                requestBody: '',
                spaceId: spaceId,
            }
            // const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);

            const response = await CBS_Services('AP', `api/gav/bank/getAll`, 'GET', null);
            console.log("fetchbankid", response);

            if (response && response.status === 200) {
                setBankCode(response.body.data || []);

            } else if (response && response.body.status === 401) {
                // showSnackbar("Unauthorized to perform action", 'success');
                console.error('Error fetching data');
            }
            else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };





    const handleConfirmAssignment = async () => {
        setLoading(true);
        try {
            // First, assign Ref ID
            const refIdResponse = await CBS_Services('GATEWAY', `authentification/assignRefIdToUser/${formData.userNameOrEmail}/${formData.refId}`, 'POST', formData, token);

            // Then, assign Bank Code
            const bankCodeResponse = await CBS_Services('GATEWAY', `authentification/assignBankCodeToUser/${formData.userNameOrEmail}/${formData.bankCode}`, 'POST', formData, token);

            console.log("formaData", formData);

            if (refIdResponse && refIdResponse.status === 200 && bankCodeResponse && bankCodeResponse.status === 200) {
                await fetchUserData();
                setShowModal(false);
                showSnackbar('Ref ID and Bank Code assigned successfully', 'success');
            } else {
                showSnackbar('Error assigning Ref ID or Bank Code', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showSnackbar('Network Error! Try again later.', 'error');
        }
        setLoading(false);
    };

    const columns = [
        // { field: "id", headerName: "ID", flex: 1 },
        { field: "userName", headerName: "User Name", flex: 1, valueGetter: (params) => formatValue(params.value), headerAlign: "center", align: "center" },
        { field: "email", headerName: "Email", flex: 1, valueGetter: (params) => formatValue(params.value), headerAlign: "center", align: "center" },
        { field: "createdBy", headerName: "Created By", flex: 1, valueGetter: (params) => formatValue(params.value), headerAlign: "center", align: "center" },
        { field: "refId", headerName: "Phone Number", flex: 1, valueGetter: (params) => formatValue(params.value), headerAlign: "center", align: "center" },
        { field: "bankCode", headerName: "Bank Code", flex: 1, valueGetter: (params) => formatValue(params.value), headerAlign: "center", align: "center" },
        { field: "createdAt", headerName: "Date Created", flex: 1, valueGetter: (params) => formatValue(params.value), headerAlign: "center", align: "center" },
        // {
        //     field: "permissions",
        //     headerName: "Assign Teller User To Bank",
        //     flex: 1,
        //     headerAlign: "center", align: "center",
        //     renderCell: (params) => {
        //         const row = params.row;
        //         return (
        //             <>
        //                 <Tooltip title="Assign">

        //                     <Box
        //                         width="30%"
        //                         m="0 4px"
        //                         p="5px"
        //                         display="flex"
        //                         justifyContent="center"
        //                         backgroundColor={colors.greenAccent[600]}
        //                         borderRadius="4px"
        //                         onClick={() => {
        //                             setFormData(prev => ({
        //                                 ...prev,
        //                                 userNameOrEmail: row.userName
        //                             }));
        //                             setShowModal(true);
        //                         }}
        //                     >
        //                         <AssuredWorkload />
        //                     </Box>

        //                 </Tooltip>
        //             </>
        //         );
        //     },
        // },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1, headerAlign: "center", align: "center",
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
                        <MenuItem onClick={() => handleEditUser(currentRow)}>
                            <Workspaces fontSize="small" style={{ marginRight: "8px" }} />
                            Update Space
                        </MenuItem>
                        <MenuItem onClick={() => {
                            setFormData(prev => ({
                                ...prev,
                                userNameOrEmail: currentRow.userName
                            }));
                            setShowModal(true);
                        }}>
                            <ManageAccounts fontSize="small" style={{ marginRight: "8px" }} />
                            Assign to Teller
                        </MenuItem>

                        {/* <MenuItem onClick={() => handleDelete(currentRow)}>
                            <Delete fontSize="small" style={{ marginRight: "8px" }} />
                            Delete
                        </MenuItem> */}
                    </Menu>
                </>
            ),
        },
    ];

    return (
        <Box m="20px">

            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="User Management" subtitle="Manage your Users" />
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
                        onClick={handleAddUser}
                    >
                        <Add sx={{ mr: "10px" }} />
                        Add User
                    </Button>
                    {/* <Button
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
                        <Add sx={{ mr: "10px" }} />
                        Assign RefId
                    </Button> */}

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
                    rows={usersData}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                    disableSelectionOnClick
                    loading={loading}
                />
            </Box>


            <Dialog open={showModal} onClose={handleToggleModal} fullWidth  >
                <DialogTitle>Assign Phone Number and Bank Code to {formatValue(formData?.userNameOrEmail)}</DialogTitle>
                <DialogContent>
                    <form noValidate autoComplete="off">
                        <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0, 1fr))">
                            {/* <TextField
                                fullWidth
                                variant="filled"
                                label="User Name"
                                value={formData.userNameOrEmail}
                                disabled
                                sx={{ gridColumn: "span 4" }}
                            /> */}

                            <TextField
                                fullWidth
                                variant="filled"
                                label="Phone Number"
                                value={formData.refId}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    refId: e.target.value
                                }))}
                                sx={FormFieldStyles("span 4")}
                            />

                            <FormControl fullWidth variant="filled" sx={FormFieldStyles("span 4")} >
                                <InputLabel>Bank</InputLabel>
                                <Select
                                    value={formData.bankCode || []}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        bankCode: e.target.value
                                    }))}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <AssuredWorkload />
                                        </InputAdornment>
                                    }
                                >
                                    <MenuItem value={""} disabled>Select Bank</MenuItem>
                                    {(Array.isArray(bankCode) ? bankCode : []).map(bank => (
                                        <MenuItem key={bank.bankCode} value={bank.bankCode}>
                                            {bank.bankName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleToggleModal} variant="outlined" color="secondary">
                        Cancel
                    </Button>
                    <LoadingButton onClick={handleConfirmAssignment} variant="contained" color="primary" loading={loading} loadingPosition="start"
                        startIcon={<Assignment />}>
                        Assign
                    </LoadingButton>

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

        </Box>

    )
}

export default UserManagement
