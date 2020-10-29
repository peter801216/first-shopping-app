import React, { useEffect, useState } from "react";
import axios from "axios";
//Mui
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ButtonGroup from "@material-ui/core/ButtonGroup";
//Redux
import { useDispatch } from "react-redux";
import {
  handleIncreaseShoppingcart,
  handleDecreaseShoppingcart,
  handleRemoveItemShoppingcart,
} from "../../redux/actions/userActions";
import { SkeletonCard } from "../util/SkeletonCard";

const useStyles = makeStyles((theme) => ({
  container: {
    position: "relative",
    backgroundColor: "#fafafa",
    height: "100%",
    width: "100%",
  },
  image: {
    height: 150,
    width: 150,
  },
  textcontent: {
    width: 200,
    paddingLeft: 10,
    paddingTop: 10,
  },
  deleteBtn: {
    position: "absolute",
    top: "5%",
    right: "2%",
    color: "red",
    width: 40,
  },
  buttonGroup: {
    margin: "5px 0px 5px 0px ",
  },
}));

export const ShoppingcartCard = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { productId, quantity } = props.productData;
  const [productData, setproductData] = useState({});
  const [loading, setloading] = useState(true);
  const cost = productData.price * productData.discount * quantity;

  useEffect(() => {
    const getProduct = (id) => {
      axios.get(`/product/${id}`).then((res) => {
        const a = res.data;
        setproductData(a);
        setloading(false);
      });
    };
    return getProduct(productId);
  }, [productId]);

  const handleQuantityIncrease = (productId) => {
    dispatch(handleIncreaseShoppingcart(productId));
  };

  const handleQuantityDecrease = (productId) => {
    if (quantity === 0) {
      return;
    }
    dispatch(handleDecreaseShoppingcart(productId));
  };

  const handleDeleteItem = (productId) => {
    dispatch(handleRemoveItemShoppingcart(productId));
  };

  return loading ? (
    <SkeletonCard />
  ) : (
    <Paper className={classes.container}>
      <Grid container direction="row">
        <Grid item>
          <img
            className={classes.image}
            src={productData.imageUrl}
            alt="list-card"
          />
        </Grid>
        <Grid item container direction="column" className={classes.textcontent}>
          <Typography variant="body1">{productData.title}</Typography>
          <Typography variant="subtitle2">
            NT$ {productData.price * productData.discount}元
          </Typography>
          <Typography variant="subtitle2">
            數量 {quantity} {productData.unit}
          </Typography>
          <ButtonGroup size="small" className={classes.buttonGroup}>
            <Button onClick={() => handleQuantityIncrease(productId)}>+</Button>
            <Button onClick={() => handleQuantityDecrease(productId)}>-</Button>
          </ButtonGroup>
          <Typography variant="subtitle2">總價 NT$ {cost}元</Typography>
        </Grid>
      </Grid>
      <Button
        onClick={() => handleDeleteItem(productId)}
        className={classes.deleteBtn}
        size="small"
      >
        刪除
      </Button>
    </Paper>
  );
};
