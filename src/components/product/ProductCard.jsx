import React, { Fragment, useState } from "react";
//Mui
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
//Routes
import { Link } from "react-router-dom";
import { PRODUCTS } from "../../configs/routes";
//Components
import { ProductDialog } from "../product/ProductDialog";
//Redux
import { useDispatch } from "react-redux";
import { productClickCount } from "../../redux/actions/productsActions";

const useStyles = makeStyles({
  card: {
    margin: "10px",
    width: "200px",
  },
  image: {
    height: "200px",
    width: "100%",
  },
  content: {
    padding: "10px",
  },
  title: {
    fontWeight: "bolder",
  },
  priceText: {
    textDecoration: "line-through	",
    display: "inline-block",
  },
  onsaleText: {
    display: "inline-block",
    color: "red",
    marginRight: "10px",
    float: "right",
  },
  link: {
    textDecoration: "none",
    color: "black",
  },
});

export const ProductCard = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [dialogOpen, setdialogOpen] = useState(false);
  const {
    product: { productId, title, imageUrl, price, discount },
  } = props;
  const newprice = price * discount;

  const handlePrice =
    discount === 1 ? (
      <Typography variant="body2">NT${price}</Typography>
    ) : (
      <Fragment>
        <Typography variant="body2" className={classes.priceText}>
          原價NT${price}
        </Typography>
        <Typography variant="body2" className={classes.onsaleText}>
          {discount * 10}折 NT${newprice}
        </Typography>
      </Fragment>
    );

  const handleOpen = (productId) => {
    dispatch(productClickCount(productId));
    setdialogOpen(true);
  };

  const handleClose = () => {
    window.history.pushState(null, null, PRODUCTS);
    setdialogOpen(false);
  };

  return (
    <Grid item>
      <Card className={classes.card}>
        <Link to={PRODUCTS + `/${productId}`} className={classes.link}>
          <CardActionArea onClick={() => handleOpen(productId)}>
            <CardMedia
              component="img"
              alt={title}
              image={imageUrl}
              className={classes.image}
            />
            <CardContent className={classes.content}>
              <Typography variant="subtitle1" className={classes.title}>
                {title}
              </Typography>
              {handlePrice}
            </CardContent>
          </CardActionArea>
        </Link>
      </Card>
      <ProductDialog
        dialogOpen={dialogOpen}
        handleClose={handleClose}
        product={props.product}
        newprice={newprice}
      />
    </Grid>
  );
};
