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
  Settings,
  MonetizationOn,
  AccountBalance,
  Description,
  CreditCard,
  CompareArrows,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { formatValue } from "../../../tools/formatValue";

const ViewOperationConfigDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    if (location.state && location.state.OperationConfigData) {
      setInitialValues(location.state.OperationConfigData);
    }
  }, [location.state]);

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

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="OPERATION DETAILS"
          subtitle={`Configuration for ${initialValues.operationType?.name}`}
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
        {/* Operation Type Details */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              backgroundColor: colors.primary[400],
              height: "100%",
            }}
          >
            <CardContent>
              <Typography variant="h5" mb={3} color={colors.greenAccent[500]}>
                Operation Details
              </Typography>
              <InfoItem
                icon={<Settings />}
                label="Operation Type ID"
                value={initialValues.operationType?.id}
              />
              <InfoItem
                icon={<Description />}
                label="Operation Name"
                value={initialValues.operationType?.name}
              />
              <InfoItem
                icon={<Description />}
                label="Description"
                value={initialValues.operationType?.description}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Charge Configuration */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              backgroundColor: colors.primary[400],
              height: "100%",
            }}
          >
            <CardContent>
              <Typography variant="h5" mb={3} color={colors.greenAccent[500]}>
                Charge Configuration
              </Typography>
              <InfoItem
                icon={<MonetizationOn />}
                label="Fixed Charge"
                value={`${formatValue(initialValues.fixedCharge)} (${
                  initialValues.fixedChargeType
                })`}
              />
              <InfoItem
                icon={<MonetizationOn />}
                label="Max Charge"
                value={formatValue(initialValues.maxCharge)}
              />
              <InfoItem
                icon={<MonetizationOn />}
                label="Min Charge"
                value={formatValue(initialValues.minCharge)}
              />
              <InfoItem
                icon={<CreditCard />}
                label="Max Amount"
                value={formatValue(initialValues.maxAmount)}
              />
              <InfoItem
                icon={<CreditCard />}
                label="Min Amount"
                value={formatValue(initialValues.minAmount)}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Charge Percentages and Additional Details */}
        <Grid item xs={12}>
          <Card
            sx={{
              backgroundColor: colors.primary[400],
            }}
          >
            <CardContent>
              <Typography variant="h5" mb={3} color={colors.greenAccent[500]}>
                Charges and Flags
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    icon={<CompareArrows />}
                    label="GIMAC Charge"
                    value={`${initialValues.gimacCharge} ${
                      initialValues.gimacChargesPercentage ? "%" : ""
                    }`}
                  />
                  <InfoItem
                    icon={<CompareArrows />}
                    label="External Charge"
                    value={`${initialValues.externalCharge} ${
                      initialValues.externalChargesPercentage ? "%" : ""
                    }`}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box mt={2}>
                    <Typography
                      variant="subtitle2"
                      color={colors.grey[400]}
                      mb={1}
                    >
                      Configuration Flags
                    </Typography>
                    <Box display="flex" gap={2}>
                      <Chip
                        label={`Merchant Debit: ${
                          initialValues.merchantDebit ? "Enabled" : "Disabled"
                        }`}
                        sx={{
                          backgroundColor: initialValues.merchantDebit
                            ? colors.greenAccent[500]
                            : colors.redAccent[500],
                          color: "white",
                        }}
                      />
                      <Chip
                        label={`Charge Percentage: ${
                          initialValues.chargePercentage ? "Yes" : "No"
                        }`}
                        sx={{
                          backgroundColor: initialValues.chargePercentage
                            ? colors.blueAccent[500]
                            : colors.greyAccent[500],
                          color: "white",
                        }}
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewOperationConfigDetails;
