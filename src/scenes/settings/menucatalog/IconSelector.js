import React from 'react';
import { TextField, Autocomplete, Box } from '@mui/material';
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import BusinessIcon from "@mui/icons-material/Business";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PlaceIcon from "@mui/icons-material/Place";
import GroupIcon from "@mui/icons-material/Group";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import WalletIcon from "@mui/icons-material/Wallet";
import PublicIcon from "@mui/icons-material/Public";
import CollectionsIcon from "@mui/icons-material/Collections";
import TagIcon from "@mui/icons-material/Tag";
import {
    AccountCircle,
    AdminPanelSettings,
    Extension,
    ManageAccounts,
    MapOutlined,
    Money,
    Settings,
    SettingsApplicationsOutlined,
    SupervisedUserCircleOutlined,
    SupervisorAccountRounded,
    TypeSpecimen,
    Widgets
} from "@mui/icons-material";

export const AVAILABLE_ICONS = {
    HomeOutlinedIcon: HomeOutlinedIcon,
    PeopleOutlinedIcon: PeopleOutlinedIcon,
    ReceiptOutlinedIcon: ReceiptOutlinedIcon,
    PersonOutlinedIcon: PersonOutlinedIcon,
    CalendarTodayOutlinedIcon: CalendarTodayOutlinedIcon,
    HelpOutlineOutlinedIcon: HelpOutlineOutlinedIcon,
    MenuOutlinedIcon: MenuOutlinedIcon,
    CorporateFareIcon: CorporateFareIcon,
    BusinessIcon: BusinessIcon,
    AccountBalanceIcon: AccountBalanceIcon,
    PlaceIcon: PlaceIcon,
    GroupIcon: GroupIcon,
    AttachMoneyIcon: AttachMoneyIcon,
    TrendingDownIcon: TrendingDownIcon,
    WalletIcon: WalletIcon,
    PublicIcon: PublicIcon,
    CollectionsIcon: CollectionsIcon,
    TagIcon: TagIcon,
    AccountCircle: AccountCircle,
    ManageAccounts: ManageAccounts,
    MapOutlined: MapOutlined,
    Money: Money,
    SettingsApplicationsOutlined: SettingsApplicationsOutlined,
    SupervisedUserCircleOutlined: SupervisedUserCircleOutlined,
    Widgets: Widgets,
    Extension: Extension,
    TypeSpecimen: TypeSpecimen,
    AdminPanelSettings: AdminPanelSettings,
    SupervisorAccountRounded: SupervisorAccountRounded,
    Settings: Settings,
};

const IconSelector = ({ value, onChange, error, helperText, label = "Select Icon" }) => {
    const iconNames = Object.keys(AVAILABLE_ICONS);

    return (
        <Autocomplete
            options={iconNames}
            value={value || null}
            onChange={(_, newValue) => onChange(newValue)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    variant="filled"
                    error={error}
                    helperText={helperText}
                    fullWidth
                    sx={{
                        mb: 2, // Add margin-bottom for better spacing
                    }}
                />
            )}
            renderOption={(props, option) => {
                const Icon = AVAILABLE_ICONS[option];
                return (
                    <Box
                        component="li"
                        {...props}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2, // Increase the gap between icon and text
                            p: 1, // Add padding for spacing inside the option
                            "&:hover": { backgroundColor: '#f0f0f0' }, // Add hover effect
                            cursor: 'pointer'
                        }}
                    >
                        <Icon fontSize="small" />
                        <span>{option}</span>
                    </Box>
                );
            }}
            isOptionEqualToValue={(option, value) => option === value}
            getOptionLabel={(option) => option}
            freeSolo={false}
            sx={{
                cursor: 'pointer'
            }}

        />
    );
};

export default IconSelector;
