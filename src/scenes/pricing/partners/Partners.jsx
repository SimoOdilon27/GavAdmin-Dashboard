import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  Grid,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Add,
  EditOutlined,
  RemoveRedEyeSharp,
  ArrowBack,
  BusinessOutlined,
  Business,
  Description,
  AccountBalance,
  Close,
} from "@mui/icons-material";
import CBS_Services from "../../../services/api/GAV_Sercives";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const Partners = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [partnersData, setPartnersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const userData = useSelector((state) => state.users);
  const token = userData.token;
  const spaceId = userData?.selectedSpace?.id;
  const navigate = useNavigate();
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);
  const open = Boolean(anchorEl);

  // Define or import the handleEdit and handleDelete functions

  const handleDelete = (row) => {
    console.log("Delete clicked", row);
    // Your delete logic here
  };

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row); // Store the current row to pass to actions
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

  const fetchPartnersData = async () => {
    setLoading(true);
    try {
      const payload = {
        serviceReference: "GET_ALL_PARTNERS",
        requestBody: "",
        spaceId: spaceId,
      };
      const response = await CBS_Services(
        "GATEWAY",
        "gavClientApiService/request",
        "POST",
        payload,
        token
      );
      console.log("response====", response);

      if (response && response.status === 200) {
        setPartnersData(response.body.data || []);
      } else {
        console.error("Error fetching data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPartnersData();
  }, []);

  const handleConfigPartner = () => {
    navigate("/partners/add");
  };

  const handleEdit = (row) => {
    navigate(`/partners/edit/${row.id}`, { state: { partnerData: row } });
  };

  const handleViewDialogOpen = (row) => {
    setCurrentRow(row);
    setViewDialogOpen(true);
  };

  const handleViewDialogClose = () => {
    setViewDialogOpen(false);
    setCurrentRow(null);
  };

  const InfoItem = ({ icon, label, value, valueColor = colors.grey[100] }) => (
    <Box display="flex" alignItems="center" mb={2}>
      <IconButton sx={{ color: colors.greenAccent[500], mr: 2 }}>
        {icon}
      </IconButton>
      <Box>
        <Typography variant="subtitle2" color={colors.grey[400]}>
          {label}
        </Typography>
        <Typography variant="body1" color={valueColor}>
          {value || "N/A"}
        </Typography>
      </Box>
    </Box>
  );

  const ViewPartnerDialog = () => {
    if (!currentRow) return null;

    return (
      <Dialog
        open={viewDialogOpen}
        onClose={handleViewDialogClose}
        maxWidth="md"
        fullWidth
      >
        <Box m="20px">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h5" mb={3} color={colors.greenAccent[500]}>
              Partner Information
            </Typography>
            <IconButton onClick={handleViewDialogClose}>
              <Close />
            </IconButton>
          </Box>

          <Grid container spacing={3}>
            {/* Partner Information */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    icon={<BusinessOutlined />}
                    label="Partner Name"
                    value={currentRow.name}
                  />
                  <InfoItem
                    icon={<Business />}
                    label="Partner ID"
                    value={currentRow.id}
                  />
                  <InfoItem
                    icon={<Description />}
                    label="Partner Type"
                    value={currentRow.type}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    icon={<Description />}
                    label="Internal Partner Type"
                    value={currentRow.internalPartnerType}
                  />
                  <InfoItem
                    icon={<AccountBalance />}
                    label="Commission Account ID"
                    value={currentRow.commissionAccountId}
                  />
                  <InfoItem
                    icon={<AccountBalance />}
                    label="Taxes Account ID"
                    value={currentRow.taxesAccountId}
                  />
                  <Grid item xs={4}>
                    <Chip
                      label={`Partner Status: ${
                        currentRow.isActive ? "Active" : "Inactive"
                      }`}
                      sx={{
                        width: "100%",
                        backgroundColor: currentRow.isActive
                          ? colors.greenAccent[500]
                          : colors.redAccent[500],
                        color: "white",
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    );
  };
  const columns = [
    {
      field: "name",
      headerName: "Partner Name",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    // {
    //   field: "taxesAccountId",
    //   headerName: "Taxes Account ID",
    //   flex: 1,
    //   headerAlign: "center",
    //   align: "center",
    // },
    // {
    //   field: "commissionAccountId",
    //   headerName: "Commission Account ID",
    //   flex: 1,
    //   headerAlign: "center",
    //   align: "center",
    // },
    {
      field: "internalPartnerType",
      headerName: "Internal Partner Type",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "type",
      headerName: "Partner Type",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "isActive",
      headerName: "Status",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const isActive = params.row.isActive;
        return (
          <Chip
            label={isActive ? "Active" : "Inactive"}
            style={{
              backgroundColor: isActive ? "green" : "red",
              color: "white",
              padding: "1px 1px 1px 1px",
            }}
          />
        );
      },
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

            <MenuItem onClick={() => handleViewDialogOpen(currentRow)}>
              <RemoveRedEyeSharp
                fontSize="small"
                style={{ marginRight: "8px" }}
              />
              View
            </MenuItem>
          </Menu>
        </>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Partners" subtitle="Partners Details" />

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
            onClick={handleConfigPartner}
          >
            <Add sx={{ mr: "10px" }} />
            New Partner
          </Button>
        </Box>
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
          rows={partnersData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          disableSelectionOnClick
          loading={loading}
        />
      </Box>
      <ViewPartnerDialog />
    </Box>
  );
};

export default Partners;
