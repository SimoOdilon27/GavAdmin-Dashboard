import { Box, Button, Tab, Tabs, useTheme } from '@mui/material';
import React from 'react'
import { tokens } from '../../../theme';
import Header from '../../../components/Header';
import { Add } from '@mui/icons-material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import TellerAccount from './telleracc/TellerAccount';
import CorpAccount from './corpacc/CorpAccount';
import BranchAccount from './branchacc/BranchAccount';
import BankAcc from './bankacc/BankAcc';
import ClientAccount from './clientacc/ClientAccount';

const AllAccounts = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Account Management" subtitle="Create Accounts" />

                <Box  >
                    {/* <Button
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
                    </Button> */}
                </Box>
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
                            padding: "10px 20px 1px 20px",
                            marginRight: "10px",
                            borderRadius: "10px",
                        }}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example" centered>
                                <Tab label="Teller Account" value="1" />
                                <Tab label="Corporation Account" value="2" />
                                <Tab label="Branch Account" value="3" />
                                <Tab label="Bank Account" value="4" />
                                {/* <Tab label="Client Account" value="5" /> */}
                            </TabList>
                        </Box>
                        <TabPanel value="1" ><TellerAccount /></TabPanel>
                        <TabPanel value="2"><CorpAccount /></TabPanel>
                        <TabPanel value="3"><BranchAccount /></TabPanel>
                        <TabPanel value="4"><BankAcc /></TabPanel>
                        {/* <TabPanel value="5"><ClientAccount /></TabPanel> */}
                    </TabContext>
                </Box>
            </Box>



        </Box>
    )
}

export default AllAccounts
