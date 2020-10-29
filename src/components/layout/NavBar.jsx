import React, { useContext } from "react";
import { Link } from "react-router-dom";
//Mui
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Button from "@material-ui/core/Button";
//Routes
import { HOME, LOGIN } from "../../configs/routes";
//UIhandle
import { UIHandler } from "../../configs/uihandler";
//Redux
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/actions/userActions";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  textDecoration: {
    position: "relative",
    textDecoration: "none",
    color: "#fff",
    margin: "auto",
  },
}));

export const NavBar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.user.authenticated);
  const [UIHandle, setUIHandle] = useContext(UIHandler);

  const handleDrawer = () => {
    setUIHandle({
      NavDrawer: !UIHandle.NavDrawer,
    });
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={handleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Link to={HOME} className={classes.textDecoration}>
            <Typography variant="h6" color="inherit">
              Shopping-App
            </Typography>
          </Link>
          {auth ? (
            <Button
              color="inherit"
              component={Link}
              to={HOME}
              onClick={handleLogout}
            >
              登出
            </Button>
          ) : (
            <Button color="inherit" component={Link} to={LOGIN}>
              登入
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};
