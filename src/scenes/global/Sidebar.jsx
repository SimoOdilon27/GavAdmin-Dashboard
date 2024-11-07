import { useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
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
import { tokens } from "../../theme";
import { AccountCircle, ManageAccounts, MapOutlined, Money, SettingsApplicationsOutlined, SupervisedUserCircleOutlined } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { formatValue } from "../../tools/formatValue";
import menuData from "./menumock";
import CBS_Services from "../../services/api/GAV_Sercives";
import { AVAILABLE_ICONS } from "../settings/menucatalog/IconSelector";
import FullscreenLoader from "../../tools/FullscreenLoader";



const renderIcon = (iconName) => {
  const IconComponent = AVAILABLE_ICONS[iconName];
  return IconComponent ? <IconComponent /> : <MenuOutlinedIcon />; // Fallback icon
};


const Item = ({ title, route, icon, selected, setSelected, closeSubmenu }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],

      }}
      onClick={() => {
        setSelected(title);

      }}
      icon={renderIcon(icon)}
    >
      <Typography>{title}</Typography>
      <Link to={route} />
    </MenuItem>
  );
};



// const Sidebar = () => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [selected, setSelected] = useState("Dashboard");
//   const [expandedSubMenu, setExpandedSubMenus] = useState([]);
//   const [openSubmenu, setOpenSubmenu] = useState(null);

//   const userData = useSelector((state) => state.users);
//   const userName = userData.userName;
//   const role = userData.roles;

//   console.log("role", role);


//   const handleSubMenuClick = (menuName) => {
//     if (openSubmenu === menuName) {
//       setOpenSubmenu(null); // Close if it's already open
//     } else {
//       setOpenSubmenu(menuName); // Open the clicked submenu
//     }

//     if (isCollapsed) {
//       setIsCollapsed(false);
//     }
//   };

//   const closeSubmenu = () => {
//     setOpenSubmenu(null);
//   };

//   return (

//     <Box
//       sx={{
//         "& .pro-sidebar-inner": {
//           background: `${colors.primary[400]} !important`,
//         },
//         "& .pro-icon-wrapper": {
//           backgroundColor: "transparent !important",
//         },
//         "& .pro-inner-item": {
//           padding: "5px 35px 5px 20px !important",
//         },
//         "& .pro-inner-item:hover": {
//           color: "#868dfb !important",
//         },
//         "& .pro-menu-item.active": {
//           color: "#6870fa !important",
//         },

//         // Add styles for submenu
//         "& .pro-menu-item": {  // This targets all menu items
//           margin: "10px 0",    // Add vertical margin
//         },
//         "& .pro-sub-menu": {
//           "& .pro-inner-list-item": {
//             "& div": {
//               padding: "5px 5px 5px 20px !important",  // Indent submenu items
//             },
//           },
//         },
//       }}
//     >
//       <ProSidebar collapsed={isCollapsed}>
//         <Menu iconShape="square">
//           {/* LOGO AND MENU ICON */}
//           <MenuItem
//             onClick={() => setIsCollapsed(!isCollapsed)}
//             icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
//             style={{
//               margin: "10px 0 20px 0",
//               color: colors.grey[100],
//             }}
//           >
//             {!isCollapsed && (
//               <Box
//                 display="flex"
//                 justifyContent="space-between"
//                 alignItems="center"
//                 ml="15px"
//               >
//                 <Typography variant="h3" color={colors.grey[100]}>
//                   GAV
//                 </Typography>
//                 <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
//                   <MenuOutlinedIcon />
//                 </IconButton>
//               </Box>
//             )}
//           </MenuItem>

//           {!isCollapsed && (
//             <Box mb="25px">
//               <Box display="flex" justifyContent="center" alignItems="center">
//                 <img
//                   alt="profile-user"
//                   width="80px"
//                   height="80px"
//                   src={`../../assets/icons8-administrator-male.png`}
//                   style={{ cursor: "pointer", borderRadius: "50%" }}
//                 />
//               </Box>
//               <Box textAlign="center">
//                 <Typography
//                   variant="h2"
//                   color={colors.grey[100]}
//                   fontWeight="bold"
//                   sx={{ m: "10px 0 0 0" }}
//                 >
//                   {formatValue(userName)}
//                 </Typography>
//                 <Typography variant="h5" color={colors.greenAccent[500]}>
//                   {formatValue(role)}
//                 </Typography>
//               </Box>
//             </Box>
//           )}

//           <Box paddingLeft={isCollapsed ? undefined : "10%"}>
//             <Item
//               title="Dashboard"
//               to="/dashboard"
//               icon={<HomeOutlinedIcon />}
//               selected={selected}
//               setSelected={setSelected}
//               closeSubmenu={closeSubmenu}
//             />


//             <>
//               {(role === "ADMIN" || role === "ADMIN_CORPORATION") &&
//                 <>
//                   <Typography
//                     variant="h6"
//                     color={colors.grey[300]}
//                     sx={{ m: "15px 0 5px 20px" }}
//                   >
//                     Accounts
//                   </Typography>

