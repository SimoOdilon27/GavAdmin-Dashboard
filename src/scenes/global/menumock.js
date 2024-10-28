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
import { AccountCircle, ManageAccounts, MapOutlined, Money, SettingsApplicationsOutlined, SupervisedUserCircleOutlined } from "@mui/icons-material";


const menuData = [
    {
        title: "Dashboard",
        to: "/dashboard",
        icon: <HomeOutlinedIcon />,
        roles: ["ADMIN", "ADMIN_CORPORATION", "TELLER"]
    },
    {
        category: "Accounts",
        roles: ["ADMIN", "ADMIN_CORPORATION"],
        subItems: [
            {
                title: "Accounts",
                to: "/bankaccount",
                icon: <AttachMoneyIcon />
            },
            {
                title: "Investments",
                to: "/bankinvestment",
                icon: <TrendingDownIcon />
            }
        ]
    },
    {
        category: "Operations",
        roles: ["TELLER", "ADMIN", "ADMIN_CORPORATION", "ADMIN_BANK", "ADMIN_BRANCH"],
        subItems: [
            {
                title: "Operations",
                to: "/cashtransactions",
                icon: <WalletIcon />,
                roles: ["TELLER"]
            },
            {
                title: "Transactions",
                to: "/viewtransactions",
                icon: <TrendingDownIcon />
            }
        ]
    },
    {
        category: "Client Management",
        roles: ["ADMIN", "ADMIN_CORPORATION", "ADMIN_BANK", "ADMIN_BRANCH"],
        subItems: [
            {
                title: "Clients",
                to: "/client",
                icon: <PersonOutlinedIcon />
            }
        ]
    },
    {
        category: "GIMAC Services",
        roles: ["ADMIN"],
        subItems: [
            {
                title: "Wallet",
                to: "/gimac-wallets",
                icon: <WalletIcon />
            },
            {
                title: "Countries",
                to: "/gimac-countries",
                icon: <PublicIcon />
            }
        ]
    },
    {
        category: "Administration",
        roles: ["ADMIN", "ADMIN_CORPORATION", "ADMIN_BANK", "ADMIN_BRANCH"],
        subItems: [
            {
                title: "Corporation",
                to: "/corporation",
                icon: <CorporateFareIcon />,

            },
            {
                title: "Bank",
                to: "/bank",
                icon: <AccountBalanceIcon />
            },
            {
                title: "Branches",
                to: "/branches",
                icon: <PlaceIcon />
            },
            {
                title: "Teller",
                to: "/tellers",
                icon: <GroupIcon />
            }
        ]

    },
    {
        category: "Authorization",
        roles: ["ADMIN", "ADMIN_CORPORATION", "ADMIN_BANK", "ADMIN_BRANCH"],
        subItems: [
            {
                title: "Roles",
                to: "/rolemanagement",
                icon: <PersonOutlinedIcon />,

            },
            {
                title: "Users",
                to: "/usermanagement",
                icon: <SupervisedUserCircleOutlined />
            },
            {
                title: "Menus",
                to: "/menu-catalog",
                icon: <CollectionsIcon />,

            },
            {
                title: " Create Menu",
                to: "/createmenu",
                icon: <CollectionsIcon />,

            },
            {
                title: "Space Management",
                to: "/space-management",
                icon: <CollectionsIcon />,

            },
            {
                title: "Type Management",
                to: "/type-management",
                icon: <CollectionsIcon />,

            }
        ]

    },
    {
        category: "Account Settings",
        roles: ["ADMIN"],
        subItems: [
            {
                title: "Account Type",
                to: "/accounttype",
                icon: <ManageAccounts />
            },
            {
                title: "Charges",
                to: "/charges",
                icon: <TagIcon />
            }
        ]
    }
];

export default menuData;
