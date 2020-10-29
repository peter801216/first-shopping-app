import React, { useEffect, useState } from "react";
import axios from "axios";
//Mui
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
//Component
import { SkeletonCard } from "../util/SkeletonCard";

const useStyles = makeStyles((theme) => ({
  container: {
    position: "relative",
    backgroundColor: "#fafafa",
    height: 150,
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

export const OrderItemsCard = (props) => {
  const classes = useStyles();
  const { productId, quantity } = props.productData;
  const [productData, setproductData] = useState({});
  const cost = productData.price * productData.discount * quantity;
  const [loading, setloading] = useState(true);

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
          <Typography variant="subtitle2">總價 NT$ {cost}元</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};
