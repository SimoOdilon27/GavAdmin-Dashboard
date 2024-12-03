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
  Switch,
  FormControlLabel,
  useTheme,
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
import { FormFieldStyles } from "../../../tools/fieldValuestyle";

const TellerForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { id } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((state) => state.users);
  const token = userData.token;
  const spaceId = userData?.selectedSpace?.id;
  const [corporations, setCorporations] = useState([]);
  const [banks, setBanks] = useState([]);
  const [branches, setBranches] = useState([]);

  // Filtered lists
  const [filteredBanks, setFilteredBanks] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);

  const [formData] = useState({
    request: id,
    bankCode: "001",
    internalId: "back-office",
  });
  const [initialValues, setInitialValues] = useState({
    msisdn: "",
    branchId: "",
    language: "",
    cbsAccountId: "",
    tellerName: "",
    internalId: "",
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
      let response;
      const submitData = {
        ...values,
        internalId: "0000",
        branchId: spaceId,
      };
      if (id) {
        // Update existing teller
        const payload = {
          serviceReference: "UPDATE_TELLER",
          requestBody: JSON.stringify(submitData),
          spaceId: spaceId,
        };
        console.log("submitData", submitData);

        response = await CBS_Services(
          "GATEWAY",
          "gavClientApiService/request",
          "POST",
          payload,
          token
        );

        // response = await CBS_Services('APE', 'teller/update', 'PUT', values);
        if (response && response.body.meta.statusCode === 200) {
          showSnackbar("Teller Updated Successfully.", "success");
          setTimeout(() => {
            navigate(-1);
          }, 2000);
        } else {
          showSnackbar(
            response.body.errors || "Error Updating Teller",
            "error"
          );
        }
      } else {
        // Add new teller

        const payload = {
          serviceReference: "CREATE_TELLER",
          requestBody: JSON.stringify(submitData),
          spaceId: spaceId,
        };
        console.log("payload", payload);
        const response = await CBS_Services(
          "GATEWAY",
          "gavClientApiService/request",
          "POST",
          payload,
          token
        );
        console.log("response", response);

        // response = await CBS_Services('APE', 'teller/create', 'POST', values);
        if (response && response.body.meta.statusCode === 200) {
          showSnackbar("Teller Created Successfully.", "success");
          setTimeout(() => {
            navigate("/usermanagement/adduser");
          }, 2000);
        } else {
          showSnackbar(response.body.errors || "Error Adding Teller", "error");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      showSnackbar("Error Try Again Later", "error");
    }
    setPending(false);
  };

  const fetchBranchID = async () => {
    try {
      const payload = {
        serviceReference: "GET_ALL_BRANCHES",
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
      console.log("response Branch", response);

      // const response = await CBS_Services('AP', `api/gav/bankBranch/getAll`, 'GET', null);

      if (response && response.body.meta.statusCode === 200) {
        setBranches(response.body.data || []);
      } else {
        console.error("Error fetching data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const fetchBankID = async () => {
    try {
      const payload = {
        serviceReference: "GET_ALL_BANKS",
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
      console.log("response Bank", response);

      // const response = await CBS_Services('AP', `api/gav/bank/getAll`, 'GET', null);
      console.log("fetchbankid", response);

      if (response && response.status === 200) {
        setBanks(response.body.data || []);
      } else if (response && response.body.status === 401) {
        showSnackbar(response.body.errors || "Error fetching Teller", "error");
      } else {
        console.error("Error fetching data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchCorpID = async () => {
    try {
      const payload = {
        serviceReference: "GET_ALL_CORPORATIONS",
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
      console.log("response Corporation", response);

      if (response && response.status === 200) {
        setCorporations(response.body.data || []);
      } else if (response && response.body.status === 401) {
        showSnackbar(
          response.body.errors || "Error fetching Corporation",
          "error"
        );
      } else {
        console.error("Error fetching data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchBranchID();
    fetchBankID();
    fetchCorpID();
  }, []);

  useEffect(() => {
    if (id && location.state && location.state.tellerData) {
      // Use the data passed from the Tellers component
      setInitialValues(location.state.tellerData);
    }
  }, [id, location.state]);

  return (
    <Box m="20px">
      <Header
        title={id ? "EDIT TELLER" : "ADD TELLER"}
        subtitle={
          id ? `Edit teller ${initialValues?.msisdn}` : "Add a new teller"
        }
      />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={checkoutSchema}
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
              px: 2, // Optional: horizontal padding for the outer container
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
                  padding: "40px", // Optional: padding for the inner container
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Teller Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.tellerName}
                  name="tellerName"
                  error={!!touched.tellerName && !!errors.tellerName}
                  helperText={touched.tellerName && errors.tellerName}
                  sx={FormFieldStyles("span 2")}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="MSISDN"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.msisdn}
                  name="msisdn"
                  error={!!touched.msisdn && !!errors.msisdn}
                  helperText={touched.msisdn && errors.msisdn}
                  sx={FormFieldStyles("span 2")}
                />

                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="CBS Account Number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.cbsAccountId}
                  name="cbsAccountId"
                  error={!!touched.cbsAccountId && !!errors.cbsAccountId}
                  helperText={touched.cbsAccountId && errors.cbsAccountId}
                  sx={FormFieldStyles("span 3")}
                />

                <FormControl
                  fullWidth
                  variant="filled"
                  sx={FormFieldStyles("span 1")}
                >
                  <InputLabel>Language</InputLabel>
                  <Select
                    label="Language"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.language}
                    name="language"
                    error={!!touched.language && !!errors.language}
                  >
                    <MenuItem value="" selected>
                      Select Language
                    </MenuItem>
                    <MenuItem value="FRENCH">FRENCH</MenuItem>
                    <MenuItem value="ENGLISH">ENGLISH</MenuItem>
                  </Select>
                  {touched.language && errors.language && (
                    <Alert severity="error">{errors.language}</Alert>
                  )}
                </FormControl>
              </Box>

              <Box display="flex" justifyContent="end" mt="20px">
                <Stack direction="row" spacing={2}>
                  {/* <LoadingButton
                                    type="submit"
                                    color="secondary"
                                    variant="contained"
                                    loading={pending}
                                    loadingPosition="start"
                                    startIcon={<Save />}
                                >
                                    {id ? "Update Teller" : "Create Teller"}
                                </LoadingButton> */}

                  <Button
                    color="primary"
                    variant="contained"
                    disabled={pending}
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>
                  {id ? (
                    ""
                  ) : (
                    <LoadingButton
                      type="submit"
                      color="secondary"
                      variant="contained"
                      loading={pending}
                      loadingPosition="start"
                      startIcon={<Save />}
                    >
                      {/* {id ? "Update Teller" : "Create Teller"} */}
                      Create Teller
                    </LoadingButton>
                  )}
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

const checkoutSchema = yup.object().shape({
  msisdn: yup.string().required("required"),
  language: yup.string().required("required"),
  cbsAccountId: yup.string(),
  tellerName: yup.string().required("required"),
});

export default TellerForm;
