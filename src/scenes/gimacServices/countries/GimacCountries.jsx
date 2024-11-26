import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CBS_Services from '../../../services/api/GAV_Sercives';
import { Box, Button, IconButton, Menu, MenuItem, useTheme } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Header from '../../../components/Header';
import { Add, Delete, EditOutlined } from '@mui/icons-material';
import { tokens } from '../../../theme';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { formatValue } from '../../../tools/formatValue';


const GimacCountries = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [countriesData, setCountriesData] = useState([]);
    const [loading, setLoading] = useState(false);
    const userData = useSelector((state) => state.users);
    const token = userData.token;
    const spaceId = userData?.selectedSpace?.id
    const navigate = useNavigate();

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

    const fetchCountriesData = async () => {
        setLoading(true);
        try {
            const payload = {
                serviceReference: 'GIMAC_COUNTRIES',
                requestBody: JSON.stringify({ internalId: "Back-Office" }),
                spaceId: spaceId,
            };


            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            console.log("response", response);

            if (response && response.body.meta.statusCode === 200) {
                const data = response.body.data.map((item, index) => ({
                    id: index + 1, // Assign a unique id to each row
                    countryId: item.countryId,
                    countryCode: item.countryCode,
                    country: item.country,
                    serviceProvider: item.serviceProvider,
                    internationalDialingCode: item.internationalDialingCode,
                }));
                setCountriesData(data);
            } else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCountriesData();
    }, []);

    console.log("countriesData", countriesData);


    const handleAddCountry = () => {
        navigate('/gimac-countries/add');
    };

    const handleEdit = (row) => {
        // Pass the entire row data to the edit page
        navigate(`/gimac-countries/edit/${row.id}`, { state: { countryData: row } });
    };



    const columns = [
        // { field: "countryId", headerName: "Country ID", flex: 1 },
        { field: "country", headerName: "Country", flex: 1, valueGetter: (params) => formatValue(params.value), },
        { field: "serviceProvider", headerName: "Service Provider", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
        { field: "internationalDialingCode", headerName: "Int Dialing Code", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
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
                <Header title="Gimac Countries" subtitle="Manage Gimac Countries" />
                <Button
                    sx={{
                        backgroundColor: colors.blueAccent[700],
                        color: colors.grey[100],
                        fontSize: "14px",
                        fontWeight: "bold",
                        padding: "10px 20px",
                        marginRight: "10px",
                    }}
                    onClick={handleAddCountry}
                >
                    <Add sx={{ mr: "10px" }} />
                    Add Country
                </Button>
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
                    rows={countriesData}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                    // checkboxSelection
                    disableSelectionOnClick
                    loading={loading}
                />
            </Box>
        </Box>
    );
};

export default GimacCountries;
