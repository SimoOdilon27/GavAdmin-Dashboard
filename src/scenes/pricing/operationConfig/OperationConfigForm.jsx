import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Alert,
  Divider,
  Tooltip,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { LoadingButton } from "@mui/lab";
import { HelpOutline, Save } from "@mui/icons-material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@emotion/react";
import Header from "../../../components/Header";
import CBS_Services from "../../../services/api/GAV_Sercives";
import { tokens } from "../../../theme";
import { FormFieldStyles } from "../../../tools/fieldValuestyle";

const OperationConfigForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.users);
  const token = userData.token;
  const spaceId = userData?.selectedSpace?.id;
  const [operationConfigData, setOperationConfigData] = useState([]);
  const [selectedChargeType, setSelectedChargeType] = useState("");
  const [initialValues, setInitialValues] = useState({
    fixedCharge: 0,
    fixedChargeType: "",
    maxCharge: 0,
    maxAmount: 0,
    minCharge: 0,
    minAmount: 0,
    operationTypeId: "",
    gimacCharge: 0,
    externalCharge: 0,
    isMerchantDebit: false,
    isChargePercentage: false,
    isGimacChargesPercentage: false,
    isExternalChargesPercentage: false,
  });

  const [pending, setPending] = useState(false);
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

  useEffect(() => {
    if (id && location.state && location.state.OperationConfigData) {
      setInitialValues(location.state.OperationConfigData);
    }
  }, [id, location.state]);

  console.log("initialValues", initialValues);

  const handleFormSubmit = async (values) => {
    setPending(true);
    try {
      let response;
      if (id) {
        // Update existing Operation Config
        const payload = {
          serviceReference: "UPDATE_OPERATION_CONFIG",
          requestBody: JSON.stringify(values),
          spaceId: spaceId,
        };
        response = await CBS_Services(
          "GATEWAY",
          "gavClientApiService/request",
          "POST",
          payload,
          token
        );

        if (response && response.status === 200) {
          showSnackbar(
            "Operation Configuration Updated Successfully.",
            "success"
          );
          setTimeout(() => {
            navigate("/menu-Operation-Config");
          }, 2000);
        } else {
          showSnackbar(
            response.body.errors || "Error Updating Operation Configuration",
            "error"
          );
        }
      } else {
        // Add new Operation Config
        const payload = {
          serviceReference: "CREATE_OPERATION_CONFIG",
          requestBody: JSON.stringify(values),
          spaceId: spaceId,
        };
        console.log("values", values);

        response = await CBS_Services(
          "GATEWAY",
          "gavClientApiService/request",
          "POST",
          payload,
          token
        );
        console.log("response", response);

        if (response && response.body.meta.statusCode === 200) {
          showSnackbar(
            "Operation Configuration Created Successfully.",
            "success"
          );
          setTimeout(() => {
            navigate(-1);
          }, 2000);
        } else {
          showSnackbar(
            response.body.errors || "Error Adding Operation Configuration",
            "error"
          );
        }
      }
    } catch (error) {
      console.error("Error:", error);
      showSnackbar("Error Try Again Later", "error");
    }
    setPending(false);
  };

  const fetchOperationConfigData = async () => {
    setPending(true);
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
      console.log("response", response);

      if (response && response.status === 200) {
        setOperationConfigData(response.body.data || []);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setPending(false);
  };

  useEffect(() => {
    fetchOperationConfigData();
  }, []);

  const handleFixedChargeType = (formikProps, typeId) => {
    formikProps.setFieldValue("fixedChargeType", typeId);
    setSelectedChargeType(typeId);

    // Dynamic field setting based on charge type
    switch (typeId) {
      case "ENUM":
        formikProps.setFieldValue("isChargePercentage", false);
        break;
      case "PERCENTAGE":
        formikProps.setFieldValue("isChargePercentage", true);
        break;
      case "AMOUNT":
        formikProps.setFieldValue("isChargePercentage", false);
        break;
    }
  };

  const TooltipCheckbox = ({
    label,
    checked,
    onChange,
    name,
    tooltipTitle,
  }) => (
    <Tooltip title={tooltipTitle} placement="top">
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={onChange}
            name={name}
            color="secondary"
          />
        }
        label={
          <Box display="flex" alignItems="center">
            {label}
            <HelpOutline color="action" fontSize="small" sx={{ ml: 1 }} />
          </Box>
        }
      />
    </Tooltip>
  );

  return (
    <Box m="20px">
      <Header
        title={
          id ? "EDIT OPERATION CONFIGURATION" : "ADD OPERATION CONFIGURATION"
        }
        subtitle={
          id
            ? "Edit the Operation Configuration"
            : "Add a new Operation Configuration"
        }
      />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={configSchema}
      >
        {(formikProps) => {
          const {
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
          } = formikProps;

          return (
            <Box
              display="grid"
              sx={{ px: 2, padding: "10px 100px 20px 100px" }}
            >
              <form onSubmit={handleSubmit}>
                <Box
                  display="grid"
                  gap="30px"
                  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                  sx={{
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
                    borderRadius: "10px",
                    padding: "40px",
                    "& > div": {
                      gridColumn: isNonMobile ? undefined : "span 4",
                    },
                  }}
                >
                  {/* Operation Type Dropdown */}
                  <FormControl
                    fullWidth
                    variant="filled"
                    sx={FormFieldStyles("span 2")}
                  >
                    <InputLabel>Operation Type</InputLabel>
                    <Select
                      label="Operation Type"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.operationTypeId}
                      name="operationTypeId"
                      error={
                        !!touched.operationTypeId && !!errors.operationTypeId
                      }
                    >
                      <MenuItem selected disabled>
                        Select Type
                      </MenuItem>
                      {Array.isArray(operationConfigData) &&
                      operationConfigData.length > 0 ? (
                        operationConfigData.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="" disabled>
                          No available Operation Types
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>

                  {/* Fixed Charge Type Dropdown */}
                  <FormControl
                    fullWidth
                    variant="filled"
                    sx={FormFieldStyles("span 2")}
                  >
                    <InputLabel>Fixed Charge Type</InputLabel>
                    <Select
                      label="Fixed Charge Type"
                      onBlur={handleBlur}
                      onChange={(e) =>
                        handleFixedChargeType(formikProps, e.target.value)
                      }
                      value={values.fixedChargeType}
                      name="fixedChargeType"
                      error={
                        !!touched.fixedChargeType && !!errors.fixedChargeType
                      }
                    >
                      <MenuItem value="" disabled>
                        Select Charge Type
                      </MenuItem>
                      <MenuItem value="ENUM">
                        Fixed Amount or Percentage with Ranges
                      </MenuItem>
                      <MenuItem value="PERCENTAGE">Percentage Based</MenuItem>
                      <MenuItem value="AMOUNT">Direct Amount</MenuItem>
                    </Select>
                  </FormControl>

                  {selectedChargeType && (
                    <>
                      {selectedChargeType === "ENUM" && (
                        <>
                          <TextField
                            fullWidth
                            variant="filled"
                            type="number"
                            label="Charge"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.fixedCharge}
                            name="fixedCharge"
                            error={
                              !!touched.fixedCharge && !!errors.fixedCharge
                            }
                            helperText={
                              touched.fixedCharge && errors.fixedCharge
                            }
                            sx={FormFieldStyles("span 2")}
                            inputProps={{ step: 0.01 }}
                          />

                          <TextField
                            fullWidth
                            variant="filled"
                            type="number"
                            label="Minimum Charge"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.minCharge}
                            name="minCharge"
                            error={!!touched.minCharge && !!errors.minCharge}
                            helperText={touched.minCharge && errors.minCharge}
                            sx={FormFieldStyles("span 1")}
                          />
                          <TextField
                            fullWidth
                            variant="filled"
                            type="number"
                            label="Maximum Charge"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.maxCharge}
                            name="maxCharge"
                            error={!!touched.maxCharge && !!errors.maxCharge}
                            helperText={touched.maxCharge && errors.maxCharge}
                            sx={FormFieldStyles("span 1")}
                          />
                        </>
                      )}

                      {selectedChargeType === "PERCENTAGE" && (
                        <>
                          <TextField
                            fullWidth
                            variant="filled"
                            type="number"
                            label="Charge Percentage"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.fixedCharge}
                            name="fixedCharge"
                            error={
                              !!touched.fixedCharge && !!errors.fixedCharge
                            }
                            helperText={
                              touched.fixedCharge && errors.fixedCharge
                            }
                            sx={FormFieldStyles("span 2")}
                          />
                        </>
                      )}

                      {selectedChargeType === "AMOUNT" && (
                        <>
                          <TextField
                            fullWidth
                            variant="filled"
                            type="number"
                            label="Charge Amount"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.fixedCharge}
                            name="fixedCharge"
                            error={
                              !!touched.fixedCharge && !!errors.fixedCharge
                            }
                            helperText={
                              touched.fixedCharge && errors.fixedCharge
                            }
                            sx={FormFieldStyles("span 2")}
                          />
                        </>
                      )}
                    </>
                  )}

                  <Box sx={FormFieldStyles("span 4")}>
                    {selectedChargeType === "ENUM" && (
                      <TooltipCheckbox
                        label="Percentage Charge"
                        checked={values.isChargePercentage}
                        onChange={(e) =>
                          setFieldValue("isChargePercentage", e.target.checked)
                        }
                        name="isChargePercentage"
                        tooltipTitle="When checked, the fixed charge will be calculated as a percentage instead of a fixed amount"
                      />
                    )}
                    <TooltipCheckbox
                      label="Merchant Debit"
                      checked={values.isMerchantDebit}
                      onChange={(e) =>
                        setFieldValue("isMerchantDebit", e.target.checked)
                      }
                      name="isMerchantDebit"
                      tooltipTitle="When checked, the merchant will be debited for this operation"
                    />
                  </Box>

                  <Divider sx={{ gridColumn: "span 4" }} />

                  <TextField
                    fullWidth
                    variant="filled"
                    type="number"
                    label="Min Amount"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.minAmount}
                    name="minAmount"
                    error={!!touched.minAmount && !!errors.minAmount}
                    helperText={touched.minAmount && errors.minAmount}
                    sx={FormFieldStyles("span 2")}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="number"
                    label="Max Amount"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.maxAmount}
                    name="maxAmount"
                    error={!!touched.maxAmount && !!errors.maxAmount}
                    helperText={touched.maxAmount && errors.maxAmount}
                    sx={FormFieldStyles("span 2")}
                  />

                  <TextField
                    fullWidth
                    variant="filled"
                    type="number"
                    label="GIMAC Charge Amount"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.gimacCharge}
                    name="gimacCharge"
                    error={!!touched.gimacCharge && !!errors.gimacCharge}
                    helperText={touched.gimacCharge && errors.gimacCharge}
                    sx={FormFieldStyles("span 1")}
                  />
                  <TooltipCheckbox
                    label="GIMAC Charge Percentage"
                    checked={values.isGimacChargesPercentage}
                    onChange={(e) =>
                      setFieldValue(
                        "isGimacChargesPercentage",
                        e.target.checked
                      )
                    }
                    name="isGimacChargesPercentage"
                    tooltipTitle="When checked, GIMAC charges will be calculated as a percentage of the transaction"
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="External Charge Amount"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.externalCharge}
                    name="externalCharge"
                    error={!!touched.externalCharge && !!errors.externalCharge}
                    helperText={touched.externalCharge && errors.externalCharge}
                    sx={FormFieldStyles("span 1")}
                  />

                  <TooltipCheckbox
                    label="External Charge Percentage"
                    checked={values.isExternalChargesPercentage}
                    onChange={(e) =>
                      setFieldValue(
                        "isExternalChargesPercentage",
                        e.target.checked
                      )
                    }
                    name="isExternalChargesPercentage"
                    tooltipTitle="When checked, external charges will be calculated as a percentage of the transaction"
                  />

                  {/* Dynamic Fields Based on Charge Type */}

                  {/* Checkboxes */}
                  <Box
                    sx={{
                      gridColumn: "span 4",
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    {/* More checkboxes as needed */}
                  </Box>
                </Box>
                {/* Submit Buttons */}
                <Box display="flex" justifyContent="end" mt="20px">
                  <Stack direction="row" spacing={2}>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </Button>
                    <LoadingButton
                      type="submit"
                      color="secondary"
                      variant="contained"
                      loading={pending}
                      startIcon={<Save />}
                    >
                      {id ? "Update Configuration" : "Create Configuration"}
                    </LoadingButton>
                  </Stack>
                </Box>
              </form>
            </Box>
          );
        }}
      </Formik>

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

