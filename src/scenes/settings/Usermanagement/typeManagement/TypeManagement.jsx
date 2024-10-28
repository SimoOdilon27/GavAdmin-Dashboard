import React, { useEffect, useState } from 'react'
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputAdornment, InputLabel, ListSubheader, Menu, MenuItem, Select, Snackbar, Stack, TextField, Tooltip, useMediaQuery, useTheme } from '@mui/material'
import Header from '../../../../components/Header'
import { tokens } from '../../../../theme';
import { Add, Delete, EditOutlined, Save, Search, VerifiedUser } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { LoadingButton } from '@mui/lab';
import { Formik } from 'formik';
import * as yup from "yup";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CBS_Services from '../../../../services/api/GAV_Sercives';
import { formatValue } from '../../../../tools/formatValue';

const TypeManagement = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const [typeData, settypeData] = React.useState([])
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = React.useState(false)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

    const [initialValues, setInitialValues] = React.useState(
        {
            intitule: "",
            level: 0,
        }
    )

    const [searchTerm, setSearchTerm] = useState('')
    const [selectAll, setSelectAll] = useState(false);
    const userData = useSelector((state) => state.users);
    const token = userData.token;
    const spaceId = userData?.selectedSpace?.id

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

    const handleToggletypeModal = () => {
        setInitialValues({
            id: 0,
            typeName: '',
            creationDate: '',

        });
        setShowModal(!showModal);
    };

    const fetchtypeData = async () => {
        setLoading(true);
        try {
            const response = await CBS_Services('GATEWAY', 'clientGateWay/type/getAllType', 'GET', null, token);
            console.log("fetchresponse=====", response);

            if (response && response.status === 200) {
                settypeData(response.body.data || []);
                // setSuccessMessage('');
                // setErrorMessage('');
            } else {
                settypeData([]);
                showSnackbar('Error Finding Data.', 'error');
            }

        } catch (error) {
            console.log('Error:', error);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchtypeData();
    }, [])



    const handleConfirmAddtype = async (values) => {
        setLoading(true);
        console.log("values", values);

        try {
            const response = await CBS_Services('GATEWAY', `clientGateWay/type/createType`, 'POST', values, token);

            console.log("response", response);
            if (response && response.status === 200) {
                handleToggletypeModal();
                await fetchtypeData();
                showSnackbar('Type created successfully.', 'success');

            } else if (response && response.status === 401) {
                showSnackbar(response.body.errors || 'Unauthorized to perform action', 'error');
            }

            else {
                showSnackbar(response.body.errors || 'Error Adding Type', 'error');

            }
        } catch (error) {
            console.error('Error:', error);
            showSnackbar('Network Error!!! Try again Later.', 'error');
        }

        setLoading(false);
    };

    const columns = [
        { field: "intitule", headerName: "Type Name", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        { field: "level", headerName: "Level", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        { field: "creationDate", headerName: "Creation Date", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
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
                        <MenuItem onClick={() => handleEdit(currentRow)}>
                            <EditOutlined fontSize="small" style={{ marginRight: "8px" }} />
                            Edit
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
                <Header title="Type Management" subtitle="Manage your Types" />
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
                        onClick={handleToggletypeModal}
                    >
                        <Add sx={{ mr: "10px" }} />
                        Add Type
                    </Button>

                </Box>
            </Box>


            <Box
                m="40px 100px 15px 100px"
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
                        display: "flex",

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
                    rows={typeData}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                    disableSelectionOnClick
                    loading={loading}
                    setFieldValue
                    getRowId={(row) => row.intitule}
                />
            </Box>

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

            <Dialog open={showModal} onClose={handleToggletypeModal} fullWidth>
                <DialogTitle>Add type</DialogTitle>
                <DialogContent>

                    <Formik
                        onSubmit={handleConfirmAddtype}
                        initialValues={initialValues}
                        enableReinitialize={true}
                        validationSchema={checkoutSchema}
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

                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Type Name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.intitule}
                                        name="intitule"
                                        error={!!touched.intitule && !!errors.intitule}
                                        helperText={touched.intitule && errors.intitule}
                                        sx={{ gridColumn: "span 4" }}
                                    />
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="number"
                                        label="Level"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.level}
                                        name="level"
                                        error={!!touched.level && !!errors.level}
                                        helperText={touched.level && errors.level}
                                        sx={{ gridColumn: "span 4" }}
                                    />

                                </Box>
                                <Box display="flex" justifyContent="end" mt="20px">
                                    <Stack direction="row" spacing={2}>

                                        <LoadingButton type="submit" color="secondary" variant="contained" loading={loading} loadingPosition="start"
                                            startIcon={<Save />} >
                                            Add
                                        </LoadingButton>

                                        <Button color="primary" variant="contained" disabled={loading} onClick={handleToggletypeModal}>
                                            Cancel
                                        </Button>
                                    </Stack>
                                </Box>
                            </form>

                        )}

                    </Formik>
                </DialogContent>
                <DialogActions>

                </DialogActions>
            </Dialog>


        </Box>
    )
}

const checkoutSchema = yup.object().shape({

    intitule: yup.string().required("required"),
    level: yup.number().required("required"),

});

export default TypeManagement
