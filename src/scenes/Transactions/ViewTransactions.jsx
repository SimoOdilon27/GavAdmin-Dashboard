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
    const [pending, setPending] = React.useState(true);
    const userData = useSelector((state) => state.users);
    const token = userData.token;


    const [telletAccountID, setTellerAccountID] = useState('')


    const GetTellerAccountID = async () => {
        try {

            const response = await CBS_Services('ACCOUNT', `api/gav/account/getTellerAccounByMsisdnAndBankCode/${userData?.bankCode}/${userData?.refId}`, 'GET');

            console.log("teller", response);

            if (response && response.status === 200) {
                setTellerAccountID(response.body.data.accountId || '')
            }
            else {
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

    useEffect(() => {

        const FetchTransaction = async () => {
            setPending(true);
            try {
                let payload = {}

                if (userData.roles === 'TELLER') {
                    payload = {
                        serviceReference: 'GET_TRANSACTION_BY_ACCOUNT_NUMBER',
                        requestBody: telletAccountID
                    }
                }
                else {
                    payload = {
                        serviceReference: 'GET_ALL_TRANSACTIONS',
                        requestBody: ''
                    }
                }


                const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
                // const response = await CBS_Services('TRANSACTION', 'api/v1/transactions/getAll', 'GET', null);
                console.log("erer", response);

                if (response && response.status === 200) {

                    if (userData.roles === 'ADMIN') {
                        setTransactionData(response.body.data);
                    }
                    else if (userData.roles === 'TELLER') {
                        const data = response.body.data.map((item, index) => ({
                            id: index + 1, // Assign a unique id to each row
                            service: item.service,
                            direction: item.direction,
                            fromAccount: item.fromAccount,
                            toAccount: item.toAccount,
                            amount: item.amount,
                        }));
                        setTransactionData(data || [])
                    }


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

            setPending(false);

        }

        FetchTransaction();
    }, [telletAccountID]);



    console.log("tellerid==", telletAccountID);


    useEffect(() => {
        GetTellerAccountID();
    }, [])

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 80,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>ID</span>,
        },
        {
            field: 'transactionId',
            headerName: 'Transaction ID',
            width: 150,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Transaction ID</span>,
        },
        {
            field: 'transactionType',
            headerName: 'Type',
            width: 120,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Type</span>,
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 100,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Status</span>,
        },
        {
            field: 'processingId',
            headerName: 'Processing ID',
            width: 150,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Processing ID</span>,
        },
        {
            field: 'direction',
            headerName: 'Direction',
            width: 100,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Transaction Type</span>,
        },
        {
            field: 'amount',
            headerName: 'Amount',
            width: 120,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Amount</span>,
        },
        {
            field: 'fromAccount',
            headerName: 'From Account',
            width: 150,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>From Account</span>,
        },
        {
            field: 'fromBankId',
            headerName: 'From Bank ID',
            width: 120,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>From Bank ID</span>,
        },
        {
            field: 'toAccount',
            headerName: 'To Account',
            width: 150,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>To Account</span>,
        },
        {
            field: 'toBankId',
            headerName: 'To Bank ID',
            width: 120,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>To Bank ID</span>,
        },
        {
            field: 'transactionCategory',
            headerName: 'Category',
            width: 150,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Category</span>,
        },
        {
            field: 'service',
            headerName: 'Service',
            width: 120,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Service</span>,
        },
        {
            field: 'dateTime',
            headerName: 'Date & Time',
            width: 180,
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Date & Time</span>,
        },
    ]

    const tellercolumns = [
        {
            field: 'service',
            headerName: 'Service',
            flex: 1

        },
        {
            field: 'direction',
            headerName: 'Transaction Type',
            flex: 1

        },
        {
            field: 'fromAccount',
            headerName: 'From Account',
            flex: 1

        },
        {
            field: 'toAccount',
            headerName: 'To Account',
            flex: 1

        },
        {
            field: 'amount',
            headerName: 'Amount',
            flex: 1

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
                    rows={transactionData}
                    columns={(userData.roles === "ADMIN") ? columns : tellercolumns}
                    components={{ Toolbar: GridToolbar }}
                    checkboxSelection
                    disableSelectionOnClick
                    loading={pending}
                />
            </Box>
        </Box>

    )
}

export default ViewTransactions