const configSchema = yup.object().shape({
  operationTypeId: yup.string().required("Operation Type ID is required"),
  //   fixedCharge: yup
  //     .number()
  //     .min(0, "Fixed Charge must be non-negative")
  //     .required("Fixed Charge is required"),
  fixedCharge: yup
    .number()
    .required("Charge is required")
    .positive("Charge must be a positive number")
    .test(
      "maxDigitsAfterDecimal",
      "Charge can have at most 2 decimal places",
      (value) => /^\d+(\.\d{1,2})?$/.test(value.toString())
    )
    .test(
      "max-percentage",
      "Percentage value cannot exceed 100",
      function (value) {
        // Only apply this validation if isPercentage is true
        return !this.parent.isChargePercentage || value <= 100;
      }
    ),
  fixedChargeType: yup.string().required("Fixed Charge Type is required"),
  maxCharge: yup.number().min(0, "Max Charge must be non-negative"),
  maxAmount: yup.number().min(0, "Max Amount must be non-negative"),
  minCharge: yup
    .number()
    .min(0, "Min Charge must be non-negative")
    .test(
      "minChargeTest",
      "Minimum charge cannot exceed maximum charge",
      function (value) {
        return value <= this.parent.maxCharge;
      }
    ),
  minAmount: yup
    .number()
    .min(0, "Min Amount must be non-negative")
    .test(
      "minAmountTest",
      "Minimum amount cannot exceed maximum amount",
      function (value) {
        return value <= this.parent.maxAmount;
      }
    ),

  gimacCharge: yup.number().min(0, "GIMAC Charge must be non-negative"),
  externalCharge: yup.number().min(0, "External Charge must be non-negative"),
});

export default OperationConfigForm;
