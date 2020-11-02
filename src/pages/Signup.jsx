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
import { signupUser } from "../redux/actions/userActions";
import { CLEAR_ERRORS } from "../redux/types";
//Routes
import { LOGIN } from "../configs/routes";

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
    margin: "0px auto 20px auto",
  },
  progress: {
    position: "absolute",
  },
}));

export const Signup = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const [signupData, setsignupData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const errors = useSelector((state) => state.UI.errors);
  const loading = useSelector((state) => state.UI.loading);

  const handleChange = (event) => {
    setsignupData({
      ...signupData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newUser = {
      name: signupData.name,
      phone: signupData.phone,
      email: signupData.email,
      password: signupData.password,
      confirmPassword: signupData.confirmPassword,
    };

    dispatch(signupUser(newUser, history));
  };

  const clearErrors = () => {
    dispatch({ type: CLEAR_ERRORS });
  };

  return (
    <Grid container direction="column" className={classes.root}>
      <Grid item>
        <Typography variant="h4">會員註冊</Typography>
      </Grid>
      <Grid item>
        <form noValidate onSubmit={handleSubmit}>
          <TextField
            className={classes.textField}
            id="name"
            name="name"
            type="name"
            label="姓名"
            fullWidth
            variant="outlined"
            onChange={handleChange}
            error={errors.name ? true : false}
            helperText={errors.name}
            value={signupData.name}
          />
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
            value={signupData.phone}
          />
          <TextField
            className={classes.textField}
            id="email"
            name="email"
            type="email"
            label="信箱"
            fullWidth
            variant="outlined"
            onChange={handleChange}
            error={errors.email ? true : false}
            helperText={errors.email}
            value={signupData.email}
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
            value={signupData.password}
          />
          <TextField
            className={classes.textField}
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="請再輸入一次密碼"
            fullWidth
            variant="outlined"
            onChange={handleChange}
            error={errors.confirmPassword ? true : false}
            helperText={errors.confirmPassword}
            value={signupData.confirmPassword}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.button}
            disabled={loading}
          >
            註冊
            {loading && (
              <CircularProgress className={classes.progress} size={30} />
            )}
          </Button>
          <Typography variant="body2">
            已經擁有帳號?{" "}
            <Link to={LOGIN} onClick={clearErrors}>
              點此
            </Link>
            前往登入
          </Typography>
        </form>
      </Grid>
    </Grid>
  );
};
