import React from "react";
//Redux
import { useSelector } from "react-redux";
//MUI
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
//components
import { HomeCard } from "../components/util/HomeCard";
//Routes
import { PRODUCTS, ABOUT, USER } from "../configs/routes";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    minWidth: "420px",
  },
}));

export const Home = () => {
  const classes = useStyles();
  const userId = useSelector((state) => state.user.credentials.userId);

  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="flex-start"
      className={classes.root}
      spacing={5}
    >
      <Grid item>
        <HomeCard
          link={PRODUCTS}
          image="https://firebasestorage.googleapis.com/v0/b/first-shopping-app-bf21e.appspot.com/o/goshopping.jpg?alt=media&token=7dd701f5-77ce-4771-9af5-a64e7536a5fe"
          title={"Go products"}
          btnText={"買東西去 >>"}
        />
      </Grid>
      <Grid item>
        <HomeCard
          link={ABOUT}
          image="https://firebasestorage.googleapis.com/v0/b/first-shopping-app-bf21e.appspot.com/o/oranges.jpg?alt=media&token=4e4ade47-476d-431d-9d33-819693687271"
          title={"About us"}
          btnText={"關於我們 >>"}
        />
      </Grid>
      <Grid item>
        <HomeCard
          link={USER + "/" + userId + "/Profiledata"}
          image="https://firebasestorage.googleapis.com/v0/b/first-shopping-app-bf21e.appspot.com/o/homeoffice.jpg?alt=media&token=3da5fbf8-0439-43c2-b3a5-edcf1bd3b11c"
          title={"My account"}
          btnText={"我的帳號 >>"}
        />
      </Grid>
    </Grid>
  );
};
