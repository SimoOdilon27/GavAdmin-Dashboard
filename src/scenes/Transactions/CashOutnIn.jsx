import { Box, Button, Tab, Tabs, useTheme } from '@mui/material';
import React from 'react'
import { Add, AttachMoney, MoneyOff } from '@mui/icons-material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import Header from '../../components/Header';
import { tokens } from '../../theme';
import CashIn from './cashtransactions/CashIn';
import CashOut from './cashtransactions/CashOut';


const CashOutnIn = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Cash In/Out" subtitle="Carry Out your Cash In/Out Transactions" />


            </Box>

            <Box
                m="10px 15px 15px 15px"
                height="70vh"
            >
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{
                            backgroundColor: colors.blueAccent[700],
                            color: colors.grey[100],
                            fontSize: "14px",
                            fontWeight: "bold",
                            // padding: "10px 20px 0px 0px",
                            marginRight: "60px",
                            marginLeft: "60px",
                            borderRadius: "10px",
                            // '& .MuiTabs-indicator': {
                            //     backgroundColor: colors.greenAccent[500],
                            //     height: 3,
                            // },
                            '& .MuiTab-root': {
                                backgroundColor: colors.blueAccent[700],
                                borderRadius: '8px 8px 0 0',
                                margin: '0 5px',
                                '&.Mui-selected': {
                                    // backgroundColor: colors.blueAccent[500],
                                    color: theme.palette.mode === 'light' ? 'black' : `${colors.greenAccent[400]}`, // Dark label for light mode, white for dark mode

                                },
                            },
                        }}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example" centered>
                                <Tab label="Cash In" value="1" icon={<AttachMoney />} iconPosition="start" />
                                <Tab label="Cash Out" value="2" icon={<MoneyOff />} iconPosition="end" />

                            </TabList>
                        </Box>
                        <TabPanel value="1" ><CashIn /></TabPanel>
                        <TabPanel value="2"><CashOut /></TabPanel>

                    </TabContext>
                </Box>
            </Box>



        </Box>
    )
}

export default CashOutnIn
