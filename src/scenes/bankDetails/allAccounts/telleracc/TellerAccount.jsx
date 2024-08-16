import { Box, TextField, useTheme, Grid, Paper, Typography, Button, Snackbar, Alert } from '@mui/material';
import React, { useState } from 'react'
import { tokens } from '../../../../theme';
import CBS_Services from '../../../../services/api/GAV_Sercives';
import { useSelector } from 'react-redux';

const TellerAccount = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [formData, setFormData] = useState({
        msisdn: '',
        branchId: '',
        bankId: '',
        corporationId: '',
        minimumBound: 0,
        maximumBound: 0,
        cbsClientId: '',
        name: '',
        cbsAccountNumber: '',
        dailyAccountThreshold: 0,
        bankCode: '',
        initialBalance: ''
    });
    const [loading, setLoading] = useState(false)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

    const userData = useSelector((state) => state.users)

    const token = userData.token

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };


    const handleConfirmAdd = async () => {

        setLoading(true)
        try {

            const payload = {
                serviceReference: 'CREATE_TELLER_ACCOUNT',
                requestBody: JSON.stringify(formData)
            }
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            console.log("addresponse", response);

            if (response && response.body.meta.statusCode === 200) {
                showSnackbar('Teller Account Created Successfully.', 'success');

            } else {
                showSnackbar(response.body.errors || 'Error while adding Teller', 'error');

            }
        } catch (error) {
            console.error('Error:', error);
            showSnackbar('Error Try Again Later', 'error');

        }
        setLoading(false)
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%', // Take full height of parent
                maxHeight: '80vh', // Limit maximum height
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    flex: 1,
                    overflow: 'auto', // Enable scrolling
                    backgroundColor: colors.primary[400],
                    padding: '20px',
                    borderRadius: '5px 5px 0 0', // Rounded corners only on top
                }}
            >
                <Typography variant="h5" color={colors.greenAccent[400]} sx={{ m: "0 10px 15px 5px" }}>
                    Create a Teller Account
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            label="MSISDN"
                            name="msisdn"
                            value={formData.msisdn}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            label="Branch ID"
                            name="branchId"
                            value={formData.branchId}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            label="Bank ID"
                            name="bankId"
                            value={formData.bankId}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            label="Corporation ID"
                            name="corporationId"
                            value={formData.corporationId}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            label="Minimum Bound"
                            name="minimumBound"
                            value={formData.minimumBound}
                            onChange={handleChange}
                            variant="outlined"
                            type="number"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            label="Maximum Bound"
                            name="maximumBound"
                            value={formData.maximumBound}
                            onChange={handleChange}
                            variant="outlined"
                            type="number"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="CBS Client ID"
                            name="cbsClientId"
                            value={formData.cbsClientId}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="CBS Account Number"
                            name="cbsAccountNumber"
                            value={formData.cbsAccountNumber}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            label="Daily Account Threshold"
                            name="dailyAccountThreshold"
                            value={formData.dailyAccountThreshold}
                            onChange={handleChange}
                            variant="outlined"
                            type="number"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            label="Bank Code"
                            name="bankCode"
                            value={formData.bankCode}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            label="Initial Balance"
                            name="initialBalance"
                            value={formData.initialBalance}
                            onChange={handleChange}
                            variant="outlined"
                            type="number"
                        />
                    </Grid>
                </Grid>
            </Paper>
            <Box
                sx={{
                    backgroundColor: colors.blueAccent[700],
                    padding: '10px',
                    borderRadius: '0 0 5px 5px', // Rounded corners only on bottom
                    textAlign: 'right',
                }}
            >
                <Button color="secondary" variant="contained"
                    onClick={handleConfirmAdd}

                >{loading ? 'Adding...' : 'Confirm'}</Button>
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
        </Box>
    )
}

export default TellerAccount