//                   <Item
//                     title="Accounts"
//                     to="/bankaccount"
//                     icon={<AttachMoneyIcon />}
//                     selected={selected}
//                     closeSubmenu={closeSubmenu}
//                   />

//                   <Item
//                     title="Investments"
//                     to="/bankinvestment"
//                     icon={<TrendingDownIcon />}
//                     selected={selected}
//                     setSelected={setSelected}
//                     closeSubmenu={closeSubmenu}
//                   />
//                 </>
//               }

//               <>
//                 <Typography
//                   variant="h6"
//                   color={colors.grey[300]}
//                   sx={{ m: "15px 0 5px 20px" }}
//                 >
//                   Operations
//                 </Typography>
//                 {(role === "TELLER") && (
//                   <Item
//                     title="Operations"
//                     to="/cashtransactions"
//                     icon={<WalletIcon />}
//                     selected={selected}
//                     setSelected={setSelected}
//                     closeSubmenu={closeSubmenu}
//                   />
//                 )}

//                 {(role === "ADMIN" || role === "ADMIN_CORPORATION" || role === "ADMIN_BANK" || role === "ADMIN_BRANCH" || role === "TELLER") && (
//                   <Item
//                     title="Transactions"
//                     to="/viewtransactions"
//                     icon={<TrendingDownIcon />}
//                     selected={selected}
//                     setSelected={setSelected}
//                     closeSubmenu={closeSubmenu}
//                   />
//                 )}

//               </>
//               {(role === "ADMIN" || role === "ADMIN_CORPORATION" || role === "ADMIN_BANK" || role === "ADMIN_BRANCH") && (
//                 <>
//                   <Typography
//                     variant="h6"
//                     color={colors.grey[300]}
//                     sx={{ m: "15px 0 5px 20px" }}
//                   >
//                     Client Management
//                   </Typography>

//                   <Item
//                     title="Clients"
//                     to="/client"
//                     icon={<PersonOutlinedIcon />}
//                     selected={selected}
//                     setSelected={setSelected}
//                     closeSubmenu={closeSubmenu}
//                   />
//                 </>
//               )}


//               {role === "ADMIN" && (
//                 <>
//                   <Typography
//                     variant="h6"
//                     color={colors.grey[300]}
//                     sx={{ m: "15px 0 5px 20px" }}
//                   >
//                     GIMAC Services
//                   </Typography>
//                   <Item
//                     title="Wallet"
//                     to="/gimac-wallets"
//                     icon={<WalletIcon />}
//                     selected={selected}
//                     setSelected={setSelected}
//                     closeSubmenu={closeSubmenu}
//                   />
//                   <Item
//                     title="Countries"
//                     to="/gimac-countries"
//                     icon={<PublicIcon />}
//                     selected={selected}
//                     setSelected={setSelected}
//                     closeSubmenu={closeSubmenu}
//                   />
//                 </>

//               )}


//               {(role === "ADMIN" || role === "ADMIN_CORPORATION" || role === "ADMIN_BANK" || role === "ADMIN_BRANCH") && (

//                 <>
//                   <Typography
//                     variant="h6"
//                     color={colors.grey[300]}
//                     sx={{ m: "15px 0 5px 20px" }}
//                   >
//                     SETTINGS
//                   </Typography>

//                   <SubMenu
//                     title="Administration"
//                     icon={<SettingsApplicationsOutlined />}
//                     open={openSubmenu === "settings"}
//                     onOpenChange={() => handleSubMenuClick("settings")}
//                     sx={{ m: "15px 0 5px 20px" }}
//                   >
//                     {(role === "ADMIN") && (
//                       <>
//                         <Item
//                           title="Corporation"
//                           to="/corporation"
//                           icon={<CorporateFareIcon />}
//                           selected={selected}
//                           setSelected={setSelected}
//                           sx={{ m: "15px 0 5px 20px" }}
//                         />
//                       </>

//                     )}

//                     {(role === "ADMIN" || role === "ADMIN_CORPORATION") &&
//                       <Item
//                         title="Bank"
//                         to="/bank"
//                         icon={<AccountBalanceIcon />}
//                         selected={selected}
//                         setSelected={setSelected}
//                       />
//                     }

//                     {(role === "ADMIN" || role === "ADMIN_CORPORATION" || role === "ADMIN_BANK") && (
//                       <Item
//                         title="Branches"
//                         to="/branches"
//                         icon={<PlaceIcon />}
//                         selected={selected}
//                         setSelected={setSelected}
//                       />
//                     )}


//                     {(role === "ADMIN" || role === "ADMIN_CORPORATION" || role === "ADMIN_BANK" || role === "ADMIN_BRANCH") && (
//                       <Item
//                         title="Teller"
//                         to="/tellers"
//                         icon={<GroupIcon />}
//                         selected={selected}
//                         setSelected={setSelected}
//                       />
//                     )}


//                   </SubMenu>
//                 </>

//               )}

