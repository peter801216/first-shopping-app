import React from "react";
//Mui
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
//Component
import { OrderItemsCard } from "../util/OrderItemsCard";
//Redux
import { useDispatch } from "react-redux";
import { handleApplyCancelOrder } from "../../redux/actions/userActions";

const useStyles = makeStyles((theme) => ({
  container: {
    position: "relative",
    backgroundColor: "#fafafa",
    height: "100%",
    width: 350,
  },
  handleField: {
    textAlign: "right",
    backgroundColor: "#fafafa",
    height: 50,
    padding: 5,
    position: "relative",
  },
  btn: {
    position: "absolute",
    left: "5%",
    top: "20%",
  },
  redbtn: {
    position: "absolute",
    left: "5%",
    top: "20%",
  },
  finishtext: {
    position: "absolute",
    left: "5%",
    top: "20%",
  },
}));

export const OrderForm = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const {
    content,
    finish,
    shipment,
    totalPrice,
    paid,
    applyCancel,
    orderId,
  } = props.order;

  const order = content.map((item) => {
    const productData = item;
    return (
      <Grid item key={item.productId}>
        <OrderItemsCard productData={productData} />
      </Grid>
    );
  });

  const applyCancelOrder = (orderId) => {
    let type = {
      applyCancel: true,
    };

    dispatch(handleApplyCancelOrder(orderId, type));
  };

  const handleButton = applyCancel ? (
    <Button color="secondary" disabled className={classes.redbtn}>
      已提出取消
    </Button>
  ) : (
    <Button
      onClick={() => applyCancelOrder(orderId)}
      variant="outlined"
      color="primary"
      className={classes.btn}
    >
      申請取消訂單
    </Button>
  );

  return (
    <Paper className={classes.container}>
      <Grid container direction="column">
        {order}
        <Grid item>
          <Paper className={classes.handleField}>
            <div>訂單總金額 NT${totalPrice}</div>
            <div>
              已付款:{paid ? <span>是</span> : <span>否</span>}
              {"    "}
              狀態: {shipment ? <span>已出貨</span> : <span>備貨中</span>}
            </div>
            {finish ? (
              <span className={classes.finishtext}>訂單已完成</span>
            ) : (
              handleButton
            )}
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};
