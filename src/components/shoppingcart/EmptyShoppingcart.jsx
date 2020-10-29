import React from "react";
import { Link } from "react-router-dom";
import { PRODUCTS } from "../../configs/routes";
//Mui
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: "800px",
  },
  title: {
    margin: "10px auto 0px auto",
    fontWeight: "bolder",
    textAlign: "center",
  },
  image: {
    width: "100%",
    minWidth: "150px",
  },
  imagecontainer: {
    position: "relative",
    maxWidth: "800px",
    padding: "30px",
  },
  textDiv: {
    position: "absolute",
    textAlign: "center",
    top: "50px",
    right: "150px",
  },
  goShopBtn: {
    margin: "5px",
    backgroundColor: "#43a047",
    cursor: "pointer",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#004d40",
    },
  },
}));

export const EmptyShoppingcart = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Typography variant="h5" className={classes.title}>
        購物車
      </Typography>
      <div className={classes.imagecontainer}>
        <img
          className={classes.image}
          src="https://firebasestorage.googleapis.com/v0/b/first-shopping-app-bf21e.appspot.com/o/gobuying.jpg?alt=media&token=afabff6e-e72a-4fee-ad01-7e482026f221"
          alt="去購物"
        />
        <div className={classes.textDiv}>
          <Typography variant="h6">{"您購物車是空的~"}</Typography>
          <Button className={classes.goShopBtn} component={Link} to={PRODUCTS}>
            <Typography variant="body1">點此前往購物</Typography>
          </Button>
        </div>
      </div>
    </div>
  );
};
