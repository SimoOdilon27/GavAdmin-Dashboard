import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  Snackbar,
  Stack,
  TextField,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CBS_Services from "../../../services/api/GAV_Sercives";
import { LoadingButton } from "@mui/lab";
import { Save } from "@mui/icons-material";
import { tokens } from "../../../theme";
import { useTheme } from "@emotion/react";
import { FormFieldStyles } from "../../../tools/fieldValuestyle";

const TaxConfigForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.users);
  const token = userData.token;
  const spaceId = userData?.selectedSpace?.id;
  const [chargesData, setChargesData] = useState([]);

  const [initialValues, setInitialValues] = useState({
    name: "",
    value: 0,
    isActive: false,
    isGloballyApplied: false,
    isPercentage: false,
    chargeId: "", // New field for non-globally applied taxes
  });

  const [pending, setPending] = useState(false);
  const [charges, setCharges] = useState([]); // State to store available charges
  const [createdTaxId, setCreatedTaxId] = useState(null); // State to store newly created tax ID

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const fetchChargesData = async () => {
    setPending(true);
    try {
      const payload = {
        serviceReference: "GET_ALL_CHARGES",
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
        setChargesData(response.body.data || []);
      } else {
        console.error("Error fetching data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setPending(false);
  };

  useEffect(() => {
    fetchChargesData();
  }, []);

  // Fetch charges when component mounts
  useEffect(() => {
    const fetchCharges = async () => {
      try {
        const payload = {
          serviceReference: "GET_CHARGES",
          spaceId: spaceId,
        };
        const response = await CBS_Services(
          "GATEWAY",
          "gavClientApiService/request",
          "POST",
          payload,
          token
        );

        if (response && response.body.meta.statusCode === 200) {
          setCharges(response.body.data);
        }
      } catch (error) {
        console.error("Error fetching charges:", error);
        showSnackbar("Error fetching charges", "error");
      }
    };

    fetchCharges();
  }, [spaceId, token]);

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleFormSubmit = async (values) => {
    setPending(true);

    try {
      // const submitData = {
      //   ...values,
      //   isActive: values.isActive,
      //   isGloballyApplied: values.isGloballyApplied,
      //   isPercentage: values.isPercentage,
      // };

      const payload = {
        serviceReference: "CREATE_TAX",
        requestBody: JSON.stringify(values),
        spaceId: spaceId,
      };
      console.log("values", values);

      const response = await CBS_Services(
        "GATEWAY",
        "gavClientApiService/request",
        "POST",
        payload,
        token
      );

      if (response && response.body.meta.statusCode === 200) {
        const createdTaxId = response.body.data.id;
        setCreatedTaxId(createdTaxId);
        showSnackbar("Tax Created Successfully.", "success");

        // If not globally applied, create tax-charge mapping
        if (!values.globallyApplied && values.chargeId) {
          await createTaxChargeMapping(createdTaxId, values.chargeId);
        }

        setTimeout(() => {
          navigate(-1);
        }, 2000);
      } else {
        showSnackbar(response.body.errors || "Error Adding Tax", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showSnackbar("Error Try Again Later", "error");
    } finally {
      setPending(false);
    }
  };

  // New function to create tax-charge mapping
  const createTaxChargeMapping = async (taxId, chargeId) => {
    try {
      const mappingPayload = {
        serviceReference: "CREATE_TAX_CHARGE_MAPPING",
        requestBody: JSON.stringify({
          taxesId: taxId,
          chargesId: chargeId,
        }),
        spaceId: spaceId,
      };

      const mappingResponse = await CBS_Services(
        "GATEWAY",
        "gavClientApiService/request",
        "POST",
        mappingPayload,
        token
      );

      if (mappingResponse && mappingResponse.body.meta.statusCode === 200) {
        showSnackbar("Tax-Charge Mapping Created Successfully.", "success");
      } else {
        showSnackbar("Error Creating Tax-Charge Mapping", "error");
      }
    } catch (error) {
      console.error("Error creating tax-charge mapping:", error);
      showSnackbar("Error Creating Tax-Charge Mapping", "error");
    }
  };

  useEffect(() => {
    if (id && location.state && location.state.taxData) {
      setInitialValues(location.state.taxData);
    }
  }, [id, location.state]);

  return (
    <Box m="20px">
      <Header
        title={id ? "EDIT TAX " : "ADD TAX "}
        subtitle={id ? "Edit the tax details" : "Add a new tax "}
      />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={taxConfigSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
          <Box
            display="grid"
            sx={{
              px: 2,
              padding: "10px 100px 20px 100px",
            }}
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
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Tax Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  name="name"
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                  sx={FormFieldStyles("span 2")}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="number"
                  label="Charge"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.value}
                  name="value"
                  error={!!touched.value && !!errors.value}
                  helperText={touched.value && errors.value}
                  sx={FormFieldStyles("span 1")}
                  inputProps={{ step: 0.01 }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.isPercentage}
                      onChange={(e) =>
                        setFieldValue("isPercentage", e.target.checked)
                      }
                      name="isPercentage"
                      color="secondary"
                    />
                  }
                  label="Value In Percentage"
                  sx={FormFieldStyles("span 1")}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.isActive}
                      onChange={(e) =>
                        setFieldValue("isActive", e.target.checked)
                      }
                      name="isActive"
                      color="secondary"
                    />
                  }
                  label="Active"
                  sx={FormFieldStyles("span 1")}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.isGloballyApplied}
                      onChange={(e) =>
                        setFieldValue("isGloballyApplied", e.target.checked)
                      }
                      name="isGloballyApplied"
                      color="secondary"
                    />
                  }
                  label="Globally Applied"
                  sx={FormFieldStyles("span 1")}
                />
                {!values.isGloballyApplied && (
                  <FormControl
                    fullWidth
                    variant="filled"
                    sx={FormFieldStyles("span 4")}
                  >
                    <InputLabel>Charge</InputLabel>
                    <Select
                      label="Charge"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.chargeId}
                      name="chargeId"
                      error={!!touched.chargeId && !!errors.chargeId}
                    >
                      <MenuItem value="" selected disabled>
                        Select Charge
                      </MenuItem>
                      {Array.isArray(chargesData) && chargesData.length > 0 ? (
                        chargesData.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.chargeValue}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="">No Charge available</MenuItem>
                      )}
                    </Select>
                    {touched.chargeId && errors.chargeId && (
                      <Alert severity="error">{errors.chargeId}</Alert>
                    )}
                  </FormControl>
                )}
              </Box>
              <Box display="flex" justifyContent="end" mt="20px">
                <Stack direction="row" spacing={2}>
                  <Button
                    color="primary"
                    variant="contained"
                    disabled={pending}
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>
                  <LoadingButton
                    type="submit"
                    color="secondary"
                    variant="contained"
                    loading={pending}
                    loadingPosition="start"
                    startIcon={<Save />}
                  >
                    {id ? "Update Tax " : "Create Tax "}
                  </LoadingButton>
                </Stack>
              </Box>
            </form>
          </Box>
        )}
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

const taxConfigSchema = yup.object().shape({
  name: yup.string().required("Tax Configuration Name is required"),
  value: yup
    .number()
    .required("Value is required")
    .min(0, "Charge Value must be non-negative")
    .test(
      "maxDigitsAfterDecimal",
      "Value can have at most 2 decimal places",
      (value) => /^\d+(\.\d{1,2})?$/.test(value.toString())
    )
    .test(
      "max-percentage",
      "Percentage value cannot exceed 100",
      function (value) {
        // Only apply this validation if isPercentage is true
        return !this.parent.isPercentage || value <= 100;
      }
    ),

  chargeId: yup.string().when("isGloballyApplied", {
    is: false,
    then: yup
      .string()
      .required("Charge is required when tax is not globally applied"),
  }),
  isActive: yup.boolean(),
  isGloballyApplied: yup.boolean(),
  isPercentage: yup.boolean(),
});

export default TaxConfigForm;
