import React from "react";
//MUI
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
//Redux
import { useSelector } from "react-redux";
//Component
import { OrderForm } from "../util/OrderForm";

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: "bolder",
  },
  form: {
    margin: "20px 0px 20px 0px",
  },
}));

export const Orderslist = () => {
  const classes = useStyles();
  const orderData = useSelector((state) => state.user.orderData);

  const finishedOrders = Object.values(orderData)
    .filter((order) => order.finish === true)
    .map((order) => {
      return (
        <Grid item key={order.createdAt}>
          <OrderForm order={order} />
        </Grid>
      );
    });

  const processingOrders = Object.values(orderData)
    .filter((order) => order.finish === false)
    .map((order) => {
      return (
        <Grid item key={order.createdAt} className={classes.form}>
          <OrderForm order={order} />
        </Grid>
      );
    });

  return (
    <Grid container direction="column" alignItems="center" justify="center">
      <Grid item>
        <Typography variant="h5" className={classes.title}>
          處理中訂單
        </Typography>
      </Grid>
      {processingOrders}
      <Grid item>
        <Typography variant="h5" className={classes.title}>
          訂單紀錄
        </Typography>
        {finishedOrders}
      </Grid>
    </Grid>
  );
};
