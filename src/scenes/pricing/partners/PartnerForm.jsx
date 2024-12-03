import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
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
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CBS_Services from "../../../services/api/GAV_Sercives";
import { LoadingButton } from "@mui/lab";
import { Save } from "@mui/icons-material";
import { tokens } from "../../../theme";
import { useTheme } from "@emotion/react";
import { FormFieldStyles } from "../../../tools/fieldValuestyle";

const PartnerForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.users);
  const token = userData.token;
  const spaceId = userData?.selectedSpace?.id;

  const [initialValues, setInitialValues] = useState({
    id: "",
    name: "",
    taxesAccountId: "",
    commissionAccountId: "",
    internalPartnerType: "",
    type: "",
    isActive: false,
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
        serviceReference: "CREATE_PARTNER",
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
        showSnackbar("Partner Edited Successfully.", "success");
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      } else {
        showSnackbar(response.body.errors || "Error Adding Partner", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showSnackbar("Error Try Again Later", "error");
    }
  };

  useEffect(() => {
    if (id && location.state && location.state.partnerData) {
      setInitialValues(location.state.partnerData);
    }
  }, [id, location.state]);

  console.log("initialValues", initialValues);

  return (
    <Box m="20px">
      <Header
        title={id ? "EDIT PARTNER" : "ADD PARTNER"}
        subtitle={id ? "Edit the partner details" : "Add a new partner"}
      />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={partnerSchema}
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
                <FormControl
                  fullWidth
                  variant="filled"
                  sx={FormFieldStyles("span 2")}
                >
                  <InputLabel>Partner Type</InputLabel>
                  <Select
                    label="Partner Type"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.type}
                    name="type"
                    error={!!touched.type && !!errors.type}
                  >
                    <MenuItem value="INTERNAL">INTERNAL</MenuItem>
                    <MenuItem value="EXTERNAL">EXTERNAL</MenuItem>
                    <MenuItem value="GIMAC">GIMAC</MenuItem>
                  </Select>
                  {touched.type && errors.type && (
                    <Alert severity="error">{errors.type}</Alert>
                  )}
                </FormControl>
                <FormControl
                  fullWidth
                  variant="filled"
                  sx={FormFieldStyles("span 2")}
                >
                  <InputLabel>Internal Partner Type</InputLabel>
                  <Select
                    label="Internal Partner Type"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.internalPartnerType}
                    name="internalPartnerType"
                    error={
                      !!touched.internalPartnerType &&
                      !!errors.internalPartnerType
                    }
                  >
                    <MenuItem value="VENDOR">Vendor</MenuItem>
                    <MenuItem value="RESELLER">Reseller</MenuItem>
                    <MenuItem value="AFFILIATE">Affiliate</MenuItem>
                  </Select>
                  {touched.internalPartnerType &&
                    errors.internalPartnerType && (
                      <Alert severity="error">
                        {errors.internalPartnerType}
                      </Alert>
                    )}
                </FormControl>

                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Partner Name"
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
                  type="text"
                  label="Taxes Account ID"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.taxesAccountId}
                  name="taxesAccountId"
                  error={!!touched.taxesAccountId && !!errors.taxesAccountId}
                  helperText={touched.taxesAccountId && errors.taxesAccountId}
                  sx={FormFieldStyles("span 2")}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Commission Account ID"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.commissionAccountId}
                  name="commissionAccountId"
                  error={
                    !!touched.commissionAccountId &&
                    !!errors.commissionAccountId
                  }
                  helperText={
                    touched.commissionAccountId && errors.commissionAccountId
                  }
                  sx={FormFieldStyles("span 2")}
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
                  label="Active Partner"
                  sx={FormFieldStyles("span 4")}
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
                    {id ? "Update Partner" : "Create Partner"}
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

const partnerSchema = yup.object().shape({
  id: yup.string().required("Partner ID is required"),
  name: yup.string().required("Partner Name is required"),
  taxesAccountId: yup.string().required("Taxes Account ID is required"),
  commissionAccountId: yup
    .string()
    .required("Commission Account ID is required"),
  internalPartnerType: yup
    .string()
    .required("Internal Partner Type is required"),
  type: yup.string().required("Partner Type is required"),
  isActive: yup.boolean(),
});

export default PartnerForm;
