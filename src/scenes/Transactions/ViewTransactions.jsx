import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Header from '../../components/Header';
import { Box, Button, Card, CardContent, IconButton, TextField, Tooltip, Typography, useTheme } from '@mui/material';
import CBS_Services from '../../services/api/GAV_Sercives';
import { tokens } from '../../theme';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Receipt, Refresh, Search } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Badge } from '@mui/material';
import { formatValue } from '../../tools/formatValue';


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
    const spaceId = userData?.selectedSpace?.id

    const [pageInput, setPageInput] = useState("1");
    const [sizeInput, setSizeInput] = useState("10");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(false);


    const [tellerAccountID, setTellerAccountID] = useState('')


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


    const FetchTransaction = async (page, pageSize) => {
        setPending(true);
        try {
            let payload = {}

            if (userData.selectedSpace?.role === 'BRANCH_TELLER') {
                payload = {
                    serviceReference: 'GET_TRANSACTION_BY_ACCOUNT_NUMBER',
                    requestBody: tellerAccountID,
                    spaceId: spaceId,
                }
            }
            else {
                payload = {
                    serviceReference: 'GET_ALL_TRANSACTIONS',
                    requestBody: JSON.stringify({
                        page: page,
                        size: pageSize,

                    }),
                    spaceId: spaceId
                }
            }

            console.log("payload", payload);


            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            // const response = await CBS_Services('TRANSACTION', 'api/v1/transactions/getAll', 'GET', null);
            console.log("erer", response);

            if (response && response.status === 200) {

                if (userData.selectedSpace?.role === 'BRANCH_TELLER') {
                    const data = response.body.data.map((item, index) => ({
                        id: index + 1, // Assign a unique id to each row
                        service: item.service,
                        direction: item.direction,
                        fromAccount: item.fromAccount,
                        toAccount: item.toAccount,
                        amount: item.amount,
                    }));
                    setTransactionData(data || [])
                } else {
                    setTransactionData(response.body.data || '');
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

    useEffect(() => {
        FetchTransaction(currentPage, pageSize);
    }, [tellerAccountID]);

    const handleFetchData = () => {
        const newPage = parseInt(pageInput);
        const newSize = parseInt(sizeInput);

        if (isNaN(newPage) || isNaN(newSize) || newPage < 1 || newSize < 1) {
            return;
        }

        setCurrentPage(newPage);
        setPageSize(newSize);
        FetchTransaction(newPage, newSize);
    };

    const handleRefresh = () => {
        FetchTransaction(currentPage, pageSize);
    };

    console.log("tellerid==", tellerAccountID);


    useEffect(() => {
        GetTellerAccountID();
    }, [])

    const statusBadgeStyles = {
        PENDING: { backgroundColor: 'orange', color: 'white' },
        SUCCESSFUL: { backgroundColor: 'green', color: 'white' },
        FAILED: { backgroundColor: 'red', color: 'white' },
    };

    const columns = [
        {
            field: 'dateTime',
            headerName: 'Date & Time',
            flex: 1, headerAlign: "center", align: "center",
            valueGetter: (params) => formatValue(params.value),
        },

        {
            field: 'fromAccount',
            headerName: 'From Account',
            flex: 1, headerAlign: "center", align: "center",
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>From Account</span>,

        },
        {
            field: 'toAccount',
            headerName: 'To Account',
            flex: 1, headerAlign: "center", align: "center",
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>To Account</span>,
        },

        {
            field: 'direction',
            headerName: 'Direction',
            flex: 1, headerAlign: "center", align: "center",
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Transaction Type</span>,
            valueGetter: (params) => formatValue(params.value),
        },
        {
            field: 'amount',
            headerName: 'Amount',
            flex: 1, headerAlign: "center", align: "center",
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Amount</span>,
            valueGetter: (params) => formatValue(params.value),
        },


        {
            field: 'service',
            headerName: 'Service',
            flex: 1, headerAlign: "center", align: "center",
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Service</span>,
            valueGetter: (params) => formatValue(params.value),
        },

        {
            field: 'status',
            headerName: 'Status',
            flex: 1, headerAlign: "center", align: "center",
            renderHeader: () => <span style={{ fontWeight: 'bold' }}>Status</span>,
            renderCell: (params) => (
                <div
                    style={{
                        padding: '5px 10px',
                        borderRadius: '12px',
                        backgroundColor: statusBadgeStyles[params.value]?.backgroundColor,
                        color: statusBadgeStyles[params.value]?.color,
                        textAlign: 'center',
                    }}
                >
                    {params.value}
                </div>
            ),
        },


    ]

    const tellercolumns = [
        {
            field: 'service',
            headerName: 'Service',
            flex: 1,
            headerAlign: "center", align: "center",
            valueGetter: (params) => formatValue(params.value),

        },
        {
            field: 'direction',
            headerName: 'Transaction Type',
            flex: 1,
            headerAlign: "center", align: "center",
            valueGetter: (params) => formatValue(params.value),

        },
        {
            field: 'fromAccount',
            headerName: 'From Account',
            flex: 1,
            headerAlign: "center", align: "center",
            valueGetter: (params) => formatValue(params.value),

        },
        {
            field: 'toAccount',
            headerName: 'To Account',
            flex: 1,
            headerAlign: "center", align: "center",
            valueGetter: (params) => formatValue(params.value),

        },
        {
            field: 'amount',
            headerName: 'Amount',
            flex: 1,
            headerAlign: "center", align: "center",
            valueGetter: (params) => formatValue(params.value),

        },
    ]

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="TRANSACTIONS" subtitle="View all transactions" />

            </Box>

            <Card sx={{ backgroundColor: colors.primary[400], mb: 3 }}>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box>
                            <Typography variant="h5" color={colors.greenAccent[500]}>
                                <Receipt sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Teller Transactions
                            </Typography>
                            <Typography variant="body2" color={colors.grey[400]} mt={1}>
                                Showing transactions for this teller
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                            <Typography variant="body2" color={colors.grey[400]} mr={2}>
                                Total Records: {rowCount}
                            </Typography>
                        </Box>
                    </Box>

                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                        <Box display="flex" alignItems="center" gap={2}>
                            <TextField
                                label="Page"
                                variant="outlined"
                                size="small"
                                value={pageInput}
                                onChange={(e) => setPageInput(e.target.value)}
                                sx={{
                                    width: '80px',
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: colors.grey[400] },
                                        '&:hover fieldset': { borderColor: colors.grey[300] },
                                    },
                                    '& .MuiInputLabel-root': { color: colors.grey[400] },
                                    '& input': { color: colors.grey[100] },
                                }}
                            />
                            <TextField
                                label="Size"
                                variant="outlined"
                                size="small"
                                value={sizeInput}
                                onChange={(e) => setSizeInput(e.target.value)}
                                sx={{
                                    width: '80px',
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: colors.grey[400] },
                                        '&:hover fieldset': { borderColor: colors.grey[300] },
                                    },
                                    '& .MuiInputLabel-root': { color: colors.grey[400] },
                                    '& input': { color: colors.grey[100] },
                                }}
                            />
                            <LoadingButton
                                variant="contained"
                                color="secondary"
                                onClick={handleFetchData}
                                loading={loading}
                                loadingPosition="start"
                                startIcon={<Search />}
                            >
                                Fetch Data
                            </LoadingButton>
                            <Tooltip title="Refresh current page">
                                <IconButton onClick={handleRefresh} sx={{ color: colors.grey[300] }}>
                                    <Refresh />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Box>
                            <Typography variant="body2" color={colors.grey[400]}>
                                Current Page: {currentPage} | Page Size: {pageSize}
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

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
                    columns={(userData.selectedSpace?.role === 'BRANCH_TELLER') ? tellercolumns : columns}
                    components={{ Toolbar: GridToolbar }}
                    // checkboxSelection
                    disableSelectionOnClick
                    loading={pending}
                />
            </Box>
        </Box>

    )
}

export default ViewTransactions
