import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CBS_Services from "../../../../services/api/GAV_Sercives";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  InputAdornment,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Stack,
  ListItem,
  List,
  TextField,
  Tooltip,
} from "@mui/material";
import { tokens } from "../../../../theme";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../../../../components/Header";
import {
  Add,
  Delete,
  EditOutlined,
  Extension,
  Search,
  VerifiedUser,
} from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { formatValue } from "../../../../tools/formatValue";
import { LoadingButton } from "@mui/lab";

const Menus = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [MenuData, setMenuData] = useState([]);
  const [SubMenuData, setSubMenuData] = useState([]);
  const [loading, setLoading] = useState(false);
  const userData = useSelector((state) => state.users);
  const token = userData.token;
  // const spaceId = userData?.selectedSpace?.id
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedRow, setSelectedRow] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);
  const open = Boolean(anchorEl);
  const [deleteMenuDialogOpen, setDeleteMenuDialogOpen] = useState(false);
  const [deleteSubMenuDialogOpen, setDeleteSubMenuDialogOpen] = useState(false);
  const [CatalogData, setCatalogData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAssignMenuModal, setShowAssignMenuModal] = React.useState(false);
  const [assignSubMenuData, setassignSubMenuData] = React.useState({
    subItemId: "",
    ressourceId: [],
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row); // Store the current row to pass to actions
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

  const fetchMenuData = async () => {
    setLoading(true);
    try {
      const response = await CBS_Services(
        "GATEWAY",
        "clientGateWay/items/getAllItems",
        "GET",
        null,
        token
      );
      console.log("responsemenus", response);

      if (response && response.status === 200) {
        setMenuData(response.body.data || []);
      } else {
        console.error("Error fetching data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };
  const fetchSubMenuData = async () => {
    setLoading(true);
    try {
      const response = await CBS_Services(
        "GATEWAY",
        "clientGateWay/subItem/getAllSubsItems",
        "GET",
        null,
        token
      );
      console.log("responsesubmenus", response);

      if (response && response.status === 200) {
        setSubMenuData(response.body.data || []);
      } else {
        console.error("Error fetching data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMenuData();
    fetchSubMenuData();
    fetchCatalogData();
  }, []);

  const handleDeleteMenuConfirm = async () => {
    setDeleteMenuDialogOpen(false);
    try {
      const response = await CBS_Services(
        "GATEWAY",
        `clientGateWay/items/deleteItem/${currentRow.id}`,
        "DELETE",
        null,
        token
      );
      console.log("responsedeletemenus", response);

      if (response && response.status === 200) {
        showSnackbar("Item Deleted successfully", "success");
        handleClose();
        fetchMenuData();
      } else {
        showSnackbar("Failed to delete item", "error");

        console.error("Error Deleting data");
      }
    } catch (error) {
      showSnackbar("A connection error occurred", "error");
      console.error("Error:", error);
    }
  };

  const handleDeleteSubMenuConfirm = async () => {
    setDeleteSubMenuDialogOpen(false);
    try {
      const response = await CBS_Services(
        "GATEWAY",
        `clientGateWay/subItem/deleteSubItem/${currentRow.id}`,
        "DELETE",
        null,
        token
      );
      console.log("responsesubmenus", response);

      if (response && response.status === 200) {
        showSnackbar("Sub Item Deleted successfully", "success");
        handleClose();
        fetchSubMenuData();
      } else {
        showSnackbar("Failed to delete Sub item", "error");
        console.error("Error Deleting data");
      }
    } catch (error) {
      showSnackbar("A connection error occurred", "error");
      console.error("Error:", error);
    }
  };

  const handleConfirmAssignTagtoSubMenu = async () => {
    setLoading(true);
    const results = [];
    let hasError = false;

    try {
      const tagsToAssign = assignSubMenuData.ressourceId;

      for (const tagName of tagsToAssign) {
        const payload = {
          ressourceId: tagName,
          subItemId: selectedRow,
        };
        console.log("payload====", payload);

        const response = await CBS_Services(
          "GATEWAY",
          `clientGateWay/subItem/addResourceToSubItem`,
          "POST",
          payload,
          token
        );
        console.log("response====", response);

        if (response && response.status === 200) {
          results.push(`Success: ${tagName}`);
        } else {
          results.push(
            `Failed: ${tagName} - ${response.body.errors || "Unknown error"}`
          );
          hasError = true;
        }
      }

      if (hasError) {
        showSnackbar(
          `Some Menu assignments failed. ${results.join(", ")}`,
          "warning"
        );
      } else {
        showSnackbar("All Menus assigned successfully.", "success");
      }

      handleToggleAssignRoleModal();
      await fetchSubMenuData();
    } catch (error) {
      console.error("Error:", error);
      showSnackbar("Network Error! Try again later.", "error");
    }

    setLoading(false);
  };

  const fetchCatalogData = async () => {
    try {
      // const payload = {
      //     serviceReference: 'GET_ALL_CATALOG',
      //     requestBody: '',
      //     spaceId: spaceId,
      // }
      // const response = await CBS_Services('GATEWAY', 'gavClientApiService/request', 'POST', payload, token);
      const response = await CBS_Services("APE", "catalog/get/all", "GET");

      console.log("response", response);

      if (response && response.status === 200) {
        setCatalogData(response.body.data);
      } else {
        console.error("Error fetching data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteMenu = (row) => {
    console.log("Delete clicked", row);
    setCurrentRow(row);
    setDeleteMenuDialogOpen(!deleteMenuDialogOpen);
  };

  const handleDeleteSubMenu = (row) => {
    console.log("Delete clicked", currentRow);
    setDeleteSubMenuDialogOpen(!deleteSubMenuDialogOpen);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleAddMenu = () => {
    navigate("/menus/createmenu");
  };
  const handleAddSubMenu = () => {
    navigate("/menus/submenuform");
  };

  const handleEdit = (row) => {
    navigate(`/menus/editmenu/${row.id}`, { state: { menuData: row } });
  };

  const handleEditSubMenu = (row) => {
    navigate(`/menus/submenuform/${row.id}`, { state: { submenuData: row } });
  };

  const handleToggleAssignRoleModal = (assignsubmenu) => {
    setSelectedRow(assignsubmenu);
    setassignSubMenuData({
      subItemId: "",
      ressourceId: [],
    });

    setShowAssignMenuModal(!showAssignMenuModal);
  };

  const handleAssignUserRole = (assignsubmenu) => {
    setSelectedRow(assignsubmenu);
    setassignSubMenuData({
      ...assignSubMenuData,
      subItemId: assignsubmenu,
      ressourceId: [], // Reset ressourceId when opening the modal
    });
    setSelectAll(false); // Reset selectAll state
    setShowAssignMenuModal(!showAssignMenuModal);
  };
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      // Select all unassigned tags
      const allMenuIds = CatalogData.map((option) => option.id);
      setassignSubMenuData({
        ...assignSubMenuData,
        ressourceId: allMenuIds,
      });
    } else {
      // Deselect all
      setassignSubMenuData({
        ...assignSubMenuData,
        ressourceId: [],
      });
    }
  };

  const handleToggle = (value) => () => {
    const currentIndex = assignSubMenuData?.ressourceId?.indexOf(value);
    const newChecked = [...assignSubMenuData.ressourceId];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setassignSubMenuData({
      ...assignSubMenuData,
      ressourceId: newChecked,
    });

    // Update selectAll state
    const allMenuIds = CatalogData.map((option) => option.id);
    setSelectAll(newChecked.length === allMenuIds.length);
  };

  const columns = [
    {
      field: "title",
      headerName: "Menu Title",
      flex: 1,
      valueGetter: (params) => formatValue(params.value),
    },
    {
      field: "typeId",
      headerName: "Type",
      flex: 1,
      valueGetter: (params) => formatValue(params.value),
    },
    {
      field: "icon",
      headerName: "Icon",
      flex: 1,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => formatValue(params.value),
    },
    {
      field: "route",
      headerName: "Route",
      flex: 1,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => formatValue(params.value),
    },
    {
      field: "menuOrder",
      headerName: "Menu Order",
      flex: 1,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => formatValue(params.value),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <>
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={(event) => handleClick(event, params.row)}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: 48 * 4.5,
                width: "20ch",
                transform: "translateX(-50%)",
              },
            }}
          >
            <MenuItem onClick={() => handleEdit(currentRow)}>
              <EditOutlined fontSize="small" style={{ marginRight: "8px" }} />
              Edit
            </MenuItem>

            <MenuItem onClick={() => handleDeleteMenu(currentRow)}>
              <Delete fontSize="small" style={{ marginRight: "8px" }} />
              Delete
            </MenuItem>
          </Menu>
        </>
      ),
    },
  ];
  const sunmenucolumns = [
    {
      field: "title",
      headerName: "Sub-Menu Title",
      flex: 1,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => formatValue(params.value),
    },
    // { field: "itemId", headerName: "Parent Menu", flex: 1, headerAlign: "center", align: "center", valueGetter: (params) => formatValue(params.value), },
    {
      field: "icon",
      headerName: "Icon",
      flex: 1,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => formatValue(params.value),
    },
    {
      field: "menuOrder",
      headerName: "Sub-Menu Order",
      flex: 1,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => formatValue(params.value),
    },
    {
      field: "route",
      headerName: "Route",
      flex: 1,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => formatValue(params.value),
    },

    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <>
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={(event) => handleClick(event, params.row)}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: 48 * 4.5,
                width: "23ch",
                transform: "translateX(-50%)",
              },
            }}
          >
            <MenuItem onClick={() => handleEditSubMenu(currentRow)}>
              <EditOutlined fontSize="small" style={{ marginRight: "8px" }} />
              Edit
            </MenuItem>
            <MenuItem onClick={() => handleAssignUserRole(currentRow.id)}>
              <Extension fontSize="small" style={{ marginRight: "8px" }} />
              Assign Resource
            </MenuItem>

            <MenuItem onClick={() => handleDeleteSubMenu(currentRow)}>
              <Delete fontSize="small" style={{ marginRight: "8px" }} />
              Delete
            </MenuItem>
          </Menu>
        </>
      ),
    },
  ];

  const sortAlphabetically = (data, field = "title") => {
    return [...data].sort((a, b) => a[field].localeCompare(b[field]));
  };
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="User Menus Management"
          subtitle="Manage your Menus and Submenus"
        />
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
            onClick={handleAddMenu}
          >
            <Add sx={{ mr: "10px" }} />
            Add Menu
          </Button>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
            onClick={handleAddSubMenu}
          >
            <Add sx={{ mr: "10px" }} />
            Add Sub Menu
          </Button>
        </Box>
      </Box>

      <Box m="10px 15px 15px 15px">
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="account type tabs"
          sx={{
            borderBottom: 1,
            borderRadius: "8px 8px 0 0",
            backgroundColor: colors.primary[400],
            borderColor: "divider",
            "& .MuiTab-root": {
              borderRadius: "8px 8px 0 0",
              margin: "0 5px",
              "&.Mui-selected": {
                color:
                  theme.palette.mode === "light"
                    ? "black"
                    : `${colors.greenAccent[400]}`,
              },
            },
          }}
        >
          <Tab label="Menus" />
          <Tab label="Sub-Menus" />
        </Tabs>
      </Box>
      <Box
        m="40px 15px 15px 15px"
        height="70vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={
            selectedTab === 0
              ? sortAlphabetically(MenuData)
              : selectedTab === 1
              ? sortAlphabetically(SubMenuData)
              : sortAlphabetically(MenuData)
          }
          columns={
            selectedTab === 0
              ? columns
              : selectedTab === 1
              ? sunmenucolumns
              : columns
          }
          components={{ Toolbar: GridToolbar }}
          loading={loading}
        />
      </Box>

      <Dialog open={deleteMenuDialogOpen} onClose={handleDeleteMenu} fullWidth>
        <DialogTitle>Confirm Menu Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this menu?
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleDeleteMenu}>
            Cancel
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDeleteMenuConfirm}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteSubMenuDialogOpen}
        onClose={handleDeleteSubMenu}
        fullWidth
      >
        <DialogTitle>Confirm Sub-Menu Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this sub-menu?
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleDeleteSubMenu}>
            Cancel
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDeleteSubMenuConfirm}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showAssignMenuModal}
        onClose={handleToggleAssignRoleModal}
        fullWidth
      >
        <DialogTitle>Assign Role</DialogTitle>

        <Dialog
          open={showAssignMenuModal}
          onClose={handleToggleAssignRoleModal}
          fullWidth
          maxWidth="md" // Increased width for better visibility
        >
          <DialogTitle>Assign Resource to Sub-Menu</DialogTitle>
          <DialogContent>
            <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
              <TextField
                fullWidth
                sx={{ mb: 2 }}
                placeholder="Search Resources..."
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
              <List
                sx={{
                  width: "100%",
                  bgcolor: "background.paper",
                  maxHeight: 300,
                  overflow: "auto",
                }}
              >
                <ListItem dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={selectAll}
                      tabIndex={-1}
                      disableRipple
                      onChange={handleSelectAll}
                      color="secondary"
                    />
                  </ListItemIcon>
                  <ListItemText primary="Select All" />
                </ListItem>
                {Array.isArray(CatalogData) && CatalogData?.length > 0 ? (
                  CatalogData.filter((option) =>
                    option.id.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((option) => {
                    const labelId = `checkbox-list-label-${option.id}`;
                    // const isAssigned = assignedRoleData[selectedRow]?.includes(option.id);
                    const isChecked =
                      assignSubMenuData.ressourceId.indexOf(option.id) !== -1;

                    return (
                      <ListItem
                        key={option.id}
                        dense
                        button
                        onClick={handleToggle(option.id)}
                      >
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={isChecked}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ "aria-labelledby": labelId }}
                            color="secondary"
                          />
                        </ListItemIcon>
                        <ListItemText id={labelId} primary={option.id} />
                      </ListItem>
                    );
                  })
                ) : (
                  <ListItem>
                    <ListItemText primary="No menus available" />
                  </ListItem>
                )}
              </List>
            </Box>
          </DialogContent>
          <DialogActions>
            <Box
              display="flex"
              justifyContent="space-between"
              width="100%"
              px={2}
            >
              <Box>
                {assignSubMenuData?.ressourceId?.length > 0 ? (
                  <Alert severity="info" sx={{ mr: 2 }}>
                    {assignSubMenuData?.ressourceId?.length} menu(s) selected
                  </Alert>
                ) : (
                  ""
                )}
              </Box>
              <Stack direction="row" spacing={2}>
                <Button
                  color="primary"
                  variant="contained"
                  disabled={loading}
                  onClick={handleToggleAssignRoleModal}
                >
                  Cancel
                </Button>
                <LoadingButton
                  type="submit"
                  color="secondary"
                  variant="contained"
                  loading={loading}
                  loadingPosition="start"
                  startIcon={<VerifiedUser />}
                  onClick={handleConfirmAssignTagtoSubMenu}
                  disabled={assignSubMenuData?.ressourceId?.length === 0}
                >
                  Assign
                </LoadingButton>
              </Stack>
            </Box>
          </DialogActions>
        </Dialog>
        <DialogActions>
          <Box display="flex" justifyContent="end" mt="20px">
            <Stack direction="row" spacing={2}>
              <LoadingButton
                type="submit"
                color="secondary"
                variant="contained"
                loading={loading}
                loadingPosition="start"
                startIcon={<VerifiedUser />}
                onClick={handleConfirmAssignTagtoSubMenu}
              >
                Assign
              </LoadingButton>

              <Button
                color="primary"
                variant="contained"
                disabled={loading}
                onClick={handleToggleAssignRoleModal}
              >
                Cancel
              </Button>
            </Stack>
          </Box>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Menus;
