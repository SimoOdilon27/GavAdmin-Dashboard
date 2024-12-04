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
  CompareArrows,
  Business,
  Numbers,
  Flag,
  Category,
} from "@mui/icons-material";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";

const ViewChargeDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    if (id && location.state && location.state.chargeData) {
      setInitialValues(location.state.chargeData);
    }
  }, [id, location.state]);

  console.log("initialValues=====", initialValues);

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
          title="COMPREHENSIVE CHARGE DETAILS"
          subtitle={`Detailed Configuration for ${initialValues.partner?.name}`}
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
        {/* Charge Details */}
        <Grid item xs={12}>
          <Card sx={{ backgroundColor: colors.primary[400] }}>
            <CardContent>
              <Typography variant="h5" mb={3} color={colors.greenAccent[500]}>
                Charge Configuration Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <InfoItem
                    icon={<Numbers />}
                    label="Charge ID"
                    value={initialValues.id}
                  />
                  <InfoItem
                    icon={<MonetizationOn />}
                    label="Charge Value"
                    value={`${formatCurrency(initialValues.chargeValue)} ${
                      initialValues.chargePercentage ? "%" : ""
                    }`}
                  />
                  <InfoItem
                    icon={<MonetizationOn />}
                    label="Min Amount"
                    value={formatCurrency(initialValues.minAmount)}
                  />
                  <InfoItem
                    icon={<MonetizationOn />}
                    label="Max Amount"
                    value={formatCurrency(initialValues.maxAmount)}
                  />
                  <InfoItem
                    icon={<Flag />}
                    label="Active"
                    value={initialValues.active ? "Yes" : "No"}
                  />

                  <InfoItem
                    icon={<Category />}
                    label="Charge Percentage"
                    value={initialValues.chargePercentage ? "Yes" : "No"}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <InfoItem
                    icon={<AccountBalance />}
                    label="Bank ID"
                    value={initialValues.bankId || "N/A"}
                  />
                  <Typography
                    variant="h6"
                    color={colors.greenAccent[500]}
                    mt={2}
                    mb={2}
                  >
                    Operation Configuration
                  </Typography>
                  <InfoItem
                    icon={<Numbers />}
                    label="Operation Config ID"
                    value={initialValues.operationConfig.id}
                  />
                  <InfoItem
                    icon={<MonetizationOn />}
                    label="Fixed Charge"
                    value={`${formatCurrency(
                      initialValues.operationConfig.fixedCharge
                    )} (${initialValues.operationConfig.fixedChargeType})`}
                  />
                  <InfoItem
                    icon={<MonetizationOn />}
                    label="Min Charge"
                    value={formatCurrency(
                      initialValues.operationConfig.minCharge
                    )}
                  />
                  <InfoItem
                    icon={<MonetizationOn />}
                    label="Max Charge"
                    value={formatCurrency(
                      initialValues.operationConfig.maxCharge
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography
                    variant="h6"
                    color={colors.greenAccent[500]}
                    mb={2}
                  >
                    Operation Type Details
                  </Typography>
                  <InfoItem
                    icon={<Description />}
                    label="Operation Type ID"
                    value={initialValues.operationConfig.operationType.id}
                  />
                  <InfoItem
                    icon={<Description />}
                    label="Operation Name"
                    value={initialValues.operationConfig.operationType.name}
                  />
                  <InfoItem
                    icon={<Description />}
                    label="Operation Description"
                    value={
                      initialValues.operationConfig.operationType.description
                    }
                  />
                  <Typography
                    variant="h6"
                    color={colors.greenAccent[500]}
                    mt={2}
                    mb={2}
                  >
                    Additional Charges
                  </Typography>
                  <InfoItem
                    icon={<MonetizationOn />}
                    label="Gimac Charge"
                    value={formatCurrency(
                      initialValues.operationConfig.gimacCharge
                    )}
                  />
                  <InfoItem
                    icon={<MonetizationOn />}
                    label="External Charge"
                    value={formatCurrency(
                      initialValues.operationConfig.externalCharge
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Partner Details */}
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: colors.primary[400], height: "100%" }}>
            <CardContent>
              <Typography variant="h5" mb={3} color={colors.greenAccent[500]}>
                Partner Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    icon={<BusinessOutlined />}
                    label="Partner Name"
                    value={initialValues.partner.name}
                  />
                  <InfoItem
                    icon={<Business />}
                    label="Partner ID"
                    value={initialValues.partner.id}
                  />
                  <InfoItem
                    icon={<Description />}
                    label="Partner Type"
                    value={initialValues.partner.type}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    icon={<Description />}
                    label="Internal Partner Type"
                    value={initialValues.partner.internalPartnerType}
                  />
                  <InfoItem
                    icon={<AccountBalance />}
                    label="Commission Account ID"
                    value={initialValues.partner.commissionAccountId}
                  />
                  <InfoItem
                    icon={<AccountBalance />}
                    label="Taxes Account ID"
                    value={initialValues.partner.taxesAccountId}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: colors.primary[400], height: "100%" }}>
            <CardContent>
              <Typography variant="h6" color={colors.greenAccent[500]} mb={2}>
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
                  <Grid item xs={6}>
                    <Chip
                      label={`Charge: ${
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
                  <Grid item xs={6}>
                    <Chip
                      label={`Partner: ${
                        initialValues.partner.active ? "Active" : "Inactive"
                      }`}
                      sx={{
                        width: "100%",
                        backgroundColor: initialValues.partner.active
                          ? colors.greenAccent[500]
                          : colors.redAccent[500],
                        color: "white",
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Chip
                      label={`Merchant Debit: ${
                        initialValues.operationConfig.merchantDebit
                          ? "Yes"
                          : "No"
                      }`}
                      sx={{
                        width: "100%",
                        backgroundColor: initialValues.operationConfig
                          .merchantDebit
                          ? colors.blueAccent[500]
                          : colors.grey[500],
                        color: "white",
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Chip
                      label={`Gimac Charges %: ${
                        initialValues.operationConfig.gimacChargesPercentage
                          ? "Yes"
                          : "No"
                      }`}
                      sx={{
                        width: "100%",
                        backgroundColor: initialValues.operationConfig
                          .gimacChargesPercentage
                          ? colors.blueAccent[500]
                          : colors.grey[500],
                        color: "white",
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Chip
                      label={`External Charges %: ${
                        initialValues.operationConfig.externalChargesPercentage
                          ? "Yes"
                          : "No"
                      }`}
                      sx={{
                        width: "100%",
                        backgroundColor: initialValues.operationConfig
                          .externalChargesPercentage
                          ? colors.blueAccent[500]
                          : colors.grey[500],
                        color: "white",
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewChargeDetails;
