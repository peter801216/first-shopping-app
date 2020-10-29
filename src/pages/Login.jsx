import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
//MUI
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
//Redux
import { loginUser } from "../redux/actions/userActions";
import { CLEAR_ERRORS } from "../redux/types";
//Routes
import { SIGNUP } from "../configs/routes";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: "30px auto 0px auto",
      width: "25ch",
      textAlign: "center",
    },
  },
  textField: {
    margin: "0px auto 20px auto",
  },
  button: {
    margin: "0px 5px 20px 5px",
  },
  progress: {
    position: "absolute",
  },
}));

export const Login = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const [loginData, setloginData] = useState({
    phone: "",
    password: "",
  });

  const errors = useSelector((state) => state.UI.errors);
  const loading = useSelector((state) => state.UI.loading);

  const handleChange = (event) => {
    setloginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const userData = {
      phone: loginData.phone,
      password: loginData.password,
    };

    dispatch(loginUser(userData, history));
  };

  const clearErrors = () => {
    dispatch({ type: CLEAR_ERRORS });
  };

  return (
    <Grid container direction="column" className={classes.root}>
      <Grid item>
        <Typography variant="h4">會員登入</Typography>
      </Grid>
      <Grid item>
        <form noValidate onSubmit={handleSubmit}>
          <TextField
            className={classes.textField}
            id="phone"
            name="phone"
            type="phone"
            label="手機號碼"
            fullWidth
            variant="outlined"
            onChange={handleChange}
            error={errors.phone ? true : false}
            helperText={errors.phone}
            value={loginData.phone}
          />
          <TextField
            className={classes.textField}
            id="password"
            name="password"
            type="password"
            label="密碼"
            fullWidth
            variant="outlined"
            onChange={handleChange}
            error={errors.password ? true : false}
            helperText={errors.password}
            value={loginData.password}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.button}
            disabled={loading}
          >
            登入
            {loading && (
              <CircularProgress className={classes.progress} size={30} />
            )}
          </Button>
          <Typography variant="body2">
            尚未擁有帳號?{" "}
            <Link to={SIGNUP} onClick={clearErrors}>
              點此
            </Link>
            前往註冊
          </Typography>
        </form>
      </Grid>
    </Grid>
  );
};