//               {(role === "ADMIN" || role === "ADMIN_CORPORATION" || role === "ADMIN_BANK" || role === "ADMIN_BRANCH") && (

//                 <>
//                   <SubMenu
//                     title="Authorization"
//                     icon={<CollectionsIcon />}
//                     open={openSubmenu === "authorization"}
//                     onOpenChange={() => handleSubMenuClick("authorization")}
//                   >
//                     {(role === "ADMIN") && (
//                       <Item
//                         title="Roles"
//                         to="/rolemanagement"
//                         icon={<PersonOutlinedIcon />}
//                         selected={selected}
//                         setSelected={setSelected}
//                       />
//                     )}

//                     {(role === "ADMIN" || role === "ADMIN_CORPORATION" || role === "ADMIN_BANK" || role === "ADMIN_BRANCH") && (
//                       <Item
//                         title="Users"
//                         to="/usermanagement"
//                         icon={<SupervisedUserCircleOutlined />}
//                         selected={selected}
//                         setSelected={setSelected}
//                       />
//                     )}

//                     {(role === "ADMIN") && (
//                       <Item
//                         title="Menus"
//                         to="/menu-catalog"
//                         icon={<CollectionsIcon />}
//                         selected={selected}
//                         setSelected={setSelected}
//                       />
//                     )}

//                   </SubMenu>

//                   {(role === "ADMIN") && (
//                     <>
//                       <Item
//                         title="Account Type"
//                         to="/accounttype"
//                         icon={<ManageAccounts />}
//                         selected={selected}
//                         setSelected={setSelected}
//                         closeSubmenu={closeSubmenu}
//                       />
//                       <Item
//                         title="Charges"
//                         to="/charges"
//                         icon={<TagIcon />}
//                         selected={selected}
//                         setSelected={setSelected}
//                         closeSubmenu={closeSubmenu}
//                       />
//                     </>
//                   )}
//                 </>
//               )}
//             </>


//           </Box>
//         </Menu>
//       </ProSidebar>
//     </Box>
//   );
// };



const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const userData = useSelector((state) => state.users);
  const role = userData?.selectedSpace?.role;
  const userName = userData.userName;
  const UserSpace = userData?.selectedSpace?.id;
  const UserId = userData.userId;
  const token = userData.token;
  const storeMenus = useSelector((state) => state.users.menus);
  const [menus, setMenus] = useState(storeMenus || []);
  const [loading, setLoading] = useState(false)




  const handleSubMenuClick = (menuName) => {
    if (openSubmenu === menuName) {
      setOpenSubmenu(null); // Close if it's already open
    } else {
      setOpenSubmenu(menuName); // Open the clicked submenu
    }

    if (isCollapsed) {
      setIsCollapsed(false);
    }
  };

  const closeSubmenu = () => {
    setOpenSubmenu(null);
  };

  const handleGetUserMenus = async () => {
    setLoading(true);
    try {

      const response = await CBS_Services("GATEWAY", `clientGateWay/items/searchItems/${UserId}/${UserSpace}`, "GET", null, token)
      console.log("response", response);

      if (response.status === 200) {
        setMenus(response.body.data);
      }
      else {
        setMenus([]);
      }

    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  useEffect(() => {
    handleGetUserMenus();
  }, [])

  useEffect(() => {
    setMenus(storeMenus);
  }, [storeMenus]);

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
        "& .pro-menu-item": {
          margin: "10px 0", // Add vertical margin
        },
        "& .pro-sub-menu .pro-inner-list-item div": {
          padding: "5px 5px 5px 20px !important", // Indent submenu items
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  GAV
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="80px"
                  height="80px"
                  src={`../../assets/icons8-administrator-male.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {formatValue(userName)}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  {formatValue(role)}
                </Typography>
              </Box>
            </Box>
          )}



          {loading ? <FullscreenLoader /> :

            <Box paddingLeft={isCollapsed ? undefined : "5%"}>
              {menus
                .sort((a, b) => a.menuOrder - b.menuOrder)  // Sort main menus by descending menuOrder
                .map((menu) => {
                  if (menu.subItemList && menu.subItemList.length > 0) {
                    return (
                      <SubMenu
                        key={menu.id}
                        title={menu.title}
                        icon={menu.icon}
                        open={openSubmenu === menu.category}
                        onOpenChange={() => handleSubMenuClick(menu.category)}
                      >
                        {menu.subItemList
                          .map((subItem) => (
                            <Item
                              key={subItem.id}
                              title={subItem.title}
                              route={subItem.route}
                              icon={subItem.icon}
                              selected={selected}
                              setSelected={setSelected}
                              closeSubmenu={closeSubmenu}
                            />
                          ))}
                      </SubMenu>
                    );
                  } else {
                    return (
                      <Item
                        key={menu.id}
                        title={menu.title}
                        route={menu.route || "/dashboard"}
                        icon={menu.icon}
                        selected={selected}
                        setSelected={setSelected}
                        closeSubmenu={closeSubmenu}
                      />
                    );
                  }
                })}
            </Box>



          }
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;

