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
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import { useParams, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const userData = useSelector((state) => state.users);
  const token = userData.token;
  const spaceId = userData?.selectedSpace?.id;

  const [initialValues, setInitialValues] = useState({
    name: "",
    value: 0,
    isActive: true,
    isGloballyApplied: false,
    isPercentage: false,
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
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleFormSubmit = async (values) => {
    setPending(true);

    try {
      const payload = {
        serviceReference: "CREATE_TAX",
        requestBody: JSON.stringify(values),
        spaceId: spaceId,
      };
      const response = await CBS_Services(
        "GATEWAY",
        "gavClientApiService/request",
        "POST",
        payload,
        token
      );
      console.log("fetchbankidbycorp", response);

      if (response && response.body.meta.statusCode === 200) {
        showSnackbar("Tax Created Successfully.", "success");
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      } else {
        showSnackbar(response.body.errors || "Error Adding Tax", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showSnackbar("Error Try Again Later", "error");
    }
  };

  return (
    <Box m="20px">
      <Header
        title={id ? "EDIT TAX CONFIGURATION" : "ADD TAX CONFIGURATION"}
        subtitle={
          id
            ? "Edit the tax configuration details"
            : "Add a new tax configuration"
        }
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
                  label="Tax Configuration Name"
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
                  label="Value"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.value}
                  name="value"
                  error={!!touched.value && !!errors.value}
                  helperText={touched.value && errors.value}
                  sx={FormFieldStyles("span 2")}
                  inputProps={{ step: 0.01 }}
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
                  label="Active Configuration"
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
                  label="Is Percentage"
                  sx={FormFieldStyles("span 1")}
                />
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
                    {id
                      ? "Update Tax Configuration"
                      : "Create Tax Configuration"}
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
    .positive("Value must be a positive number")
    .test(
      "maxDigitsAfterDecimal",
      "Value can have at most 2 decimal places",
      (value) => /^\d+(\.\d{1,2})?$/.test(value.toString())
    ),
  isActive: yup.boolean(),
  isGloballyApplied: yup.boolean(),
  isPercentage: yup.boolean(),
});

export default TaxConfigForm;
