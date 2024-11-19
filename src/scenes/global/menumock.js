const menuData = [
    {
        title: "Dashboard",
        to: "/dashboard",
        icon: "HomeOutlinedIcon",

    },
    {
        category: "Accounts",

        subItems: [
            {
                title: "Accounts",
                to: "/bankaccount",
                icon: "AttachMoneyIcon"
            },
            {
                title: "Investments",
                to: "/bankinvestment",
                icon: "TrendingDownIcon"
            }
        ]
    },
    {
        category: "Operations",
        subItems: [
            {
                title: "Operations",
                to: "/cashtransactions",
                icon: "WalletIcon",

            },
            {
                title: "Transactions",
                to: "/viewtransactions",
                icon: "TrendingDownIcon"
            }
        ]
    },
    {
        category: "Client Management",

        subItems: [
            {
                title: "Clients",
                to: "/client",
                icon: "PersonOutlinedIcon"
            }
        ]
    },
    {
        category: "GIMAC Services",

        subItems: [
            {
                title: "Wallet",
                to: "/gimac-wallets",
                icon: "WalletIcon"
            },
            {
                title: "Countries",
                to: "/gimac-countries",
                icon: "PublicIcon"
            }
        ]
    },
    {
        category: "Administration",

        subItems: [
            {
                title: "Corporation",
                to: "/corporation",
                icon: "CorporateFareIcon",

            },
            {
                title: "Bank",
                to: "/bank",
                icon: "AccountBalanceIcon"
            },
            {
                title: "Branches",
                to: "/branches",
                icon: "PlaceIcon"
            },
            {
                title: "Teller",
                to: "/tellers",
                icon: "GroupIcon"
            }
        ]

    },
    {
        category: "Authorization",

        subItems: [
            {
                title: "Roles",
                to: "/rolemanagement",
                icon: "PersonOutlinedIcon",

            },
            {
                title: "Users",
                to: "/usermanagement",
                icon: "SupervisedUserCircleOutlined"
            },
            {
                title: "Resources",
                to: "/menu-catalog",
                icon: "CollectionsIcon",

            },
            {
                title: "Menus",
                to: "/menus",
                icon: "CollectionsIcon",

            },
            {
                title: " Create Menu",
                to: "/createmenu",
                icon: "CollectionsIcon",

            },
            {
                title: "Space Management",
                to: "/space-management",
                icon: "CollectionsIcon",

            },
            {
                title: "Space Category",
                to: "/type-management",
                icon: "CollectionsIcon",

            }
        ]

    },
    {
        category: "Account Settings",

        subItems: [
            {
                title: "Account Type",
                to: "/accounttype",
                icon: "ManageAccounts"
            },
            {
                title: "Charges",
                to: "/charges",
                icon: "TagIcon"
            }
        ]
    }
];

export default menuData;
