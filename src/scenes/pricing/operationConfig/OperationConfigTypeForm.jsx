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

const OperationConfigTypeForm = () => {
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
    description: "",
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
      if (id) {
        // Update existing Operation-Type item
        const payload = {
          serviceReference: "UPDATE_OPERATION_TYPE",
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

        if (response && response.body.meta.statusCode === 200) {
          showSnackbar("Operation-Type Edited Successfully.", "success");
          setTimeout(() => {
            navigate(-1);
          }, 2000);
        } else {
          // toast.error(response.body.errors || "Error Editing Operation-Type");
          showSnackbar(
            response.body.errors || "Error Editing Operation-Type",
            "error"
          );
        }
      } else {
        // Add new Operation-Type item
        const payload = {
          serviceReference: "CREATE_OPERATION_TYPE",
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
        console.log("values", values);

        if (response && response.body.meta.statusCode === 200) {
          showSnackbar("Operation-Type Created Successfully.", "success");
          // navigate("/menu-Operation-Type"); // Navigate back to the Operation-Type list
          setTimeout(() => {
            navigate(-1);
          }, 2000);
        } else {
          showSnackbar(
            response.body.errors || "Error Adding Operation-Type",
            "error"
          );
        }
      }

      if (response && response.body.meta.statusCode === 200) {
        navigate(-1); // Navigate back to the Operation-Type list
      }
    } catch (error) {
      console.error("Error:", error);
      // toast.error(`Error ${id ? "Editing" : "Adding"} Operation-Type`);
      showSnackbar("Error Try Again Later", "error");
    }
    setPending(false);
  };

  useEffect(() => {
    if (id && location.state && location.state.OperationTypeData) {
      setInitialValues(location.state.OperationTypeData);
    }
  }, [id, location.state]);

  console.log("initialValues", initialValues);

  return (
    <Box m="20px">
      <Header
        title={id ? "EDIT OPERATION TYPE " : "ADD OPERATION TYPE"}
        subtitle={id ? "Edit the Operation Type" : "Add a new Operation Type"}
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
                  padding: "40px",
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Operation Type ID"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.id}
                  name="id"
                  error={!!touched.id && !!errors.id}
                  helperText={touched.id && errors.id}
                  sx={FormFieldStyles("span 2")}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Name"
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
                  label="Description"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.description}
                  name="description"
                  error={!!touched.description && !!errors.description}
                  helperText={touched.description && errors.description}
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
                    {id ? "Update Operation-Type" : "Create Operation-Type"}
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

const checkoutSchema = yup.object().shape({
  id: yup.string().required("required"),
  name: yup.string().required("required"),
  description: yup.string().required("required"),
});

export default OperationConfigTypeForm;
