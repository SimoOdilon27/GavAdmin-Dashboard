import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import {
  ArrowBack,
  MonetizationOn,
  BusinessOutlined,
  AccountBalance,
  Description,
  Numbers,
  Flag,
  Category,
} from "@mui/icons-material";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";

const ViewTaxConfigDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    if (id && location.state && location.state.taxData) {
      setInitialValues(location.state.taxData);
    }
  }, [id, location.state]);

  if (!initialValues) return null;

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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "CFA",
    }).format(value);
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="TAX CONFIGURATION DETAILS"
          subtitle={`Detailed Configuration for ${initialValues.name}`}
        />

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
            onClick={() => navigate(-1)}
          >
            <ArrowBack sx={{ mr: "10px" }} />
            Back
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Tax Configuration Details */}
        <Grid item xs={12}>
          <Card sx={{ backgroundColor: colors.primary[400] }}>
            <CardContent>
              <Typography variant="h5" mb={3} color={colors.greenAccent[500]}>
                Tax Configuration Overview
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <InfoItem
                    icon={<Numbers />}
                    label="Tax Config ID"
                    value={initialValues.id}
                  />
                  <InfoItem
                    icon={<Description />}
                    label="Name"
                    value={initialValues.name}
                  />
                  <InfoItem
                    icon={<MonetizationOn />}
                    label="Value"
                    value={`${initialValues.value} ${
                      initialValues.percentage ? "%" : ""
                    }`}
                  />
                  {/* <InfoItem
                    icon={<Flag />}
                    label="Active"
                    value={initialValues.active ? "Yes" : "No"}
                  />
                  <InfoItem
                    icon={<Category />}
                    label="Percentage"
                    value={initialValues.percentage ? "Yes" : "No"}
                  />
                  <InfoItem
                    icon={<Category />}
                    label="Globally Applied"
                    value={initialValues.globallyApplied ? "Yes" : "No"}
                  /> */}
                </Grid>

                {/* Configuration Flags */}
                <Grid item xs={12} md={8}>
                  <Typography
                    variant="h6"
                    color={colors.greenAccent[500]}
                    mb={2}
                  >
                    Configuration Flags
                  </Typography>
                  <Box
                    display="flex"
                    flexDirection="column"
                    gap={2}
                    sx={{
                      border: `1px solid ${colors.grey[700]}`,
                      borderRadius: 2,
                      padding: 2,
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Chip
                          label={`Tax Config: ${
                            initialValues.active ? "Active" : "Inactive"
                          }`}
                          sx={{
                            width: "100%",
                            backgroundColor: initialValues.active
                              ? colors.greenAccent[500]
                              : colors.redAccent[500],
                            color: "white",
                          }}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <Chip
                          label={`Percentage: ${
                            initialValues.percentage ? "Yes" : "No"
                          }`}
                          sx={{
                            width: "100%",
                            backgroundColor: initialValues.percentage
                              ? colors.blueAccent[500]
                              : colors.grey[500],
                            color: "white",
                          }}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <Chip
                          label={`Globally Applied: ${
                            initialValues.globallyApplied ? "Yes" : "No"
                          }`}
                          sx={{
                            width: "100%",
                            backgroundColor: initialValues.globallyApplied
                              ? colors.blueAccent[500]
                              : colors.grey[500],
                            color: "white",
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Associated Charges */}
        {initialValues.charges && initialValues.charges.length > 0 && (
          <Grid item xs={12}>
            <Card sx={{ backgroundColor: colors.primary[400] }}>
              <CardContent>
                <Typography variant="h5" mb={3} color={colors.greenAccent[500]}>
                  Associated Charges
                </Typography>
                {initialValues.charges.map((charge, index) => (
                  <>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Typography
                          variant="h6"
                          color={colors.greenAccent[400]}
                        >
                          Charge Details
                        </Typography>
                        <InfoItem
                          icon={<Numbers />}
                          label="Charge ID"
                          value={charge.id}
                        />
                        <InfoItem
                          icon={<MonetizationOn />}
                          label="Charge Value"
                          value={`${formatCurrency(charge.chargeValue)} ${
                            charge.chargePercentage ? "%" : ""
                          }`}
                        />
                        <InfoItem
                          icon={<Flag />}
                          label="Active"
                          value={charge.active ? "Yes" : "No"}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography
                          variant="h6"
                          color={colors.greenAccent[400]}
                        >
                          Operation Configuration
                        </Typography>
                        <InfoItem
                          icon={<Description />}
                          label="Operation Type"
                          value={charge.operationConfig.operationType.name}
                        />
                        <InfoItem
                          icon={<MonetizationOn />}
                          label="Fixed Charge"
                          value={`${formatCurrency(
                            charge.operationConfig.fixedCharge
                          )} (${charge.operationConfig.fixedChargeType})`}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography
                          variant="h6"
                          color={colors.greenAccent[400]}
                        >
                          Partner Information
                        </Typography>
                        <InfoItem
                          icon={<BusinessOutlined />}
                          label="Partner Name"
                          value={charge.partner.name}
                        />
                        <InfoItem
                          icon={<AccountBalance />}
                          label="Partner ID"
                          value={charge.partner.id}
                        />
                      </Grid>
                    </Grid>
                  </>
                ))}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ViewTaxConfigDetails;
