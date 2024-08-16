import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Header from '../../components/Header';
import { Box, Button, useTheme } from '@mui/material';
import CBS_Services from '../../services/api/GAV_Sercives';
import { tokens } from '../../theme';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const ViewTransactions = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [transactionData, setTransactionData] = useState([]);
    const [responseMessage, setResponseMessage] = useState(
        {
            message: "",
            description: "",
            status: ""

        }
    )
    const [searchTerm, setSearchTerm] = useState('');
    const [pending, setPending] = React.useState(true);

    const filteredTransactions = transactionData.filter((transaction) =>
        Object.values(transaction).some((field) =>
            typeof field === 'string' &&
            field.toLowerCase().includes(searchTerm.toLowerCase())
        ));

    const userData = useSelector((state) => state.users);
    const token = userData.token;

    useEffect(() => {

        const FetchTransaction = async () => {
            try {

                const payload = {
                    serviceReference: 'GET_ALL_TRANSACTIONS',
                    requestBody: ''
                }
                const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
                // const response = await CBS_Services('TRANSACTION', 'api/v1/transactions/getAll', 'GET', null);

                if (response && response.status === 200) {
                    setTransactionData(response.body.data)

                } else {
                    setResponseMessage({
                        message: "Error Finding Transactions, Try Later!!!",
                        description: response.body.description,
                        status: response.status
                    })

                }
            } catch (error) {
                console.log(error);

            }

        }

        FetchTransaction();
    }, []);

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            headerAlign: 'center',
            align: 'center',
            width: 80,
            sortable: true,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>ID</span>,
        },
        {
            field: 'transactionId',
            headerName: 'Transaction ID',
            headerAlign: 'center',
            align: 'center',
            width: 150,
            sortable: true,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Transaction ID</span>,
        },
        {
            field: 'transactionType',
            headerName: 'Type',
            headerAlign: 'center',
            align: 'center',
            width: 120,
            sortable: true,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Type</span>,
        },
        {
            field: 'status',
            headerName: 'Status',
            headerAlign: 'center',
            align: 'center',
            width: 100,
            sortable: true,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Status</span>,
        },
        {
            field: 'processingId',
            headerName: 'Processing ID',
            headerAlign: 'center',
            align: 'center',
            width: 150,
            sortable: true,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Processing ID</span>,
        },
        {
            field: 'direction',
            headerName: 'Direction',
            headerAlign: 'center',
            align: 'center',
            width: 100,
            sortable: true,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Direction</span>,
        },
        {
            field: 'amount',
            headerName: 'Amount',
            headerAlign: 'center',
            align: 'center',
            width: 120,
            sortable: true,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Amount</span>,
        },
        {
            field: 'fromAccount',
            headerName: 'From Account',
            headerAlign: 'center',
            align: 'center',
            width: 150,
            sortable: true,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>From Account</span>,
        },
        {
            field: 'fromBankId',
            headerName: 'From Bank ID',
            headerAlign: 'center',
            align: 'center',
            width: 120,
            sortable: true,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>From Bank ID</span>,
        },
        {
            field: 'toAccount',
            headerName: 'To Account',
            headerAlign: 'center',
            align: 'center',
            width: 150,
            sortable: true,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>To Account</span>,
        },
        {
            field: 'toBankId',
            headerName: 'To Bank ID',
            headerAlign: 'center',
            align: 'center',
            width: 120,
            sortable: true,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>To Bank ID</span>,
        },
        {
            field: 'transactionCategory',
            headerName: 'Category',
            headerAlign: 'center',
            align: 'center',
            width: 150,
            sortable: true,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Category</span>,
        },
        {
            field: 'service',
            headerName: 'Service',
            headerAlign: 'center',
            align: 'center',
            width: 120,
            sortable: true,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Service</span>,
        },
        {
            field: 'dateTime',
            headerName: 'Date & Time',
            headerAlign: 'center',
            align: 'center',
            width: 180,
            sortable: true,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Date & Time</span>,
        },
    ]

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Transactions" subtitle="View all transactions" />

            </Box>


            <Box
                m="40px 0 0 0"
                height="75vh"
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
                    rows={filteredTransactions}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                    checkboxSelection
                    disableSelectionOnClick
                />
            </Box>
        </Box>

    )
}

export default ViewTransactions
