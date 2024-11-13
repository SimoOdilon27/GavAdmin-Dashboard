import { useTheme } from '@emotion/react';
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputAdornment, InputLabel, ListSubheader, Menu, MenuItem, Select, Snackbar, Stack, TextField, Tooltip, useMediaQuery } from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import { tokens } from '../../../theme';
import Header from '../../../components/Header';
import { Add, Assignment, AssuredWorkload, BackupRounded, Delete, EditOutlined, LocalActivitySharp, MenuBook, Save, Search, SwitchAccessShortcut, SwitchAccount, VerifiedUser } from '@mui/icons-material';
import CBS_Services from '../../../services/api/GAV_Sercives';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { Formik } from 'formik';
import { formatValue } from '../../../tools/formatValue';
import MoreVertIcon from "@mui/icons-material/MoreVert";




const UserManagement = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const [formData, setFormData] = useState({
        userNameOrEmail: '',
        refId: ''
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

    const handleConfirmRefId = async () => {
        setLoading(true);
        try {
            const response = await CBS_Services('GATEWAY', `authentification/assignRefIdToUser/${formData.userNameOrEmail}/${formData.refId}`, 'POST', formData, token);

            console.log("response", response);
            if (response && response.status === 200) {
                handleToggleModal();
                await fetchUserData();
                showSnackbar('Ref Id assigned successfully.', 'success');

            } else if (response && response.status === 401) {
                showSnackbar(response.body.errors || 'Unauthorized to perform action', 'error');
            }

            else {
                showSnackbar(response.body.errors || 'Error Assigning RefId', 'error');

            }
        } catch (error) {
            console.error('Error:', error);
            showSnackbar('Network Error!!! Try again Later.', 'error');
        }

        setLoading(false);
    };

    const handleAddUser = () => {
        navigate('/usermanagement/adduser');
    };
    const handleEditUser = (row) => {
        navigate(`/usermanagement/userconfig/${row.userName}`);
    };

    const handleToggleModal = () => {
        setShowModal(!showModal);
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
                setBankCode(response.body.data);

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

    const handleAssignUserRole = (assignbankCode) => {
        setSelectedRow(assignbankCode);
        setAssignbankCode({
            ...assignbankCode,
            userNameOrEmail: assignbankCode,
            bankCode: '',
        });
        setShowAssignBankCodeModal(!showAssignBankCodeModal);
    };

    const handleConfirmAssignBankCode = async () => {
        setLoading(true);
        try {

            const response = await CBS_Services('GATEWAY', `authentification/assignBankCodeToUser/${selectedRow}/${assignbankCode.bankCode}`, 'POST', assignbankCode, token);

            console.log("responseassign", response);

            if (response && response.status === 200) {
                showSnackbar('Bank Code assigned successfully.', 'success');
                handleToggleAssignBankCodeModal();
                await fetchUserData();
            } else {
                showSnackbar(response.body.errors || 'Error assigning Bank Code.', 'error');
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
        { field: "role", headerName: "Role", flex: 1, valueGetter: (params) => formatValue(params.value), headerAlign: "center", align: "center" },
        { field: "refId", headerName: "Ref Id", flex: 1, valueGetter: (params) => formatValue(params.value), headerAlign: "center", align: "center" },
        { field: "bankCode", headerName: "Bank Code", flex: 1, valueGetter: (params) => formatValue(params.value), headerAlign: "center", align: "center" },

        {
            field: "permissions",
            headerName: "Assign Bank Code",
            flex: 1,
            headerAlign: "center", align: "center",
            renderCell: (params) => {
                const row = params.row;
                return (
                    <>
                        <Tooltip title="Assign Bank Code">

                            <Box
                                width="30%"
                                m="0 4px"
                                p="5px"
                                display="flex"
                                justifyContent="center"
                                backgroundColor={colors.greenAccent[600]}
                                borderRadius="4px"
                                onClick={() => handleAssignUserRole(row.userName)}
                            >
                                <AssuredWorkload />
                            </Box>
                            {/* <Box
                            width="30%"
                            m="0"
                            p="5px"
                            display="flex"
                            justifyContent="center"
                            backgroundColor={colors.redAccent[600]}
                            borderRadius="4px"
                        >
                            <Delete />
                        </Box> */}
                        </Tooltip>
                    </>
                );
            },
        },
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
                            <SwitchAccount fontSize="small" style={{ marginRight: "8px" }} />
                            Update Space
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
                        <Add sx={{ mr: "10px" }} />
                        Assign RefId
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
                    rows={usersData}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                    disableSelectionOnClick
                    loading={loading}
                />
            </Box>


            <Dialog open={showModal} onClose={handleToggleModal} fullWidth  >
                <DialogTitle>Assign RefId</DialogTitle>
                <DialogContent>
                    <form noValidate autoComplete="off">
                        <Box
                            display="grid"
                            gap="30px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                        >

                            {/* <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="UserName or Email"
                                onChange={(e) => setFormData({ ...formData, userNameOrEmail: e.target.value })}
                                name="userNameOrEmail"
                                value={formData.userNameOrEmail}
                                sx={{ gridColumn: "span 4" }}
                            /> */}


                            <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 4" }}>
                                <InputLabel>Menu</InputLabel>
                                <Select
                                    label="UserName or Email"
                                    onChange={(e) => setFormData({ ...formData, userNameOrEmail: e.target.value })}

                                    name="userNameOrEmail"
                                    value={formData.userNameOrEmail}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <MenuBook />
                                        </InputAdornment>
                                    }
                                    MenuProps={MenuProps}
                                >
                                    <ListSubheader>
                                        <TextField
                                            size="small"
                                            autoFocus
                                            placeholder="Type to search..."
                                            fullWidth
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Search />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key !== 'Escape') {
                                                    e.stopPropagation();
                                                }
                                            }}
                                        />
                                    </ListSubheader>
                                    <MenuItem value="">
                                        <em>Select User</em>
                                    </MenuItem>
                                    {Array.isArray(usersData) && usersData.length > 0 ? (
                                        usersData.filter(option =>
                                            option.userName.toLowerCase().includes(searchTerm.toLowerCase())
                                        ).map(option => (
                                            <MenuItem key={option.userName} value={option.userName}>
                                                {option.userName}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem value="">No User available</MenuItem>
                                    )}
                                </Select>

                            </FormControl>
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="RefId"
                                onChange={(e) => setFormData({ ...formData, refId: e.target.value })}
                                name="refId"
                                value={formData.refId}
                                sx={{ gridColumn: "span 4" }}
                            />



                        </Box>

                    </form>
                </DialogContent>
                <DialogActions>
                    <LoadingButton onClick={handleConfirmRefId} variant="contained" color="primary" loading={loading} loadingPosition="start"
                        startIcon={<Assignment />}>
                        Assign RefId
                    </LoadingButton>
                    <Button onClick={handleToggleModal} variant="outlined" color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={showAssignBankCodeModal} onClose={handleToggleAssignBankCodeModal} fullWidth >
                <DialogTitle>Assign Bank Code</DialogTitle>
                <DialogContent>

                    <Formik
                        onSubmit={handleConfirmAssignBankCode}
                        initialValues={assignbankCode}
                        enableReinitialize={true}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleBlur,
                            handleChange,
                            handleSubmit,
                            setFieldValue
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


                                    <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 4" }}>
                                        <InputLabel>Bank</InputLabel>
                                        <Select
                                            label="Bank"
                                            onBlur={handleBlur}
                                            onChange={(e) => {
                                                handleChange(e);
                                                setFieldValue("bankCode", e.target.value);
                                                setAssignbankCode({ ...assignbankCode, bankCode: e.target.value });
                                            }}
                                            value={values.bankCode}
                                            name="bankCode"
                                            error={!!touched.bankCode && !!errors.bankCode}
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <MenuBook />
                                                </InputAdornment>
                                            }
                                            MenuProps={MenuProps}
                                        >
                                            <ListSubheader>
                                                <TextField
                                                    size="small"
                                                    autoFocus
                                                    placeholder="Type to search..."
                                                    fullWidth
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Search />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key !== 'Escape') {
                                                            e.stopPropagation();
                                                        }
                                                    }}
                                                />
                                            </ListSubheader>
                                            <MenuItem value="">
                                                <em>Select Menu</em>
                                            </MenuItem>
                                            {Array.isArray(bankCode) && bankCode.length > 0 ? (
                                                bankCode.filter(option =>
                                                    option.id.toLowerCase().includes(searchTerm.toLowerCase())
                                                ).map(option => (
                                                    <MenuItem key={option.bankCode} value={option.bankCode}>
                                                        {option.bankName}
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <MenuItem value="">No Bank available</MenuItem>
                                            )}
                                        </Select>
                                        {touched.bankCode && errors.bankCode && (
                                            <Alert severity="error">{errors.bankCode}</Alert>
                                        )}
                                    </FormControl>

                                </Box>

                            </form>
                        )}
                    </Formik>


                </DialogContent>
                <DialogActions>
                    <Box display="flex" justifyContent="end" mt="20px">
                        <Stack direction="row" spacing={2}>

                            <LoadingButton type="submit" color="secondary" variant="contained" loading={loading} loadingPosition="start"
                                startIcon={<AssuredWorkload />} onClick={handleConfirmAssignBankCode}>
                                Assign
                            </LoadingButton>

                            <Button color="primary" variant="contained" disabled={loading} onClick={handleToggleAssignBankCodeModal}>
                                Cancel
                            </Button>
                        </Stack>
                    </Box>
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
