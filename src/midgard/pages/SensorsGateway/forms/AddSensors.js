import React, { useState, useEffect } from "react";
import moment from "moment";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { validators } from "../../../utils/validators";
import Modal from "../../../components/Modal/Modal";
import MenuItem from "@material-ui/core/MenuItem";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Select from "@material-ui/core/Select";
import { useInput } from "../../../hooks/useInput";
import Loader from "../../../components/Loader/Loader";
import { Card, CardContent, Typography } from "@material-ui/core";
import DatePickerComponent from "../../../components/DatePicker/DatePicker";
import EnvironmentalLimitsForm from "./EnvironmentalLimitsForm";
import { associatedGatewayMock } from "../../../utils/mock";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(8),
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      width: "70%",
      margin: "auto",
    },
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    borderRadius: "18px",
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  loadingWrapper: {
    // margin: theme.spacing(1),
    position: "relative",
  },
  cardItems: {
    marginTop: theme.spacing(4),
  },
  formTitle: {
    fontWeight: "bold",
    marginTop: "1em",
    textAlign: "center",
  },
}));

function AddSensor({
  dispatch,
  loading,
  history,
  loaded,
  error,
  location,
  gatewayTypeList,
}) {
  const editPage = location.state && location.state.type === "edit";
  const editData =
    (location.state && location.state.type === "edit" && location.state.data) ||
    {};
  const [openModal, toggleModal] = useState(true);
  const classes = useStyles();
  const [min_temp_val, changeMinTempVal] = useState(0);
  const [max_temp_val, changeMaxTempVal] = useState(100);
  const [minMaxTempValue, setMinMaxTempValue] = useState([0, 35, 75, 100]);
  const [low_temp_val, changeLowTempVal] = useState(0);
  const [high_temp_val, changeHighTempVal] = useState(100);

  const [min_humid_val, changeMinHumidVal] = useState(0);
  const [max_humid_val, changeMaxHumidVal] = useState(100);
  const [minMaxHumidValue, setMinMaxHumidValue] = useState([0, 35, 75, 100]);
  const [low_humid_val, changeLowHumidVal] = useState(0);
  const [high_humid_val, changeHighHumidVal] = useState(100);

  const gateway_name = useInput(editData.name || "");
  const gateway_type = useInput(editData.gateway_type || "", {
    required: true,
  });
  const [activation_date, handleDateChange] = useState(
    editData.activation_date || moment()
  );
  const sim_card_id = useInput("");
  const battery_level = useInput("");
  const mac_address = useInput("");
  const last_known_location = useInput("");
  const [last_report_date_time, handleLastReportDate] = useState(
    moment(new Date())
  );
  const gateway_uuid = useInput("");
  const [formError, setFormError] = useState({});
  const [associatedGateway, setAccociatedGateway] = useState([]);
  const [environmentalModal, toggleEnvironmentalModal] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const buttonText = editPage ? "save" : "add Sensor";
  const formTitle = editPage ? "Edit Sensor(1/2)" : "Add Sensor(1/2)";
  const closeModal = () => {
    toggleModal(false);
    if (location && location.state) {
      history.push(location.state.from);
    }
  };

  /**
   * Submit The form and add/edit custodian
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const gatewayFormValues = {
      name: gateway_name.value,
      sensors: "",
      sim_card_id: sim_card_id.value,
      gateway_type: gateway_type.value,
      // shipment_ids: ["string"],
      activation_date: activation_date.value,
      last_known_battery_level: battery_level.value,
      ...(editPage && editData && { id: editData.id }),
    };
    if (editPage) {
      dispatch(editItem(itemFormValue, history));
    } else {
      dispatch(addItem(itemFormValue, history));
    }
  };

  /**
   * Handle input field blur event
   * @param {Event} e Event
   * @param {String} validation validation type if any
   * @param {Object} input input field
   */

  const handleBlur = (e, validation, input, parentId) => {
    let validateObj = validators(validation, input);
    let prevState = { ...formError };
    if (validateObj && validateObj.error)
      setFormError({
        ...prevState,
        [e.target.id || parentId]: validateObj,
      });
    else
      setFormError({
        ...prevState,
        [e.target.id || parentId]: {
          error: false,
          message: "",
        },
      });
  };

  const submitDisabled = () => {
    let errorKeys = Object.keys(formError);
    let errorExists = false;
    if (!gateway_type.value) return true;
    errorKeys.forEach((key) => {
      if (formError[key].error) errorExists = true;
    });
    return errorExists;
  };

  const theme = useTheme();
  let isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <div>
      {openModal && (
        <Modal
          open={openModal}
          setOpen={closeModal}
          title={formTitle}
          titleClass={classes.formTitle}
          maxWidth={"md"}
        >
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <Grid container spacing={isDesktop ? 2 : 0}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="gateway_name"
                  label="Alias"
                  name="gateway_name"
                  autoComplete="gateway_name"
                  {...gateway_name.bind}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="gateway_uuid"
                  label="Sensor1 UUID"
                  name="gateway_uuid"
                  autoComplete="gateway_uuid"
                  {...gateway_uuid.bind}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="last_known_location"
                  label="Sensor Placed"
                  name="last_known_location"
                  autoComplete="last_known_location"
                  {...last_known_location.bind}
                />
              </Grid>
            </Grid>
            <Card variant="outlined" className={classes.cardItems}>
              <CardContent>
                <Typography
                  className={classes.dashboardHeading}
                  variant={"body1"}
                >
                  Sensor Info
                </Typography>
                <Grid container spacing={isDesktop ? 2 : 0}>
                  <Grid item xs={12} md={6} sm={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      required
                      id="gateway_type"
                      select
                      label="Sensor Type"
                      error={
                        formError.gateway_type && formError.gateway_type.error
                      }
                      helperText={
                        formError.gateway_type
                          ? formError.gateway_type.message
                          : ""
                      }
                      onBlur={(e) =>
                        handleBlur(e, "required", gateway_type, "gateway_type")
                      }
                      {...gateway_type.bind}
                    >
                      <MenuItem value={""}>Select</MenuItem>
                      {gatewayTypeList &&
                        gatewayTypeList.map((item, index) => (
                          <MenuItem
                            key={`${item.id}${item.name}`}
                            value={item.url}
                          >
                            {item.name}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6} sm={6}>
                    <DatePickerComponent
                      label={"Activated"}
                      selectedDate={activation_date}
                      handleDateChange={handleDateChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} sm={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="sim_card_id"
                      label="IMEI"
                      name="sim_card_id"
                      autoComplete="sim_card_id"
                      {...sim_card_id.bind}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} sm={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="battery_level"
                      label="Battery"
                      name="battery_level"
                      autoComplete="battery_level"
                      {...battery_level.bind}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} sm={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="mac_address"
                      label="Mac Address"
                      name="mac_address"
                      autoComplete="mac_address"
                      {...mac_address.bind}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Grid container spacing={2} justify="center">
              <Grid item xs={6} sm={4}>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => closeModal()}
                  className={classes.submit}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={6} sm={4}>
                <div className={classes.loadingWrapper}>
                  <Button
                    onClick={() => toggleEnvironmentalModal(true)}
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    // disabled={loading || submitDisabled()}
                  >
                    Next
                  </Button>
                  {loading && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )}
                </div>
              </Grid>
            </Grid>
            {environmentalModal && (
              <Modal
                open={environmentalModal}
                setOpen={toggleEnvironmentalModal}
                title={"Set Environmental Limits(2/2)"}
                titleClass={classes.formTitle}
                maxWidth={"md"}
              >
                <EnvironmentalLimitsForm
                  closeModal={toggleEnvironmentalModal}
                  parentClasses={classes}
                  isSubmitDisabled={loading || submitDisabled()}
                  min_temp_val={min_temp_val}
                  max_temp_val={max_temp_val}
                  changeMinTempVal={changeMinTempVal}
                  changeMaxTempVal={changeMaxTempVal}
                  minMaxTempValue={minMaxTempValue}
                  setMinMaxTempValue={setMinMaxTempValue}
                  low_temp_val={low_temp_val}
                  high_temp_val={high_temp_val}
                  changeLowTempVal={changeLowTempVal}
                  changeHighTempVal={changeHighTempVal}
                  searchModalOpen={searchModalOpen}
                  setSearchModalOpen={setSearchModalOpen}
                  associatedGateway={associatedGateway}
                  setAccociatedGateway={setAccociatedGateway}
                  min_humid_val={min_humid_val}
                  changeMinHumidVal={changeMinHumidVal}
                  max_humid_val={max_humid_val}
                  changeMaxHumidVal={changeMaxHumidVal}
                  minMaxHumidValue={minMaxHumidValue}
                  setMinMaxHumidValue={setMinMaxHumidValue}
                  low_humid_val={low_humid_val}
                  changeLowHumidVal={changeLowHumidVal}
                  high_humid_val={high_humid_val}
                  changeHighHumidVal={changeHighHumidVal}
                />
              </Modal>
            )}
          </form>
        </Modal>
      )}
    </div>
  );
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.sensorsGatewayReducer,
});

export default connect(mapStateToProps)(AddSensor);
