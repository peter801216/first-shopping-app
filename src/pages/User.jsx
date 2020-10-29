import React from "react";
//Routes
import { Switch, Route, Link } from "react-router-dom";
import { USER } from "../configs/routes";
//Components
import { Profiledata } from "../components/user/Profiledata";
import { Orderslist } from "../components/user/Orderslist";
import { Shoppingcartlist } from "../components/user/Shoppingcartlist";
//Mui
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
//Redux
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  btn: {
    margin: "15px",
  },
  btncontainer: {
    maxWidth: "800px",
  },
}));

export const User = () => {
  const classes = useStyles();
  const userId = useSelector((state) => state.user.credentials.userId);
  const userPath = USER + "/" + userId;

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <Grid
        item
        container
        direction="row"
        justify="center"
        className={classes.btncontainer}
      >
        <Grid item>
          <Button
            component={Link}
            to={userPath + "/Profiledata"}
            className={classes.btn}
            color="primary"
            variant="contained"
            size="large"
          >
            會員資料
          </Button>
        </Grid>
        <Grid item>
          <Button
            component={Link}
            to={userPath + "/Shoppingcartlist"}
            className={classes.btn}
            color="primary"
            variant="contained"
            size="large"
          >
            購物車
          </Button>
        </Grid>
        <Grid item>
          <Button
            component={Link}
            to={userPath + "/Orderslist"}
            className={classes.btn}
            color="primary"
            variant="contained"
            size="large"
          >
            訂單查詢
          </Button>
        </Grid>
      </Grid>
      <Grid item className={classes.btncontainer}>
        <Switch>
          <Route
            exact
            path={userPath + "/Profiledata"}
            component={Profiledata}
          />
          <Route
            exact
            path={userPath + "/Shoppingcartlist"}
            component={Shoppingcartlist}
          />
          <Route exact path={userPath + "/Orderslist"} component={Orderslist} />
        </Switch>
      </Grid>
    </Grid>
  );
};
