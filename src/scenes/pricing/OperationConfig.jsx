import { Box, Button, useTheme } from '@mui/material';
import React from 'react'
import { tokens } from '../../theme';
import Header from '../../components/Header';
import { Add } from '@mui/icons-material';

const OperationConfig = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Operation Config" subtitle="Manage your operation configurations" />

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
                    >
                        <Add sx={{ mr: "10px" }} />
                        Add
                    </Button>
                </Box>
            </Box>





        </Box>
    )
}

export default OperationConfig
