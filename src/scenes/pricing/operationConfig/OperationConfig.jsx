import {
  Box,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { Add, EditOutlined, RemoveRedEyeSharp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import CBS_Services from "../../../services/api/GAV_Sercives";
import { useSelector } from "react-redux";
import { formatValue } from "../../../tools/formatValue";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const OperationConfig = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [operationConfigData, setOperationConfigData] = useState([]);
  const [operationTypeData, setOperationTypeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const userData = useSelector((state) => state.users);
  const token = userData.token;
  const spaceId = userData?.selectedSpace?.id;
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
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

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const fetchOperationConfigData = async () => {
    setLoading(true);
    try {
      const payload = {
        serviceReference: "GET_ALL_OPERATION_CONFIGURATIONS",
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

      // const response = await CBS_Services('APE', 'pricing/get/all', 'GET');
      if (response && response.status === 200) {
        setOperationConfigData(response.body.data || []);
      } else {
        console.error("Error fetching data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  const fetchOperationTypeData = async () => {
    setLoading(true);
    try {
      const payload = {
        serviceReference: "GET_ALL_OPERATION_TYPES",
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

      // const response = await CBS_Services('APE', 'pricing/get/all', 'GET');
      if (response && response.status === 200) {
        setOperationTypeData(response.body.data || []);
      } else {
        console.error("Error fetching data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOperationConfigData();
    fetchOperationTypeData();
  }, []);

  const handleConfigOperationConfig = () => {
    navigate("/operationconfigurations/addoperationconfig");
  };

  const handleEditOperationConfig = (row) => {
    navigate(`/operationconfigurations/editoperationconfig/${row.id}`, {
      state: { OperationConfigData: row },
    });
  };
  const handleViewOperationConfig = (row) => {
    navigate(`/operationconfigurations/viewoperationconfig/${row.id}`, {
      state: { OperationConfigData: row },
    });
  };

  const handleConfigOperationType = () => {
    navigate("/operationconfigurations/addoperationtype");
  };
  const handleEditOperationType = (row) => {
    navigate(`/operationconfigurations/editoperationtype/${row.id}`, {
      state: { OperationTypeData: row },
    });
  };
  const handleViewOperationType = (row) => {
    navigate(`/operationconfigurations/viewoperationtype/${row.id}`, {
      state: { OperationTypeData: row },
    });
  };

  const operationtypecolumns = [
    // { field: "id", headerName: "ID", flex: 1 },
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => formatValue(params.value),
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => formatValue(params.value),
    },
    {
      field: "description",
      headerName: "Description",
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
            <MenuItem onClick={() => handleEditOperationType(currentRow)}>
              <EditOutlined fontSize="small" style={{ marginRight: "8px" }} />
              Edit
            </MenuItem>

            <MenuItem onClick={() => handleDelete(currentRow)}>
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

  const operationconfigcolumns = [
    {
      field: "operationType.name",
      headerName: "Operation Type",
      flex: 1,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => {
        return formatValue(params.row.operationType?.name);
      },
    },
    {
      field: "fixedCharge",
      headerName: "Charge",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return `${params.value}${params.row.chargePercentage ? "%" : ""}`;
      },
    },

    {
      field: "minAmount",
      headerName: "Min Amount",
      flex: 1,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => formatValue(params.row.minAmount),
    },
    {
      field: "maxAmount",
      headerName: "Max Amount",
      flex: 1,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => formatValue(params.row.maxAmount),
    },

    {
      field: "gimacCharge",
      headerName: "GIMAC Charge",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return `${params.value}${params.row.gimacChargesPercentage ? "%" : ""}`;
      },
    },
    {
      field: "externalCharge",
      headerName: "External Charge",
      flex: 1,
      headerAlign: "center",
      align: "center",
      // valueGetter: (params) => formatValue(params.row.externalCharge),
      renderCell: (params) => {
        return `${params.row.externalCharge}${
          params.row.externalChargesPercentage ? "%" : ""
        }`;
      },
    },

    {
      field: "merchantDebit",
      headerName: "Merchant Debit",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const isMerchantDebit = params.row.merchantDebit;
        return (
          <Chip
            label={isMerchantDebit ? "Debited" : "Not Debited"}
            style={{
              backgroundColor: isMerchantDebit ? "green" : "orange",
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
            <MenuItem onClick={() => handleEditOperationConfig(currentRow)}>
              <EditOutlined fontSize="small" style={{ marginRight: "8px" }} />
              Edit
            </MenuItem>

            <MenuItem onClick={() => handleViewOperationConfig(currentRow)}>
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
        <Header
          title="Operation Config"
          subtitle="Manage your operation configurations"
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
            onClick={handleConfigOperationConfig}
          >
            <Add sx={{ mr: "10px" }} />
            New Operation Config
          </Button>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
              marginRight: "10px",
            }}
            onClick={handleConfigOperationType}
          >
            <Add sx={{ mr: "10px" }} />
            New Operation Type
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
          centered
          aria-label="account type tabs"
          sx={{
            borderBottom: 1,
            borderRadius: "8px 8px 0 0",
            backgroundColor: colors.primary[400],
            borderColor: "divider",
            "& .MuiTab-root": {
              borderRadius: "8px 8px 0 0",
              margin: "0 5px",
              fontWeight: 600,
              transition: "all 0.3s ease",
              "&.Mui-selected": {
                color:
                  theme.palette.mode === "light"
                    ? "black"
                    : `${colors.greenAccent[400]}`,
              },
            },
            "& .MuiTabs-indicator": {
              height: "4px", // Make indicator more prominent
              backgroundColor: theme.palette.primary.main,
            },
          }}
        >
          <Tab label="Operation Configs" />
          <Tab label="Operation Types" />
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
              ? operationConfigData
              : selectedTab === 1
              ? operationTypeData
              : operationConfigData
          }
          columns={
            selectedTab === 0
              ? operationconfigcolumns
              : selectedTab === 1
              ? operationtypecolumns
              : operationconfigcolumns
          }
          components={{ Toolbar: GridToolbar }}
          loading={loading}
        />
      </Box>
    </Box>
  );
};

export default OperationConfig;
