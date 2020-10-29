import React, { useState } from "react";
//Mui
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
//Redux
import { useSelector, useDispatch } from "react-redux";
import {
  edituserdata,
  getUserData,
  handleChangePassword,
} from "../../redux/actions/userActions";

const useStyles = makeStyles((theme) => ({
  title: {
    margin: "10px auto 0px auto",
    fontWeight: "bolder",
    textAlign: "center",
  },
  TextField: {
    margin: "10px auto 10px auto",
    width: "300px",
  },
  btn: {
    margin: "10px",
  },
  progress: {
    position: "absolute",
  },
}));

export const Profiledata = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const credentials = useSelector((state) => state.user.credentials);
  const loading = useSelector((state) => state.UI.loading);

  const [userdata, setuserdata] = useState({
    name: credentials.name,
    phone: credentials.phone,
    email: credentials.email,
    info: {
      address: credentials.info.address,
      accountNumber: credentials.info.accountNumber,
      bankCode: credentials.info.bankCode,
    },
  });

  const [newPassword, setnewPassword] = useState({
    password: "",
    confirmpassword: "",
    passwordError: false,
    confirmError: false,
  });

  const [isEdit, setisEdit] = useState(false);
  const [handleSubmitError, sethandleSubmitError] = useState(false);

  const handleChange = (event) => {
    sethandleSubmitError(true);
    setisEdit(true);

    let originData = userdata;
    let originInfo = userdata.info;
    let newData = {};
    if (event.target.name === "name" || event.target.name === "phone") {
      newData = {
        ...originData,
        [event.target.name]: event.target.value,
      };
    } else if (
      event.target.name === "address" ||
      event.target.name === "accountNumber" ||
      event.target.name === "bankCode"
    ) {
      let newInfo = {
        ...originInfo,
      };

      if (event.target.name === "bankCode") {
        if (
          isNaN(event.target.value) ||
          event.target.value.split("").includes(".") ||
          event.target.value.length > 3
        ) {
          newInfo = { ...originInfo };
          return;
        } else if (event.target.value.length !== 3) {
          newInfo = {
            ...originInfo,
            [event.target.name]: event.target.value,
          };
          sethandleSubmitError(false);
        } else {
          newInfo = {
            ...originInfo,
            [event.target.name]: event.target.value,
          };
        }
      }

      if (event.target.name === "accountNumber") {
        if (
          isNaN(event.target.value) ||
          event.target.value.split("").includes(".") ||
          event.target.value.length > 16
        ) {
          newInfo = { ...originInfo };
          return;
        } else if (event.target.value.length < 10) {
          newInfo = {
            ...originInfo,
            [event.target.name]: event.target.value,
          };
          sethandleSubmitError(false);
        } else {
          newInfo = {
            ...originInfo,
            [event.target.name]: event.target.value,
          };
        }
      }

      newData = {
        ...originData,
        info: { ...newInfo },
      };
    }
    setuserdata(newData);
  };

  const handlepasswordChange = (event) => {
    setnewPassword({
      ...newPassword,
      passwordError: false,
      confirmError: false,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    sethandleSubmitError(false);
    setisEdit(false);

    event.preventDefault();
    const newData = {
      ...userdata,
    };
    console.log(newData);
    dispatch(edituserdata(newData));
  };

  const resetOriginData = () => {
    sethandleSubmitError(false);
    setisEdit(false);
    setuserdata({
      name: credentials.name,
      phone: credentials.phone,
      email: credentials.email,
      info: {
        address: credentials.info.address,
        accountNumber: credentials.info.accountNumber,
        bankCode: credentials.info.bankCode,
      },
    });
    dispatch(getUserData());
  };

  const handleChangePasswordSubmit = (event) => {
    event.preventDefault();
    const newdata = {
      password: newPassword.password,
      confirmpassword: newPassword.confirmpassword,
    };

    const errors = {
      handle: false,
      passwordError: false,
      confirmError: false,
    };

    if (newdata.password.length < 6) {
      errors.passwordError = "密碼至少超過6個字元";
      errors.handle = true;
    }

    if (newdata.password !== newdata.confirmpassword) {
      errors.confirmError = "密碼不符，請重新輸入";
      errors.handle = true;
    }

    if (errors.handle === true) {
      return setnewPassword({
        ...newPassword,
        passwordError: errors.passwordError,
        confirmError: errors.confirmError,
      });
    }

    dispatch(handleChangePassword({ password: newdata.password }));
    setnewPassword({
      password: "",
      confirmpassword: "",
      passwordError: false,
      confirmError: false,
    });

    dispatch(getUserData());
  };

  return (
    <div>
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <Typography variant="h5" className={classes.title}>
            會員資料
          </Typography>
        </Grid>
        <Grid item>
          <form>
            <Grid container direction="column" alignItems="center">
              <Grid item>
                <TextField
                  name="name"
                  variant="outlined"
                  fullWidth
                  multiline
                  label="會員姓名"
                  className={classes.TextField}
                  value={userdata.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  disabled
                  name="phone"
                  variant="outlined"
                  fullWidth
                  multiline
                  label="會員電話(此欄位不得更改)"
                  className={classes.TextField}
                  value={userdata.phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  disabled
                  name="email"
                  variant="outlined"
                  fullWidth
                  multiline
                  label="E-mail(此欄位不得更改)"
                  className={classes.TextField}
                  value={userdata.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  name="address"
                  variant="outlined"
                  fullWidth
                  multiline
                  label="會員地址"
                  className={classes.TextField}
                  value={userdata.info.address}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  name="bankCode"
                  variant="outlined"
                  fullWidth
                  multiline
                  label="銀行代碼"
                  className={classes.TextField}
                  value={userdata.info.bankCode}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  name="accountNumber"
                  variant="outlined"
                  fullWidth
                  multiline
                  label="銀行帳戶號碼"
                  className={classes.TextField}
                  value={userdata.info.accountNumber}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  className={classes.btn}
                  color="primary"
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
                  disabled={handleSubmitError ? false : true}
                >
                  儲存變更
                  {loading && (
                    <CircularProgress className={classes.progress} size={30} />
                  )}
                </Button>
                <Button
                  className={classes.btn}
                  color="secondary"
                  variant="contained"
                  size="large"
                  onClick={resetOriginData}
                  disabled={isEdit ? false : true}
                >
                  取消變更
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
        <Grid item>
          <Typography variant="h5" className={classes.title}>
            密碼變更
          </Typography>
        </Grid>
        <Grid item>
          <form noValidate onSubmit={handleChangePasswordSubmit}>
            <Grid container direction="column" alignItems="center">
              <Grid item>
                <TextField
                  type="password"
                  name="password"
                  variant="outlined"
                  fullWidth
                  label="請輸入新密碼"
                  className={classes.TextField}
                  value={newPassword.password}
                  onChange={handlepasswordChange}
                  error={newPassword.passwordError ? true : false}
                  helperText={newPassword.passwordError}
                />
              </Grid>
              <Grid item>
                <TextField
                  name="confirmpassword"
                  variant="outlined"
                  type="password"
                  fullWidth
                  label="再次入新密碼"
                  className={classes.TextField}
                  value={newPassword.confirmpassword}
                  onChange={handlepasswordChange}
                  error={newPassword.confirmError ? true : false}
                  helperText={newPassword.confirmError}
                />
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  className={classes.btn}
                  color="primary"
                  variant="contained"
                  size="large"
                  disabled={loading}
                >
                  儲存變更
                  {loading && (
                    <CircularProgress className={classes.progress} size={30} />
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </div>
  );
};
