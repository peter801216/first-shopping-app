import React, { useContext } from "react";
import { Link } from "react-router-dom";
//Redux
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/actions/userActions";
//MUI
import { makeStyles } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
//icons
import HomeIcon from "@material-ui/icons/Home";
import StorefrontIcon from "@material-ui/icons/Storefront";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import InputIcon from "@material-ui/icons/Input";
//UIhandle
import { UIHandler } from "../../configs/uihandler";
//Routes
import { HOME, PRODUCTS, LOGIN, USER } from "../../configs/routes";

export const Drawer = () => {
  const [UIHandle, setUIHandle] = useContext(UIHandler);

  const toggleDrawer = (openToggle) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    let handleUI = { ...UIHandle };
    handleUI.NavDrawer = openToggle;
    setUIHandle(handleUI);
  };

  return (
    <div>
      <SwipeableDrawer
        anchor="left"
        open={UIHandle.NavDrawer}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <DrawerList handleClose={toggleDrawer(false)} />
      </SwipeableDrawer>
    </div>
  );
};

const useStyles = makeStyles({
  list: {
    width: 300,
    height: "100%",
    backgroundColor: "#e8f5e9",
  },
  textDecoration: {
    textDecoration: "none",
  },
  typography: {
    fontWeight: "bold",
    color: "#1b5e20",
  },
  typographyDivide: {
    marginLeft: 15,
    fontWeight: "bolder",
    marginTop: 10,
    marginBottom: 10,
  },
});

const DrawerList = ({ handleClose }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.user.authenticated);
  const userId = useSelector((state) => state.user.credentials.userId);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const LoginNavHandle = auth ? (
    <Link to={HOME} className={classes.textDecoration} onClick={handleLogout}>
      <ListItem button key="Logout" onClick={handleClose}>
        <ListItemIcon>
          <InputIcon />
        </ListItemIcon>
        <Typography variant="h6" className={classes.typography}>
          登出
        </Typography>
      </ListItem>
    </Link>
  ) : (
    <Link to={LOGIN} className={classes.textDecoration}>
      <ListItem button key="Login" onClick={handleClose}>
        <ListItemIcon>
          <InputIcon />
        </ListItemIcon>
        <Typography variant="h6" className={classes.typography}>
          登入
        </Typography>
      </ListItem>
    </Link>
  );

  return (
    <div className={classes.list} role="presentation">
      <List>
        <Link to={HOME} className={classes.textDecoration}>
          <ListItem button key="Home" onClick={handleClose}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <Typography variant="h6" className={classes.typography}>
              首頁
            </Typography>
          </ListItem>
        </Link>
        <Divider />
        <Link to={PRODUCTS} className={classes.textDecoration}>
          <ListItem button key="Products" onClick={handleClose}>
            <ListItemIcon>
              <StorefrontIcon />
            </ListItemIcon>
            <Typography variant="h6" className={classes.typography}>
              商品
            </Typography>
          </ListItem>
        </Link>
        <Divider />
        <Link
          to={USER + "/" + userId + "/Profiledata"}
          className={classes.textDecoration}
        >
          <ListItem button key="Profile" onClick={handleClose}>
            <ListItemIcon>
              <AccountBoxIcon />
            </ListItemIcon>
            <Typography variant="h6" className={classes.typography}>
              個人資料
            </Typography>
          </ListItem>
        </Link>
        <Divider />
        <Link
          to={USER + "/" + userId + "/Shoppingcartlist"}
          className={classes.textDecoration}
        >
          <ListItem button key="ShoppingCart" onClick={handleClose}>
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            <Typography variant="h6" className={classes.typography}>
              購物車
            </Typography>
          </ListItem>
        </Link>
        <Divider />
        {LoginNavHandle}
        <Divider />
      </List>
    </div>
  );
};
