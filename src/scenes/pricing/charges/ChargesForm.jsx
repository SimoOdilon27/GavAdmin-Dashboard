import React, { useEffect, useState } from "react";
import {
	Alert,
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
	useTheme,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import { Save } from "@mui/icons-material";
import CBS_Services from "../../../services/api/GAV_Sercives";
import { FormFieldStyles } from "../../../tools/fieldValuestyle";
import Header from "../../../components/Header";

const ChargesForm = () => {
	const isNonMobile = useMediaQuery("(min-width:600px)");
	const { id } = useParams();
	const theme = useTheme();
	const location = useLocation();
	const navigate = useNavigate();
	const userData = useSelector((state) => state.users);
	const token = userData.token;
	const spaceId = userData?.selectedSpace?.id;
	const usertype = userData.selectedSpace.role;
	const [bankID, setBankID] = useState([]);
	const [bankIDbyCorp, setBankIDbyCorp] = useState([]);
	const [partnerData, setPartnerData] = useState([]);
	const [OperationConfigData, setOperationConfigData] = useState([]);
	const [initialValues, setInitialValues] = useState({
		bankId: "",
		chargeValue: 0,
		maxAmount: 0,
		minAmount: 0,
		operationConfigId: 0,
		partnerId: "",
		isActive: true,
		isChargePercentage: true,
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
			console.log("fetchbankid", response);

			if (response && response.body.meta.statusCode === 200) {
				setBankID(response.body.data);
			} else {
				console.error("Error fetching data");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const fetchPartnerData = async () => {
		try {
			const payload = {
				serviceReference: "GET_ALL_PARTNERS",
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
			console.log("fetchbankid", response);

			if (response && response.body.meta.statusCode === 200) {
				setPartnerData(response.body.data);
			} else {
				console.error("Error fetching data");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};
	const fetchOperationConfigData = async () => {
		try {
			const payload = {
				serviceReference: "GET_ALL_OPERATION_CONFIGS",
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
			console.log("fetchbankid", response);

			if (response && response.body.meta.statusCode === 200) {
				setOperationConfigData(response.body.data);
			} else {
				console.error("Error fetching data");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	useEffect(() => {
		fetchBankID();
		fetchBankbyCorporation();
		fetchPartnerData();
		fetchOperationConfigData();
	}, []);

	const handleFormSubmit = async (values) => {
		setPending(true);
		try {
			let response;
			let payload = {};

			const submitData = {
				...values,
				bankId: spaceId,
			};

			if (usertype === "BANK_ADMIN") {
				payload = {
					serviceReference: "CREATE_CHARGE",
					requestBody: JSON.stringify(submitData),
					spaceId: spaceId,
				};
			} else {
				payload = {
					serviceReference: "CREATE_CHARGE",
					requestBody: JSON.stringify(values),
					spaceId: spaceId,
				};
			}

			response = await CBS_Services(
				"GATEWAY",
				"gavClientApiService/request",
				"POST",
				payload,
				token
			);
			if (response && response.body.meta.statusCode === 200) {
				showSnackbar(
					id ? "Charge Updated Successfully." : "Charge Created Successfully.",
					"success"
				);
				setTimeout(() => {
					navigate("/charges");
				}, 2000);
			} else {
				showSnackbar(
					response.body.errors ||
					(id ? "Error Updating Charge" : "Error Creating Charge"),
					"error"
				);
			}
		} catch (error) {
			console.error("Error:", error);
			showSnackbar("Error Try Again Later", "error");
		}
		setPending(false);
	};

	const fetchBankbyCorporation = async () => {
		try {
			const payload = {
				serviceReference: "GET_ALL_BANKS_BY_CORPORATION_ID",
				requestBody: spaceId,
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
				setBankIDbyCorp(response.body.data);
			} else {
				console.error("Error fetching data");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	useEffect(() => {
		if (id && location.state && location.state.chargeData) {
			setInitialValues(location.state.chargeData);
		}
	}, [id, location.state]);

	return (
		<Box m="20px">
			<Header
				title={id ? "EDIT CHARGE" : "ADD CHARGE"}
				subtitle={
					id
						? "Edit the charge configuration"
						: "Add a new charge configuration"
				}
			/>

			<Formik
				onSubmit={handleFormSubmit}
				initialValues={initialValues}
				enableReinitialize={true}
				validationSchema={chargeSchema}
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
								{usertype === "CREDIX_ADMIN" && (
									<FormControl
										fullWidth
										variant="filled"
										sx={FormFieldStyles("span 4")}
									>
										<InputLabel>Bank</InputLabel>
										<Select
											label="Bank"
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.bankId}
											name="bankId"
											error={!!touched.bankId && !!errors.bankId}
										>
											<MenuItem value="" selected disabled>
												Select Bank
											</MenuItem>
											{Array.isArray(bankID) && bankID.length > 0 ? (
												bankID.map((option) => (
													<MenuItem key={option.bankId} value={option.bankId}>
														{option.bankName}
													</MenuItem>
												))
											) : (
												<option value="">No Banks available</option>
											)}
										</Select>
										{touched.bankId && errors.bankId && (
											<Alert severity="error">{errors.bankId}</Alert>
										)}
									</FormControl>
								)}

								{usertype === "CORPORATION_ADMIN" && (
									<FormControl
										fullWidth
										variant="filled"
										sx={FormFieldStyles("span 4")}
									>
										<InputLabel>Bank</InputLabel>
										<Select
											label="Bank"
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.bankId}
											name="bankId"
											error={!!touched.bankId && !!errors.bankId}
										>
											<MenuItem value="" selected disabled>
												Select Partners
											</MenuItem>
											{Array.isArray(bankIDbyCorp) &&
												bankIDbyCorp.length > 0 ? (
												bankIDbyCorp.map((option) => (
													<MenuItem key={option.bankId} value={option.bankId}>
														{option.bankName}
													</MenuItem>
												))
											) : (
												<MenuItem value="">No Banks available</MenuItem>
											)}
										</Select>
										{touched.bankId && errors.bankId && (
											<Alert severity="error">{errors.bankId}</Alert>
										)}
									</FormControl>
								)}

								<FormControl
									fullWidth
									variant="filled"
									sx={FormFieldStyles("span 2")}
								>
									<InputLabel>Operation Config</InputLabel>
									<Select
										label="Operation Config"
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.operationConfigId}
										name="operationConfigId"
										error={
											!!touched.operationConfigId && !!errors.operationConfigId
										}
									>
										<MenuItem value="" selected disabled>
											Select Operation Config
										</MenuItem>
										{Array.isArray(partnerData) && partnerData.length > 0 ? (
											partnerData.map((option) => (
												<MenuItem key={option.id} value={option.id}>
													{option.name}
												</MenuItem>
											))
										) : (
											<MenuItem value="">
												No Operation Config available
											</MenuItem>
										)}
									</Select>
									{touched.operationConfigId && errors.operationConfigId && (
										<Alert severity="error">{errors.operationConfigId}</Alert>
									)}
								</FormControl>

								<FormControl
									fullWidth
									variant="filled"
									sx={FormFieldStyles("span 2")}
								>
									<InputLabel>Partner</InputLabel>
									<Select
										label="Partner"
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.partnerId}
										name="partnerId"
										error={!!touched.partnerId && !!errors.partnerId}
									>
										<MenuItem value="" selected disabled>
											Select Partner
										</MenuItem>
										{Array.isArray(partnerData) && partnerData.length > 0 ? (
											partnerData.map((option) => (
												<MenuItem key={option.id} value={option.id}>
													{option.name}
												</MenuItem>
											))
										) : (
											<MenuItem value="">No Partners available</MenuItem>
										)}
									</Select>
									{touched.partnerId && errors.partnerId && (
										<Alert severity="error">{errors.partnerId}</Alert>
									)}
								</FormControl>
								<TextField
									fullWidth
									variant="filled"
									type="number"
									label="Charge Value"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.chargeValue}
									name="chargeValue"
									error={!!touched.chargeValue && !!errors.chargeValue}
									helperText={touched.chargeValue && errors.chargeValue}
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
									sx={FormFieldStyles("span 1")}
								/>
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
									sx={FormFieldStyles("span 1")}
								/>

								<Box sx={FormFieldStyles("span 1")}>
									<FormControlLabel
										control={
											<Checkbox
												checked={values.isActive}
												color="secondary"
												onChange={(e) =>
													setFieldValue("isActive", e.target.checked)
												}
												name="isActive"
											/>
										}
										label="Is Active"
									/>
								</Box>
								<Box sx={FormFieldStyles("span 1")}>
									<FormControlLabel
										control={
											<Checkbox
												color="secondary"
												checked={values.isChargePercentage}
												onChange={(e) =>
													setFieldValue("isChargePercentage", e.target.checked)
												}
												name="isChargePercentage"
											/>
										}
										label="Is Charge Percentage"
									/>
								</Box>
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
										{id ? "Update Charge" : "Create Charge"}
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

const chargeSchema = yup.object().shape({
	// bankId: yup.string().required("Bank ID is required"),
	chargeValue: yup
		.number()
		.required("Charge Value is required")
		.positive("Charge Value must be positive"),
	maxAmount: yup
		.number()
		.required("Max Amount is required")
		.positive("Max Amount must be positive"),
	minAmount: yup
		.number()
		.required("Min Amount is required")
		.positive("Min Amount must be positive"),
	// operationConfigId: yup.number()
	//     .required("Operation Config ID is required")
	//     .positive("Operation Config ID must be positive"),
	partnerId: yup.string().required("Partner ID is required"),
	isActive: yup.boolean(),
	isChargePercentage: yup.boolean(),
});

export default ChargesForm;
