import { Box, TextField, useTheme, Grid, Paper, Typography, Button, Snackbar, Alert } from '@mui/material';
import React, { useState } from 'react';
import { tokens } from '../../../../theme';
import { useSelector } from 'react-redux';
import CBS_Services from '../../../../services/api/GAV_Sercives';

const CorpAccount = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [formData, setFormData] = useState({
        corporationId: '',
        name: '',
        cbsAccountNumber: '',
        hasCbsAccount: true,
        dailyAccountThreshold: 0,
        otherCbs: true,
    });
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

    const userData = useSelector((state) => state.users);
    const token = userData.token;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleConfirmAdd = async () => {
        setLoading(true);
        try {
            const payload = {
                serviceReference: 'CREATE_CORP_ACCOUNT',
                requestBody: JSON.stringify(formData),
            };
            const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
            console.log("addresponse", response);

            if (response && response.body.meta.statusCode === 200) {
                showSnackbar('Corporate Account Created Successfully.', 'success');
            } else {
                showSnackbar(response.body.errors || 'Error while adding Corporate Account', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showSnackbar('Error Try Again Later', 'error');
        }
        setLoading(false);
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
                height: '100%',
                maxHeight: '80vh',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    flex: 1,
                    overflow: 'auto',
                    backgroundColor: colors.primary[400],
                    padding: '20px',
                    borderRadius: '5px 5px 0 0',
                }}
            >
                <Typography variant="h5" color={colors.greenAccent[400]} sx={{ m: "0 10px 15px 5px" }}>
                    Create a Corporate Account
                </Typography>
                <Grid container spacing={2}>

                    <Grid item xs={12} sm={6} md={12}>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <TextField
                            fullWidth
                            label="Corporation ID"
                            name="corporationId"
                            value={formData.corporationId}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={6}>
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
                            label="Has CBS Account"
                            name="hasCbsAccount"
                            value={formData.hasCbsAccount ? 'true' : 'false'}
                            onChange={(e) => setFormData({ ...formData, hasCbsAccount: e.target.value === 'true' })}
                            variant="outlined"
                            select
                            SelectProps={{ native: true }}
                        >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            label="Other CBS"
                            name="otherCbs"
                            value={formData.otherCbs ? 'true' : 'false'}
                            onChange={(e) => setFormData({ ...formData, otherCbs: e.target.value === 'true' })}
                            variant="outlined"
                            select
                            SelectProps={{ native: true }}
                        >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </TextField>
                    </Grid>
                </Grid>
            </Paper>
            <Box
                sx={{
                    backgroundColor: colors.blueAccent[700],
                    padding: '10px',
                    borderRadius: '0 0 5px 5px',
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
    );
};

export default CorpAccount;
