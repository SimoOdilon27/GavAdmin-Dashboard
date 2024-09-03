import { Box, Button, Tab, Tabs, useTheme } from '@mui/material';
import React from 'react'
import { tokens } from '../../../theme';
import Header from '../../../components/Header';
import { Add } from '@mui/icons-material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import OtherCharges from './ChargesConfigurations/OtherCharges';
import ChargesRange from './ChargesConfigurations/ChargesRange';
import BankCharges from './ChargesConfigurations/BankCharges';
import AssignCharges from './ChargesConfigurations/AssignCharges';


const Charges = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Pricing Configuration" subtitle="Configure your Pricing" />

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
                                <Tab label="Other Charges" value="1" />
                                <Tab label="Charges Ranges" value="2" />
                                <Tab label="Bank Charges" value="3" />
                                <Tab label="Assign Charges" value="4" />
                            </TabList>
                        </Box>
                        <TabPanel value="1" ><OtherCharges /></TabPanel>
                        <TabPanel value="2"><ChargesRange /></TabPanel>
                        <TabPanel value="3"><BankCharges /></TabPanel>
                        <TabPanel value="4"><AssignCharges /></TabPanel>
                    </TabContext>
                </Box>
            </Box>



        </Box>
    )
}

export default Charges
