import {
  Box,
  IconButton,
  useTheme,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  Typography,
  Select,
  FormControl,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Lock, Refresh } from "@mui/icons-material";
import CBS_Services from "../../services/api/GAV_Sercives";
import FullscreenLoader from "../../tools/FullscreenLoader";

const USER_TIMEOUT = 60 * 60 * 1000;

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });
  // Get user spaces and selected space from Redux store
  const userData = useSelector((state) => state.users);
  const token = userData.token;
  const userSpaces = useSelector((state) => state.users?.listSpaces) || [];
  const selectedSpace = useSelector((state) => state.users?.selectedSpace);
  const Space = useSelector((state) => state.users?.selectedSpace?.intitule);
  const UserId = userData.userId;
  const [space, setSpace] = useState(selectedSpace);
  const storedColorMode = useSelector((state) => state.users.colorMode);

  const handleRefresh = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (storedColorMode && storedColorMode !== theme.palette.mode) {
      colorMode.toggleColorMode();
    }
  }, [storedColorMode]);

  const handleColorModeToggle = () => {
    // Toggle color mode in context
    colorMode.toggleColorMode();

    // Update color mode in Redux store
    dispatch({
      type: "SET_COLOR_MODE",
      colorMode: theme.palette.mode === "dark" ? "light" : "dark",
    });
  };

  const handleSpaceChange = async (event) => {
    const newSpace = event.target.value;
    // Update selected space in Redux
    dispatch({
      type: "SELECT_SPACE",
      selectedSpace: newSpace,
    });

    // Fetch menus for the new space
    await handleGetUserMenus(UserId, newSpace.id);
    setSnackbar({
      open: true,
      message: `Switched to ${newSpace.intitule}`,
      severity: "success",
    });
    // handleRefresh();
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate("/profile"); // Adjust the path as necessary
  };

  const handleLogout = () => {
    handleMenuClose();
    dispatch({
      type: "LOGOUT",
      users: {},
    });
    console.log("Logout");
    navigate("/");
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleGetUserMenus = async (userId, spaceId) => {
    setLoading(true);
    try {
      const response = await CBS_Services(
        "GATEWAY",
        `clientGateWay/items/searchItems/${userId}/${spaceId}`,
        "GET",
        null,
        token
      );
      console.log("response", response);

      if (response.status === 200) {
        // Dispatch menus to Redux store
        dispatch({ type: "SET_MENUS", menus: response.body.data });
      } else {
        dispatch({ type: "SET_MENUS", menus: [] });
        setSnackbar({
          open: true,
          message: "Failed to load menus for the selected space",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching menus:", error);
      setSnackbar({
        open: true,
        message: "Error loading menus. Please try again.",
        severity: "error",
      });
    }
    setLoading(false);
  };

  // Initial menus fetch for the selected space
  useEffect(() => {
    if (selectedSpace && UserId) {
      handleGetUserMenus(UserId, selectedSpace.id);
    }
    setSpace(selectedSpace);
  }, []);

  useEffect(() => {
    // Set a timer to log out the user after 1 hour
    const timer = setTimeout(() => {
      dispatch({ type: "LOGOUT" });
      navigate("/");
      setSnackbar({
        open: true,
        message: "Your Session has expired.Login again!!!.",
        severity: "warning",
      });
    }, USER_TIMEOUT);

    return () => {
      clearTimeout(timer);
    };
  }, [dispatch, navigate]);

  const toCapitalizeCase = (str) => {
    return str.toUpperCase();
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SPACE SWITCHER */}
      {loading ? (
        <FullscreenLoader />
      ) : (
        <>
          <Box
            display="flex"
            alignItems="center"
            backgroundColor={colors.primary[400]}
            borderRadius="3px"
            padding="0 10px"
            width="300px"
          >
            <Typography variant="body4" sx={{ color: colors.grey[300] }}>
              Space:
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={selectedSpace}
                onChange={handleSpaceChange}
                sx={{
                  "& .MuiSelect-select": {
                    py: 1,
                    color:
                      theme.palette.mode === "dark"
                        ? colors.grey[100]
                        : colors.primary[100],
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select Space
                </MenuItem>
                {userSpaces.map(() => (
                  <MenuItem key={space?.id} value={space}>
                    {toCapitalizeCase(space.intitule)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {/* ICONS */}
          <Box display="flex">
            <IconButton onClick={handleColorModeToggle}>
              {theme.palette.mode === "dark" ? (
                <DarkModeOutlinedIcon />
              ) : (
                <LightModeOutlinedIcon />
              )}
            </IconButton>
            <IconButton onClick={handleRefresh}>
              <Refresh />
            </IconButton>
            <IconButton>
              <NotificationsOutlinedIcon />
            </IconButton>

            <IconButton>
              <SettingsOutlinedIcon />
            </IconButton>
            <IconButton onClick={handleMenuOpen}>
              <PersonOutlinedIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>
                <Box>Logout</Box>
              </MenuItem>
            </Menu>
          </Box>
        </>
      )}

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Topbar;
