import {
  Box,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
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
  Settings,
} from "@mui/icons-material";
import CBS_Services from "../../../services/api/GAV_Sercives";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const TaxesConfig = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [taxesConfigData, setTaxesConfigData] = useState([]);
  const [loading, setLoading] = useState(false);
  const userData = useSelector((state) => state.users);
  const token = userData.token;
  const spaceId = userData?.selectedSpace?.id;
  const navigate = useNavigate();

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

  const fetchTaxesConfigData = async () => {
    setLoading(true);
    try {
      const payload = {
        serviceReference: "GET_ALL_TAXES_CONFIG",
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
        setTaxesConfigData(response.body.data || []);
      } else {
        console.error("Error fetching data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTaxesConfigData();
  }, []);

  const handleConfigTaxes = () => {
    navigate("/taxconfigurations/add");
  };

  const handleEdit = (row) => {
    navigate(`/taxconfigurations/edit/${row.id}`, { state: { taxData: row } });
  };

  const columns = [
    {
      field: "name",
      headerName: "Tax Name",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "value",
      headerName: "Tax Value",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return `${params.value}${params.row.percentage ? "%" : ""}`;
      },
    },

    {
      field: "globallyApplied",
      headerName: "Global Application",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const isGloballyApplied = params.row.globallyApplied;
        return (
          <Chip
            label={isGloballyApplied ? "Global" : "Limited"}
            style={{
              backgroundColor: isGloballyApplied ? "green" : "orange",
              color: "white",
              padding: "1px 1px 1px 1px",
            }}
          />
        );
      },
    },
    {
      field: "active",
      headerName: "Status",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const isActive = params.row.active;
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

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Tax" subtitle="Tax Details" />

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
            onClick={handleConfigTaxes}
          >
            <Add sx={{ mr: "10px" }} />
            New Tax
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
          rows={taxesConfigData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          disableSelectionOnClick
          loading={loading}
        />
      </Box>
    </Box>
  );
};

export default TaxesConfig;
