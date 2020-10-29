import React, { useState } from "react";
//Routes
import { useHistory } from "react-router-dom";
import { USER } from "../../configs/routes";

//Redux
import { useSelector, useDispatch } from "react-redux";
import { LOADING_UI, STOP_LOADING_UI } from "../../redux/types";
import { handleAddShoppingcart } from "../../redux/actions/userActions";
//Mui
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Snackbar from "@material-ui/core/Snackbar";
//Icons
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

const useStyles = makeStyles({
  dialogcontent: {
    width: "300px",
    height: "370px",
    padding: 0,
    position: "relative",
  },
  image: {
    width: "300px",
    height: "295px",
    top: 0,
    position: "absolute",
  },
  closeBtn: {
    position: "absolute",
    right: "0px",
    top: "0px",
    color: "black",
  },
  content: {
    padding: "0px",
  },
  textContent: {
    position: "absolute",
    top: "295px",
    width: "100%",
    height: "90px",
  },
  textwidth: {
    width: "175px",
  },
  title: {
    margin: "5px 5px 0px 10px",
  },
  priceText: {
    marginLeft: "10px",
  },
  priceTextOnSale: {
    marginLeft: "10px",
    color: "red",
  },
  buyBtn: {
    width: "90px",
    marginTop: "5px",
    left: "30%",
    backgroundColor: "#43a047",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#1b5e20",
    },
    cursor: "pointer",
  },
  SCBtn: {
    width: "90px",
    marginTop: "5px",
    left: "30%",
    backgroundColor: "#ff9800",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#e65100",
    },
    cursor: "pointer",
  },
  handleQtyBtn: {
    margin: "5px 10px 0px 10px",
    backgroundColor: "#43a047",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#1b5e20",
    },
  },
  textField: {
    width: "30px",
  },
});

export const ProductDialog = (props) => {
  const classes = useStyles();
  let history = useHistory();
  const dispatch = useDispatch();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const {
    dialogOpen,
    handleClose,
    newprice,
    product: { productId, title, imageUrl, price, discount, unit },
  } = props;

  const [qty, setqty] = useState(0);
  const authenticated = useSelector((state) => state.user.authenticated);
  const userId = useSelector((state) => state.user.credentials.userId);
  const userPath = USER + "/" + userId;

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handlePlusQty = () => {
    let newQty;
    if (qty < 99) {
      newQty = qty + 1;
      setqty(newQty);
    }
  };

  const handleMinusQty = () => {
    let newQty;
    if (qty > 0) {
      newQty = qty - 1;
      setqty(newQty);
    }
  };

  const handleAddSC = () => {
    dispatch({ type: LOADING_UI });
    if (!authenticated) {
      history.push("/login");
      dispatch({ type: STOP_LOADING_UI });
    }

    if (qty === 0) {
      return;
    }

    const data = {
      productId: productId,
      quantity: qty,
    };

    dispatch(handleAddShoppingcart(data));
    setOpenSnackbar(true);
  };

  const handleGoPay = () => {
    dispatch({ type: LOADING_UI });
    if (!authenticated) {
      history.push("/login");
      dispatch({ type: STOP_LOADING_UI });
    }

    if (qty === 0) {
      return;
    }

    const data = {
      productId: productId,
      quantity: qty,
    };

    dispatch(handleAddShoppingcart(data));
    setOpenSnackbar(true);
    history.push(userPath + "/Shoppingcartlist");
  };

  const priceText =
    discount === 1 ? (
      <Typography variant="body1" className={classes.priceText}>
        NT${price}/{unit}
      </Typography>
    ) : (
      <Typography variant="body2" className={classes.priceTextOnSale}>
        特價 NT${newprice}/{unit}
      </Typography>
    );

  return (
    <Dialog open={dialogOpen} onClose={handleClose} aria-labelledby={productId}>
      <DialogContent className={classes.dialogcontent}>
        <img src={imageUrl} className={classes.image} alt="dialogimage" />
        <IconButton onClick={handleClose} className={classes.closeBtn}>
          <CancelRoundedIcon fontSize="large" />
        </IconButton>
        <div className={classes.textContent}>
          <Grid container direction="row">
            <Grid item className={classes.textwidth}>
              <Typography variant="body1" className={classes.title}>
                {title}
              </Typography>
              {priceText}
              <IconButton
                onClick={handlePlusQty}
                size="small"
                className={classes.handleQtyBtn}
              >
                <AddIcon />
              </IconButton>
              <TextField className={classes.textField} value={qty} multiline />
              <IconButton
                onClick={handleMinusQty}
                size="small"
                className={classes.handleQtyBtn}
              >
                <RemoveIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <Grid container direction="column">
                <Grid item>
                  <Button className={classes.SCBtn} onClick={handleAddSC}>
                    加入購物車
                  </Button>
                </Grid>
                <Grid item>
                  <Button className={classes.buyBtn} onClick={handleGoPay}>
                    購買
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </DialogContent>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        message="成功加入購物車"
      />
    </Dialog>
  );
};
